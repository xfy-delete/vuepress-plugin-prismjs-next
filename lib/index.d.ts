import type { PluginFunction, App, PluginObject } from '@vuepress/core';
import * as MarkdownIt from 'markdown-it';
declare type optionsType = {
    languages?: Array<string>;
    plugins?: Array<string>;
    theme?: string;
    css?: boolean;
};
declare const _default: (options: PluginFunction<optionsType> | MarkdownIt, app: App | MarkdownIt.PluginWithOptions<optionsType>) => void | PluginObject;
export default _default;
