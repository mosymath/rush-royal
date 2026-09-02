import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: path.join(projectRoot, "client"),
  base: "./",
  resolve: {
    alias: {
      "@": path.join(projectRoot, "client", "src"),
      "@shared": path.join(projectRoot, "shared"),
      "@assets": path.join(projectRoot, "attached_assets"),
    },
  },
  build: {
    outDir: path.join(projectRoot, "dist", "offline-single"),
    emptyOutDir: true,
    cssCodeSplit: false,
    assetsInlineLimit: 100_000_000,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        entryFileNames: "assets/mosy-math.js",
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
});
