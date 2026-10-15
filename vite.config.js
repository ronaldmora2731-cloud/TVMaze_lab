import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  // Rutas relativas: funcionan localmente y en GitHub Pages
  // aunque el repositorio tenga cualquier nombre.
  base: "./",
  server: { port: 1234 },
  build: {
    outDir: "../dist",
    emptyOutDir: true
  }
});
