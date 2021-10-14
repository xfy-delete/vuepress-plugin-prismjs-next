const Prism = require('prismjs');
const rawLoadLanguages = require('prismjs/components/index');
const { loadPlugins, loadTheme } = require('./plugins');

rawLoadLanguages.silent = true;

function loadLanguages(languages) {
  const langsToLoad = languages.filter((item) => !Prism.languages[item]);
  if (langsToLoad.length) {
    rawLoadLanguages(langsToLoad);
  }
}

const plugin = (md, { languages = ['markdown', 'jsdoc', 'yaml'], plugins = [], theme = null, css = true }, app) => {
  loadTheme(app || md, css, theme);
  loadPlugins(app || md, css, plugins);
  if (languages?.length !== 0) {
    loadLanguages(languages);
  }
  md.options.highlight = function (code, lang) {
    const prismLang = Prism.languages[lang];
    const html = prismLang
      ? Prism.highlight(code, prismLang, lang)
      : md.utils.escapeHtml(code);
    const classAttribute = lang
      ? ` class='${md.options.langPrefix}${md.utils.escapeHtml(lang)}'`
      : '';
    return `<pre${classAttribute}><code${classAttribute}>${html}</code></pre>`;
  };
}

module.exports = (options = {}, app) => {
  console.log('=====================')
  if (typeof options.use === 'function') {
    options.use(plugin, app);
  } {
    return {
      name: 'markdown-prismjs-plugin',
      extendsMarkdown(md) {
        md.use(plugin, options, app);
      },
    }
  }
};
