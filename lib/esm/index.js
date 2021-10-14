import Prism from 'prismjs';
import rawLoadLanguages from 'prismjs/components/index';
import { loadPlugins, loadTheme } from './plugins';
function loadLanguages(languages) {
    const langsToLoad = languages === null || languages === void 0 ? void 0 : languages.filter((item) => !Prism.languages[item]);
    if (langsToLoad === null || langsToLoad === void 0 ? void 0 : langsToLoad.length) {
        rawLoadLanguages(langsToLoad);
    }
}
const plugin = (md, options, app) => {
    var _a;
    const temp = options || {};
    loadTheme(app || md, temp.css, temp.theme);
    loadPlugins(app || md, temp.css, temp.plugins);
    if (((_a = temp.languages) === null || _a === void 0 ? void 0 : _a.length) !== 0) {
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
export default (options, app) => {
    if (typeof options.use === 'function') {
        plugin(options, app);
        return undefined;
    }
    return {
        name: 'markdown-prismjs-plugin',
        extendsMarkdown(md) {
            plugin(md, options, app);
        },
    };
};
