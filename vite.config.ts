import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "db": path.resolve(__dirname, "./db"),
      "contracts": path.resolve(__dirname, "./contracts"),
    },
  },
  build: {
    outDir: 'dist',
  },
})
