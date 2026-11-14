// Plugins included by @tanstack/react-start/config:
//   - TanStack Router codegen, tanstackStart (SSR), @vitejs/plugin-react,
//     tailwindcss (v4), vite-tsconfig-paths, nitro (cloudflare-pages preset),
//     VITE_* env injection, @ path alias, React/TanStack dedupe.
// Add extra vite plugins under the `vite.plugins` key if needed.
import { defineConfig } from "@tanstack/react-start/config";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    // Builds for Cloudflare Pages (SSR via Pages Functions / _worker.js).
    // Switch to 'cloudflare' if deploying as a standalone Cloudflare Worker.
    preset: "cloudflare-pages",
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    entry: "server",
  },
  tsr: {
    generatedRouteTree: "./src/routeTree.gen.ts",
    routesDirectory: "./src/routes",
    autoCodeSplitting: true,
  },
  vite: {
    plugins: [tailwindcss(), tsConfigPaths()],
  },
});
