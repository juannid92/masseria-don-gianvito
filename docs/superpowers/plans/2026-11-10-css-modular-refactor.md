# CSS Modular Refactor — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scomporre `src/styles.css` (1461 righe) in moduli CSS separati usando `@import` di Tailwind v4, eliminando duplicati e migliorando la manutenibilità senza alterare alcun comportamento visivo o animazione.

**Architecture:** Il file monolitico viene suddiviso in 7 moduli tematici importati da `styles.css`. Ogni modulo è auto-contenuto per responsabilità. Le animazioni GSAP/Lenis/ScrollTrigger sono SACRE e non vanno toccate. La regola duplicata `.fullscreen-hero-title h1` (linee 429 e 601) viene consolidata. Il grain SVG feTurbulence nell'agriturismo (linea 1294) viene sostituito con noise PNG base64 coerente con quanto già fatto nel batch 3.

**Tech Stack:** Tailwind CSS v4 (`@import`), CSS custom properties, Bun, Cloudflare Pages

**Spec:** Audit report consolidato + AGENTS.md (animazioni sacre)

## Global Constraints

- Le animazioni sono SACRE (AGENTS.md): non rimuovere, non ristrutturare GSAP/Lenis/ScrollTrigger/CSS transitions/animations.
- Single source of truth: dati business solo in `src/data/masseria.ts`.
- Runtime: Cloudflare Workers (no Node-only API).
- Package manager: bun.
- Commits: conventional format con `Co-Authored-By: Claude Code <noreply@anthropic.com>`.
- Build must pass: `bun run build` dopo ogni task.
- Zero regressione visiva: il sito deve apparire identico prima e dopo il refactor.

## Review Focus

1. **Ordine di import**: i moduli devono essere importati nell'ordine corretto per preservare la cascata CSS (tokens → base → utilities → componenti → pagine).
2. **Duplicati rimossi**: la regola `.fullscreen-hero-title h1` appare due volte (linee 429 e 601); va consolidata in una sola occorrenza nel modulo heroes.
3. **Animazioni intatte**: nessun selettore GSAP/ScrollTrigger/Lenis/CSS transition deve essere modificato o rimosso.
4. **Grain SVG → PNG**: il feTurbulence SVG inline (linea 1294) deve essere sostituito con noise PNG base64.
5. **Build output**: il CSS compilato deve essere funzionalmente identico al pre-refactor (stesse regole, stesso ordine di specificità).

---

### Task 1: Creare `src/styles/tokens.css` — Design tokens e variabili CSS

**Files:**
- Create: `src/styles/tokens.css`
- Source: `src/styles.css:1-127` (@theme inline block + :root variables)

**Interfaces:**
- Consumes: nulla (primo modulo caricato)
- Produces: tutte le custom properties (--bianco-calce, --oro-antico, --carminio, --biscotto, --carbone, shadcn aliases, font definitions) usate da tutti gli altri moduli

- [ ] **Step 1: Creare directory `src/styles/`**
- [ ] **Step 2: Estrarre linee 1-127 in `src/styles/tokens.css`**

Contenuto: `@import "tailwindcss"`, blocco `@theme inline`, blocco `:root` con tutte le variabili CSS (palette, shadcn semantic, font). Nota: `@import "tailwindcss"` deve restare nel file principale O nel primo modulo importato. Verificare che Tailwind v4 supporti `@import` dentro un file importato; se no, tenere `@import "tailwindcss"` in `styles.css` e mettere solo `@theme inline` + `:root` in `tokens.css`.

- [ ] **Step 3: Verificare che `@theme inline` funzioni correttamente nel modulo importato**

Run: `bun run build`
Expected: PASS, zero errori Tailwind

- [ ] **Step 4: Commit**

```bash
git add src/styles/tokens.css
git commit -m "refactor(css): extract design tokens to styles/tokens.css"
```

---

### Task 2: Creare `src/styles/base.css` — Reset, base layer, reduced motion, utility classes

**Files:**
- Create: `src/styles/base.css`
- Source: `src/styles.css:128-295` (@layer base, utility tipografiche, continuità sezioni, reduced motion, tap targets, landscape)

**Interfaces:**
- Consumes: variabili CSS da tokens.css
- Produces: reset globali, stili base html/body/img/svg, ::selection, :focus-visible, heading hyphens, @utility font-display/font-eyebrow/hairline-oro/pattern-pietra, section spacing, reduced motion overrides, min-height tap targets, landscape hero title

- [ ] **Step 1: Estrarre linee 128-295 in `src/styles/base.css`**

Include: `@media (min-width: 768px)` per header-offset, `@layer base` completo, `@utility` blocks, section adjacency rules, `section[id]` scroll-margin, `@media (prefers-reduced-motion: reduce)`, reduced motion data-reveal override, mobile tap targets, landscape short viewport.

- [ ] **Step 2: Aggiungere `@import "./styles/base.css"` a `src/styles.css` dopo tokens**
- [ ] **Step 3: Rimuovere le regole estratte da `src/styles.css`**
- [ ] **Step 4: `bun run build` → PASS**
- [ ] **Step 5: Commit**

```bash
git add src/styles/base.css src/styles.css
git commit -m "refactor(css): extract base layer and utilities to styles/base.css"
```

---

### Task 3: Creare `src/styles/journey.css` — Stili shared journey pages

**Files:**
- Create: `src/styles/journey.css`
- Source: `src/styles.css:297-421` (journey-shell, kicker, buttons, map-hero, pins, story, moments, photo-slot, next, chapter-nav, menu, tabs, route-progress, lenis, cinema, image-unavailable + responsive breakpoints journey)

**Interfaces:**
- Consumes: variabili CSS da tokens.css, font definitions
- Produces: tutti i selettori `.journey-*` condivisi tra le 4 anime

- [ ] **Step 1: Estrarre linee 297-421 in `src/styles/journey.css`**

Include anche i breakpoint responsive journey (linee 387-395, 406-407, 416, 420) e le regole `.journey-cinema-*`, `.journey-image-unavailable`.

- [ ] **Step 2: Aggiungere `@import "./styles/journey.css"` a `src/styles.css`**
- [ ] **Step 3: Rimuovere le regole estratte da `src/styles.css`**
- [ ] **Step 4: `bun run build` → PASS**
- [ ] **Step 5: Commit**

```bash
git add src/styles/journey.css src/styles.css
git commit -m "refactor(css): extract shared journey styles to styles/journey.css"
```

---

### Task 4: Creare `src/styles/heroes.css` — Fullscreen hero + R3F heroes + micro-interazioni + navigazione

**Files:**
- Create: `src/styles/heroes.css`
- Source: `src/styles.css:422-703` (fullscreen-hero, micro-interazioni, tipografia hero, nav items, hamburger menu, utilities cursor/text, reduced motion hero)

**Interfaces:**
- Consumes: variabili CSS da tokens.css
- Produces: `.fullscreen-hero*`, `.link-hover`, `.btn-primary`, `.btn-outline`, `.card-hover`, `.scroll-indicator`, `.reveal-up`, `.img-reveal`, `.text-heading-xl`, `.nav-item`, `.menu-icon`, `.cursor-grab`, `.text-balance`, `.text-pretty`

- [ ] **Step 1: Estrarre linee 422-703 in `src/styles/heroes.css`**

Consolidare la regola duplicata `.fullscreen-hero-title h1`: mantenere SOLO la versione della linea 429 (quella originale nel contesto fullscreen-hero) e RIMUOVERE la copia alla linea 601-605. La versione alla linea 429 ha `font-size:clamp(60px,6.3vw,104px)` ed è corretta nel contesto; la linea 601 sovrascrive con `clamp(58px,7.2vw,110px)` creando conflitto. Mantenere la linea 429 come canonical.

Includere anche il breakpoint responsive hero (linee 442-460, 703).

- [ ] **Step 2: Aggiungere `@import "./styles/heroes.css"` a `src/styles.css`**
- [ ] **Step 3: Rimuovere le regole estratte da `src/styles.css`**
- [ ] **Step 4: `bun run build` → PASS**
- [ ] **Step 5: Commit**

```bash
git add src/styles/heroes.css src/styles.css
git commit -m "refactor(css): extract hero and micro-interaction styles to styles/heroes.css"
```

---

### Task 5: Creare `src/styles/anime.css` — Stili specifici per ogni anima (Allevamento, Caseificio, Macelleria, Agriturismo)

**Files:**
- Create: `src/styles/anime.css`
- Source: `src/styles.css:705-1461` (R3F heroes overlay, Allevamento counter/momenti/v2, Caseificio timeline/v2, Macelleria cards/stations/v2, Agriturismo cinema/carta/prenota/fine/tavola/gallerie, journey-photo shared, gallerie specifiche)

**Interfaces:**
- Consumes: variabili CSS da tokens.css, selettori journey da journey.css
- Produces: tutti i selettori specifici per anima (.allevamento-*, .caseificio-*, .macelleria-*, .agri-*, .pinned-*, .hero-canvas-*, .hero-overlay-*)

- [ ] **Step 1: Estrarre linee 705-1461 in `src/styles/anime.css`**

Include: R3F hero canvas/overlay (705-761), Allevamento counter+momenti (763-864), Caseificio timeline (866-938), Macelleria cards (940-1025), shared moment index/label (1027-1059), Allevamento v2 pinned stack (1062-1128), Caseificio v2 (1129-1199), Macelleria v2 stations (1200-1274), Agriturismo v2 cinema/carta/prenota/fine/tavola (1276-1416), journey-photo shared (1418-1427), gallerie agriturismo/macelleria/allevamento (1428-1461).

Sostituire il grain SVG feTurbulence inline (linea 1294, `.agri-scene-grain`) con noise PNG base64. Usare lo stesso pattern PNG noise già generato nel batch 3 (verificare se esiste un asset noise in public/images/ o generare un nuovo PNG noise 200x200 con Pillow e convertirlo in base64 inline).

- [ ] **Step 2: Aggiungere `@import "./styles/anime.css"` a `src/styles.css`**
- [ ] **Step 3: Rimuovere le regole estratte da `src/styles.css`**
- [ ] **Step 4: Generare noise PNG per agriturismo grain (se non esiste già)**
- [ ] **Step 5: `bun run build` → PASS**
- [ ] **Step 6: Commit**

```bash
git add src/styles/anime.css src/styles.css
git commit -m "refactor(css): extract anime-specific styles to styles/anime.css"
```

---

### Task 6: Pulizia finale e verifica `src/styles.css` come entry point

**Files:**
- Modify: `src/styles.css` (dovrebbe contenere solo @import statements)

**Interfaces:**
- Consumes: tutti i moduli creati
- Produces: entry point pulito con soli import

- [ ] **Step 1: Verificare che `src/styles.css` contenga solo gli @import nell'ordine corretto**

Ordine richiesto:
```css
@import "tailwindcss";
@import "./styles/tokens.css";
@import "./styles/base.css";
@import "./styles/journey.css";
@import "./styles/heroes.css";
@import "./styles/anime.css";
```

Se `@import "tailwindcss"` è stato spostato in tokens.css, rimuoverlo da qui. Se deve restare qui per compatibilità Tailwind v4, tenerlo come prima riga.

- [ ] **Step 2: Verificare che non ci siano regole CSS residue in `src/styles.css`**

Il file deve contenere SOLO dichiarazioni `@import`. Zero regole CSS orfane.

- [ ] **Step 3: `bun run build` → PASS**
- [ ] **Step 4: Verifica visiva rapida: confrontare screenshot pre/post refactor**

Non automatizzabile in questo contesto. Il reviewer verifica che il build produca lo stesso output CSS.

- [ ] **Step 5: Commit finale**

```bash
git add src/styles.css
git commit -m "refactor(css): clean up styles.css as module entry point"
```

---

## Out of Scope (deferred)

- Migrazione a CSS Modules / CSS-in-JS (cambio architettura, non richiesto)
- Estrazione di varianti tema dark/light (non presente nel progetto)
- Ottimizzazione further del CSS output (tree-shaking, purge)
- Component decomposition >400 righe (task separato)