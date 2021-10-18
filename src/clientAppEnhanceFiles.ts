import { ClientAppEnhance } from '@vuepress/client';

const clientAppEnhanceFiles: ClientAppEnhance = ({ app, router }) => {
  app.directive('line-numbers', {
    mounted(el) {
      // @ts-ignore
      if (typeof resizeLineNumbers !== 'undefined') {
        console.log(el);
        console.log(document);
        // @ts-ignore
        resizeLineNumbers([el]);
      }
    },
  });
};

export default clientAppEnhanceFiles;
