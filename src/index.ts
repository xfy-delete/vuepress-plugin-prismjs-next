import type { PluginFunction, App, PluginObject } from '@vuepress/core';
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
  css?: boolean
}

const resizeStr = `
window.addEventListener('resize', () => {
  // @ts-ignore
  if (typeof lineNumbers !== 'undefined') {
    // @ts-ignore
    lineNumbers(Array.prototype.slice.call(document.querySelectorAll('pre.line-numbers[class*=language-]')));
  }
});
`;

const plugin = (md: MarkdownIt, options: optionsType, app: App) => {
  if (options) {
    loadPlugins(md, options.plugins, app);
    loadLanguages(options.languages);
  }
  loadCss(app, options);
  setHead(app, 'script', {}, '');
  md.options.highlight = (code, lang) => {
    const prismLang = Prism.languages[lang];
    const html = prismLang
      ? Prism.highlight(code, prismLang, lang)
      : md.utils.escapeHtml(code);
    return html;
  };
};

export default (options: PluginFunction<optionsType>, app: App): PluginObject => {
  console.log('\x1B[36m%s\x1B[0m', 'vuepress plugin loading');
  return {
    name: 'vuepress-plugin-prismjs-next',
    extendsMarkdown(md) {
      app.siteData.head = app.siteData.head || [];
      app.siteData.head.push(['script', { }, resizeStr]);
      plugin(md, options as optionsType, app as App);
    },
    clientAppEnhanceFiles: app.env.isBuild ? path.resolve(__dirname, './clientAppEnhanceFiles.js') : path.resolve(__dirname, './esm/clientAppEnhanceFiles.js'),
  };
};

export {
  optionsType,
};
