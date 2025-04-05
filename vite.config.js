import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
  plugins: [
    react(),
    wasm(),
    topLevelAwait()
  ],
  build: {
    commonjsOptions: {
      include: [/onnxruntime-web/, /node_modules/] // 强制包含CJS模块
    }
  },

  server: {
    proxy: {
      // 将所有以 /api 开头的请求转发到后端
      '/api': {
        target: 'http://localhost:3000', // 后端地址
        changeOrigin: true,
      }
    }
  }
});