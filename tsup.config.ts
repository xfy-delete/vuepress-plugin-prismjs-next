import type { Options } from 'tsup';

const tsup: Options = {
  splitting: false,
  sourcemap: false,
  clean: true,
  watch: ['./src/plugins/browser', './src/plugins/utils'],
  entryPoints: ['./src/plugins/browser'],
  format: ['iife'],
  outDir: './lib/browser',
  bundle: true,
  dts: true,
};

export default tsup;
