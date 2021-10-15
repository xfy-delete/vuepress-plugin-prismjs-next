<template>
  <div v-html="html"></div>
</template>

<script lang="ts">
import { defineComponent, nextTick, ref } from "vue";

import MarkdownIt, { PluginSimple } from "markdown-it";
// @ts-ignore
import markdownPlugin from "../../../lib/esm";

var tmpl = `
\`\`\`html
  <!DOCTYPE html>
  <html lang="en">
  <meta charset="utf-8" />
  <title>测试</title>
  <style>
    a.not-a-class {
      color: red;
    }
  </style>
  <body style="color: black">
    <!-- Links in HTML, woo!
    Lea Verou http://lea.verou.me or, with Markdown, Lea Verou -->
    <img src="https://prismjs.com/assets/img/spectrum.png" alt="In attributes too!" />
    <p>Autolinking in raw text: http://prismjs.com</p>
  </body>
  </html>
\`\`\`
`;
const md = new MarkdownIt();
md.use(markdownPlugin as PluginSimple);
export default defineComponent({
  name: "app",
  setup() {
    const html = ref('');
    nextTick(() => {
      console.log(222)
      html.value = md.render(tmpl);
    })
    return {
      html,
    };
  },
});
</script>

<style>
</style>
