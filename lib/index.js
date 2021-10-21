"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setHead = void 0;
const prismjs_1 = __importDefault(require("prismjs"));
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("@vuepress/utils");
const plugins_1 = require("./plugins");
const pluginSwitch_1 = require("./plugins/utils/pluginSwitch");
const browserPlugins = {
    'copy-to-clipboard': true,
    'download-buttond': true,
    'line-highlight': true,
    'line-numbers': true,
    'match-braces': true,
    previewers: true,
    'show-language': true,
    toolbar: true,
};
const resizeStr = `
if (typeof TOOLBAR_CALLBACKS === 'undefined') {
  TOOLBAR_CALLBACKS = [];
}
if (typeof TOOLBAR_MAP === 'undefined') {
  TOOLBAR_MAP = [];
}
if (typeof VUEPRESS_PLUGINS === 'undefined') {
  VUEPRESS_PLUGINS = {};
}
window.addEventListener('resize', () => {
  if (typeof lineNumbers !== 'undefined') {
    lineNumbers(Array.prototype.slice.call(document.querySelectorAll('pre.line-numbers[class*=language-]')));
    lineNumbers(Array.prototype.slice.call(document.querySelectorAll('pre.line-highlight[class*=language-]')));
  }
});
`;
function setHead(app, type, attr, text) {
    app.siteData.head = app.siteData.head || [];
    if (text) {
        app.siteData.head.push([type, attr, text]);
    }
    else {
        app.siteData.head.push([type, attr]);
    }
}
exports.setHead = setHead;
const plugin = (md, options, app) => {
    if (options) {
        (0, plugins_1.loadPlugins)(md, options);
        (0, plugins_1.loadLanguages)(options.languages);
    }
    md.options.highlight = (code, lang) => {
        const prismLang = prismjs_1.default.languages[lang];
        const html = prismLang
            ? prismjs_1.default.highlight(code, prismLang, lang)
            : md.utils.escapeHtml(code);
        return html;
    };
};
function setFile(assetsPath, filePath, file) {
    fs_1.default.stat(assetsPath, (err, stats) => {
        if (!stats) {
            fs_1.default.mkdirSync(assetsPath, { recursive: true });
        }
        fs_1.default.writeFileSync(`${assetsPath}${filePath}`, file);
    });
}
exports.default = (options, app) => {
    console.log('\x1B[36m%s\x1B[0m', 'vuepress plugin loading');
    (0, pluginSwitch_1.initPluginSwitch)();
    const pluginFile = `vuepress-plugin-prism.${Date.now()}.js`;
    const cssFile = `vuepress-plugin-prism.${Date.now()}.css`;
    const plugins = options === null || options === void 0 ? void 0 : options.plugins;
    let pluginStr = '';
    if (plugins) {
        pluginStr = resizeStr;
        plugins.forEach((plugin) => {
            if (browserPlugins[plugin]) {
                pluginStr += `${fs_1.default.readFileSync(utils_1.path.resolve(__dirname, `./browser/${plugin}.global.js`)).toString()}\n`;
            }
        });
    }
    const cssStr = (0, plugins_1.loadCss)(options);
    if (app.env.isDev || app.env.isDebug) {
        if (pluginStr !== '') {
            setHead(app, 'script', {}, pluginStr);
        }
        if (cssStr !== '') {
            setHead(app, 'style', { type: 'text/css' }, cssStr);
        }
    }
    else if (app.env.isBuild) {
        setHead(app, 'script', { defer: true, src: `/assets/js/${pluginFile}` });
        setHead(app, 'link', { rel: 'stylesheet', href: `/assets/css/${cssFile}` });
    }
    return {
        name: 'vuepress-plugin-prismjs-next',
        extendsMarkdown(md) {
            options = {
                languages: ['java', 'css', 'javascript', 'typescript', 'html', 'json', 'shell', 'yaml', 'diff'],
                plugins: [],
                css: true,
                vPre: true,
                lineNumbers: 3,
                ...(options || {}),
            };
            plugin(md, options, app);
        },
        clientAppEnhanceFiles: app.env.isBuild ? utils_1.path.resolve(__dirname, './clientAppEnhanceFiles.js') : utils_1.path.resolve(__dirname, './esm/clientAppEnhanceFiles.js'),
        onGenerated(app) {
            if (pluginStr !== '') {
                const assetsJsPath = `${utils_1.path.resolve(app.options.dest)}/assets/js/`;
                setFile(assetsJsPath, pluginFile, pluginStr);
            }
            if (cssStr) {
                const assetsCssPath = `${utils_1.path.resolve(app.options.dest)}/assets/css/`;
                setFile(assetsCssPath, cssFile, cssStr);
            }
        },
    };
};
