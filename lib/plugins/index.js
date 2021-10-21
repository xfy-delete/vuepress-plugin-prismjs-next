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
exports.loadCss = exports.loadLanguages = exports.loadPlugins = void 0;
const components_1 = __importDefault(require("prismjs/components"));
const dependencies_1 = __importDefault(require("prismjs/dependencies"));
const index_1 = __importDefault(require("prismjs/components/index"));
const prismjs_1 = __importDefault(require("prismjs"));
const uglifycss_1 = __importDefault(require("uglifycss"));
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("@vuepress/utils");
const line_numbers_1 = require("./utils/line-numbers");
const new_code_1 = __importDefault(require("./style/new_code"));
const old_code_1 = __importDefault(require("./style/old_code"));
const pluginSwitch_1 = require("./utils/pluginSwitch");
index_1.default.silent = true;
let globalPluginsLoad = true;
const nodePlugins = {
    'inline-color': true,
    autolinker: true,
    'data-uri-highlight': true,
    'show-invisibles': true,
    previewers: true,
};
const prismjsPlugins = {
    treeview: true,
    'diff-highlight': true,
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
    md.renderer.rules.fence = (tokens, idx, opts) => {
        var _a, _b, _c;
        const preClassList = [];
        const codeClassList = [];
        const preStyleList = [];
        const codeStyleList = [];
        const preAttrList = [];
        let lines = null;
        const token = tokens[idx];
        if (token.tag !== 'code') {
            return token.content;
        }
        const info = token.info ? md.utils.unescapeAll(token.info).trim() : '';
        const lang = ((_a = info.match(/^([a-zA-Z]+)/)) === null || _a === void 0 ? void 0 : _a[1]) || 'text';
        (0, pluginSwitch_1.sitePluginSwitch)(info, preAttrList);
        const html = ((_b = opts.highlight) === null || _b === void 0 ? void 0 : _b.call(opts, token.content, lang, '')) || md.utils.escapeHtml(token.content);
        (0, pluginSwitch_1.initPluginSwitch)();
        const languageClass = `${md.options.langPrefix}${md.utils.escapeHtml(lang)}`;
        preClassList.push(languageClass);
        if (pluginMap['line-numbers']) {
            lines = (0, line_numbers_1.lineNumbers)(info, token.content, preStyleList, codeStyleList, options);
            if (lines) {
                preClassList.push('line-numbers');
                preStyleList.push(`counter-reset: linenumber ${lines[0] - 1};`);
            }
        }
        else {
            (0, line_numbers_1.setWhiteSpaceStyle)(info, codeStyleList);
        }
        if (pluginMap['match-braces']) {
            codeClassList.push('match-braces');
            if (/:no-brace-hover\b/.test(info)) {
                codeClassList.push('no-brace-hover');
            }
            if (/:no-brace-select\b/.test(info)) {
                codeClassList.push('no-brace-select');
            }
            if (!(/:no-rainbow-braces\b/.test(info))) {
                codeClassList.push('rainbow-braces');
            }
        }
        let codeStr = `<code class='${languageClass} ${codeClassList.join(' ')}' style='${codeStyleList.join('')}'>${html}${lines ? lines[1] : ''}</code>`;
        const useVPre = (_c = isVPre(info)) !== null && _c !== void 0 ? _c : options.vPre;
        const maxHeightMatch = info.match(/max-height\[([\d,-]+)\]/);
        if (maxHeightMatch) {
            preStyleList.push(`max-height: ${maxHeightMatch[1]}px;`);
        }
        if (useVPre) {
            codeStr = `<code v-pre${codeStr.slice('<code'.length)}`;
        }
        const match = info.match(/{([\d,-]+)}/);
        return `<pre v-pre-load ${preAttrList.join(' ')} ${match ? `data-line=${match[1]}` : ''} lang=${lang} class='${preClassList.join(' ')}' style='${preStyleList.join('')}'>${codeStr}</pre>`;
    };
}
const getPath = (type) => (name) => `prismjs/${components_1.default[type].meta.path.replace(/\{id\}/g, name)}`;
const isPlugin = (dep) => components_1.default.plugins[dep] != null;
const getNoCSS = (type, name) => !!components_1.default[type][name].noCSS;
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
function loadPlugins(md, options) {
    if (!globalPluginsLoad) {
        return;
    }
    const plugins = options === null || options === void 0 ? void 0 : options.plugins;
    globalPluginsLoad = false;
    if (plugins) {
        for (let index = 0; index < plugins.length;) {
            const plugin = plugins[index];
            if (nodePlugins[plugin]) {
                Promise.resolve().then(() => __importStar(require(utils_1.path.resolve(__dirname, `./node/${plugin}`))));
            }
            if (prismjsPlugins[plugin]) {
                Promise.resolve().then(() => __importStar(require(`prismjs/plugins/${plugin}/prism-${plugin}`)));
            }
            if (plugin === 'normalize-whitespace') {
                Promise.resolve().then(() => __importStar(require(utils_1.path.resolve(__dirname, './node/normalize-whitespace')))).then(() => {
                    if (options.NormalizeWhitespace) {
                        prismjs_1.default.plugins.NormalizeWhitespace.setDefaults(options.NormalizeWhitespace);
                    }
                });
            }
            pluginMap[plugin] = true;
            index += 1;
        }
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
function defaultCss(scssStr) {
    let codeScssPath = '../../../@vuepress/theme-default/lib/client/styles/code.scss';
    if (process.env.VUEPRESS_PLUGINS_PRISMJS_NEXT && process.env.VUEPRESS_PLUGINS_PRISMJS_NEXT.indexOf('true') !== -1) {
        codeScssPath = '../../example/node_modules/@vuepress/theme-default/lib/client/styles/code.scss';
    }
    fs_1.default.writeFileSync(utils_1.path.resolve(__dirname, utils_1.path.resolve(__dirname, codeScssPath)), scssStr);
}
function loadCss(options) {
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
        defaultCss(new_code_1.default);
    }
    else {
        defaultCss(old_code_1.default);
    }
    cssPathList.forEach((file) => {
        cssStrList.push(getFileString(file));
    });
    if (cssStrList.length === 0) {
        return;
    }
    let cssStr = '';
    cssStrList.forEach((css) => {
        if (css) {
            cssStr += `${css}\n`;
        }
    });
    return cssStr;
}
exports.loadCss = loadCss;
