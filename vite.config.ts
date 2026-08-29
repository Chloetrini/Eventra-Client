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
      // Was pointed at 4001 — this dev server's OWN port (see `port: 4001`
      // just above) — so every local /api call was proxying back to itself
      // instead of reaching the actual backend, which runs on 4000 (see
      // startServer's PORT default in the backend's src/index.ts). That
      // made every API call fail locally regardless of whether the backend
      // itself was up and connected.
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
    },
  },

})
