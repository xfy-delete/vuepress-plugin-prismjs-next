import config from 'prismjs/components';
import getLoader from 'prismjs/dependencies';
import rawLoadLanguages from 'prismjs/components/index';
import Prism from 'prismjs';
import {
  App, HeadAttrsConfig, HeadTagNonEmpty,
} from '@vuepress/core';
import MarkdownIt from 'markdown-it';
import uglifycss from 'uglifycss';
import fs from 'fs';
import { path } from '@vuepress/utils';
import Token from 'markdown-it/lib/token';

import lineNumbers, { loadLineNumbers, setWhiteSpaceStyle } from './line-numbers';
import lineHighlight from './line-highlight';
import matchBraces from './match-braces';
import { optionsType } from '..';
import { myToolbar, registerButton } from './toolbar';
import showLanguage from './show-language';
import copyToClipboard from './copy-to-clipboard';
import downloadButton from './download-button';
import newCode from '../new_code';
import oldCode from '../old_code';
import inlineStyle from './browser/inline-style';

rawLoadLanguages.silent = true;

let globalPluginsLoad = true;

const localPluginList = {
  autolinker: true,
  'inline-style': true,
  'data-uri-highlight': true,
  'show-invisibles': true,
  'normalize-whitespace': true,
  previewers: true,
};

const pluginList = {
  treeview: true,
  'diff-highlight': true,
  'highlight-keywords': true,
};

const pluginMap: {
  [key: string]: boolean
} = {};

function isVPre(info: string): boolean | null {
  if (/:v-pre\b/.test(info)) {
    return true;
  }
  if (/:no-v-pre\b/.test(info)) {
    return false;
  }
  return null;
}

function mdPlugin(md: MarkdownIt, options: optionsType, pluginMap: {[key: string]: boolean}) {
  md.renderer.rules.fence = (tokens: Array<Token>, idx: number, opts: MarkdownIt.Options) => {
    const preClassList: Array<string> = [];
    const preStyleList: Array<string> = [];
    const codeStyleList: Array<string> = [];
    let lines: [number, string] | null = null;
    const token = tokens[idx];
    if (token.tag !== 'code') {
      return token.content;
    }
    const info = token.info ? md.utils.unescapeAll(token.info).trim() : '';
    const lang = info.match(/^([a-zA-Z]+)/)?.[1] || 'text';
    const html = opts.highlight?.(token.content, lang, '') || md.utils.escapeHtml(token.content);
    const languageClass = `${md.options.langPrefix}${md.utils.escapeHtml(lang)}`;
    preClassList.push(languageClass);
    if (pluginMap['line-numbers']) {
      lines = lineNumbers(info, token.content, preStyleList, codeStyleList, options);
      if (lines) {
        preClassList.push('line-numbers');
        preStyleList.push(`counter-reset: linenumber ${lines[0] - 1};`);
      }
    } else {
      setWhiteSpaceStyle(info, codeStyleList);
    }
    if (pluginMap.toolbar) {
      preClassList.push('my-toolbar');
    }
    if (pluginMap.toolbar && pluginMap['show-language']) {
      preClassList.push('show-language');
    }
    let codeStr = `<code class='${languageClass}' style='${codeStyleList.join('')}'>${html}${lines ? lines[1] : ''}</code>`;
    const useVPre = isVPre(info) ?? options.vPre;
    if (useVPre) {
      codeStr = `<code v-pre${codeStr.slice('<code'.length)}`;
    }
    const match = info.match(/{([\d,-]+)}/);
    return `<pre v-pre-load ${match ? `data-line=${match[1]}` : ''} lang=${lang} class='match-braces rainbow-braces ${preClassList.join(' ')}' style='${preStyleList.join('')}'>${codeStr}</pre>`;
  };
}

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

function loadPlugins(md: MarkdownIt, app: App, options: optionsType): undefined {
  if (!globalPluginsLoad) {
    return;
  }
  const plugins = options?.plugins;
  globalPluginsLoad = false;
  if (plugins) {
    for (let index = 0; index < plugins.length;) {
      const plugin = plugins[index];
      if (localPluginList[plugin]) {
        import(`./${plugin}`);
      }
      if (pluginList[plugin]) {
        import(`prismjs/plugins/${plugin}/prism-${plugin}`);
      }
      pluginMap[plugin] = true;
      index += 1;
    }
  }
  if (pluginMap['inline-style']) {
    setHead(app, 'style', { type: 'text/css' }, inlineStyle);
  }
  if (pluginMap['line-numbers']) {
    setHead(app, 'script', {}, loadLineNumbers.toString());
  }
  if (pluginMap['line-highlight']) {
    setHead(app, 'script', {}, lineHighlight.toString());
  }
  if (pluginMap['match-braces']) {
    setHead(app, 'script', {}, matchBraces.toString());
  }
  if (pluginMap.toolbar) {
    setHead(app, 'script', {}, registerButton.toString());
    setHead(app, 'script', {}, myToolbar.toString());
  }
  if (pluginMap.toolbar && pluginMap['show-language']) {
    setHead(app, 'script', {}, showLanguage);
  }
  if (pluginMap.toolbar && pluginMap['copy-to-clipboard']) {
    setHead(app, 'script', {}, copyToClipboard);
  }
  if (pluginMap.toolbar && pluginMap['download-button']) {
    setHead(app, 'script', {}, downloadButton);
  }
  if (pluginMap.previewers) {
    setHead(app, 'script', {}, fs.readFileSync(path.resolve(__dirname, './previewers/index.js')).toString()
      .replace('exports.default = previewers;', '').replace('Object.defineProperty(exports, "__esModule", { value: true });', ''));
  }
  mdPlugin(md, options, pluginMap);
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

function defaultCss(scssStr: string) {
  let codeScssPath = '../../../@vuepress/theme-default/lib/client/styles/code.scss';
  if (process.env.VUEPRESS_PLUGIN_PRISMJS_NEXT && process.env.VUEPRESS_PLUGIN_PRISMJS_NEXT.indexOf('true') !== -1) {
    codeScssPath = '../../example/node_modules/@vuepress/theme-default/lib/client/styles/code.scss';
  }
  fs.writeFileSync(path.resolve(__dirname, path.resolve(__dirname, codeScssPath)), scssStr);
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
    defaultCss(newCode);
  } else {
    defaultCss(oldCode);
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
