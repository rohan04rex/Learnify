import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build'
    ? '/RGET project assignment 1 backup 1/admin-dashboard/'
    : '/',
}))
