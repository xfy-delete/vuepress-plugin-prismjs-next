import config from 'prismjs/components';
import fs from 'fs';
import uglifycss from 'uglifycss';
import getLoader from 'prismjs/dependencies';

const pluginList = {
  autolinker: true,
  'inline-color': true,
  'diff-highlight': true,
  'data-uri-highlight': true,
};
const getPath = (type) => (name) => `prismjs/${config[type].meta.path.replace(/\{id\}/g, name)}`;
const isPlugin = (dep) => config.plugins[dep] != null;
const getNoCSS = (type, name) => !!config[type][name].noCSS;
function isFileExisted(file) {
  return new Promise((resolve, reject) => {
    fs.access(file, (err) => {
      if (err) {
        reject(err.message);
      } else {
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
  } else {
    theme = `prism-${theme}`;
  }
  return getPath('themes')(theme);
};
const getPluginPath = getPath('plugins');
function loadPlugins(app, css, plugins) {
  console.log('----------------------', plugins);
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
      const pluginCss = getLoader(config, [...plugins]).getIds().reduce((deps, dep) => {
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
          const uglified = uglifycss.processString(fs.readFileSync(cssPath).toString(), { maxLineLen: 500, expandVars: true });
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
function loadTheme(app, css, theme) {
  if ((css === undefined || css) && theme) {
    const themeCssPath = `node_modules/${getThemePath(theme)}`;
    isFileExisted(themeCssPath).then(() => {
      console.log(themeCssPath);
      const uglified = uglifycss.processString(fs.readFileSync(themeCssPath).toString(), { maxLineLen: 500, expandVars: true });
      if (uglified) {
        if (app.siteData !== undefined) {
          app.siteData.head = app.siteData.head || [];
          app.siteData.head.push(['style', { type: 'text/css' }, uglified]);
        }
      }
    });
  }
}
export { loadPlugins, loadTheme };
