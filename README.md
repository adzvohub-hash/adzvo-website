# ADZVO Business Showcase

Built with TanStack Start, React, TypeScript, and Tailwind CSS. Deployed on Cloudflare Pages.

## Development

Requires Node.js 20+. Install with [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) if needed.

```sh
npm install
npm run dev
```

## Build & Deploy

```sh
# Build for Cloudflare Pages
npm run build
# → .output/public/  (static assets, CDN-served)
# → .output/server/  (SSR worker, runs on Cloudflare Pages Functions)

# Deploy via Wrangler CLI
npx wrangler pages deploy .output/public

# Or connect your GitHub repo in the Cloudflare Pages dashboard:
#   Build command:  npm run build
#   Output dir:     .output/public
#   Node version:   20
```

## Stack

- [TanStack Start](https://tanstack.com/start) — SSR framework
- [TanStack Router](https://tanstack.com/router) — file-based routing
- [React 19](https://react.dev) — UI
- [Tailwind CSS v4](https://tailwindcss.com) — styling
- [Nitro](https://nitro.unjs.io) — server engine (cloudflare-pages preset)
