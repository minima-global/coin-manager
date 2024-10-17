import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react-swc"
import legacy from "@vitejs/plugin-legacy"
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"
import path from "path"

export default () => {
  return defineConfig({
    base: "",
    build: {
      outDir: "build",
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    plugins: [
      react(),
      legacy({
        targets: ["defaults", "not IE 11", "Android >= 9"],
      }),
      TanStackRouterVite(),
    ],
  })
}
