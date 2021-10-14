"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadTheme = exports.loadPlugins = void 0;
const components_1 = __importDefault(require("prismjs/components"));
const fs_1 = __importDefault(require("fs"));
const uglifycss_1 = __importDefault(require("uglifycss"));
const dependencies_1 = __importDefault(require("prismjs/dependencies"));
const pluginList = {
    autolinker: true,
    'inline-color': true,
    'diff-highlight': true,
    'data-uri-highlight': true,
};
const getPath = (type) => (name) => `prismjs/${components_1.default[type].meta.path.replace(/\{id\}/g, name)}`;
const isPlugin = (dep) => components_1.default.plugins[dep] != null;
const getNoCSS = (type, name) => !!components_1.default[type][name].noCSS;
function isFileExisted(file) {
    return new Promise((resolve, reject) => {
        fs_1.default.access(file, (err) => {
            if (err) {
                reject(err.message);
            }
            else {
                resolve(true);
            }
        });
    });
}
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
function loadPlugins(app, css, plugins) {
    if (plugins) {
        plugins.forEach((plugin) => {
            if (pluginList[plugin]) {
                import.meta.glob(`./${plugin}`);
            }
        });
        if (app.siteData !== undefined) {
            app.siteData.head = app.siteData.head || [];
        }
        if (css === undefined || css) {
            const pluginCss = (0, dependencies_1.default)(components_1.default, [...plugins]).getIds().reduce((deps, dep) => {
                const temp = [];
                if (isPlugin(dep) && !getNoCSS('plugins', dep)) {
                    temp.unshift(`${getPluginPath(dep)}.css`);
                }
                return [...deps, ...temp];
            }, ([]));
            pluginCss.forEach((p) => {
                const cssPath = `node_modules/${p}`;
                isFileExisted(cssPath).then(() => {
                    console.log(cssPath);
                    const uglified = uglifycss_1.default.processString(fs_1.default.readFileSync(cssPath).toString(), { maxLineLen: 500, expandVars: true });
                    if (uglified) {
                        if (app.siteData !== undefined) {
                            app.siteData.head.push(['style', { type: 'text/css' }, uglified]);
                        }
                    }
                });
            });
        }
    }
}
exports.loadPlugins = loadPlugins;
function loadTheme(app, css, theme) {
    if ((css === undefined || css) && theme) {
        const themeCssPath = `node_modules/${getThemePath(theme)}`;
        isFileExisted(themeCssPath).then(() => {
            console.log(themeCssPath);
            const uglified = uglifycss_1.default.processString(fs_1.default.readFileSync(themeCssPath).toString(), { maxLineLen: 500, expandVars: true });
            if (uglified) {
                if (app.siteData !== undefined) {
                    app.siteData.head = app.siteData.head || [];
                    app.siteData.head.push(['style', { type: 'text/css' }, uglified]);
                }
            }
        });
    }
}
exports.loadTheme = loadTheme;
