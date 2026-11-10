# Audit Fixes Batch 3 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Risolvere i restanti finding dell'audit: rinomina immagini WhatsApp residue, conversione SVG placeholder pesanti in PNG raster, ottimizzazione hero image LCP.

**Architecture:** Task indipendenti su file/directory separati. Ogni task produce un deliverable testabile autonomamente. Build must pass dopo ogni task.

**Tech Stack:** React, TanStack Start, GSAP, Cloudflare Pages, Bun, Python/Pillow (per generazione immagini)

## Global Constraints

- Le animazioni sono SACRE (AGENTS.md): non rimuovere, non ristrutturare GSAP/Lenis/ScrollTrigger/CSS transitions.
- Single source of truth: dati business solo in `src/data/masseria.ts`.
- Runtime: Cloudflare Workers (no Node-only API nel server code).
- Package manager: bun.
- Commits: conventional format con `Co-Authored-By: Claude Code <noreply@anthropic.com>`.
- Build must pass: `bun run build` dopo ogni task.

---

### Task 1: Rinomina immagini WhatsApp agriturismo → slug descrittivi

**Files:**
- Rename: 30 file in `public/images/agriturismo/`
- Modify: componenti che referenziano queste immagini (grep per nomi vecchi)

- [ ] **Step 1:** Grep per ogni filename WhatsApp agriturismo in `src/` per mappare uso
- [ ] **Step 2:** Definire naming `{soggetto}-{numero}.jpeg` (es. `tavola-apparecchiata-01.jpeg`)
- [ ] **Step 3:** Rinominare con `mv`
- [ ] **Step 4:** Aggiornare riferimenti nei componenti
- [ ] **Step 5:** `bun run build` → PASS
- [ ] **Step 6:** Commit `refactor(assets): rename agriturismo WhatsApp images to descriptive slugs`

---

### Task 2: Rinomina immagini WhatsApp macelleria → slug descrittivi

**Files:**
- Rename: 8 file in `public/images/macelleria/`
- Modify: componenti che referenziano queste immagini

- [ ] **Step 1-6:** Stesso approccio Task 1, naming `macelleria-{soggetto}-{numero}.jpeg`
- [ ] Commit: `refactor(assets): rename macelleria WhatsApp images to descriptive slugs`

---

### Task 3: Rinomina 2 immagini WhatsApp residue in masseria/

**Files:**
- Rename: 2 file in `public/images/masseria/` (varianti 09.34.46)
- Verify: non referenziati in src/ (confermato da audit precedente)

- [ ] **Step 1:** Verificare con grep che non siano referenziati
- [ ] **Step 2:** Rinominare con slug descrittivi
- [ ] **Step 3:** `bun run build` → PASS
- [ ] **Step 4:** Commit `refactor(assets): rename residual masseria WhatsApp images`

---

### Task 4: Convertire SVG placeholder pesanti in PNG raster

**Files:**
- Convert: `storia-famiglia.svg` (429KB), `storia-lavoro.svg` (291KB), `storia-pietra.svg` (201KB), `macelleria-brace-ai.svg` (211KB), `allevamento-pascolo-ai.svg` (218KB), `agriturismo-tavola-ai.svg` (169KB), `caseificio-mozzarelle-ai.svg` (54KB)
- Keep as SVG: `logo-completo.svg` (201KB), `logo-emblema.svg` (171KB), `agriturismo-focaccia.svg` (62KB) — questi sono loghi/icone vettoriali legittimi
- Modify: componenti che referenziano gli SVG convertiti

- [ ] **Step 1:** Identificare quali componenti referenziano ciascun SVG pesante
- [ ] **Step 2:** Convertire ogni SVG in PNG usando Python/Pillow o librsvg: `rsvg-convert -w 1200 -h auto input.svg -o output.png` oppure Pillow + cairosvg
- [ ] **Step 3:** Sostituire riferimenti `.svg` → `.png` nei componenti
- [ ] **Step 4:** Rimuovere file SVG originali convertiti
- [ ] **Step 5:** `bun run build` → PASS
- [ ] **Step 6:** Commit `perf(assets): convert heavy SVG placeholders to raster PNG`

---

### Task 5: Ottimizzare hero image LCP (masseria-aerial.jpg)

**Files:**
- Optimize: `public/images/masseria-aerial.jpg` (530KB)
- Create: varianti WebP responsive (800w, 1200w, 1920w)
- Modify: `src/components/home/Hero.tsx` per usare `<picture>` con srcset

- [ ] **Step 1:** Generare varianti WebP con sharp/pillow: 800w (~80KB), 1200w (~150KB), 1920w (~250KB)
- [ ] **Step 2:** Aggiornare Hero.tsx per usare `<picture>` con `<source type="image/webp" srcset="...">` e fallback JPG
- [ ] **Step 3:** Mantenere `fetchPriority="high"` e `decoding="async"`
- [ ] **Step 4:** `bun run build` → PASS
- [ ] **Step 5:** Commit `perf(images): optimize hero LCP with WebP srcset and picture element`

---

## Out of Scope (deferred)

- CSS monolitico → moduli separati (refactoring ampio)
- Scomposizione componenti >400 righe (refactoring strutturale)
- Test automatizzati (setup infrastruttura)
- Conversione JPEG gallery → WebP (pipeline asset separata)