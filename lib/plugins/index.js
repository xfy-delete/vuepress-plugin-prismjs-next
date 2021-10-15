"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
}) : (function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function (o, v) {
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
exports.loadCss = exports.setTheme = exports.loadLanguages = exports.loadPlugins = void 0;
const components_1 = __importDefault(require("prismjs/components"));
const dependencies_1 = __importDefault(require("prismjs/dependencies"));
const prismjs_1 = __importDefault(require("prismjs"));
const languages_1 = __importDefault(require("./languages"));
let globalPlugins = true;
const pluginList = {
  autolinker: true,
  'inline-color': true,
  'diff-highlight': true,
  'data-uri-highlight': true,
};
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
          importList.push(Promise.resolve().then(() => __importStar(require(`./${plugin}`))));
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
        Promise.resolve().then(() => __importStar(require(`./${plugin}`)));
      }
    });
  }
  return Promise.resolve(true);
}
exports.loadPlugins = loadPlugins;
function loadCss(options, _ctx) {
  if (options && options.plugins) {
    const pluginCss = (0, dependencies_1.default)(components_1.default, [...options.plugins]).getIds().reduce((deps, dep) => {
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
exports.loadCss = loadCss;
function loadLanguages(languages) {
  const langsToLoad = languages === null || languages === void 0 ? void 0 : languages.filter((item) => !prismjs_1.default.languages[item]);
  if (langsToLoad === null || langsToLoad === void 0 ? void 0 : langsToLoad.length) {
    (0, languages_1.default)(langsToLoad);
  }
}
exports.loadLanguages = loadLanguages;
let globalTheme;
function setTheme(theme) {
  globalTheme = theme;
}
exports.setTheme = setTheme;
