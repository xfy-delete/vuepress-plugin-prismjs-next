import { ClientAppEnhance } from '@vuepress/client';

const clientAppEnhanceFiles: ClientAppEnhance = ({ app, router }) => {
  app.directive('line-numbers', {
    mounted(el) {
      // @ts-ignore
      if (typeof lineNumbers !== 'undefined') {
        // @ts-ignore
        lineNumbers([el]);
      }
    },
  });
};

export default clientAppEnhanceFiles;
