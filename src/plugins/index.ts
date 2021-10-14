import config from 'prismjs/components';
import fs from 'fs';
import uglifycss from 'uglifycss';
import type { App } from '@vuepress/core';
import * as MarkdownIt from 'markdown-it';
import getLoader from 'prismjs/dependencies';

const pluginList = {
  autolinker: true,
  'inline-color': true,
  'diff-highlight': true,
  'data-uri-highlight': true,
};

const getPath = (type: string) => (name: string) => `prismjs/${config[type].meta.path.replace(/\{id\}/g, name)}`;

const isPlugin = (dep: string) => config.plugins[dep] != null;

const getNoCSS = (type: string, name: string) => !!config[type][name].noCSS;

function isFileExisted(file: string): Promise<boolean> {
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

function loadPlugins(app: MarkdownIt | App, css?: boolean, plugins?: Array<string>) {
  if (plugins) {
    plugins.forEach((plugin) => {
      if (pluginList[plugin]) {
        // @ts-ignore
        import.meta.glob(`./${plugin}`);
      }
    });
    if ((app as App).siteData !== undefined) {
      (app as App).siteData.head = (app as App).siteData.head || [];
    }
    if (css === undefined || css) {
      const pluginCss = getLoader(config, [...plugins]).getIds().reduce((deps: Array<string>, dep: string) => {
        const temp = [];
        if (isPlugin(dep) && !getNoCSS('plugins', dep)) {
          temp.unshift(`${getPluginPath(dep)}.css` as never);
        }
        return [...deps, ...temp];
      }, ([]));
      pluginCss.forEach((p: string) => {
        const cssPath = `node_modules/${p}`;
        isFileExisted(cssPath).then(() => {
          console.log(cssPath);
          const uglified = uglifycss.processString(
            fs.readFileSync(cssPath).toString(),
            { maxLineLen: 500, expandVars: true },
          );
          if (uglified) {
            if ((app as App).siteData !== undefined) {
              (app as App).siteData.head.push(['style', { type: 'text/css' }, uglified]);
            }
          }
        });
      });
    }
  }
}

function loadTheme(app: MarkdownIt | App, css?: boolean, theme?: string) {
  if ((css === undefined || css) && theme) {
    const themeCssPath = `node_modules/${getThemePath(theme)}`;
    isFileExisted(themeCssPath).then(() => {
      console.log(themeCssPath);
      const uglified = uglifycss.processString(
        fs.readFileSync(themeCssPath).toString(),
        { maxLineLen: 500, expandVars: true },
      );
      if (uglified) {
        if ((app as App).siteData !== undefined) {
          (app as App).siteData.head = (app as App).siteData.head || [];
          (app as App).siteData.head.push(['style', { type: 'text/css' }, uglified]);
        }
      }
    });
  }
}

export {
  loadPlugins,
  loadTheme,
};
