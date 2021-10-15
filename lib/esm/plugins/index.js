import config from 'prismjs/components';
import getLoader from 'prismjs/dependencies';
import Prism from 'prismjs';
import rawLoadLanguages from './languages';
let globalPlugins = true;
const pluginList = {
    autolinker: true,
    'inline-color': true,
    'diff-highlight': true,
    'data-uri-highlight': true,
};
const getPath = (type) => (name) => `prismjs/${config[type].meta.path.replace(/\{id\}/g, name)}`;
const isPlugin = (dep) => config.plugins[dep] != null;
const getNoCSS = (type, name) => !!config[type][name].noCSS;
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
function loadPlugins(plugins, isAsync) {
    if (!globalPlugins) {
        return Promise.reject(new Error('重复注册插件'));
    }
    globalPlugins = false;
    if (isAsync) {
        return new Promise((resolve, reject) => {
            if (plugins) {
                const importList = [];
                for (let index = 0; index < plugins.length;) {
                    const plugin = plugins[index];
                    importList.push(import(/* @vite-ignore */ `./${plugin}`));
                    index += 1;
                }
                Promise.all(importList).then(() => {
                    resolve(true);
                }).catch((error) => {
                    reject(error);
                });
            }
            else {
                resolve(true);
            }
        });
    }
    if (plugins) {
        plugins.forEach((plugin) => {
            if (pluginList[plugin]) {
                import(/* @vite-ignore */ `./${plugin}`);
            }
        });
    }
    return Promise.resolve(true);
}
function loadCss(options, _ctx) {
    if (options && options.plugins) {
        const pluginCss = getLoader(config, [...options.plugins]).getIds().reduce((deps, dep) => {
            const temp = [];
            if (isPlugin(dep) && !getNoCSS('plugins', dep)) {
                temp.unshift(`${getPluginPath(dep)}.css`);
            }
            return [...deps, ...temp];
        }, ([]));
        pluginCss.forEach((p) => {
            const cssPath = `node_modules/${p}`;
            console.log(cssPath);
        });
    }
    if (options && options.theme) {
        const themeCssPath = `node_modules/${getThemePath(options.theme)}`;
        console.log(themeCssPath);
    }
}
function loadLanguages(languages) {
    const langsToLoad = languages === null || languages === void 0 ? void 0 : languages.filter((item) => !Prism.languages[item]);
    if (langsToLoad === null || langsToLoad === void 0 ? void 0 : langsToLoad.length) {
        rawLoadLanguages(langsToLoad);
    }
}
let globalTheme;
function setTheme(theme) {
    globalTheme = theme;
}
export { loadPlugins, loadLanguages, setTheme, loadCss, };
