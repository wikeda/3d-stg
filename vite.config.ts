import { defineConfig } from 'vite'

export default defineConfig({
  base: '/3d-stg/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
