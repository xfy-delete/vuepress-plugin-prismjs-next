import type { PluginFunction, App, PluginObject } from '@vuepress/core';
import * as MarkdownIt from 'markdown-it';
import Prism from 'prismjs';
import rawLoadLanguages from 'prismjs/components/index';
import { loadPlugins, loadTheme } from './plugins';

type optionsType = {
  languages?: Array<string>,
  plugins?: Array<string>,
  theme?: string,
  css?: boolean
}

function loadLanguages(languages: Array<string> | undefined): void {
  const langsToLoad = languages?.filter((item) => !Prism.languages[item]);
  if (langsToLoad?.length) {
    rawLoadLanguages(langsToLoad);
  }
}

const plugin = (md: MarkdownIt, options: optionsType, app?: App) => {
  const temp = options || {};
  loadTheme(app || md, temp.css, temp.theme);
  loadPlugins(app || md, temp.css, temp.plugins);
  if (temp.languages?.length !== 0) {
    loadLanguages(temp.languages);
  }

  md.options.highlight = (code, lang) => {
    const prismLang = Prism.languages[lang];
    const html = prismLang
      ? Prism.highlight(code, prismLang, lang)
      : md.utils.escapeHtml(code);
    const classAttribute = lang
      ? ` class='${md.options.langPrefix}${md.utils.escapeHtml(lang)}'`
      : '';
    return `<pre${classAttribute}><code${classAttribute}>${html}</code></pre>`;
  };
};

export default (options: PluginFunction<optionsType> | MarkdownIt, app: App | MarkdownIt.PluginWithOptions<optionsType>): void | PluginObject => {
  if (typeof (options as MarkdownIt).use === 'function') {
    plugin(options as MarkdownIt, app as optionsType);
    return undefined;
  }
  return {
    name: 'markdown-prismjs-plugin',
    extendsMarkdown(md) {
      plugin(md, options as optionsType, app as App);
    },
  };
};
