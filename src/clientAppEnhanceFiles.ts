import { ClientAppEnhance } from '@vuepress/client';

function hasClass(element, className) {
  return element.classList.contains(className);
}

const clientAppEnhanceFiles: ClientAppEnhance = ({ app }) => {
  app.directive('pre-load', {
    mounted(el) {
      // @ts-ignore
      const _VUEPRESS_PLUGINS = VUEPRESS_PLUGINS || {};
      if (typeof _VUEPRESS_PLUGINS !== 'undefined') {
        if (!el.getAttribute('no-match-braces') && typeof _VUEPRESS_PLUGINS.MatchBraces !== 'undefined') {
          _VUEPRESS_PLUGINS.MatchBraces(el);
        }
        if (hasClass(el, 'line-numbers') && typeof _VUEPRESS_PLUGINS.LoadLineNumbers !== 'undefined') {
          _VUEPRESS_PLUGINS.LoadLineNumbers([el]);
        }
        if (!el.getAttribute('no-line-highlight') && typeof _VUEPRESS_PLUGINS.LoadLineHighlight !== 'undefined') {
          _VUEPRESS_PLUGINS.LoadLineHighlight([el]);
        }
        if (typeof _VUEPRESS_PLUGINS.LoadToolbar !== 'undefined') {
          _VUEPRESS_PLUGINS.LoadToolbar(el);
        }
        if (!el.getAttribute('no-previewers') && typeof _VUEPRESS_PLUGINS.PreviewerInitEvents !== 'undefined') {
          _VUEPRESS_PLUGINS.PreviewerInitEvents(el, el.getAttribute('lang'));
        }
      }
    },
  });
};

export default clientAppEnhanceFiles;
