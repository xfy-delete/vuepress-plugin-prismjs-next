export default `(function () {
  // @ts-ignore
  if (typeof registerButton !== 'undefined') {
    // @ts-ignore
    registerButton('download-file', (preEle) => {
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
}())`;
