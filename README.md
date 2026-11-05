# Masseria Don Gianvito

Sito web della Masseria Don Gianvito — allevamento, caseificio, macelleria e agriturismo a Noci (BA).

## Tech Stack

- **React 19** + **TanStack Start** (SSR)
- **Vite 8** + **Tailwind CSS v4**
- **GSAP** + **Lenis** + **Framer Motion** (animazioni e scroll)
- **Cloudflare Pages** (deploy)
- **Bun** (package manager e runtime)

## Development

```sh
bun install
bun run dev
```

Il dev server parte con HMR e SSR. Le animazioni sono attive solo con `prefers-reduced-motion: no-preference`.

## Build & Deploy

```sh
bun run build      # produce dist/ con preset cloudflare-module
bun run deploy     # build + wrangler deploy su Cloudflare Pages
```

Push su `main` triggera il deploy automatico via GitHub integration su Cloudflare Pages.

## Struttura

- `src/routes/` — routing file-based TanStack Start
- `src/components/home/` — sezioni home (7 atti)
- `src/components/journey/` — pagine immersive (4 anime)
- `src/data/masseria.ts` — unica fonte di verità per dati aziendali
- `src/config/site.ts` — SEO, OG metadata, URL sito
- `src/styles.css` — design tokens e stili componenti

## Foto

La foto aerea hero è confermata. Le altre foto sono fornite dal cliente. Foto caseificio in attesa. Vedi `FOTO-DA-PRODURRE.md` per la lista completa degli scatti necessari.