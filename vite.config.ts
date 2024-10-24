import path from 'node:path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [TanStackRouterVite(), react()],
  build: {
    outDir: path.join("build", "dist"),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
