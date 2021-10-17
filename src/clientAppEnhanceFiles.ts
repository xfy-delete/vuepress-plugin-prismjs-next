import { ClientAppEnhance } from '@vuepress/client';

const clientAppEnhanceFiles: ClientAppEnhance = ({ app, router }) => {
  router.afterEach(() => {
    router.isReady().then(() => {
      // @ts-ignore
      if (typeof resizeLineNumbers !== 'undefined') {
        // @ts-ignore
        // eslint-disable-next-line no-undef
        resizeLineNumbers();
      }
    });
  });
};

export default clientAppEnhanceFiles;
