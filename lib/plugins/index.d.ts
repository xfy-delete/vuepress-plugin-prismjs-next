import type { App } from '@vuepress/core';
import * as MarkdownIt from 'markdown-it';
declare function loadPlugins(app: MarkdownIt | App, css?: boolean, plugins?: Array<string>): void;
declare function loadTheme(app: MarkdownIt | App, css?: boolean, theme?: string): void;
export { loadPlugins, loadTheme, };
