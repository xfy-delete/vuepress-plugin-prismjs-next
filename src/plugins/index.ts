import config from 'prismjs/components';
import getLoader from 'prismjs/dependencies';
import rawLoadLanguages from 'prismjs/components/index';
import Prism from 'prismjs';
import { App } from '@vuepress/core';
import MarkdownIt from 'markdown-it';
import uglifycss from 'uglifycss';
import fs from 'fs';

import mdPlugin from './md';

import { optionsType } from '..';

rawLoadLanguages.silent = true;

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

const getPath = (type: string) => (name: string) => `prismjs/${config[type].meta.path.replace(/\{id\}/g, name)}`;

const isPlugin = (dep: string) => config.plugins[dep] != null;

const getNoCSS = (type: string, name: string) => !!config[type][name].noCSS;

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

function loadPlugins(md: MarkdownIt, plugins: Array<string> | undefined, app: App): undefined {
  if (!globalPluginsLoad) {
    return;
  }
  globalPluginsLoad = false;
  if (plugins) {
    for (let index = 0; index < plugins.length;) {
      const plugin = plugins[index];
      if (localPluginList[plugin]) {
        import(`./prismjs/${plugin}`);
      }
      if (pluginList[plugin]) {
        import(`prismjs/plugins/${plugin}/prism-${plugin}`);
      }
      pluginMap[plugin] = true;
      index += 1;
    }
  }
  mdPlugin(md, pluginMap, app);
}

function loadLanguages(languages?: Array<string>) {
  const langsToLoad = languages?.filter((item) => !Prism.languages[item]);
  if (langsToLoad?.length) {
    rawLoadLanguages(langsToLoad);
  }
}

function getPluginCssList(plugins: Array<string>): Array<string> {
  const cssList = getLoader(config, [...plugins]).getIds().reduce((deps: Array<string>, dep: string) => {
    const temp = [];
    if (isPlugin(dep) && !getNoCSS('plugins', dep)) {
      temp.unshift(`${getPluginPath(dep)}.css` as never);
    }
    return [...deps, ...temp];
  }, ([]));
  return cssList;
}

function getFileString(file: string): string {
  const data = fs.readFileSync(`node_modules/${file}`);
  return uglifycss.processString(data.toString(), { maxLineLen: 500, expandVars: true });
}

function loadCss(app: App, options?: optionsType): undefined {
  let cssPathList: Array<string> = [];
  let themeCssPath: string | undefined;
  if (options && options.plugins) {
    cssPathList = getPluginCssList(options.plugins);
  }
  if (options && options.theme) {
    themeCssPath = getThemePath(options.theme);
  }
  const cssStrList: Array<string> = [];
  if (themeCssPath) {
    cssStrList.push(getFileString(themeCssPath));
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
export {
  loadPlugins,
  loadLanguages,
  loadCss,
};
