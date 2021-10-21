// @ts-ignore
if (typeof VUEPRESS_PLUGIN !== 'undefined' && typeof VUEPRESS_PLUGIN.registerButton !== 'undefined') {
  // @ts-ignore
  VUEPRESS_PLUGIN.registerButton('download-file', (preEle) => {
    if (!preEle || !/pre/i.test(preEle.nodeName) || !preEle.hasAttribute('data-src')) {
      return;
    }
    const a = document.createElement('a');
    a.textContent = '下载';
    a.setAttribute('download', '');
    a.href = preEle.getAttribute('data-src');
    return a;
  });
}
