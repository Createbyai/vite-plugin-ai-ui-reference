import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import aiUiReference from './plugins/vite-plugin-ai-ui-reference/index.js';

export default defineConfig({
  plugins: [vue(), aiUiReference()],
  server: { host: '127.0.0.1', port: 4173, strictPort: true },
  preview: { host: '127.0.0.1', port: 4173, strictPort: true }
});
