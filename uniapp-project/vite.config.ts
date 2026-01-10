import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';

export default defineConfig({
  plugins: [uni()],
  transpileDependencies: ['wot-design-uni'],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    open: false,
    cors: true
  },
  build: {
    target: 'es2015',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'pinia']
        }
      }
    }
  },
  // 配置路径别名（已在 tsconfig.json 中配置）
  resolve: {
    alias: {
      '@': './src'
    }
  }
});
