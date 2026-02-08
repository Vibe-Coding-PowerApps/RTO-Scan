import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";
import { powerApps } from "./plugins/powerApps";
import fs from "fs";

// https://vite.dev/config/
export default defineConfig(() => {
  // Always include Power Apps plugin in dev for CORS
  const plugins = [react(), powerApps()];
  // HTTPS config (only if certs exist)
  let https: any = undefined;
  try {
    if (fs.existsSync('cert/key.pem') && fs.existsSync('cert/cert.pem')) {
      https = {
        key: fs.readFileSync('cert/key.pem'),
        cert: fs.readFileSync('cert/cert.pem'),
      } as any;
    }
  } catch (e) {
    console.warn('Could not load HTTPS certs:', e);
  }
  return {
    base: "./",
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 5178,
      strictPort: true,
      https,
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
  };
});
