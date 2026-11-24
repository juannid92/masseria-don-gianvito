# Performance Audit — masseriadongianvito.it

## Summary

The site uses TanStack Start with Vite, Three.js for 3D hero pins, GSAP for scroll animations, and Lenis for smooth scrolling. Total client assets weigh **2.2 MB**. The largest performance risks are a 664 KB Three.js bundle loaded on every page, a 286 KB fonts CSS file with base64-embedded font data, and Google Tag Manager loaded synchronously in `<head>`. Code-splitting is partially effective (route-level chunks exist), but the shared vendor bundle remains large. Image optimization is mixed: WebP variants exist for some images but many JPEGs lack responsive `srcset`, and only 13 of ~100+ images use `loading="lazy"`.

**Estimated Core Web Vitals (lab):**
- **LCP**: Likely 2.5–4.0s (hero image + render-blocking CSS + large JS bundles)
- **INP**: Likely 200–400ms (Three.js initialization + GSAP ScrollTrigger setup on first interaction)
- **CLS**: Likely <0.05 (preloaded hero image, explicit dimensions on most elements)

---

## Core Web Vitals

### Largest Contentful Paint (LCP)
- **Status**: ⚠️ At Risk
- **LCP candidate**: Hero aerial photo (`/images/masseria-luogo.jpg`, 244 KB JPEG) or the Three.js canvas
- **Issues**:
  - 3 CSS files loaded as render-blocking stylesheets (fonts 286 KB + styles 198 KB + index 6.3 KB = **490 KB total**)
  - No `<link rel="preload">` for the LCP hero image detected in built HTML
  - Three.js module (664 KB) may delay interactive rendering even if not LCP element
- **Recommendation**: Add `<link rel="preload" as="image" href="/images/masseria-luogo.jpg">` to `<head>`. Consider inlining critical CSS and deferring non-critical styles.

### Interaction to Next Paint (INP)
- **Status**: ⚠️ At Risk
- **Issues**:
  - Three.js (664 KB) initializes WebGL context on page load, blocking main thread
  - GSAP ScrollTrigger (111 KB) registers observers on mount
  - Shared vendor chunk `index-CSbw48yy.js` is 383 KB — likely includes React DOM + router
- **Recommendation**: Defer Three.js initialization until after first paint or use `requestIdleCallback`. Lazy-load ScrollTrigger only when scroll-linked sections enter viewport.

### Cumulative Layout Shift (CLS)
- **Status**: ✅ Good (estimated)
- **Positives**: Hero image preloaded, explicit aspect ratios on product cards and gallery items
- **Risk**: Font swap from base64 embedded fonts may cause brief FOUT/FOIT flash

---

## Resource Analysis

### JavaScript Bundles
| File | Size | Notes |
|------|------|-------|
| `three.module-BZT8X7MV.js` | **664 KB** | Loaded on every page via shared layout; should be route-specific |
| `index-CSbw48yy.js` | **383 KB** | Vendor/shared chunk (React, router, utilities) |
| `ChapterNavigation-Bon_Q9ff.js` | 179 KB | Route-specific, correctly split |
| `routes-DDci2Epo.js` | 154 KB | Route manifest, correctly split |
| `ScrollTrigger-B2JeSRMT.js` | 111 KB | GSAP plugin, lazy-loaded ✅ |
| Route chunks (prodotti, agriturismo, etc.) | 13–23 KB each | Well-split ✅ |

**Total JS**: ~1.7 MB uncompressed. Three.js alone is 39% of total JS.

### CSS Bundles
| File | Size | Notes |
|------|------|-------|
| `fonts-Cm6gl5G-.css` | **286 KB** | Single @font-face with 291 KB base64 woff2 data embedded inline |
| `styles-HHu8OdOF.css` | **198 KB** | Main stylesheet (Tailwind + custom CSS) |
| `index-PKqnejSf.css` | 6.3 KB | Component styles |

**Total CSS**: ~490 KB. Fonts CSS is 58% of total CSS weight.

### Images
- **Formats**: 82 JPEG, 19 JPG, 11 WebP, 3 SVG, 1 PNG
- **WebP coverage**: Only 11 WebP files exist (mostly agriturismo gallery + aerial variants). Most product and story images are JPEG-only with no WebP fallback.
- **Largest images**:
  - `agriturismo-cinquecento-punto2.jpg`: 784 KB
  - `masseria-aerial.jpg`: 532 KB
  - `storia-allevamento.jpg`: 488 KB
- **SVG optimization needed**: `logo-completo.svg` (204 KB) and `logo-emblema.svg` (172 KB) are unusually large for logos — likely contain embedded raster data or unoptimized paths
- **Lazy loading**: Only **13 images** use `loading="lazy"`, **1** uses `loading="eager"`. Many below-fold images likely lack lazy loading attributes.
- **Preloading**: No `<link rel="preload" as="image">` tags detected in built output despite hero image being critical for LCP

### Third-Party Scripts
- **Google Tag Manager** (`GTM-KGG4P46D`): Loaded via `<script async>` in `<head>` of `__root.tsx`. While `async` prevents render-blocking, GTM still competes for main thread during initialization and loads additional scripts (analytics, consent managers).
- **No other third-party scripts detected** (no ads, no chat widgets, no social embeds) ✅

### Font Loading Strategy
- **Critical issue**: All font data is **base64-encoded inline** in `fonts-Cm6gl5G-.css` (291 KB of base64 woff2). This means:
  - Fonts cannot be cached independently of CSS
  - The entire 286 KB must download before any text renders
  - No `font-display: swap` benefit since data is already inline
- **@font-face declarations**: Only 1 declaration found (likely Fraunces variable font)
- **Recommendation**: Serve fonts as separate `.woff2` files with `font-display: swap` and `<link rel="preload">`. This would reduce initial CSS payload by ~286 KB and enable independent caching.

---

## Recommendations

### Critical (fix immediately)
1. **Move Three.js to route-specific lazy import**: Currently loaded on every page via shared layout. Should be dynamically imported only on pages that use 3D pins (homepage hero). Estimated savings: 664 KB on all non-homepage routes.
2. **Extract base64 fonts to separate files**: Convert inline base64 woff2 to standalone font files with `font-display: swap`. Reduces render-blocking CSS by 286 KB and enables browser font caching.
3. **Add LCP image preload**: Add `<link rel="preload" as="image" href="/images/masseria-luogo.jpg">` to prevent late discovery of the largest contentful paint element.

### High (fix within 1 week)
4. **Optimize large SVGs**: Run `svgo` on `logo-completo.svg` (204 KB) and `logo-emblema.svg` (172 KB). Target <20 KB each for logo SVGs.
5. **Add `loading="lazy"` to below-fold images**: Audit all `<img>` tags and add lazy loading to images not in the initial viewport. Currently only 13/100+ images have it.
6. **Generate WebP/AVIF variants for key images**: Prioritize hero image, story photos, and agriturismo gallery. Serve via `<picture>` with format negotiation.
7. **Compress large JPEGs**: `agriturismo-cinquecento-punto2.jpg` (784 KB) and `masseria-aerial.jpg` (532 KB) should be re-encoded at quality 80-85 or converted to WebP. Target <200 KB for full-width images.

### Medium (fix within 1 month)
8. **Defer GTM initialization**: Move GTM script to after `DOMContentLoaded` or use a consent-aware lazy loader to reduce main thread contention during page load.
9. **Audit vendor chunk**: Investigate what's in `index-CSbw48yy.js` (383 KB). Consider splitting React DOM from router utilities if possible.
10. **Add resource hints**: Add `<link rel="dns-prefetch">` for `www.googletagmanager.com` and `<link rel="preconnect">` for any CDN origins.

### Low (backlog)
11. **Consider CSS containment**: Add `contain: layout style paint` to isolated sections (footer, sticky bar) to reduce recalculation scope during scroll animations.
12. **Evaluate Lenis smooth scroll necessity**: Smooth scrolling libraries add continuous rAF loops. Test if native `scroll-behavior: smooth` suffices for the design intent.

---

*Note: Core Web Vitals are lab-based estimates. Field data from CrUX would provide real-user measurements but requires Google API credentials not currently configured.*