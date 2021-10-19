import { ClientAppEnhance } from '@vuepress/client';

function hasClass(element, className) {
  return element.classList.contains(className);
}

const clientAppEnhanceFiles: ClientAppEnhance = ({ app, router }) => {
  app.directive('pre-load', {
    mounted(el) {
      // @ts-ignore
      if (hasClass(el, 'line-numbers') && typeof lineNumbers !== 'undefined') {
        // @ts-ignore
        lineNumbers([el]);
      }
      // @ts-ignore
      if (hasClass(el, 'line-highlight') && typeof lineHighlight !== 'undefined') {
        // @ts-ignore
        lineHighlight([el]);
      }
      // @ts-ignore
      if (hasClass(el, 'my-toolbar') && typeof myToolbar !== 'undefined') {
        // @ts-ignore
        myToolbar(el);
      }
      // @ts-ignore
      if (hasClass(el, 'show-language') && typeof showLanguage !== 'undefined') {
        // @ts-ignore
        showLanguage(el);
      }
    },
  });
};

export default clientAppEnhanceFiles;
