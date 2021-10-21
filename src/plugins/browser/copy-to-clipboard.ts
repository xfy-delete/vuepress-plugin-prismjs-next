function registerClipboard(element, copyInfo) {
  element.addEventListener('click', () => {
    copyTextToClipboard(copyInfo);
  });
}
function fallbackCopyTextToClipboard(copyInfo) {
  const textArea = document.createElement('textarea');
  textArea.value = copyInfo.getText();
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.position = 'fixed';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    const successful = document.execCommand('copy');
    setTimeout(() => {
      if (successful) {
        copyInfo.success();
      } else {
        copyInfo.error();
      }
    }, 1);
  } catch (err) {
    setTimeout(() => {
      copyInfo.error(err);
    }, 1);
  }
  document.body.removeChild(textArea);
}
function copyTextToClipboard(copyInfo) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(copyInfo.getText()).then(copyInfo.success, () => {
      fallbackCopyTextToClipboard(copyInfo);
    });
  } else {
    fallbackCopyTextToClipboard(copyInfo);
  }
}
function selectElementText(element) {
  const selection = window.getSelection();
  if (selection) {
    selection.selectAllChildren(element);
  }
}
function getSettings(startElement) {
  const settings = {
    copy: '复制',
    'copy-error': '请 Ctrl+C 进行复制',
    'copy-success': '成功',
    'copy-timeout': 5000,
  };

  const prefix = 'data-prismjs-';
  for (const key in settings) {
    const attr = prefix + key;
    let element = startElement;
    while (element && !element.hasAttribute(attr)) {
      element = element.parentElement;
    }
    if (element) {
      settings[key] = element.getAttribute(attr);
    }
  }
  return settings;
}

// @ts-ignore
if (typeof VUEPRESS_PLUGINS !== 'undefined' && typeof VUEPRESS_PLUGINS.registerButton !== 'undefined') {
  // @ts-ignore
  VUEPRESS_PLUGINS.registerButton('copy-to-clipboard', (preEle) => {
    const settings = getSettings(preEle);
    const linkCopy = document.createElement('button');
    linkCopy.className = 'copy-to-clipboard-button';
    linkCopy.setAttribute('type', 'button');
    const linkSpan = document.createElement('span');
    linkCopy.appendChild(linkSpan);
    setState('copy');
    registerClipboard(linkCopy, {
      getText() {
        return preEle.textContent;
      },
      success() {
        setState('copy-success');
        resetText();
      },
      error() {
        setState('copy-error');
        setTimeout(() => {
          selectElementText(preEle);
        }, 1);
        resetText();
      },
    });
    return linkCopy;
    function resetText() {
      setTimeout(() => { setState('copy'); }, settings['copy-timeout']);
    }
    function setState(state) {
      linkSpan.textContent = settings[state];
      linkCopy.setAttribute('data-copy-state', state);
    }
  });
}
