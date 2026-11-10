# Structural Improvements — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migliorare la struttura del codice (CSS tokens, modularità, hook deps) senza alterare il funzionamento o l'estetica del sito.

**Architecture:** 4 task indipendenti e sequenziali. Nessuna modifica visiva o comportamentale. Ogni task richiede build verde prima del commit. Le animazioni GSAP/Lenis/ScrollTrigger sono SACRE e non vanno toccate.

**Tech Stack:** Tailwind CSS v4, React, TanStack Router, Bun, Cloudflare Pages

**Spec:** Audit strutturale Impeccable/Motion/UI-UX del 2026-11-10

## Global Constraints

- Le animazioni sono SACRE (AGENTS.md): non modificare GSAP/Lenis/ScrollTrigger/CSS transitions.
- Zero regressione visiva o comportamentale: solo refactoring interno.
- Build must pass: `bun run build` dopo ogni task.
- Commits: conventional format con `Co-Authored-By: Claude Code <noreply@anthropic.com>`.
- Package manager: bun.

## Review Focus

1. **Token rimossi non usati**: verificare che `--radius-sm/md/lg/xl` non siano referenziati da nessun componente prima della rimozione.
2. **Split anime.css preserves cascade**: l'ordine di import dei sotto-moduli deve preservare la cascata CSS originale.
3. **useHomeHashScroll deps**: rimuovere `router` dal dependency array senza introdurre stale closure su `location`.
4. **Build output identico**: il CSS compilato post-refactor deve essere funzionalmente identico al pre-refactor.

---

### Task 1: Rimuovere radius tokens inutilizzati da tokens.css

**Files:**
- Modify: `src/styles/tokens.css:2-5`

**Interfaces:**
- Consumes: nulla
- Produces: tokens.css pulito, senza variabili morte

- [ ] **Step 1: Verificare assenza di riferimenti a --radius-sm/md/lg/xl**

Run: `grep -rn "radius-sm\|radius-md\|radius-lg\|radius-xl" src/ --include="*.tsx" --include="*.ts" --include="*.css" | grep -v tokens.css`
Expected: zero risultati

- [ ] **Step 2: Rimuovere le 4 righe --radius-sm/md/lg/xl da tokens.css**

Rimuovere linee 2-5 (`--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`). Mantenere `--radius: 0.5rem` nel blocco `:root` (linea 62).

- [ ] **Step 3: `bun run build` → PASS**
- [ ] **Step 4: Commit**

```bash
git add src/styles/tokens.css
git commit -m "refactor(css): remove unused radius scale tokens from tokens.css"
```

---

### Task 2: Split anime.css in sotto-moduli per anima

**Files:**
- Create: `src/styles/anime/shared.css` (linee 1-58: R3F heroes + shared overlay)
- Create: `src/styles/anime/allevamento.css` (linee 59-161 + 323-358: counter/momenti + v2 pinned)
- Create: `src/styles/anime/caseificio.css` (linee 162-235 + 359-424: timeline + v2)
- Create: `src/styles/anime/macelleria.css` (linee 236-322 + 425-495: cards + v2 stations)
- Create: `src/styles/anime/agriturismo.css` (linee 496-756: v2 cinema/carta/prenota/tavola/gallerie)
- Modify: `src/styles/anime.css` → diventa entry point con soli @import
- Modify: `src/styles.css` → aggiorna import path se necessario

**Interfaces:**
- Consumes: variabili CSS da tokens.css
- Produces: stessi selettori CSS, stessa cascata, stessa specificità

- [ ] **Step 1: Creare directory `src/styles/anime/`**
- [ ] **Step 2: Estrarre blocco shared (linee 1-58) in `src/styles/anime/shared.css`**

Include: `.journey-chapter-hero`, `.hero-canvas-frame`, `.hero-overlay` e varianti.

- [ ] **Step 3: Estrarre blocco allevamento (linee 59-161 + 323-358) in `src/styles/anime/allevamento.css`**

Include: `.allevamento-counter-*`, `.allevamento-moment-*`, `.allevamento-v2-*` (pinned stack, hero 3D).

- [ ] **Step 4: Estrarre blocco caseificio (linee 162-235 + 359-424) in `src/styles/anime/caseificio.css`**

Include: `.caseificio-timeline-*`, `.caseificio-node-*`, `.caseificio-v2-*`.

- [ ] **Step 5: Estrarre blocco macelleria (linee 236-322 + 425-495) in `src/styles/anime/macelleria.css`**

Include: `.macelleria-card-*`, `.macelleria-station-*`, `.macelleria-v2-*`.

- [ ] **Step 6: Estrarre blocco agriturismo (linee 496-756) in `src/styles/anime/agriturismo.css`**

Include: `.agri-*`, `.pinned-*`, gallerie agriturismo/macelleria/allevamento, journey-photo shared.

- [ ] **Step 7: Trasformare `src/styles/anime.css` in entry point con @import**

```css
@import "./anime/shared.css";
@import "./anime/allevamento.css";
@import "./anime/caseificio.css";
@import "./anime/macelleria.css";
@import "./anime/agriturismo.css";
```

- [ ] **Step 8: `bun run build` → PASS**
- [ ] **Step 9: Commit**

```bash
git add src/styles/anime.css src/styles/anime/
git commit -m "refactor(css): split anime.css into per-anima sub-modules"
```

---

### Task 3: Fix useHomeHashScroll dependency array

**Files:**
- Modify: `src/lib/nav.ts:126`

**Interfaces:**
- Consumes: `location.pathname`, `location.hash` da TanStack Router
- Produces: stesso comportamento di scroll-to-hash, senza re-run spurie

- [ ] **Step 1: Rimuovere `router` dal dependency array di useHomeHashScroll**

Cambiare linea 126 da:
```ts
}, [location.pathname, location.hash, router]);
```
a:
```ts
}, [location.pathname, location.hash]);
```

`router` è usato solo per type-safety ma non viene letto dentro l'effect; `location` è già reattivo ai cambi di route.

- [ ] **Step 2: Verificare che TypeScript non segnali errori**

Run: `npx tsc --noEmit`
Expected: zero errori

- [ ] **Step 3: `bun run build` → PASS**
- [ ] **Step 4: Commit**

```bash
git add src/lib/nav.ts
git commit -m "fix(nav): remove unnecessary router dep from useHomeHashScroll"
```

---

### Task 4: Verifica finale e pulizia

**Files:**
- Verify: tutti i moduli CSS, build output, git status

- [ ] **Step 1: Verificare che styles.css import chain sia corretta**

Run: `cat src/styles.css`
Expected: 8 righe di soli @import nell'ordine tokens → base → journey → heroes → anime

- [ ] **Step 2: Verificare conteggio righe totale**

Run: `wc -l src/styles.css src/styles/tokens.css src/styles/base.css src/styles/journey.css src/styles/heroes.css src/styles/anime.css src/styles/anime/*.css`
Expected: totale ≈ 1429 righe (stesso pre-split)

- [ ] **Step 3: `bun run build` → PASS**
- [ ] **Step 4: Commit finale (se ci sono modifiche residue)**

```bash
git add -A
git commit -m "chore: final cleanup after structural improvements"
```

---

## Out of Scope (deferred)

- Lazy loading sezioni home (rischio hydration SSR, bundle size non critico)
- Token di spacing sistematici (sforzo alto, refactor massivo componenti)
- Link a /braceria (redirect 301 intenzionale verso /agriturismo)
- Modifiche estetiche o di contenuto (solo refactoring interno)