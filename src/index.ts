import type { App, PluginObject } from '@vuepress/core';
import MarkdownIt from 'markdown-it';
import Prism from 'prismjs';
import { path } from '@vuepress/utils';

import {
  loadPlugins, loadLanguages, loadCss, setHead,
} from './plugins';

type optionsType = {
  languages?: Array<string>,
  plugins?: Array<string>,
  theme?: string,
  css?: boolean,
  vPre?: true | boolean,
  lineNumbers?: number | boolean
}

const resizeStr = `
if (typeof TOOLBAR_CALLBACKS === 'undefined') {
  TOOLBAR_CALLBACKS = [];
}
if (typeof TOOLBAR_MAP === 'undefined') {
  TOOLBAR_MAP = [];
}
window.addEventListener('resize', () => {
  if (typeof lineNumbers !== 'undefined') {
    lineNumbers(Array.prototype.slice.call(document.querySelectorAll('pre.line-numbers[class*=language-]')));
    lineNumbers(Array.prototype.slice.call(document.querySelectorAll('pre.line-highlight[class*=language-]')));
  }
});
`;

const plugin = (md: MarkdownIt, options: optionsType, app: App) => {
  if (options) {
    loadPlugins(md, app, options);
    loadLanguages(options.languages);
  }
  loadCss(app, options);
  md.options.highlight = (code, lang) => {
    const prismLang = Prism.languages[lang];
    const html = prismLang
      ? Prism.highlight(code, prismLang, lang)
      : md.utils.escapeHtml(code);
    return html;
  };
};

export default (options: optionsType, app: App): PluginObject => {
  console.log('\x1B[36m%s\x1B[0m', 'vuepress plugin loading');
  return {
    name: 'vuepress-plugin-prismjs-next',
    define: {
      VUEPRESS_PLUGIN: {},
    },
    extendsMarkdown(md) {
      options = {
        languages: ['java', 'css', 'javascript', 'typescript', 'html', 'json', 'shell', 'yaml', 'diff'],
        plugins: [],
        css: true,
        vPre: true,
        lineNumbers: 3,
        ...(options || {}),
      };
      setHead(app, 'script', {}, resizeStr);
      plugin(md, options as optionsType, app as App);
    },
    clientAppEnhanceFiles: app.env.isBuild ? path.resolve(__dirname, './clientAppEnhanceFiles.js') : path.resolve(__dirname, './esm/clientAppEnhanceFiles.js'),
  };
};

export {
  optionsType,
};
