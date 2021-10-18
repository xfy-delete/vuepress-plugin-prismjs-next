import { App } from '@vuepress/core';
import MarkdownIt from 'markdown-it';
import Token from 'markdown-it/lib/token';

import lineNumbers from './line-numbers';

export default (md: MarkdownIt, pluginMap: {}, app: App) => {
  md.renderer.rules.fence = (tokens: Array<Token>, idx: number, options, env, slf) => {
    const preClassList: Array<string> = [];
    const preStyleList: Array<string> = [];
    const codeStyleList: Array<string> = [];
    let lines: [number, string] | null = null;
    const token = tokens[idx];
    const info = token.info ? md.utils.unescapeAll(token.info).trim() : '';
    const lang = info.match(/^([a-zA-Z]+)/)?.[1] || 'text';
    const html = options.highlight?.(token.content, lang, '') || md.utils.escapeHtml(token.content);
    const languageClass = `${md.options.langPrefix}${md.utils.escapeHtml(lang)}`;
    preClassList.push(languageClass);
    if (pluginMap['line-numbers']) {
      lines = lineNumbers(token, info, token.content, preStyleList, app);
      if (lines) {
        preClassList.push('line-numbers');
        preStyleList.push(`counter-reset: linenumber ${lines[0] - 1};`);
      }
    }
    const codeStr = `<code class='${languageClass}'>${html}${lines ? lines[1] : ''}</code>`;
    return `<pre v-line-numbers class='${preClassList.join(' ')}' style='${preStyleList.join('')}'>${codeStr}</pre>`;
  };
};
