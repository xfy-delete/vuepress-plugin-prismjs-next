import type { PluginFunction, App, PluginObject } from '@vuepress/core';
import MarkdownIt from 'markdown-it';
import Prism from 'prismjs';
import fs from 'fs';
import { path } from '@vuepress/utils';

import {
  loadPlugins, loadLanguages, loadCss,
} from './plugins';

type optionsType = {
  languages?: Array<string>,
  plugins?: Array<string>,
  theme?: string,
  css?: boolean
}

const plugin = (md: MarkdownIt, options: optionsType, app: App) => {
  if (options) {
    loadPlugins(md, options.plugins, app);
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

export default (options: PluginFunction<optionsType>, app: App): PluginObject => {
  console.log('\x1B[36m%s\x1B[0m', 'vuepress plugin loading');
  return {
    name: 'markdown-prismjs-plugin',
    extendsMarkdown(md) {
      app.siteData.head = app.siteData.head || [];
      app.siteData.head.push(['script', { }, '']);
      plugin(md, options as optionsType, app as App);
    },
    clientAppEnhanceFiles: app.env.isBuild ? path.resolve(__dirname, './clientAppEnhanceFiles.js') : path.resolve(__dirname, './esm/clientAppEnhanceFiles.js'),
    onInitialized: (a) => {
      console.log(path.resolve(__dirname, '@vuepress/theme-default/lib/client/code.scss'));
      console.log(fs.readFileSync('../node_modules/@vuepress/theme-default/lib/client/code.scss'));
    },
  };
};

export {
  optionsType,
};
