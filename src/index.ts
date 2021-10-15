import type { PluginFunction, App, PluginObject } from '@vuepress/core';
import * as MarkdownIt from 'markdown-it';
import Prism from 'prismjs';

import { loadPlugins, setTheme, loadLanguages } from './plugins';

type optionsType = {
  languages?: Array<string>,
  plugins?: Array<string>,
  theme?: string,
  css?: boolean
}

const plugin = (md: MarkdownIt, options: optionsType, _app?: App) => {
  const temp = options || {};
  if (temp.plugins) {
    loadPlugins(temp.plugins);
  }
  // loadLanguages(temp.languages);
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

function useOptions(options: optionsType) {
  return new Promise((resolve, reject) => {
    if (options) {
      setTheme(options.theme);
      loadLanguages(options.languages);
      loadPlugins(options.plugins, true)?.then(() => {
        resolve(true);
      }).catch((error) => {
        reject(error);
      });
    } else {
      reject();
    }
  });
}

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

export {
  useOptions,
};
