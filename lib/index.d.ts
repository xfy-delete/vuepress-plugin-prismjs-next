import { PluginFunction, AppOptions, PluginObject } from '@vuepress/core';
import * as MarkdownIt from 'markdown-it';

declare type optionsType = {
    languages?: Array<string>;
    plugins?: Array<string>;
    theme?: string;
    css?: boolean;
};
declare const _default: (options: PluginFunction<optionsType> | MarkdownIt, app: AppOptions | MarkdownIt.PluginWithOptions<optionsType>) => void | PluginObject;

export { _default as default };
