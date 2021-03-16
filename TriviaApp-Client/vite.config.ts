import vue from '@vitejs/plugin-vue'
import path from 'path';
import { defineConfig } from 'vite'
import { getAliases } from 'vite-aliases'

import tsconfigPaths from 'vite-tsconfig-paths'

const aliases = getAliases();

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [vue(), tsconfigPaths()],
  server: {
    port: 8080,
  },
  resolve:
  {
    alias: {
      '/@': path.resolve(__dirname, './src')
    },
  },
  mode: 'development',
});
