import { resolve } from 'path';
import glsl from 'vite-plugin-glsl';

const root = resolve(__dirname, 'src');
const outDir = resolve(__dirname, 'dist');

export default {
  root: 'src/',
  publicDir: '../public/',
  base: './',
  build: {
    outDir,
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        '01': resolve(root, '01', 'index.html'),
        '02': resolve(root, '02', 'index.html'),
        '03': resolve(root, '03', 'index.html'),
        '04': resolve(root, '04', 'index.html'),
        '05': resolve(root, '05', 'index.html'),

      },
    },
  },
  plugins: [glsl()],
};
