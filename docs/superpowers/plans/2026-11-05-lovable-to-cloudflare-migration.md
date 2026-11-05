# Lovable to Cloudflare Pages Migration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove all Lovable infrastructure dependencies and configure the project for native Cloudflare Pages deployment while fixing production-blocking bugs.

**Architecture:** Replace `@lovable.dev/vite-tanstack-config` with explicit Vite + TanStack Start plugins, add `wrangler.toml` for Cloudflare Pages Functions, fix singleton/state bugs in router and config, remove 34 unused shadcn components, and update documentation. The SSR entry (`src/server.ts`) is already Cloudflare Workers-compatible and stays unchanged.

**Tech Stack:** Vite 8, TanStack Start 1.x, Nitro (cloudflare preset), Bun, Tailwind CSS v4, TypeScript 5.9

**Spec:** Design approved in brainstorming session 2026-11-05. Key decisions: Cloudflare Pages (not standalone Workers), preserve existing SSR error wrapper in `server.ts`, keep photo aerial Hero asset as-is, retain only 5 used UI components (input, textarea, select, tabs, label).

## Global Constraints

- Runtime target: Cloudflare Pages Functions (Nitro `cloudflare` preset)
- Package manager: bun (lockfile: `bun.lock`)
- Node compatibility: no Node-only APIs in server code (Workers runtime)
- Preserve existing `src/server.ts` SSR error wrapper — do not replace or restructure
- Preserve `src/assets/masseria-aerial.asset.json` and Hero image fallback chain
- All commits must be conventional (`feat:`, `fix:`, `chore:`, `refactor:`)
- No new dependencies unless required for Cloudflare build
- PRESERVE ALL ANIMATIONS AND MOTION: do not modify, remove or restructure any GSAP, Lenis, ScrollTrigger, Framer Motion code, CSS transitions/animations, or scroll-driven effects in `src/components/`, `src/styles.css`, or `src/hooks/`. The motion system is approved as-is and must survive the migration unchanged

## Review Focus

1. **Vite config parity**: After removing `@lovable.dev/vite-tanstack-config`, the dev server must still resolve `@/` aliases, inject `VITE_*` env vars, and serve TanStack Start SSR — verified by `bun run dev` starting without errors
2. **QueryClient singleton**: Multiple router creations must share one QueryClient instance — verified by checking that `getRouter()` returns routers sharing the same client reference
3. **OG image availability**: `SITE_CONFIG.ogImage` must resolve to an existing file in `public/` — verified by file existence check
4. **Unused component removal safety**: Removing 34 UI files must not break any import — verified by `bun run build` succeeding with zero errors
5. **Cloudflare deploy readiness**: `wrangler pages deploy` must produce a valid deployment artifact — verified by `bun run build` producing `.output/` directory compatible with Cloudflare Pages

---

### Task 1: Fix QueryClient Singleton in Router

**Files:**
- Modify: `src/router.tsx`

**Interfaces:**
- Consumes: `QueryClient` from `@tanstack/react-query`
- Produces: `getRouter()` function returning a router with a shared singleton QueryClient

- [ ] **Step 1: Write the failing test concept**

This is a stateful singleton fix. Verification is manual: call `getRouter()` twice and confirm both return routers whose `context.queryClient` is the same object reference.

- [ ] **Step 2: Implement singleton pattern in `src/router.tsx`**

Move `QueryClient` instantiation outside `getRouter()` as a module-level constant. The function creates the router using this shared instance. Signature unchanged: `getRouter(): Router`.

```typescript
const queryClient = new QueryClient();

export const getRouter = () => {
  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });
  return router;
};
```

- [ ] **Step 3: Verify dev server starts**

Run: `bun run dev`
Expected: Server starts on configured port without errors. Stop after confirming.

- [ ] **Step 4: Commit**

```bash
git add src/router.tsx
git commit -m "fix: use singleton QueryClient in router to prevent duplicate caches"
```

---

### Task 2: Fix OG Image Reference

**Files:**
- Modify: `src/config/site.ts`
- Verify: `public/images/` contents

**Interfaces:**
- Consumes: file listing of `public/images/`
- Produces: corrected `SITE_CONFIG.ogImage` pointing to an existing asset

- [ ] **Step 1: Check available images in public/images/**

Run: `ls public/images/`
Expected: list of actual files. Note which SVG/PNG exists that can serve as OG image.

- [ ] **Step 2: Update ogImage in `src/config/site.ts`**

Change `ogImage` from `/images/logo-completo.svg` to the path of an existing image found in Step 1. If no suitable image exists, set it to `/favicon-masseria.svg` (confirmed present in `public/`).

- [ ] **Step 3: Verify the referenced file exists**

Run: `test -f "public${new_og_path}" && echo OK || echo MISSING`
Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add src/config/site.ts
git commit -m "fix: correct ogImage path to existing asset for social sharing"
```

---

### Task 3: Remove Unused UI Components

**Files:**
- Delete: 34 files in `src/components/ui/` (all except `input.tsx`, `textarea.tsx`, `select.tsx`, `tabs.tsx`, `label.tsx`, `button.tsx`, `separator.tsx`, `skeleton.tsx`, `tooltip.tsx`)
- Verify: no broken imports remain

**Interfaces:**
- Consumes: grep results confirming zero external imports for each deleted file
- Produces: clean `src/components/ui/` with only used components

- [ ] **Step 1: Confirm the full deletion list**

The following 34 components have zero imports outside their own file and must be deleted:
`accordion`, `alert-dialog`, `alert`, `aspect-ratio`, `avatar`, `badge`, `breadcrumb`, `calendar`, `card`, `carousel`, `chart`, `checkbox`, `collapsible`, `command`, `context-menu`, `drawer`, `dropdown-menu`, `form`, `hover-card`, `input-otp`, `menubar`, `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`, `resizable`, `scroll-area`, `sidebar`, `slider`, `sonner`, `switch`, `table`, `toggle-group`

Additionally check `toggle.tsx` — if unused, delete it too.

Retain: `button.tsx`, `input.tsx`, `label.tsx`, `select.tsx`, `separator.tsx`, `skeleton.tsx`, `tabs.tsx`, `textarea.tsx`, `tooltip.tsx`

- [ ] **Step 2: Delete all unused component files**

Run: `rm src/components/ui/{accordion,alert-dialog,alert,aspect-ratio,avatar,badge,breadcrumb,calendar,card,carousel,chart,checkbox,collapsible,command,context-menu,drawer,dropdown-menu,form,hover-card,input-otp,menubar,navigation-menu,pagination,popover,progress,radio-group,resizable,scroll-area,sidebar,slider,sonner,switch,table,toggle-group}.tsx`

Also delete `toggle.tsx` if confirmed unused in Step 1.

- [ ] **Step 3: Verify build succeeds with no missing imports**

Run: `bun run build`
Expected: Build completes without "Cannot find module" or similar import errors.

- [ ] **Step 4: Commit**

```bash
git add -A src/components/ui/
git commit -m "chore: remove 34 unused shadcn UI components"
```

---

### Task 4: Replace Lovable Vite Config with Native Configuration

**Files:**
- Modify: `vite.config.ts`
- Modify: `package.json` (remove `@lovable.dev/vite-tanstack-config`, add explicit deps if needed)

**Interfaces:**
- Consumes: current `vite.config.ts` using `@lovable.dev/vite-tanstack-config`
- Produces: standalone `vite.config.ts` with explicit TanStack Start, React, Tailwind, and tsconfig-paths plugins

- [ ] **Step 1: Document what @lovable.dev/vite-tanstack-config provides**

From the existing comment in `vite.config.ts`, it bundles: `tanstackStart`, `viteReact`, `tailwindcss`, `tsConfigPaths`, `nitro` (cloudflare preset), `componentTagger` (dev-only), `VITE_*` env injection, `@` path alias, React/TanStack dedupe, error logger plugins, sandbox detection.

- [ ] **Step 2: Rewrite `vite.config.ts` with explicit plugins**

Replace the entire file content. Import and compose:
- `@tanstack/router-plugin/vite` (TanStackRouterPlugin)
- `@vitejs/plugin-react`
- `@tailwindcss/vite`
- `vite-tsconfig-paths`
- Configure Nitro via TanStack Start's `app.config.ts` or inline nitro config with `preset: 'cloudflare'`
- Set `resolve.alias` for `@` → `./src`
- Preserve `server.entry: "server"` for custom SSR wrapper

The exact plugin composition must match what `@lovable.dev/vite-tanstack-config` was providing. Reference TanStack Start docs for the canonical Vite setup.

- [ ] **Step 3: Remove @lovable.dev/vite-tanstack-config from package.json**

Run: `bun remove @lovable.dev/vite-tanstack-config`

- [ ] **Step 4: Install any newly required explicit dependencies**

If Step 2 introduced imports not already in `package.json`, install them:
Run: `bun install`

- [ ] **Step 5: Verify dev server starts correctly**

Run: `bun run dev`
Expected: Server starts, pages render, `@/` aliases resolve, Tailwind classes apply. Stop after confirming.

- [ ] **Step 6: Verify production build succeeds**

Run: `bun run build`
Expected: `.output/` directory produced with Cloudflare-compatible structure.

- [ ] **Step 7: Commit**

```bash
git add vite.config.ts package.json bun.lock
git commit -m "refactor: replace @lovable.dev/vite-tanstack-config with explicit Vite plugins"
```

---

### Task 5: Add Wrangler Configuration and Deploy Scripts

**Files:**
- Create: `wrangler.toml`
- Modify: `package.json` (add deploy script)

**Interfaces:**
- Consumes: build output from Task 4 (`.output/` directory)
- Produces: `wrangler.toml` configured for Cloudflare Pages Functions + deploy script

- [ ] **Step 1: Create `wrangler.toml`**

```toml
name = "masseria-don-gianvito"
compatibility_date = "2026-11-05"
pages_build_output_dir = ".output/public"

[vars]
# Add environment variables here as needed
```

Adjust `pages_build_output_dir` to match the actual Nitro cloudflare preset output path. Verify by inspecting `.output/` structure after build.

- [ ] **Step 2: Add deploy script to package.json**

Add to `"scripts"`:
```json
"deploy": "bun run build && wrangler pages deploy"
```

- [ ] **Step 3: Install wrangler as dev dependency**

Run: `bun add -d wrangler`

- [ ] **Step 4: Verify build produces correct output structure**

Run: `bun run build && ls .output/`
Expected: Directory structure compatible with Cloudflare Pages Functions (typically `_worker.js/` or `functions/` alongside static assets).

- [ ] **Step 5: Commit**

```bash
git add wrangler.toml package.json bun.lock
git commit -m "feat: add wrangler.toml and deploy script for Cloudflare Pages"
```

---

### Task 6: Clean Up Lovable Artifacts and Update Documentation

**Files:**
- Delete: `.lovable/` directory
- Modify: `AGENTS.md` (remove Lovable-specific warnings or update for new workflow)
- Modify: `README.md` (replace Lovable instructions with local dev + Cloudflare deploy)

**Interfaces:**
- Consumes: current `AGENTS.md`, `README.md`, `.lovable/` directory
- Produces: updated docs reflecting post-Lovable workflow

- [ ] **Step 1: Remove .lovable directory**

Run: `rm -rf .lovable/`

- [ ] **Step 2: Update AGENTS.md**

Remove the `<!-- LOVABLE:BEGIN -->` / `<!-- LOVABLE:END -->` block about git history rewriting. Replace with a brief note about the Cloudflare Pages deployment target and that commits push directly to GitHub for automatic deploy.

- [ ] **Step 3: Rewrite README.md**

Replace Lovable editor references with:
- Local development: `bun install && bun run dev`
- Production build: `bun run build`
- Deploy: `bun run deploy` (or push to main for auto-deploy via Cloudflare Pages GitHub integration)
- Tech stack summary: React 19, TanStack Start, Vite 8, Tailwind CSS v4, Cloudflare Pages

- [ ] **Step 4: Verify no remaining references to @lovable.dev in source**

Run: `grep -r "lovable" --include="*.ts" --include="*.tsx" --include="*.md" --include="*.json" src/ *.md *.json 2>/dev/null | grep -v node_modules | grep -v bun.lock`
Expected: Only acceptable references remain (e.g., historical notes in docs, not functional dependencies).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove Lovable artifacts and update documentation for Cloudflare Pages"
```

---

### Task 7: Final Integration Verification

**Files:**
- No file changes — verification only

**Interfaces:**
- Consumes: all changes from Tasks 1–6
- Produces: confirmation that the project builds, runs, and is deploy-ready

- [ ] **Step 1: Clean install and build**

Run: `rm -rf node_modules && bun install && bun run build`
Expected: Clean install succeeds, build produces `.output/` without errors.

- [ ] **Step 2: Start dev server and verify key routes**

Run: `bun run dev`
Manually verify:
- `/` renders Hero with aerial photo
- `/agriturismo` loads without errors
- `/braceria` redirects to `/agriturismo`
- `/allevamento`, `/caseificio`, `/macelleria` load
- 404 page renders for invalid routes

Stop server after verification.

- [ ] **Step 3: Verify no Lovable dependencies remain**

Run: `grep -r "@lovable" package.json bun.lock 2>/dev/null`
Expected: No matches.

- [ ] **Step 4: Final commit (if any fixes were needed)**

Only if Steps 1–3 revealed issues that required fixes. Otherwise skip.

```bash
git add -A
git commit -m "fix: address integration issues found during final verification"
```