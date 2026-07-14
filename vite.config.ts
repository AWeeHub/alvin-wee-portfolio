/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        /**
         * Fonts keep their own names; everything else keeps its content hash.
         *
         * The hash is what makes a file safe to cache forever, and the fonts do
         * not need it: they are immutable upstream (@fontsource ships a version,
         * not a moving file), and a stable name is the only way index.html can
         * name them in a <link rel="preload"> — which is what takes them off the
         * critical path behind the CSS. Discovered late, they swapped in at 3.4s
         * on a throttled phone and re-wrapped the headline: CLS 0.22.
         */
        assetFileNames: (asset) =>
          /\.(woff2?|ttf|otf|eot)$/i.test(asset.names?.[0] ?? asset.name ?? '')
            ? 'assets/fonts/[name][extname]'
            : 'assets/[name]-[hash][extname]',
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
