"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOptions = void 0;
const prismjs_1 = __importDefault(require("prismjs"));
const plugins_1 = require("./plugins");
const plugin = (md, options, _app) => {
    const temp = options || {};
    if (temp.plugins) {
        (0, plugins_1.loadPlugins)(temp.plugins);
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
function useOptions(options) {
    return new Promise((resolve, reject) => {
        var _a;
        if (options) {
            (0, plugins_1.setTheme)(options.theme);
            (0, plugins_1.loadLanguages)(options.languages);
            (_a = (0, plugins_1.loadPlugins)(options.plugins, true)) === null || _a === void 0 ? void 0 : _a.then(() => {
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
exports.useOptions = useOptions;
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
