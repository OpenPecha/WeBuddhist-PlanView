import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  const backendBaseUrl = env.VITE_BACKEND_BASE_URL
  const shortUrlBase = env.VITE_SHORT_URL_BASE
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      open: true,
      allowedHosts: true,
      proxy: {
        "/api": {
          target: backendBaseUrl,
          changeOrigin: true,
        },
        "/shortener": {
          target: shortUrlBase,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/shortener/, ""),
        },
      },
    },
    preview: {
      host: "0.0.0.0",
      port: 4173,
    },
  }
})
