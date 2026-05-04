import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/classify': 'http://localhost:5000',
      '/upload': 'http://localhost:5000',
      '/predict_personality': 'http://localhost:5000',
      '/plan_trip': 'http://localhost:5000',
    },
  },
})
