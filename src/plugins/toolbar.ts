function myToolbar(preEle: any) {
  function myButtonHook(pre) {
    if (!pre || !/pre/i.test(pre.nodeName)) {
      return;
    }
    if (pre.parentNode.classList.contains('code-toolbar')) {
      return;
    }
    const noop = function () {};
    function getOrder(element): Array<string> {
      while (element) {
        let order = element.getAttribute('data-toolbar-order');
        if (order != null) {
          order = order.trim();
          if (order.length) {
            return order.split(/\s*,\s*/g);
          }
          return [];
        }
        element = element.parentElement;
      }
      return [];
    }
    const wrapper = document.createElement('div');
    wrapper.classList.add('code-toolbar');
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const toolbar = document.createElement('div');
    // @ts-ignore
    toolbar.style = 'top: .3em;right: .5em;';
    toolbar.classList.add('toolbar');
    // @ts-ignore
    let elementCallbacks = TOOLBAR_CALLBACKS;
    const order = getOrder(pre);
    // @ts-ignore
    if (order.length > 0) {
      // @ts-ignore
      elementCallbacks = order.map((key) => TOOLBAR_MAP[key] || noop);
    }

    elementCallbacks.forEach((callback) => {
      const element = callback(pre);
      if (!element) {
        return;
      }
      const item = document.createElement('div');
      item.classList.add('toolbar-item');
      item.appendChild(element);
      toolbar.appendChild(item);
    });
    wrapper.appendChild(toolbar);
  }

  if (typeof registerButton !== 'undefined') {
    // @ts-ignore
    registerButton('label', (ele): string | undefined => {
      if (!ele || !/pre/i.test(ele.nodeName)) {
        return;
      }
      if (!ele.hasAttribute('data-label')) {
        return;
      }
      let element;
      let template;
      const text = ele.getAttribute('data-label');
      try {
        template = document.querySelector(`template#${text}`);
      } catch (e) {
      }
      if (template) {
        element = template.content;
      } else {
        if (ele.hasAttribute('data-url')) {
          element = document.createElement('a');
          element.href = ele.getAttribute('data-url');
          element.target = '_blank';
        } else {
          element = document.createElement('span');
        }
        element.textContent = text;
      }
      return element;
    });
  }
  myButtonHook(preEle);
}

const registerButton = `
function registerButton(key, opts) {
  let callback;
  if (typeof opts === 'function') {
    callback = opts;
  } else {
    callback = function (env) {
      let element;
      if (typeof opts.onClick === 'function') {
        element = document.createElement('button');
        element.type = 'button';
        element.addEventListener('click', function () {
          opts.onClick.call(this, env);
        });
      } else if (typeof opts.url === 'string') {
        element = document.createElement('a');
        element.href = opts.url;
      } else {
        element = document.createElement('span');
      }
      if (opts.className) {
        element.classList.add(opts.className);
      }
      element.textContent = opts.text;
      return element;
    };
  }

  if (key in TOOLBAR_MAP) {
    console.warn('There is a button with the key ' + key +' registered already.');
    return;
  }
  TOOLBAR_CALLBACKS.push(TOOLBAR_MAP[key] = callback);
}
`;

export {
  myToolbar,
  registerButton,
};
