import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: { target: ['chrome107', 'firefox104', 'edge107', 'safari16'] },
  server: {
    proxy: { '/api': 'http://127.0.0.1:3001' },
    allowedHosts: true, // Разрешаем внешние хосты (localtunnel, ngrok и т.д.)
  },
})
