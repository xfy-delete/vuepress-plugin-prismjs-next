import { defineConfig, UserConfigExport } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import html from 'vite-plugin-html';
import { resolve } from 'path';

const pathResolve = (pathStr: string) => resolve(__dirname, pathStr);

export default (): UserConfigExport => defineConfig({
  plugins: [vue(), vueJsx(), html()],
  resolve: {
    alias: {
      '@': pathResolve('./src'),
    },
  },
  build: {
    outDir: 'dist',
    terserOptions: {
      compress: {
        keep_infinity: true,
        drop_console: true,
        drop_debugger: true,
      },
    },
    brotliSize: false,
    chunkSizeWarningLimit: 2000,
  },
  server: {
    port: 8082,
    open: false,
    host: '0.0.0.0',
    https: false,
  },
  css: {
    preprocessorOptions: {},
  },
});
