import Prism from 'prismjs';
import { loadPlugins, setTheme, loadLanguages } from './plugins';
const plugin = (md, options, _app) => {
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
function useOptions(options) {
    return new Promise((resolve, reject) => {
        var _a;
        if (options) {
            setTheme(options.theme);
            loadLanguages(options.languages);
            (_a = loadPlugins(options.plugins, true)) === null || _a === void 0 ? void 0 : _a.then(() => {
                resolve(true);
            }).catch((error) => {
                reject(error);
            });
        }
        else {
            reject();
        }
    });
}
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
export { useOptions, };
