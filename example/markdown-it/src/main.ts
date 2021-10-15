import { createApp } from 'vue';
// @ts-ignore
import { useOptions } from "../../../lib/esm";
import App from './App.vue';
useOptions({
  languages: ['java', 'css', 'javascript', 'typescript', 'html', 'json', 'shell', 'yaml', 'diff'],
  plugins: ['inline-color'],
}).then(() => {
  const app = createApp(App);
  app.mount('#app');
})

