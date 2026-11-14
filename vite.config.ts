import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import tsConfigPaths from 'vite-tsconfig-paths'

// IMPORTANT: cloudflare() must be listed FIRST.
// tanstackStart() already includes the React Vite plugin internally — do NOT
// add @vitejs/plugin-react here or it will register twice and break.
export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tanstackStart({
      server: { entry: 'server' }, // → src/server.ts (SSR error wrapper)
    }),
    tailwindcss(),
    tsConfigPaths(),
  ],
})
