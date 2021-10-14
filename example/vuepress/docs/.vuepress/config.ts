import { defineUserConfig } from '@vuepress/cli';
import { resolve } from 'path';
import type { DefaultThemeOptions } from '@vuepress/theme-default';

const isProd = process.env.NODE_ENV === 'production';

export default defineUserConfig<DefaultThemeOptions>({
  base: '/',
  lang: 'zh-CN',
  title: 'vuepress-plugin-prismjs 例子',
  description: 'vuepress-plugin-prismjs 例子',
  plugins: [[
    resolve(__dirname, '../../../../lib'),
    {
      languages: ['java', 'css', 'javascript', 'typescript', 'html', 'json', 'shell', 'yaml', 'diff'],
      plugins: ['inline-color'], // , "autolinker", "data-uri-highlight", "diff-highlight"
      theme: "dark",
    }
  ]],
  themeConfig: {
    themePlugins: {
      prismjs: false,
    },
  },
  markdown: {
    code: {
      preWrapper: false,
    },
    customComponent: false,
  },
  bundler: process.env.DOCS_BUNDLER ?? (isProd ? '@vuepress/webpack' : '@vuepress/vite'),
  dest: `${__dirname}../../../.dist`,
  temp: `${__dirname}../../../.temp`,
  cache: `${__dirname}../../../.cache`,
  port: 8081,
  open: false
});
