import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Guia-do-Cidadao/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://analyzedocument-3jxiuen5qa-uc.a.run.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})

