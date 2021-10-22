import { ClientAppEnhance } from '@vuepress/client';

function hasClass(element, className) {
  return element.classList.contains(className);
}

const clientAppEnhanceFiles: ClientAppEnhance = ({ app }) => {
  app.directive('pre-load', {
    mounted(el) {
      try {
        // @ts-ignore
        const _VUEPRESS_PLUGINS = VUEPRESS_PLUGINS || {};
        if (typeof _VUEPRESS_PLUGINS !== 'undefined') {
          if (!el.getAttribute('no-mb') && typeof _VUEPRESS_PLUGINS.MatchBraces !== 'undefined') {
            _VUEPRESS_PLUGINS.MatchBraces(el);
          }
          if (hasClass(el, 'line-numbers') && typeof _VUEPRESS_PLUGINS.LoadLineNumbers !== 'undefined') {
            _VUEPRESS_PLUGINS.LoadLineNumbers([el]);
          }
          if (!el.getAttribute('no-lh') && typeof _VUEPRESS_PLUGINS.LoadLineHighlight !== 'undefined') {
            _VUEPRESS_PLUGINS.LoadLineHighlight([el]);
          }
          if (!el.getAttribute('no-tb') && typeof _VUEPRESS_PLUGINS.LoadToolbar !== 'undefined') {
            _VUEPRESS_PLUGINS.LoadToolbar(el);
          }
          if (!el.getAttribute('no-pw') && typeof _VUEPRESS_PLUGINS.PreviewerInitEvents !== 'undefined') {
            _VUEPRESS_PLUGINS.PreviewerInitEvents(el, el.getAttribute('lang'));
          }
          if (typeof _VUEPRESS_PLUGINS.WhitespaceNormalization !== 'undefined') {
            _VUEPRESS_PLUGINS.WhitespaceNormalization(el.querySelector('code'));
          }
        }
      } catch (error) {

      }
    },
  });
};

export default clientAppEnhanceFiles;
