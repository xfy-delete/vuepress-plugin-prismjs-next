"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prismjs_1 = __importDefault(require("prismjs"));
const utils_1 = require("@vuepress/utils");
const plugins_1 = require("./plugins");
const resizeStr = `
if (typeof TOOLBAR_CALLBACKS === 'undefined') {
  TOOLBAR_CALLBACKS = [];
}
if (typeof TOOLBAR_MAP === 'undefined') {
  TOOLBAR_MAP = [];
}
window.addEventListener('resize', () => {
  if (typeof lineNumbers !== 'undefined') {
    lineNumbers(Array.prototype.slice.call(document.querySelectorAll('pre.line-numbers[class*=language-]')));
    lineNumbers(Array.prototype.slice.call(document.querySelectorAll('pre.line-highlight[class*=language-]')));
  }
});
`;
const plugin = (md, options, app) => {
    if (options) {
        (0, plugins_1.loadPlugins)(md, app, options);
        (0, plugins_1.loadLanguages)(options.languages);
    }
    (0, plugins_1.loadCss)(app, options);
    md.options.highlight = (code, lang) => {
        const prismLang = prismjs_1.default.languages[lang];
        const html = prismLang
            ? prismjs_1.default.highlight(code, prismLang, lang)
            : md.utils.escapeHtml(code);
        return html;
    };
};
exports.default = (options, app) => {
    console.log('\x1B[36m%s\x1B[0m', 'vuepress plugin loading');
    return {
        name: 'vuepress-plugin-prismjs-next',
        define: {
            VUEPRESS_PLUGIN: {},
        },
        extendsMarkdown(md) {
            options = {
                languages: ['java', 'css', 'javascript', 'typescript', 'html', 'json', 'shell', 'yaml', 'diff'],
                plugins: [],
                css: true,
                vPre: true,
                lineNumbers: 3,
                ...(options || {}),
            };
            (0, plugins_1.setHead)(app, 'script', {}, resizeStr);
            plugin(md, options, app);
        },
        clientAppEnhanceFiles: app.env.isBuild ? utils_1.path.resolve(__dirname, './clientAppEnhanceFiles.js') : utils_1.path.resolve(__dirname, './esm/clientAppEnhanceFiles.js'),
    };
};
