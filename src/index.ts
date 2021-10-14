import type { PluginFunction, AppOptions, PluginObject } from '@vuepress/core';
import * as MarkdownIt from 'markdown-it';
import Prism from 'prismjs';
import rawLoadLanguages from 'prismjs/components/index';

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

// eslint-disable-next-line no-unused-vars
const plugin = (md: MarkdownIt, options: optionsType, _app?: AppOptions) => {
  const temp = options || {};
  // loadTheme(app || md, temp.css, temp.theme);
  // loadPlugins(app || md, temp.css, temp.plugins);
  if (temp.languages?.length !== 0) {
    loadLanguages(temp.languages);
  }

  console.log(222222);
  md.options.highlight = (code, lang) => {
    const prismLang = Prism.languages[lang];
    // console.log(code);
    const html = prismLang
      ? Prism.highlight(code, prismLang, lang)
      : md.utils.escapeHtml(code);
    const classAttribute = lang
      ? ` class='${md.options.langPrefix}${md.utils.escapeHtml(lang)}'`
      : '';
    return `<pre${classAttribute}><code${classAttribute}>${html}</code></pre>`;
  };
};

export default (options: PluginFunction<optionsType> | MarkdownIt, app: AppOptions | MarkdownIt.PluginWithOptions<optionsType>): void | PluginObject => {
  console.log('111111111111111');
  if (typeof (options as MarkdownIt).use === 'function') {
    plugin(options as MarkdownIt, app as optionsType);
    return undefined;
  }
  return {
    name: 'markdown-prismjs-plugin',
    extendsMarkdown(md) {
      plugin(md, options as optionsType, app as AppOptions);
    },
  };
};
