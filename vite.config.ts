import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import babel from '@rolldown/plugin-babel'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host:'0.0.0.0',
    port: 4001,
    open: true,
    allowedHosts: ['localhost', '0.0.0.0'],
    proxy: {
      '/api': {
        // target: 'http://localhost:4001',
        changeOrigin: true,
        secure: false,
      },
    },
  },

})