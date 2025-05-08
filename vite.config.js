import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',  // This ensures the assets are correctly referenced for GitHub Pages
  plugins: [react()],
})