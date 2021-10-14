<template>
  <div v-html="html"></div>
</template>

<script lang="ts">
import {
  defineComponent
} from 'vue';

import MarkdownIt, { PluginSimple } from 'markdown-it';
// import markdownPlugin from '../../../lib/esm';

const md = MarkdownIt({
  highlight: function (str, lang) {
    console.log(str)
    return '';
  }
});
// md.use(markdownPlugin as PluginSimple)

export default defineComponent({
  name: 'app',
  setup() {
    const html = md.render(`
    \`\`\`html
    <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Example</title>
<style>
/* Also works here */
a.not-a-class {
	color:
red;
}
</style>
<body style="color: black">

</body>
</html>
\`\`\`
    `);
    return {
      html
    };
  },
});
</script>

<style>
</style>
