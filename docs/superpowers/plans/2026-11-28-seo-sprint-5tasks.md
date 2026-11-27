# SEO Sprint — 5 Task Tecnici (2026-11-28)

**Goal:** Portare il sito da ~82/100 a ~90+/100 chiudendo 5 gap tecnici indipendenti.

**Architecture:** 5 task indipendenti eseguibili in parallelo da subagent, orchestrati dal controller. Nessuna dipendenza incrociata tra task.

**Tech Stack:** TypeScript, React, TanStack Start, Cloudflare Pages `_headers`, Schema.org JSON-LD

**Spec:** docs/seo/IMPLEMENTATION-ROADMAP.md (Phase 2-3)

## Global Constraints

- Animazioni intoccabili: non modificare GSAP, Lenis, ScrollTrigger, Framer Motion, CSS transitions/animations, scroll-driven effects.
- Runtime: Cloudflare Workers (no Node-only APIs).
- Dati aziendali: `src/data/masseria.ts` è single source of truth — mai hardcodare contatti/orari/coordinate.
- Commits: formato convenzionale, chiusura con `Co-Authored-By: Claude Fable 5.2 <noreply@anthropic.com>`.
- ASCII-only in file pubblici (robots.txt, _headers).
- Build: `bun run build`.

## Review Focus

1. Cache-Control su HTML deve essere `public, max-age=0, must-revalidate` — valore errato causa stale pages in produzione.
2. Schema Event su /eventi deve usare date ISO 8601 nel campo `startDate` — formati non standard vengono ignorati da Google.
3. BreadcrumbList JSON-LD deve avere `itemListElement` con `position` numerico crescente — errore comune è ometterlo.
4. Alt text su immagini market deve essere descrittivo (non solo nome prodotto) — requisito WCAG 2.1 AA.
5. Bundle size: market.js (39KB) e routes.js (146KB) sono i target primari per verifica tree-shaking.

---

### Task 1: Cache-Control Header HTML

**Files:** Modify `public/_headers`

- [ ] Aggiungere blocco `/*.html` e fallback per pagine HTML con `Cache-Control: public, max-age=0, must-revalidate`
- [ ] Verificare build
- [ ] Commit

### Task 2: Schema Event su /eventi

**Files:** Modify `src/routes/eventi.tsx`

- [ ] Leggere struttura attuale APPUNTAMENTI
- [ ] Aggiungere JSON-LD `Event` schema per ogni appuntamento con `name`, `startDate`, `location`, `offers`
- [ ] Verificare build
- [ ] Commit

### Task 3: BreadcrumbList JSON-LD su route mancanti

**Files:** Modify `src/routes/dove-siamo.tsx`, `src/routes/contatti.tsx`, `src/routes/faq.tsx`, `src/routes/recensioni.tsx`, `src/routes/chi-siamo.tsx`, `src/routes/prodotti.tsx`

- [ ] Verificare quali route hanno già BreadcrumbList schema
- [ ] Aggiungere BreadcrumbList JSON-LD dove mancante
- [ ] Verificare build
- [ ] Commit

### Task 4: Alt Text Audit Prodotti Market

**Files:** Modify `src/data/market.ts`, `src/routes/market.tsx`

- [ ] Leggere tutti i prodotti e varianti
- [ ] Aggiornare alt text per essere descrittivi (non solo nome prodotto)
- [ ] Verificare build
- [ ] Commit

### Task 5: Bundle Size + Hero Images Audit

**Files:** Read-only analysis

- [ ] Verificare dimensioni gzip di market.js e routes.js
- [ ] Verificare dimensioni WebP aerial hero
- [ ] Riportare findings nel report — no code changes unless optimization found
- [ ] Commit solo se ci sono fix applicabili