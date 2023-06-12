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
        '01-new-hope-intro': resolve(root, '01-new-hope-intro', 'index.html'),
        '02-product-detail': resolve(root, '02-product-detail', 'index.html'),
        '03-chamboule-tout': resolve(root, '03-chamboule-tout', 'index.html'),
        '04-product-detail': resolve(root, '04-product-detail', 'index.html'),
        '05-shader-drawing': resolve(root, '05-shader-drawing', 'index.html'),
        '06-business-card': resolve(root, '06-business-card', 'index.html'),
        '07-blender-portal': resolve(root, '07-blender-portal', 'index.html'),
        '08-earth-animation': resolve(root, '08-earth-animation', 'index.html'),
      },
    },
  },
  plugins: [glsl()],
};
