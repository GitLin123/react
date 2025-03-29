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
  optimizeDeps: {
    include: [  // 显式包含所有必要依赖
    ]
  },
  server: {

  }
});