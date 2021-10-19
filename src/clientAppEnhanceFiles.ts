import { ClientAppEnhance } from '@vuepress/client';

function hasClass(element, className) {
  return element.classList.contains(className);
}

const clientAppEnhanceFiles: ClientAppEnhance = ({ app, router }) => {
  app.directive('pre-load', {
    mounted(el) {
      // @ts-ignore
      if (hasClass(el, 'line-numbers') && typeof loadLineNumbers !== 'undefined') {
        // @ts-ignore
        loadLineNumbers([el]);
      }
      // @ts-ignore
      if (typeof lineHighlight !== 'undefined') {
        // @ts-ignore
        lineHighlight([el]);
      }
      // @ts-ignore
      if (typeof myToolbar !== 'undefined') {
        // @ts-ignore
        myToolbar(el);
      }
      // @ts-ignore
      if (typeof matchBraces !== 'undefined') {
        // @ts-ignore
        matchBraces(el);
      }
    },
  });
};

export default clientAppEnhanceFiles;
