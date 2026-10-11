import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/fantasy-draft-tool-v2/',
  plugins: [
    react(),
    tailwindcss()
  ],
})
