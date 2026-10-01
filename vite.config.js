import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true, // Разрешаем внешние хосты (localtunnel, ngrok и т.д.)
  },
})