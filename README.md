# ADZVO Business Showcase

Built with TanStack Start, React, TypeScript, and Tailwind CSS. Deployed on Cloudflare Workers.

## Development

Requires Node.js 20+. Install with [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) if needed.

```sh
npm install
npm run dev
```

The dev server uses `@cloudflare/vite-plugin` for local emulation of the Cloudflare runtime.

## Build & Deploy

```sh
# Build
npm run build

# Deploy to Cloudflare Workers
npm run deploy
# (runs: wrangler deploy)
```

First time: run `npx wrangler login` before deploying.

## Stack

- [TanStack Start](https://tanstack.com/start) — SSR framework (Vite plugin)
- [TanStack Router](https://tanstack.com/router) — file-based routing
- [React 19](https://react.dev) — UI
- [Tailwind CSS v4](https://tailwindcss.com) — styling
- [Cloudflare Workers](https://workers.cloudflare.com) — hosting & SSR runtime
