import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  base: command === 'build' ? '/Blend-builder/' : '/',
  server: {
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
}))
