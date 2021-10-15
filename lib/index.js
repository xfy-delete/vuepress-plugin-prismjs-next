"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prismjs_1 = __importDefault(require("prismjs"));
const languages_1 = __importDefault(require("./plugins/languages"));
const plugins_1 = require("./plugins");
function loadLanguages(languages) {
    const langsToLoad = languages === null || languages === void 0 ? void 0 : languages.filter((item) => !prismjs_1.default.languages[item]);
    if (langsToLoad === null || langsToLoad === void 0 ? void 0 : langsToLoad.length) {
        (0, languages_1.default)(langsToLoad);
    }
}
const plugin = (md, options, app) => {
    var _a;
    const temp = options || {};
    (0, plugins_1.loadTheme)(app || md, temp.css, temp.theme);
    (0, plugins_1.loadPlugins)(app || md, temp.css, temp.plugins);
    if (((_a = temp.languages) === null || _a === void 0 ? void 0 : _a.length) !== 0) {
        loadLanguages(temp.languages);
    }
    md.options.highlight = (code, lang) => {
        const prismLang = prismjs_1.default.languages[lang];
        const html = prismLang
            ? prismjs_1.default.highlight(code, prismLang, lang)
            : md.utils.escapeHtml(code);
        const classAttribute = lang
            ? ` class='${md.options.langPrefix}${md.utils.escapeHtml(lang)}'`
            : '';
        return `<pre${classAttribute}><code${classAttribute}>${html}</code></pre>`;
    };
};
exports.default = (options, app) => {
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
