import config from 'prismjs/components';
import getLoader from 'prismjs/dependencies';
import rawLoadLanguages from 'prismjs/components/index';
import Prism from 'prismjs';
import {
  App, HeadAttrsConfig, HeadTagEmpty, HeadTagNonEmpty,
} from '@vuepress/core';
import MarkdownIt from 'markdown-it';
import uglifycss from 'uglifycss';
import fs from 'fs';
import { path } from '@vuepress/utils';

import mdPlugin from './md';
import { lineNumbers } from './md/line-numbers';

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

export function setHead(app: App, type: HeadTagNonEmpty, attr: HeadAttrsConfig, text: string) {
  app.siteData.head = app.siteData.head || [];
  app.siteData.head.push([type, attr, text]);
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
  if (pluginMap['line-numbers']) {
    setHead(app, 'script', {}, lineNumbers.toString());
  }
  mdPlugin(md, pluginMap);
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

function removeDefaultCss() {
  let codeScssPath = '../../../@vuepress/theme-default/lib/client/styles/code.scss';
  if (process.env.VUEPRESS_PLUGIN_PRISMJS_NEXT && process.env.VUEPRESS_PLUGIN_PRISMJS_NEXT.indexOf('true') !== -1) {
    codeScssPath = '../../example/node_modules/@vuepress/theme-default/lib/client/styles/code.scss';
  }
  fs.writeFileSync(path.resolve(__dirname, path.resolve(__dirname, codeScssPath)), `
@import '_variables';

code[class*='language-'],
pre[class*='language-'] {
  background: none;
  font-family: var(--font-family-code);
  font-size: 1em;
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  word-wrap: normal;
  line-height: 1.5;

  -moz-tab-size: 4;
  -o-tab-size: 4;
  tab-size: 4;

  -webkit-hyphens: none;
  -moz-hyphens: none;
  -ms-hyphens: none;
  hyphens: none;
}

pre[class*='language-'] {
  padding: 1em;
  margin: 0.5em 0;
  overflow: auto;
}

:not(pre) > code[class*='language-'] {
  padding: 0.1em;
  border-radius: 0.3em;
  white-space: normal;
}


.theme-default-content {
  pre,
  pre[class*='language-'] {
    line-height: 1.4;
    padding: 1.25rem 1.5rem;
    margin: 0.85rem 0;
    border-radius: 6px;
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
export {
  loadPlugins,
  loadLanguages,
  loadCss,
};
