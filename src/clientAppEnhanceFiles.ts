import { ClientAppEnhance } from '@vuepress/client';

function hasClass(element, className) {
  return element.classList.contains(className);
}

const clientAppEnhanceFiles: ClientAppEnhance = ({ app }) => {
  app.directive('pre-load', {
    mounted(el) {
      // @ts-ignore
      const _VUEPRESS_PLUGIN = VUEPRESS_PLUGIN || {};
      if (typeof _VUEPRESS_PLUGIN !== 'undefined') {
        if (!el.getAttribute('no-match-braces') && typeof _VUEPRESS_PLUGIN.MatchBraces !== 'undefined') {
          _VUEPRESS_PLUGIN.MatchBraces(el);
        }
        if (hasClass(el, 'line-numbers') && typeof _VUEPRESS_PLUGIN.LoadLineNumbers !== 'undefined') {
          _VUEPRESS_PLUGIN.LoadLineNumbers([el]);
        }
        if (!el.getAttribute('no-line-highlight') && typeof _VUEPRESS_PLUGIN.LoadLineHighlight !== 'undefined') {
          _VUEPRESS_PLUGIN.LoadLineHighlight([el]);
        }
        if (typeof _VUEPRESS_PLUGIN.LoadToolbar !== 'undefined') {
          _VUEPRESS_PLUGIN.LoadToolbar(el);
        }
        if (!el.getAttribute('no-previewers') && typeof _VUEPRESS_PLUGIN.PreviewerInitEvents !== 'undefined') {
          _VUEPRESS_PLUGIN.PreviewerInitEvents(el, el.getAttribute('lang'));
        }
      }
    },
  });
};

export default clientAppEnhanceFiles;
