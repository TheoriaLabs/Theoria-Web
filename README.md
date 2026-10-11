# Theoria Web

The Theoria Labs landing page: Next.js App Router, TypeScript, a green Theta identity, and an original periodic ASCII shear animation.

## Development

Use Node.js 22.19+ and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Page copy is in `app/page.tsx`, design tokens in `app/globals.css`, product configuration in `lib/site-config.ts`, and the animation in `components/hero-animation.tsx`.

```sh
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

## Deployment

Import `yourball/Theoria-Web` into Vercel using its Next.js preset. Use `main` for production and enable GitHub preview deployments. No backend, database, or Blob store is required.

Set `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS origin when attaching a custom domain. On Vercel, the production deployment domain is used automatically when this is unset. Local development falls back to localhost.

Vercel serves files under `public/` directly. See `public/install/README.md` for the installer publishing workflow. Neither CLI nor IDE currently has a configured public release. The CLI panel shows its future command with copying disabled. The IDE tab and call-to-action are locked and labeled Coming soon until a release is ready.

The site repository is initially private. The footer links to its GitHub source; access depends on repository permissions.

## Animation

Theta is drawn on a discrete character grid. Each row is horizontally sheared as `x' = (x + s*y) mod L`. Advancing `s` from zero to the grid width `L` restores every point because row coordinates are integers. The 18-second cycle holds the original for three seconds at each end and transforms for twelve seconds. It supports pause, reduced motion, resizing, and offscreen/background suspension. `tests/shear.test.ts` checks restoration, wraparound, row bijection, and periodic timing.

The IDE research graph and terminal are explicitly labeled illustrative/conceptual. Typography uses Google Fonts with local system fallbacks.
