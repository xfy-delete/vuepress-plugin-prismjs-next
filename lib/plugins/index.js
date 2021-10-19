"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCss = exports.loadLanguages = exports.loadPlugins = exports.setHead = void 0;
const components_1 = __importDefault(require("prismjs/components"));
const dependencies_1 = __importDefault(require("prismjs/dependencies"));
const index_1 = __importDefault(require("prismjs/components/index"));
const prismjs_1 = __importDefault(require("prismjs"));
const uglifycss_1 = __importDefault(require("uglifycss"));
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("@vuepress/utils");
const line_numbers_1 = __importDefault(require("./line-numbers"));
const line_highlight_1 = __importDefault(require("./line-highlight"));
const toolbar_1 = require("./toolbar");
const show_language_1 = __importDefault(require("./show-language"));
index_1.default.silent = true;
let globalPluginsLoad = true;
const localPluginList = {
    autolinker: true,
    'inline-color': true,
    'diff-highlight': true,
    'data-uri-highlight': true,
};
const pluginList = {
    treeview: true,
    'highlight-keywords': true,
};
const pluginMap = {};
function isVPre(info) {
    if (/:v-pre\b/.test(info)) {
        return true;
    }
    if (/:no-v-pre\b/.test(info)) {
        return false;
    }
    return null;
}
function mdPlugin(md, options, pluginMap) {
    md.renderer.rules.fence = (tokens, idx, opts, _env, _slf) => {
        var _a, _b, _c;
        const preClassList = [];
        const preStyleList = [];
        const codeStyleList = [];
        let lines = null;
        const token = tokens[idx];
        if (token.tag !== 'code') {
            return token.content;
        }
        const info = token.info ? md.utils.unescapeAll(token.info).trim() : '';
        const lang = ((_a = info.match(/^([a-zA-Z]+)/)) === null || _a === void 0 ? void 0 : _a[1]) || 'text';
        const html = ((_b = opts.highlight) === null || _b === void 0 ? void 0 : _b.call(opts, token.content, lang, '')) || md.utils.escapeHtml(token.content);
        const languageClass = `${md.options.langPrefix}${md.utils.escapeHtml(lang)}`;
        preClassList.push(languageClass);
        if (pluginMap['line-numbers']) {
            lines = (0, line_numbers_1.default)(info, token.content, preStyleList, codeStyleList, options);
            if (lines) {
                preClassList.push('line-numbers');
                preStyleList.push(`counter-reset: linenumber ${lines[0] - 1};`);
            }
        }
        if (pluginMap['line-highlight']) {
            preClassList.push('line-highlight');
        }
        if (pluginMap.toolbar) {
            preClassList.push('my-toolbar');
        }
        if (pluginMap.toolbar && pluginMap['show-language']) {
            preClassList.push('show-language');
        }
        let codeStr = `<code class='${languageClass}' style='${codeStyleList.join('')}'>${html}${lines ? lines[1] : ''}</code>`;
        const useVPre = (_c = isVPre(info)) !== null && _c !== void 0 ? _c : options.vPre;
        if (useVPre) {
            codeStr = `<code v-pre${codeStr.slice('<code'.length)}`;
        }
        return `<pre v-pre-load data-line='1,3-4,42' lang=${lang} class='${preClassList.join(' ')} linkable-line-numbers' style='${preStyleList.join('')}'>${codeStr}</pre>`;
    };
}
const getPath = (type) => (name) => `prismjs/${components_1.default[type].meta.path.replace(/\{id\}/g, name)}`;
const isPlugin = (dep) => components_1.default.plugins[dep] != null;
const getNoCSS = (type, name) => !!components_1.default[type][name].noCSS;
function setHead(app, type, attr, text) {
    app.siteData.head = app.siteData.head || [];
    app.siteData.head.push([type, attr, text]);
}
exports.setHead = setHead;
const getThemePath = (theme) => {
    if (theme.includes('/')) {
        const [themePackage, themeName] = theme.split('/');
        return `${themePackage}/themes/prism-${themeName}.css`;
    }
    if (theme === 'default') {
        theme = 'prism';
    }
    else {
        theme = `prism-${theme}`;
    }
    return getPath('themes')(theme);
};
const getPluginPath = getPath('plugins');
function loadPlugins(md, app, options) {
    if (!globalPluginsLoad) {
        return;
    }
    const plugins = options === null || options === void 0 ? void 0 : options.plugins;
    globalPluginsLoad = false;
    if (plugins) {
        for (let index = 0; index < plugins.length;) {
            const plugin = plugins[index];
            if (localPluginList[plugin]) {
                Promise.resolve().then(() => __importStar(require(`./${plugin}`)));
            }
            if (pluginList[plugin]) {
                Promise.resolve().then(() => __importStar(require(`prismjs/plugins/${plugin}/prism-${plugin}`)));
            }
            pluginMap[plugin] = true;
            index += 1;
        }
    }
    if (pluginMap['line-numbers']) {
        setHead(app, 'script', {}, line_numbers_1.default.toString());
    }
    if (pluginMap['line-highlight']) {
        setHead(app, 'script', {}, line_highlight_1.default.toString());
    }
    if (pluginMap.toolbar) {
        setHead(app, 'script', {}, toolbar_1.registerButton);
        setHead(app, 'script', {}, toolbar_1.myToolbar.toString());
    }
    if (pluginMap.toolbar && pluginMap['show-language']) {
        setHead(app, 'script', {}, show_language_1.default.toString());
    }
    mdPlugin(md, options, pluginMap);
}
exports.loadPlugins = loadPlugins;
function loadLanguages(languages) {
    const langsToLoad = languages === null || languages === void 0 ? void 0 : languages.filter((item) => !prismjs_1.default.languages[item]);
    if (langsToLoad === null || langsToLoad === void 0 ? void 0 : langsToLoad.length) {
        (0, index_1.default)(langsToLoad);
    }
}
exports.loadLanguages = loadLanguages;
function getPluginCssList(plugins) {
    const cssList = (0, dependencies_1.default)(components_1.default, [...plugins]).getIds().reduce((deps, dep) => {
        const temp = [];
        if (isPlugin(dep) && !getNoCSS('plugins', dep)) {
            temp.unshift(`${getPluginPath(dep)}.css`);
        }
        return [...deps, ...temp];
    }, ([]));
    return cssList;
}
function getFileString(file) {
    const data = fs_1.default.readFileSync(`node_modules/${file}`);
    return uglifycss_1.default.processString(data.toString(), { maxLineLen: 500, expandVars: true });
}
function removeDefaultCss() {
    let codeScssPath = '../../../@vuepress/theme-default/lib/client/styles/code.scss';
    if (process.env.VUEPRESS_PLUGIN_PRISMJS_NEXT && process.env.VUEPRESS_PLUGIN_PRISMJS_NEXT.indexOf('true') !== -1) {
        codeScssPath = '../../example/node_modules/@vuepress/theme-default/lib/client/styles/code.scss';
    }
    fs_1.default.writeFileSync(utils_1.path.resolve(__dirname, utils_1.path.resolve(__dirname, codeScssPath)), `
@import '_variables';
.theme-default-content {
  pre,
  pre[class*='language-'] {
    margin: 0.85rem 0;
    overflow: auto;

    code {
      padding: 0;
      border-radius: 0;
      -webkit-font-smoothing: auto;
      -moz-osx-font-smoothing: auto;
    }
  }

  .line-number {
    font-family: var(--font-family-code);
  }
}


@each $lang in $codeLang {
  div[class*='language-'].ext-#{$lang} {
    &:before {
      content: '' + $lang;
    }
  }
}

@media (max-width: $MQMobileNarrow) {
  .theme-default-content {
    div[class*='language-'] {
      margin: 0.85rem -1.5rem;
      border-radius: 0;
    }
  }
}`);
}
function loadCss(app, options) {
    let cssPathList = [];
    let themeCssPath;
    if (options && options.plugins) {
        cssPathList = getPluginCssList(options.plugins);
    }
    if (options && options.theme) {
        themeCssPath = getThemePath(options.theme);
    }
    const cssStrList = [];
    if (themeCssPath) {
        cssStrList.push(getFileString(themeCssPath));
        removeDefaultCss();
    }
    cssPathList.forEach((file) => {
        cssStrList.push(getFileString(file));
    });
    if (cssStrList.length === 0) {
        return;
    }
    app.siteData.head = app.siteData.head || [];
    cssStrList.forEach((cssStr) => {
        if (cssStr && app.siteData) {
            app.siteData.head.push(['style', { type: 'text/css' }, cssStr]);
        }
    });
}
exports.loadCss = loadCss;
