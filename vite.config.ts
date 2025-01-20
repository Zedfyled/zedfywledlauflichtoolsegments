import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        dir: "docs",
        entryFileNames: 'plugin.js',
        assetFileNames: 'plugin.css',
        chunkFileNames: "chunk.js",
        manualChunks: undefined,
      }
    }
  }
})
