import type {
  App, HeadAttrsConfig, HeadTagEmpty, HeadTagNonEmpty, PluginObject,
} from '@vuepress/core';
import MarkdownIt from 'markdown-it';
import Prism from 'prismjs';
import fs from 'fs';
import { path } from '@vuepress/utils';

import {
  loadPlugins, loadLanguages, loadCss,
} from './plugins';
import { initPluginSwitch } from './plugins/utils/pluginSwitch';

const browserPlugins = {
  'copy-to-clipboard': true,
  'download-buttond': true,
  'line-highlight': true,
  'line-numbers': true,
  'match-braces': true,
  previewers: true,
  'show-language': true,
  toolbar: true,
};

type optionsType = {
  languages?: Array<string>,
  plugins?: Array<string>,
  theme?: string,
  css?: boolean,
  vPre?: true | boolean,
  lineNumbers?: number | boolean,
  NormalizeWhitespace?: {
    'remove-trailing'?: boolean,
    'remove-indent'?: boolean,
    'left-trim'?: boolean,
    'right-trim'?: boolean,
    'break-lines'?: number,
    'indent'?: number,
    'remove-initial-line-feed'?: boolean,
    'tabs-to-spaces'?: number,
    'spaces-to-tabs'?: number
  }
}

const resizeStr = `
if (typeof TOOLBAR_CALLBACKS === 'undefined') {
  TOOLBAR_CALLBACKS = [];
}
if (typeof TOOLBAR_MAP === 'undefined') {
  TOOLBAR_MAP = [];
}
if (typeof VUEPRESS_PLUGINS === 'undefined') {
  VUEPRESS_PLUGINS = {};
}
window.addEventListener('resize', () => {
  if (typeof VUEPRESS_PLUGINS.LoadLineNumbers !== 'undefined') {
    VUEPRESS_PLUGINS.LoadLineNumbers(Array.prototype.slice.call(document.querySelectorAll('pre.line-numbers[class*=language-]')));
  }
  if (typeof VUEPRESS_PLUGINS.LoadLineHighlight !== 'undefined') {
    VUEPRESS_PLUGINS.LoadLineHighlight(Array.prototype.slice.call(document.querySelectorAll('pre.line-highlight[class*=language-]')));
  }
});
`;

export function setHead(app: App, type: HeadTagEmpty | HeadTagNonEmpty, attr: HeadAttrsConfig, text?: string) {
  app.siteData.head = app.siteData.head || [];
  if (text) {
    app.siteData.head.push([type as HeadTagNonEmpty, attr, text]);
  } else {
    app.siteData.head.push([type as HeadTagEmpty, attr]);
  }
}

const plugin = (md: MarkdownIt, options: optionsType, app: App) => {
  if (options) {
    loadLanguages(options.languages);
    loadPlugins(md, options);
  }
  md.options.highlight = (code, lang) => {
    let prismLang = Prism.languages[lang];
    if (!prismLang) {
      loadLanguages([lang]);
      prismLang = Prism.languages[lang];
    }
    const html = prismLang
      ? Prism.highlight(code, prismLang, lang)
      : md.utils.escapeHtml(code);
    return html;
  };
};

function setFile(assetsPath: string, filePath: string, file: string) {
  fs.stat(assetsPath, (err, stats) => {
    if (!stats) {
      fs.mkdirSync(assetsPath, { recursive: true });
    }
    fs.writeFileSync(`${assetsPath}${filePath}`, file);
  });
}

export default (options: optionsType, app: App): PluginObject => {
  console.log('\x1B[36m%s\x1B[0m', 'vuepress plugin loading');
  initPluginSwitch();
  const pluginFile = `vuepress-plugin-prism.${Date.now()}.js`;
  const cssFile = `vuepress-plugin-prism.${Date.now()}.css`;
  const plugins = options?.plugins;
  let pluginStr = '';
  if (plugins) {
    pluginStr = resizeStr;
    plugins.forEach((plugin) => {
      if (browserPlugins[plugin]) {
        pluginStr += `${fs.readFileSync(path.resolve(__dirname, `./browser/${plugin}.global.js`)).toString()}\n`;
      }
    });
  }
  const cssStr = loadCss(options);
  if (app.env.isDev || app.env.isDebug) {
    if (pluginStr !== '') {
      setHead(app, 'script', {}, pluginStr);
    }
    if (cssStr !== '') {
      setHead(app, 'style', { type: 'text/css' }, cssStr);
    }
  } else if (app.env.isBuild) {
    setHead(app, 'script', { defer: true, src: `/assets/js/${pluginFile}` });
    setHead(app, 'link', { rel: 'stylesheet', href: `/assets/css/${cssFile}` });
  }
  return {
    name: 'vuepress-plugin-prismjs-next',
    extendsMarkdown(md) {
      options = {
        languages: ['java', 'css', 'javascript', 'typescript', 'html', 'json', 'shell', 'yaml', 'diff'],
        plugins: [],
        css: true,
        vPre: true,
        lineNumbers: 3,
        ...(options || {}),
      };
      plugin(md, options as optionsType, app as App);
    },
    clientAppEnhanceFiles: app.env.isBuild ? path.resolve(__dirname, './clientAppEnhanceFiles.js') : path.resolve(__dirname, './esm/clientAppEnhanceFiles.js'),
    onGenerated(app: App) {
      if (pluginStr !== '') {
        const assetsJsPath = `${path.resolve(app.options.dest)}/assets/js/`;
        setFile(assetsJsPath, pluginFile, pluginStr);
      }
      if (cssStr) {
        const assetsCssPath = `${path.resolve(app.options.dest)}/assets/css/`;
        setFile(assetsCssPath, cssFile, cssStr);
      }
    },
  };
};

export {
  optionsType,
};
