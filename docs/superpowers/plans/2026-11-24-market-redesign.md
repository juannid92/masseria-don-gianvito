# Market Redesign & Route Rename Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename `/bottega` → `/market` across the entire codebase, completely redesign the Market page (fonts, colors, mobile photo cards), and rebuild the 3D shopping bag icon using threejs-geometry/animation/interaction skills.

**Architecture:** Three independent workstreams: (1) route rename with 301 redirect, (2) CSS + component redesign of Market page, (3) Three.js icon rebuild. Workstreams 1 and 2 are sequential (rename first, then redesign). Workstream 3 is independent but touches HeroPin3D.tsx which workstream 1 also modifies (the `buildBottega` → `buildMarket` rename), so it must run after task 1.

**Tech Stack:** TanStack Start (file-based routing), Three.js (dynamic import), CSS custom properties, Vite

**Spec:** User request in conversation — rename bottega→market everywhere including hero, redesign Market page aesthetics (font, colors, system, mobile photo cards), rebuild 3D objects using /threejs-geometry, /threejs-animation, /threejs-interaction skills.

## Global Constraints

- All existing animations (GSAP, Lenis, ScrollTrigger, Framer Motion) are SACRED — never modify them
- The project uses TanStack Start file-based routing: route path = file path under `src/routes/`
- Design tokens live in `src/styles/tokens.css`; new Market tokens must be added there, not hardcoded
- Three.js is dynamically imported via `loadThree()` in HeroPin3D.tsx — maintain this pattern
- The `BUILDERS` record in HeroPin3D.tsx maps `PinId` → builder function; key must match `pin-anime.ts` id
- `pin-anime.ts` defines `PinAnima.id` as `AnimaId | "bottega"` — rename to `"market"`
- All internal links to `/bottega` must update to `/market`; a Cloudflare redirect handles external/old links
- Product images use placeholder paths like `/images/bottega/carne-placeholder.jpg` — these are data values, not route references; keep as-is unless user provides new images
- Build must pass (`bun run build`) after every task
- No commits until each task's verification step passes

## Review Focus

1. **Old `/bottega` URLs still work** — users with bookmarked links or search engine indexed pages must land on `/market` via redirect, not 404
2. **Mobile product cards show photos** — the current list layout hides images on mobile; the redesign must include visible image containers at all breakpoints
3. **3D icon renders correctly after dynamic import** — the rebuilt shopping bag must produce a valid PNG data URL via the shared renderer without hydration mismatch
4. **Cart functionality survives redesign** — WhatsApp ordering, quantity controls, and cart drawer must work identically after CSS/component changes
5. **Pin label and tint color update in hero map** — the pin must say "Market" not "Bottega" and use the correct brand color

---

### Task 1: Rename route `/bottega` → `/market` and update all internal references

**Files:**
- Rename: `src/routes/bottega.tsx` → `src/routes/market.tsx`
- Modify: `src/data/pin-anime.ts:17,22,96-108`
- Modify: `src/components/home/HeroPin3D.tsx:300,310`
- Modify: `src/components/site/StickyContactBar.tsx:9`
- Modify: `src/components/site/Footer.tsx:87`
- Modify: `src/routes/market.tsx` (internal URLs after rename)

**Interfaces:**
- Consumes: nothing new
- Produces: `PinAnima.id` type changes from `AnimaId | "bottega"` to `AnimaId | "market"`; `PinAnima.to` union changes `"/bottega"` → `"/market"`; `BUILDERS` key changes `"bottega"` → `"market"`; route file exports `Route` at path `/market`

- [ ] **Step 1: Rename route file**

```bash
mv src/routes/bottega.tsx src/routes/market.tsx
```

- [ ] **Step 2: Update route internals in `src/routes/market.tsx`**

Change `createFileRoute("/bottega")` → `createFileRoute("/market")`.
Change all `getAbsoluteUrl("/bottega")` → `getAbsoluteUrl("/market")` (lines 24, 27, 141).
Update meta description text if it still says "legumi" → "panificio".

- [ ] **Step 3: Update `src/data/pin-anime.ts`**

Line 17: `id: AnimaId | "bottega"` → `id: AnimaId | "market"`
Line 22: `to: ... | "/bottega"` → `to: ... | "/market"`
Lines 96-108: Change `id: "bottega"` → `id: "market"`, `nome: "Bottega"` → `nome: "Market"`, `to: "/bottega"` → `to: "/market"`, `tinta: "var(--bottega-forest-green)"` → `tinta: "var(--carminio)"` (or appropriate new Market token from task 3).

- [ ] **Step 4: Update `src/components/home/HeroPin3D.tsx`**

Line 300: `type PinId = AnimaId | "bottega"` → `type PinId = AnimaId | "market"`
Line 310: `bottega: buildBottega` → `market: buildBottega` (builder function name stays until task 5 renames it)

- [ ] **Step 5: Update `src/components/site/StickyContactBar.tsx`**

Line 9: `to="/bottega"` → `to="/market"`

- [ ] **Step 6: Update `src/components/site/Footer.tsx`**

Line 87: `to="/bottega"` → `to="/market"`

- [ ] **Step 7: Verify build passes**

Run: `bun run build`
Expected: ✓ built in <600ms, no errors

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "refactor(market): rename route /bottega → /market across codebase"
```

---

### Task 2: Add Cloudflare 301 redirect from `/bottega` to `/market`

**Files:**
- Create or modify: `_redirects` (Cloudflare Pages redirect file at project root or `public/`)

**Interfaces:**
- Consumes: nothing
- Produces: `/bottega` → `/market` 301 redirect for external/bookmarked links

- [ ] **Step 1: Check for existing redirects file**

Run: `ls public/_redirects _redirects 2>&1`
If neither exists, create `public/_redirects`.

- [ ] **Step 2: Add redirect rule**

Append to `public/_redirects`:
```
/bottega /market 301
/bottega/* /market/:splat 301
```

- [ ] **Step 3: Verify build passes**

Run: `bun run build`
Expected: ✓ built, `_redirects` included in output

- [ ] **Step 4: Commit**

```bash
git add public/_redirects
git commit -m "feat(redirect): 301 /bottega → /market for SEO continuity"
```

---

### Task 3: Define Market design tokens in `tokens.css`

**Files:**
- Modify: `src/styles/tokens.css`

**Interfaces:**
- Consumes: existing token naming convention (`--color-*`, `--font-*`)
- Produces: New CSS custom properties consumed by task 4's CSS rewrite:
  - `--market-bg` (page background)
  - `--market-surface` (card/item background)
  - `--market-text` (primary text)
  - `--market-text-muted` (secondary text)
  - `--market-accent` (price, CTA highlight)
  - `--market-border` (subtle borders)
  - `--market-font-heading` (heading font stack)
  - `--market-font-body` (body font stack)

- [ ] **Step 1: Choose palette and fonts**

The user rejected the current `--bottega-*` green/ruby/cream palette and the current font treatment. Select new values that fit a premium food market aesthetic while staying within the site's overall brand (bianco-calce, oro-antico, carminio, biscotto family). Example direction:
- Background: warm off-white (`--pietra-100` or similar)
- Surface: white with subtle warmth
- Accent: `--carminio` or `--oro-antico-testo` for prices
- Heading font: `var(--font-display)` (Fraunces) — already available
- Body font: `var(--font-sans)` (Inter) — already available

Final values are a design decision; pick ones that contrast well and feel premium.

- [ ] **Step 2: Add tokens to `src/styles/tokens.css` under `:root`**

Add a `/* ── MARKET ── */` section with the chosen values. Each token must have both light and dark mode values if the site supports dark mode (check for `@media (prefers-color-scheme: dark)` or `[data-theme="dark"]` blocks).

- [ ] **Step 3: Verify build passes**

Run: `bun run build`
Expected: ✓ built, no CSS parse errors

- [ ] **Step 4: Commit**

```bash
git add src/styles/tokens.css
git commit -m "feat(tokens): add Market page design tokens"
```

---

### Task 4: Rewrite Market page CSS with new design system and mobile photo cards

**Files:**
- Rewrite: `src/styles/bottega.css` (keep filename for now; content fully replaced)

**Interfaces:**
- Consumes: tokens from task 3 (`--market-bg`, `--market-surface`, etc.)
- Produces: Complete CSS for `.market-page`, `.market-hero`, `.market-filters`, `.market-category-group`, `.market-items`, `.market-item` (with photo card layout), `.market-cart-fab`, responsive breakpoints at 767px and 480px

- [ ] **Step 1: Rewrite `src/styles/bottega.css`**

Replace entire file contents. Key requirements:
- Use `--market-*` tokens exclusively (no hardcoded colors)
- `.market-item` must be a card with visible image container at ALL breakpoints including mobile (≥200px height, object-fit cover)
- Typography: heading font for product names, body font for descriptions, distinct price styling
- Filter tabs: clean pill or underline style, not the current green-filled pills
- Cart FAB and drawer: restyle with new tokens
- Mobile (≤767px): single column, full-width cards with photo prominently displayed above text
- Reduced motion: respect `prefers-reduced-motion`

- [ ] **Step 2: Verify build passes**

Run: `bun run build`
Expected: ✓ built, no CSS errors

- [ ] **Step 3: Commit**

```bash
git add src/styles/bottega.css
git commit -m "style(market): complete CSS redesign with photo cards and new tokens"
```

---

### Task 5: Update Market page component to use new CSS classes and restore image display

**Files:**
- Modify: `src/routes/market.tsx`

**Interfaces:**
- Consumes: CSS classes from task 4, product data from `src/data/bottega.ts` (unchanged)
- Produces: Updated JSX that renders product images in cards, uses new class names, maintains cart/WhatsApp functionality

- [ ] **Step 1: Update `MarketItem` component in `src/routes/market.tsx`**

The current `MarketItem` has no `<img>` tag — it only shows name, description, price, and action buttons. Add an image element:
- Use `product.immagine` as `src`
- Wrap in a container div with the appropriate CSS class from task 4
- Add `loading="lazy"` and descriptive `alt` text (use `product.nome`)
- Ensure the image container has explicit dimensions to prevent CLS

- [ ] **Step 2: Update CSS class references throughout `src/routes/market.tsx`**

Replace any remaining `bottega-*` class references with `market-*` equivalents matching task 4's CSS. Update inline color references like `var(--bottega-red-ruby)` → `var(--market-accent)`, `var(--bottega-forest-green)` → appropriate new token, `var(--bottega-cream)` → `var(--market-surface)`.

- [ ] **Step 3: Verify build passes**

Run: `bun run build`
Expected: ✓ built, no TypeScript or CSS errors

- [ ] **Step 4: Commit**

```bash
git add src/routes/market.tsx
git commit -m "feat(market): update component with image cards and new design classes"
```

---

### Task 6: Rebuild 3D shopping bag icon using threejs-geometry skill

**Files:**
- Modify: `src/components/home/HeroPin3D.tsx:258-298` (the `buildBottega` function)

**Interfaces:**
- Consumes: `ThreeModule` type, `THREE.Scene` instance (same signature as current `buildBottega`)
- Produces: Renamed `buildMarket` function with improved geometry that clearly reads as a shopping bag/market icon at 64×64px render size

- [ ] **Step 1: Load threejs-geometry skill**

Invoke the `threejs-geometry` skill to get guidance on building recognizable low-poly icons.

- [ ] **Step 2: Rewrite `buildBottega` → `buildMarket` in HeroPin3D.tsx**

Apply threejs-geometry skill guidance. The current icon (BoxGeometry body + TorusGeometry handle + PlaneGeometry tag) is too abstract at 64px. Improve:
- Make proportions more recognizable as a shopping bag (wider, shorter handle)
- Add visual detail that reads at small size (e.g., thicker handle, visible fold line, contrasting front panel)
- Use materials/colors consistent with the new Market design tokens
- Keep total mesh count reasonable (<15 meshes) for fast single-frame render

Function signature stays: `(THREE: ThreeModule, scene: InstanceType<ThreeModule["Scene"]>) => void`

- [ ] **Step 3: Update BUILDERS record**

Line ~310: `market: buildBottega` → `market: buildMarket`

- [ ] **Step 4: Verify build passes**

Run: `bun run build`
Expected: ✓ built, no TypeScript errors

- [ ] **Step 5: Commit**

```bash
git add src/components/home/HeroPin3D.tsx
git commit -m "feat(hero): rebuild Market 3D icon with improved geometry"
```

---

### Task 7: Apply threejs-animation and threejs-interaction enhancements (optional polish)

**Files:**
- Modify: `src/components/home/HeroPin3D.tsx`

**Interfaces:**
- Consumes: Current static single-frame render approach
- Produces: Optional animation loop or interaction feedback for the Market pin icon

- [ ] **Step 1: Load threejs-animation skill**

Evaluate whether animation adds value at 64px icon size. The current approach renders a single frame to PNG via `toDataURL`. Animation would require switching to a live canvas render loop, which is a significant architectural change.

- [ ] **Step 2: Decision point**

If the skill guidance suggests animation is impractical at this scale (single-frame PNG icons), skip this task and note why. If a lightweight enhancement is feasible (e.g., subtle rotation on hover via CSS transform on the `<img>`, not Three.js animation), implement that instead in CSS.

- [ ] **Step 3: Load threejs-interaction skill**

Same evaluation: does interaction make sense for a static icon rendered to PNG? Likely answer is no — interaction belongs at the pin/card level (already handled by existing hover states), not inside the Three.js render.

- [ ] **Step 4: Implement or skip with justification**

If skipping: commit a no-op or CSS-only enhancement. If implementing: follow skill guidance, verify build, commit.

```bash
git add src/components/home/HeroPin3D.tsx
git commit -m "feat(hero): apply threejs skill enhancements to Market icon"
```

---

### Task 8: Final integration verification

**Files:**
- Read-only verification across all modified files

**Interfaces:**
- Consumes: all previous tasks' outputs
- Produces: confirmed working state

- [ ] **Step 1: Verify all `/bottega` references are gone from source**

Run: `grep -rn 'bottega\|/bottega' src/ --include='*.tsx' --include='*.ts' | grep -v node_modules | grep -v '.gen.ts' | grep -v 'bottega.ts' | grep -v '/images/bottega/'`
Expected: zero results (only `src/data/bottega.ts` filename and image placeholder paths should remain)

- [ ] **Step 2: Verify build passes**

Run: `bun run build`
Expected: ✓ built in <600ms

- [ ] **Step 3: Verify route tree regenerated**

Run: `grep -n 'market\|bottega' src/routeTree.gen.ts`
Expected: `/market` present, `/bottega` absent

- [ ] **Step 4: Final commit (if any stragglers found)**

```bash
git add -A
git commit -m "chore(market): final cleanup after bottega→market migration"
```