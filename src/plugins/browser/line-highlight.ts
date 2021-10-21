function LoadLineHighlight(elements: Array<any>) {
  let fakeTimer: NodeJS.Timeout = setTimeout(() => {});

  let scrollIntoView = true;

  function callFunction(func) {
    func();
  }

  const isLineHeightRounded = (function () {
    let res;
    return function () {
      if (typeof res === 'undefined') {
        const d = document.createElement('div');
        d.style.fontSize = '13px';
        d.style.lineHeight = '1.5';
        d.style.padding = '0';
        d.style.border = '0';
        d.innerHTML = '&nbsp;<br />&nbsp;';
        document.body.appendChild(d);
        res = d.offsetHeight === 38;
        document.body.removeChild(d);
      }
      return res;
    };
  }());

  function getContentBoxTopOffset(parent, child) {
    const parentStyle = getComputedStyle(parent);
    const childStyle = getComputedStyle(child);
    function pxToNumber(px) {
      return +px.substr(0, px.length - 2);
    }
    return child.offsetTop + pxToNumber(childStyle.borderTopWidth) + pxToNumber(childStyle.paddingTop) - pxToNumber(parentStyle.paddingTop);
  }

  function getLine(element, number): any {
    if (element.tagName !== 'PRE' || !element.classList.contains('line-numbers')) {
      return;
    }
    const lineNumberRows = element.querySelector('.line-numbers-rows');
    if (!lineNumberRows) {
      return;
    }
    const lineNumberStart = parseInt(element.getAttribute('data-start'), 10) || 1;
    const lineNumberEnd = lineNumberStart + (lineNumberRows.children.length - 1);

    if (number < lineNumberStart) {
      number = lineNumberStart;
    }
    if (number > lineNumberEnd) {
      number = lineNumberEnd;
    }
    const lineIndex = number - lineNumberStart;
    // eslint-disable-next-line consistent-return
    return lineNumberRows.children[lineIndex];
  }

  function hasClass(element, className) {
    return element.classList.contains(className);
  }

  function isActive(element, className, defaultActivation?) {
    const no = `no-${className}`;
    while (element) {
      const classList = element.classList;
      if (classList.contains(className)) {
        return true;
      }
      if (classList.contains(no)) {
        return false;
      }
      element = element.parentElement;
    }
    return !!defaultActivation;
  }

  function isActiveFor(pre) {
    if (!pre || !/pre/i.test(pre.nodeName)) {
      return false;
    }
    if (pre.hasAttribute('data-line')) {
      return true;
    }
    if (pre.id && isActive(pre, 'linkable-line-numbers')) {
      return true;
    }

    return false;
  }

  function applyHash() {
  }

  function highlightLines(pre, lines?, classes?) {
    lines = typeof lines === 'string' ? lines : (pre.getAttribute('data-line') || '');
    const ranges = lines.replace(/\s+/g, '').split(',').filter(Boolean);
    const offset = +pre.getAttribute('data-line-offset') || 0;

    const parseMethod = isLineHeightRounded() ? parseInt : parseFloat;
    const lineHeight = parseMethod(getComputedStyle(pre).lineHeight);
    const hasLineNumbers = isActive(pre, 'line-numbers');
    const codeElement = pre.querySelector('code');
    const parentElement = hasLineNumbers ? pre : codeElement || pre;
    const mutateActions: Array<any> = [];

    const codePreOffset = !codeElement || parentElement === codeElement ? 0 : getContentBoxTopOffset(pre, codeElement);

    ranges.forEach((currentRange) => {
      const range = currentRange.split('-');

      const start = +range[0];
      const end = +range[1] || start;

      const line = pre.querySelector(`.line-highlight[data-range="${currentRange}"]`) || document.createElement('div');

      mutateActions.push(() => {
        line.setAttribute('aria-hidden', 'true');
        line.setAttribute('data-range', currentRange);
        line.className = `${classes || ''} line-highlight`;
      });

      if (hasLineNumbers) {
        const startNode = getLine(pre, start);
        const endNode = getLine(pre, end);

        if (startNode) {
          const top = `${startNode.offsetTop + codePreOffset}px`;
          mutateActions.push(() => {
            line.style.top = top;
          });
        }

        if (endNode) {
          const height = `${(endNode.offsetTop - startNode.offsetTop) + endNode.offsetHeight}px`;
          mutateActions.push(() => {
            line.style.height = height;
          });
        }
      } else {
        mutateActions.push(() => {
          line.setAttribute('data-start', String(start));
          if (end > start) {
            line.setAttribute('data-end', String(end));
          }

          line.style.top = `${(start - offset - 1) * lineHeight + codePreOffset}px`;

          line.textContent = new Array(end - start + 2).join(' \n');
        });
      }

      mutateActions.push(() => {
        line.style.width = `${pre.scrollWidth}px`;
      });

      mutateActions.push(() => {
        parentElement.appendChild(line);
      });
    });

    const id = pre.id;
    if (hasLineNumbers && isActive(pre, 'linkable-line-numbers') && id) {
      if (!hasClass(pre, 'linkable-line-numbers')) {
        // add class to pre
        mutateActions.push(() => {
          pre.classList.add('linkable-line-numbers');
        });
      }

      const start = parseInt(pre.getAttribute('data-start') || '1', 10);

      Array.from(pre.querySelectorAll('.line-numbers-rows > span')).forEach((lineSpan: any, i) => {
        const lineNumber = i + start;
        lineSpan.onclick = function () {
          const hash = `${id}.${lineNumber}`;
          scrollIntoView = false;
          // eslint-disable-next-line no-restricted-globals
          location.hash = hash;
          setTimeout(() => {
            scrollIntoView = true;
          }, 1);
        };
      });
    }

    pre.classList.remove('line-highlight');

    return function () {
      mutateActions.forEach(callFunction);
    };
  }

  elements.forEach((pre) => {
    if (isActiveFor(pre)) {
      const lines = Array.from(pre.querySelectorAll('.line-highlight'));
      lines.forEach((line) => {
        pre.removeChild(line);
      });
      clearTimeout(fakeTimer);
      const mutateDom = highlightLines(pre);
      mutateDom();
      fakeTimer = setTimeout(applyHash, 1);
    }
  });
}

// @ts-ignore
if (typeof VUEPRESS_PLUGINS !== 'undefined') {
  // @ts-ignore
  VUEPRESS_PLUGINS.LoadLineHighlight = LoadLineHighlight;
}
