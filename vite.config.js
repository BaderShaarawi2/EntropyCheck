import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // react() lets Vite understand JSX (the HTML-looking code inside .jsx files).
  plugins: [react()],
})
