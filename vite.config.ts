import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";
import { powerApps } from "./plugins/powerApps";

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react(), powerApps()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5177,
    strictPort: true,
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom', 'jsqr'],
          'radix-ui': ['@radix-ui/react-dialog', '@radix-ui/react-alert-dialog'],
        },
      },
    },
  },
});
