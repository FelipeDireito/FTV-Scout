import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      }),
      basicSsl()
    ],
    preview: {
      https: true,
    },
    server: {
      https: true,
      proxy: {
        '/api': {
          target: env.API_TARGET || 'http://localhost:8000',
          changeOrigin: true,
        },
      },
    },
  }
})
