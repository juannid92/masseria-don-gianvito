# Agent Guidelines — Masseria Don Gianvito

## Deployment Target

This project deploys to **Cloudflare Pages** via GitHub integration. Pushes to `main` trigger automatic builds and deployments. Manual deploy: `bun run deploy`.

## Key Constraints

- **Animations are sacred**: Do not modify, remove, or restructure any GSAP, Lenis, ScrollTrigger, Framer Motion code, CSS transitions/animations, or scroll-driven effects. The motion system is approved as-is.
- **Runtime**: Cloudflare Workers (no Node-only APIs in server code).
- **Package manager**: bun (lockfile: `bun.lock`).
- **SSR entry**: `src/server.ts` contains a custom error wrapper — do not replace or restructure it.
- **Data source**: All business data (contacts, hours, coordinates, anime structure) lives in `src/data/masseria.ts`. Never hardcode these values elsewhere.
- **Commits**: Conventional format (`feat:`, `fix:`, `chore:`, `refactor:`).

## Project Structure

- `src/routes/` — TanStack Start file-based routing
- `src/components/home/` — Home page sections (7 acts)
- `src/components/journey/` — Immersive chapter pages (4 anime)
- `src/styles.css` — Design tokens, utility classes, component styles (monolithic)
- `src/data/` — Single source of truth for all business data
- `src/config/site.ts` — SEO, OG metadata, site URL

## Photo Assets

The aerial hero photo is confirmed and must remain. Other photos are provided by the client. Caseificio photos are pending. See `FOTO-DA-PRODURRE.md` for the full shot list.