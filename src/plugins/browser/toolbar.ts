function LoadToolbar(preEle: any) {
  if (!preEle || !/pre/i.test(preEle.nodeName)) {
    return;
  }
  if (preEle.parentNode.classList.contains('code-toolbar')) {
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
  preEle.parentNode.insertBefore(wrapper, preEle);
  wrapper.appendChild(preEle);

  const toolbar = document.createElement('div');
  // @ts-ignore
  toolbar.style = 'top: 0.3em;right: 1.5em;';
  toolbar.classList.add('toolbar');
  // @ts-ignore
  let elementCallbacks = TOOLBAR_CALLBACKS;
  const order = getOrder(preEle);
  // @ts-ignore
  if (order.length > 0) {
    // @ts-ignore
    elementCallbacks = order.map((key) => TOOLBAR_MAP[key] || noop);
  }

  elementCallbacks.forEach((callback) => {
    const element = callback(preEle);
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
        element.addEventListener('click', function (this: any) {
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
  // @ts-ignore
  if (key in TOOLBAR_MAP) {
    return;
  }
  // @ts-ignore
  TOOLBAR_CALLBACKS.push(TOOLBAR_MAP[key] = callback);
}

// @ts-ignore
if (typeof VUEPRESS_PLUGIN !== 'undefined') {
  // @ts-ignore
  VUEPRESS_PLUGIN.LoadToolbar = LoadToolbar;
  // @ts-ignore
  VUEPRESS_PLUGIN.registerButton = registerButton;
}
