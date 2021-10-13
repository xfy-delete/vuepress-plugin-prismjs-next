import type { Plugin } from '@vuepress/core';

export interface PrismjsPluginOptions {
  languages: string[];
}

declare const prismjsPlugin: Plugin<PrismjsPluginOptions>;

export default prismjsPlugin;
