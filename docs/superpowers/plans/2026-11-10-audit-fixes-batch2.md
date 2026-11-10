# Audit Fixes Batch 2 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Risolvere i restanti finding dell'audit consolidato: sr-only link esterni, JSON-LD multi-type, sitemap dinamica, rinomina asset immagini, migrazione Framer Motion → GSAP.

**Architecture:** Task indipendenti su file separati (tranne Task 4-5 che toccano gli stessi 4 componenti Home). Ogni task produce un deliverable testabile autonomamente. Il build deve passare dopo ogni task.

**Tech Stack:** React, TanStack Start, GSAP, Cloudflare Pages, Vite, Bun

**Spec:** Audit report consolidato sessione 2026-11-10 (finding #29, #12, #6, #10, #21)

## Global Constraints

- Le animazioni sono SACRE (AGENTS.md): non rimuovere, non ristrutturare GSAP/Lenis/ScrollTrigger/CSS transitions. Migrare Framer Motion → GSAP mantenendo identico comportamento visivo.
- Single source of truth: dati business solo in `src/data/masseria.ts`.
- Runtime: Cloudflare Workers (no Node-only API nel server code).
- Package manager: bun.
- Commits: conventional format (`feat:`, `fix:`, `chore:`, `refactor:`).
- Build must pass: `bun run build` dopo ogni task.

## Review Focus

1. **Framer Motion → GSAP**: le animazioni migrate devono essere visivamente identiche; nessun jank o comportamento diverso.
2. **Sitemap dinamica**: tutte le route esistenti devono essere presenti con lastmod valido; nessuna route persa.
3. **Rinomina immagini**: tutti i riferimenti nei componenti devono essere aggiornati; zero 404 sulle immagini.
4. **JSON-LD multi-type**: validazione Schema.org corretta; nessun campo richiesto mancante per i tipi aggiunti.
5. **Sr-only link esterni**: testo accessibile presente ma invisibile; nessun impatto sul layout visivo.

---

### Task 1: Sr-only text per link esterni target="_blank"

**Files:**
- Modify: `src/components/site/Footer.tsx:96-150`
- Modify: `src/components/home/Prenota.tsx` (link Maps/WhatsApp se presenti con target="_blank")

**Interfaces:**
- Consumes: nessuno
- Produces: pattern `<span className="sr-only">(si apre in una nuova scheda)</span>` riutilizzabile

- [ ] **Step 1: Identificare tutti i link con `target="_blank"` in Footer.tsx e Prenota.tsx**

Cercare `target="_blank"` nei due file. I link noti sono: Maps, WhatsApp, Instagram, Facebook (Footer), e eventuali in Prenota.

- [ ] **Step 2: Aggiungere sr-only span a ogni link target="_blank"**

Per ogni `<a target="_blank">`, aggiungere immediatamente prima della chiusura del tag:
```tsx
<span className="sr-only">(si apre in una nuova scheda)</span>
```

- [ ] **Step 3: Verificare build**

Run: `bun run build`
Expected: PASS, zero errori

- [ ] **Step 4: Commit**

```bash
git add src/components/site/Footer.tsx src/components/home/Prenota.tsx
git commit -m "fix(a11y): add sr-only hint for external links opening in new tab"
```

---

### Task 2: JSON-LD multi-type (Farm, Restaurant, Butcher)

**Files:**
- Modify: `src/routes/__root.tsx:140-165`

**Interfaces:**
- Consumes: `MASSERIA` da `src/data/masseria.ts`, `SITE_CONFIG` da `src/config/site.ts`
- Produces: JSON-LD con `@type` array

- [ ] **Step 1: Cambiare @type da stringa ad array**

In `__root.tsx` riga 142, cambiare:
```typescript
"@type": "Restaurant",
```
in:
```typescript
"@type": ["Farm", "Restaurant", "Butcher"],
```

- [ ] **Step 2: Aggiungere proprietà specifiche per Farm e Butcher**

Dopo `priceRange: "$$"`, aggiungere campi opzionali utili per i tipi aggiunti:
```typescript
additionalType: ["Farm", "Butcher"],
```
Non aggiungere campi obbligatori che non abbiamo nei dati (es. `hasOfferCatalog`). Mantenere minimale.

- [ ] **Step 3: Verificare build**

Run: `bun run build`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/routes/__root.tsx
git commit -m "fix(seo): use multi-type JSON-LD for Farm, Restaurant, Butcher"
```

---

### Task 3: Sitemap dinamica con lastmod nel build

**Files:**
- Create: `scripts/generate-sitemap.ts`
- Modify: `package.json` (aggiungere script `generate:sitemap`)
- Delete: `public/sitemap.xml` (sarà generato dal build)

**Interfaces:**
- Consumes: lista route hardcoded (/, /allevamento, /caseificio, /macelleria, /agriturismo, /prodotti, /legali/privacy, /legali/cookie), `SITE_CONFIG.url`
- Produces: `dist/client/sitemap.xml` con `<lastmod>` dalla data dell'ultimo commit git

- [ ] **Step 1: Creare scripts/generate-sitemap.ts**

Script che:
1. Legge `SITE_CONFIG.url` da `src/config/site.ts` (o hardcode `https://masseriadongianvito.it`)
2. Esegue `git log -1 --format=%cI` per ottenere la data ISO dell'ultimo commit
3. Genera XML sitemap con tutte le route note, ciascuna con `<lastmod>` = data commit
4. Scrive il file in `dist/client/sitemap.xml` (dopo il build Vite) o in `public/sitemap.xml` (prima del build)

Approccio semplice: generare in `public/sitemap.xml` come prebuild step.

```typescript
// scripts/generate-sitemap.ts
import { execSync } from "child_process";
import { writeFileSync } from "fs";

const BASE_URL = "https://masseriadongianvito.it";
const ROUTES = [
  { path: "/", priority: "1.0", changefreq: "monthly" },
  { path: "/agriturismo", priority: "0.9", changefreq: "monthly" },
  { path: "/allevamento", priority: "0.8", changefreq: "monthly" },
  { path: "/caseificio", priority: "0.8", changefreq: "monthly" },
  { path: "/macelleria", priority: "0.8", changefreq: "monthly" },
  { path: "/prodotti", priority: "0.8", changefreq: "monthly" },
  { path: "/legali/privacy", priority: "0.3", changefreq: "yearly" },
  { path: "/legali/cookie", priority: "0.3", changefreq: "yearly" },
];

const lastmod = execSync("git log -1 --format=%cI").toString().trim().split("T")[0];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map(r => `  <url>
    <loc>${BASE_URL}${r.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

writeFileSync("public/sitemap.xml", xml);
console.log(`✅ Sitemap generated with lastmod=${lastmod}`);
```

- [ ] **Step 2: Aggiungere script prebuild in package.json**

Aggiungere `"generate:sitemap": "bun run scripts/generate-sitemap.ts"` e modificare il build script in `"build": "bun run generate:sitemap && bun run vite:build"` (o equivalente). Verificare il nome esatto dello script build corrente in package.json.

- [ ] **Step 3: Eseguire lo script e verificare output**

Run: `bun run generate:sitemap`
Expected: `public/sitemap.xml` generato con `<lastmod>` valido

- [ ] **Step 4: Verificare build completo**

Run: `bun run build`
Expected: PASS, sitemap inclusa nel build output

- [ ] **Step 5: Commit**

```bash
git add scripts/generate-sitemap.ts package.json public/sitemap.xml
git commit -m "feat(seo): generate dynamic sitemap with lastmod from git"
```

---

### Task 4: Rinomina asset immagini WhatsApp → slug descrittivi

**Files:**
- Rename: tutti i file in `public/images/masseria/` (20+ file)
- Modify: tutti i componenti che referenziano queste immagini (grep per i nomi vecchi)

**Interfaces:**
- Consumes: mapping vecchio nome → nuovo nome
- Produces: file rinominati + import aggiornati

- [ ] **Step 1: Mappare ogni immagine al suo contesto d'uso**

Grep per ogni filename WhatsApp in `src/` per capire quale componente la usa e a cosa si riferisce (allevamento, caseificio, macelleria, agriturismo, storia, ecc.). Costruire una tabella di mapping.

- [ ] **Step 2: Definire naming convention kebab-case**

Pattern: `{sezione}-{soggetto}-{numero}.jpeg`
Esempi: `allevamento-bovini-pascolo-01.jpeg`, `caseificio-interno-lavorazione-01.jpeg`, `agriturismo-tavola-apparecchiata-01.jpeg`

- [ ] **Step 3: Rinominare i file con mv**

Usare `mv` per ogni file, seguendo il mapping definito.

- [ ] **Step 4: Aggiornare tutti i riferimenti nei componenti**

Grep per i nomi vecchi e sostituire con i nuovi in ogni file sorgente.

- [ ] **Step 5: Verificare build**

Run: `bun run build`
Expected: PASS, zero reference a file inesistenti

- [ ] **Step 6: Commit**

```bash
git add public/images/masseria/ src/
git commit -m "refactor(assets): rename WhatsApp images to descriptive kebab-case slugs"
```

---

### Task 5: Migrazione Framer Motion → GSAP nei 4 componenti Home

**Files:**
- Modify: `src/components/home/IlManifesto.tsx`
- Modify: `src/components/home/IlLuogo.tsx`
- Modify: `src/components/home/LaFiliera.tsx`
- Modify: `src/components/home/LaStoria.tsx`

**Interfaces:**
- Consumes: `motion` component da framer-motion (da rimuovere), GSAP già presente negli stessi file
- Produces: stesse animazioni usando solo GSAP/ScrollTrigger/CSS transitions

- [ ] **Step 1: Analizzare l'uso di motion in ciascun componente**

Per ogni file, identificare quali elementi usano `<motion.div>`, `<motion.p>`, ecc. e quali props di animazione sono usate (initial, animate, whileInView, transition, variants).

- [ ] **Step 2: Mappare ogni animazione Framer Motion al equivalente GSAP**

Pattern comuni:
- `whileInView={{ opacity: 1, y: 0 }}` → `gsap.from(element, { opacity: 0, y: 30, scrollTrigger: { trigger: element, start: "top 85%" } })`
- `initial={{ opacity: 0 }}` + `animate={{ opacity: 1 }}` → `gsap.from(element, { opacity: 0 })` dentro useEffect o gsap.context()
- `transition={{ duration: 0.8 }}` → `{ duration: 0.8 }` nel tween GSAP

- [ ] **Step 3: Migrare IlManifesto.tsx**

Rimuovere import framer-motion. Sostituire ogni `<motion.X>` con elemento HTML normale. Aggiungere tween GSAP equivalenti nel useEffect esistente o crearne uno nuovo con gsap.context(). Mantenere le animazioni GSAP esistenti intatte.

- [ ] **Step 4: Migrare IlLuogo.tsx**

Stesso approccio. Attenzione: questo componente ha 541 righe, procedere con cautela.

- [ ] **Step 5: Migrare LaFiliera.tsx**

Stesso approccio. Questo componente ha già animazioni GSAP complesse (clip-path filo). Integrare le ex-Framer Motion nello stesso context.

- [ ] **Step 6: Migrare LaStoria.tsx**

Stesso approccio. Ha quickSetter e cache offset GSAP esistenti.

- [ ] **Step 7: Rimuovere framer-motion da package.json se non più usato altrove**

Verificare: `grep -r "framer-motion" src/` — se zero risultati, `bun remove framer-motion`.

- [ ] **Step 8: Verificare build**

Run: `bun run build`
Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add src/components/home/ package.json bun.lock
git commit -m "refactor(motion): migrate home components from Framer Motion to GSAP"
```

---

## Out of Scope (deferred)

- CSS monolitico → moduli separati (refactoring ampio, rischio regressione alto, nessun bug funzionale)
- Componenti Home >400 righe → scomposizione (refactoring strutturale, richiede design review)
- Test automatizzati (richiede setup infrastruttura testing, progetto separato)
- Conversione immagini JPEG → WebP/AVIF (richiede pipeline asset, non è un fix codice)