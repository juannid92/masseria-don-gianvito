# Full SEO Audit Report — masseriadongianvito.it

**Date:** 2026-11-19
**URL:** https://www.masseriadongianvito.it
**Business Type:** Hybrid Farm + Restaurant + Butcher (brick-and-mortar, Noci, Puglia, Italy)
**Auditors:** 7 parallel subagents (technical, content, schema, performance, visual, local, geo/agentic, sxo)

---

## Executive Summary

### Overall SEO Health Score: 66/100

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Technical SEO | 72/100 | 22% | 15.8 |
| Content Quality | 68/100 | 23% | 15.6 |
| On-Page SEO | 65/100 | 20% | 13.0 |
| Schema / Structured Data | 72/100 | 10% | 7.2 |
| Performance (CWV) | 55/100 | 10% | 5.5 |
| AI Search Readiness | 58/100 | 10% | 5.8 |
| Images | 60/100 | 5% | 3.0 |
| **Total** | | **100%** | **65.9 ≈ 66** |

### Top 5 Critical Issues

1. **Missing security headers** (HSTS, CSP, X-Frame-Options) — site vulnerable to MITM, XSS, clickjacking
2. **No redirect strategy** for domain variants — 4 URLs serve identical content without 301 redirects
3. **Three.js bundle (664 KB) loaded on every page** — should be route-specific lazy import
4. **Base64-embedded fonts in 286 KB CSS file** — blocks rendering, prevents independent caching
5. **No reviews/social proof anywhere** — critical trust gap for restaurant/agriturismo business

### Top 5 Quick Wins

1. Add `<link rel="preload" as="image" href="/images/masseria-luogo.jpg">` for LCP improvement
2. Fix `telephone` format in JSON-LD: remove `tel:` prefix, use E.164 format
3. Replace incorrect `FarmAction` schema type on /allevamento with `LocalBusiness`
4. Add missing canonical tag on /chi-siamo (one-line fix)
5. Add "Prenota" button to main header navigation

---

## Detailed Findings by Category

### 1. Technical SEO (Score: 72/100)

**What works:** Clean URL structure, proper robots.txt with AI crawler strategy, valid multi-type JSON-LD, correct canonicals on 12/13 pages, well-structured sitemap with 18 URLs.

| Severity | Finding | Effort | Impact |
|----------|---------|--------|--------|
| 🔴 Critical | Missing security headers (HSTS, CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy) | Low (Cloudflare config) | High |
| 🟠 High | No 301 redirects for www/non-www/http variants — all 4 return 200 | Low (Cloudflare rules) | High |
| 🟡 Medium | Missing canonical tag on /chi-siamo | Very Low (one line) | Medium |
| 🟢 Low | Sitemap lastmod dates are uniform/stale (build date, not content date) | Medium (build plugin) | Low |
| ℹ️ Info | AI crawler strategy correctly blocks training crawlers, allows search citability | N/A | Positive |
| ℹ️ Info | Clean semantic URL structure, no query params, max 2 levels depth | N/A | Positive |

**Full details:** [findings/technical.md](findings/technical.md)

---

### 2. Content Quality (Score: 68/100)

**What works:** Strong editorial voice, consistent narrative across all pages, no keyword stuffing, unique titles and meta descriptions on all pages, word counts range 472–1,037.

| Severity | Finding | Effort | Impact |
|----------|---------|--------|--------|
| 🟠 High | Bottega page uses 25 product names as H2 — flat hierarchy, no category grouping | Low | High |
| 🟡 Medium | Homepage H1 lacks geographic qualifier "Noci" | Low | Medium |
| 🟡 Medium | 3 pages below 500 words (Caseificio 472, Prodotti 483, Allevamento 514) | Medium | High |
| 🟡 Medium | Weak E-E-A-T signals — no staff names, years per activity, first-person experience | Medium | High |
| 🟡 Medium | Poor AI citation readiness — few discrete, verifiable factual claims | Medium | High |
| 🟡 Medium | Generic OG image shared across 5/7 pages | Low | Medium |
| 🟡 Medium | Heading nesting issues on /prodotti | Low | Medium |
| 🟢 Low | Meta descriptions lack CTAs on Allevamento, Caseificio, Macelleria | Low | Low |

**Full details:** [findings/content.md](findings/content.md)

---

### 3. Schema / Structured Data (Score: 72/100)

**What works:** JSON-LD on all 13 pages, multi-type global entity (Farm+Restaurant+Butcher), page-specific schemas (Restaurant, LocalBusiness, Store, FAQPage, BreadcrumbList), consistent address/geo data, OfferCatalog with 25 products on /bottega.

| Severity | Finding | Effort | Impact |
|----------|---------|--------|--------|
| 🔴 Critical | `telephone` uses `tel:` prefix in global schema — invalid format | Low | High |
| 🔴 Critical | `FarmAction` on /allevamento is semantically wrong (it's a CreativeWork, not a business) | Low | High |
| 🔴 Critical | Inconsistent telephone format across schemas (arrays vs strings, tel: vs plain) | Low | High |
| 🟠 High | Missing `image` property on global schema | Low | High |
| 🟠 High | Missing `openingHoursSpecification` on most pages | Low | High |
| 🟠 High | /prodotti ItemList lacks Product/Offer data (vs /bottega which has full OfferCatalog) | Medium | High |
| 🟠 High | No `Organization` schema on homepage (only on /chi-siamo) | Low | High |
| 🟡 Medium | BreadcrumbList missing on /agriturismo, /allevamento, /caseificio, /macelleria, /prodotti | Low | Medium |
| 🟡 Medium | FAQPage questions lack `url` property | Low | Medium |
| 🟡 Medium | No `Menu` schema on /agriturismo despite menu content existing | Medium | Medium |
| 🟡 Medium | Redundant `additionalType` values already in @type | Low | Low |
| 🟢 Low | No `AggregateRating` or `Review` schema on homepage | Low | Medium |
| 🟢 Low | No `sameAs` social profile links in any schema | Low | Medium |

**Full details:** [findings/schema.md](findings/schema.md)

---

### 4. Performance / Core Web Vitals (Score: 55/100)

**Estimated CWV (lab-based, no CrUX field data available):**
- **LCP:** 2.5–4.0s ⚠️ (hero image + render-blocking CSS + large JS)
- **INP:** 200–400ms ⚠️ (Three.js init + GSAP ScrollTrigger)
- **CLS:** <0.05 ✅ (preloaded hero, explicit dimensions)

| Severity | Finding | Effort | Impact |
|----------|---------|--------|--------|
| 🔴 Critical | Three.js (664 KB) loaded on every page via shared layout | Medium | Critical |
| 🔴 Critical | Base64-embedded fonts in 286 KB CSS file blocks rendering | Medium | Critical |
| 🔴 Critical | No LCP image preload for hero photo | Low | High |
| 🟠 High | Large unoptimized SVGs: logo-completo.svg (204 KB), logo-emblema.svg (172 KB) | Low | High |
| 🟠 High | Only 13/100+ images use `loading="lazy"` | Low | High |
| 🟠 High | Most images JPEG-only, no WebP/AVIF fallback | Medium | High |
| 🟠 High | Large JPEGs: agriturismo-cinquecento-punto2.jpg (784 KB), masseria-aerial.jpg (532 KB) | Low | Medium |
| 🟡 Medium | GTM competes for main thread during initialization | Low | Medium |
| 🟡 Medium | Vendor chunk index-CSbw48yy.js is 383 KB | Medium | Medium |
| 🟢 Low | No resource hints (dns-prefetch, preconnect) for third parties | Low | Low |
| 🟢 Low | Consider CSS containment for isolated sections | Low | Low |

**Full details:** [findings/performance.md](findings/performance.md)

---

### 5. Visual SEO (Score: 60/100)

**Note:** Screenshots could not be captured (screenshot.py not in runtime allowlist). Analysis based on source code inspection.

| Severity | Finding | Effort | Impact |
|----------|---------|--------|--------|
| 🟠 High | 10+ images missing `alt` attributes entirely (Bottega, Agriturismo, Hero, Footer) | Medium | High |
| 🟡 Medium | 3 images have empty `alt=""` — verify truly decorative | Low | Medium |
| 🟡 Medium | Above-the-fold hero content relies on JavaScript rendering (Three.js + GSAP) | Medium | Medium |
| 🟢 Low | OG image may not match current hero visual | Low | Low |
| ℹ️ Info | Strong visual design system with CSS custom properties and responsive breakpoints | N/A | Positive |

**Full details:** [findings/visual.md](findings/visual.md)

---

### 6. Local SEO (Score: 70/100)

**What works:** Strong NAP consistency via centralized data object, multiple LocalBusiness schema variants by page type, Google Maps embeds on key pages, structured reviews with aggregateRating on /recensioni.

| Severity | Finding | Effort | Impact |
|----------|---------|--------|--------|
| 🟠 High | Homepage JSON-LD uses ['Farm','Restaurant','Butcher'] but NOT LocalBusiness | Low | High |
| 🟡 Medium | Opening hours lack structured `openingHoursSpecification` on most pages | Low | Medium |
| 🟡 Medium | No dedicated Google Business Profile link or badge | Low | Medium |
| 🟡 Medium | Review/aggregateRating schema only on /recensioni, not homepage | Low | Medium |
| 🟢 Low | Two phone numbers without clear role differentiation | Low | Low |
| 🟢 Low | Rural address format may cause issues with some citation platforms | Low | Low |
| ℹ️ Info | Excellent NAP consistency via centralized MASSERIA data object | N/A | Positive |
| ℹ️ Info | Map embed present on /dove-siamo and Prenota component | N/A | Positive |

**Full details:** [findings/local.md](findings/local.md)

---

### 7. AI Search Readiness / GEO (Score: 55/100)

**What works:** Correct AI crawler strategy (blocks training, allows citability), strong semantic HTML (8 nav, 2 main, 20 article elements), 50 aria-labels, zero a11y violations from render engine.

| Severity | Finding | Effort | Impact |
|----------|---------|--------|--------|
| 🟠 High | No /llms.txt discovery file | Low | High |
| 🟠 High | No /.well-known/ai-plugin.json | Medium | High |
| 🟡 Medium | No FAQ content on homepage for AI snippet extraction | Medium | Medium |
| 🟡 Medium | Brand entity consistency good but no sameAs links to external authorities | Low | Medium |
| 🟢 Low | No Markdown versions of key pages for text-only agents | Low | Low |
| ℹ️ Info | Semantic HTML structure is excellent for AI parsing | N/A | Positive |
| ℹ️ Info | 50 aria-labels provide rich accessibility tree | N/A | Positive |

**Full details:** [findings/geo.md](findings/geo.md)

---

### 8. Agentic / AI Agent Accessibility (Score: 68/100)

**What works:** Strong accessibility foundations, clean semantic HTML, zero a11y violations, structured JSON-LD consumable by agents, Store schema with OfferCatalog on /bottega.

| Severity | Finding | Effort | Impact |
|----------|---------|--------|--------|
| 🟠 High | No WebMCP or agent discovery protocol (/.well-known/webmcp.json) | Medium | High |
| 🟠 High | No Markdown content mirrors for text-only agents | Medium | Medium |
| 🟡 Medium | 4 images with empty alt — verify decorative | Low | Low |
| 🟢 Low | No form elements on homepage (WhatsApp/phone CTAs instead) | Low | Low |
| ℹ️ Info | Only 1 explicit ARIA role used — native semantics preferred ✓ | N/A | Positive |
| ℹ️ Info | Zero a11y issues from Playwright render | N/A | Positive |

**Limitations:** Lighthouse accessibility audit not run (no local Chrome binary). Findings based on static HTML analysis only.

**Full details:** [findings/agentic.md](findings/agentic.md)

---

### 9. SXO — Search Experience Optimization (Score: 68/100)

**What works:** Strong editorial/narrative experience, consistent brand voice, immersive scroll animations, clear value proposition on homepage, Bottega e-commerce flow with cart + WhatsApp ordering.

| Severity | Finding | Effort | Impact |
|----------|---------|--------|--------|
| 🔴 Critical | No reviews/social proof on any page — biggest trust deficit for restaurant | Medium | Critical |
| 🔴 Critical | /prodotti vs /bottega intent cannibalization | Medium | High |
| 🟠 High | No "Prenota" button in main header navigation | Low | High |
| 🟠 High | Missing opening hours above fold on /macelleria and /agriturismo | Low | High |
| 🟠 High | Flat H2 hierarchy in Bottega (25 product-name H2s) | Low | High |
| 🟡 Medium | No booking form on /agriturismo (WhatsApp/phone only) | Medium | Medium |
| 🟡 Medium | No visual certification badges (only mentioned in text) | Low | Medium |
| 🟡 Medium | No event/venue section for event planners persona | Medium | Medium |
| 🟡 Medium | No newsletter signup for seasonal updates | Low | Low |
| 🟢 Low | Sticky contact bar competes with content on <375px screens | Medium | Low |
| 🟢 Low | No recipe/pairing content for food enthusiast persona | Medium | Low |
| 🟢 Low | No press kit for media persona | Low | Low |

**Full details:** [findings/sxo.md](findings/sxo.md)

---

## Prioritized Action Plan

### Phase 1: Critical Fixes (Week 1)

| # | Action | Category | Effort | Impact |
|---|--------|----------|--------|--------|
| 1 | Add security headers via Cloudflare (HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy) | Technical | Low | Critical |
| 2 | Configure 301 redirects for all domain variants → https://www.masseriadongianvito.it | Technical | Low | Critical |
| 3 | Move Three.js to route-specific lazy import (save 664 KB on non-homepage routes) | Performance | Medium | Critical |
| 4 | Extract base64 fonts to separate .woff2 files with font-display: swap | Performance | Medium | Critical |
| 5 | Add LCP image preload for hero photo | Performance | Low | High |
| 6 | Fix telephone format in all JSON-LD: remove tel: prefix, use E.164 | Schema | Low | High |
| 7 | Replace FarmAction with LocalBusiness on /allevamento | Schema | Low | High |
| 8 | Add image property to global schema | Schema | Low | High |
| 9 | Add review/testimonial section to homepage and /agriturismo | SXO | Medium | Critical |

### Phase 2: High-Impact Improvements (Weeks 2-3)

| # | Action | Category | Effort | Impact |
|---|--------|----------|--------|--------|
| 10 | Add openingHoursSpecification to global schema | Schema | Low | High |
| 11 | Add Organization with logo and sameAs to homepage schema | Schema | Low | High |
| 12 | Add LocalBusiness to homepage JSON-LD @type array | Local | Low | High |
| 13 | Add "Prenota" button to main header navigation | SXO | Low | High |
| 14 | Restructure Bottega H2 hierarchy: categories as H2, products as H3 | Content/SXO | Low | High |
| 15 | Clarify /prodotti vs /bottega distinction or consolidate | SXO | Medium | High |
| 16 | Optimize large SVGs (logo-completo.svg 204KB, logo-emblema.svg 172KB) | Performance | Low | High |
| 17 | Add loading="lazy" to all below-fold images | Performance | Low | High |
| 18 | Fix 10+ missing alt attributes across Bottega, Agriturismo, Hero, Footer | Visual | Medium | High |
| 19 | Create /llms.txt for AI discovery | GEO | Low | High |
| 20 | Add Menu schema to /agriturismo | Schema | Medium | Medium |

### Phase 3: Content & Authority (Month 2)

| # | Action | Category | Effort | Impact |
|---|--------|----------|--------|--------|
| 21 | Expand thin content pages (+150-300 words each: Caseificio, Prodotti, Allevamento) | Content | Medium | High |
| 22 | Add E-E-A-T experience signals (staff names, years active, first-person narratives) | Content | Medium | High |
| 23 | Embed 3-5 citable factual claims per page for AI extraction | Content/GEO | Medium | High |
| 24 | Generate WebP/AVIF variants for key images | Performance | Medium | High |
| 25 | Compress large JPEGs (>400KB) to quality 80-85 or WebP | Performance | Low | Medium |
| 26 | Add BreadcrumbList to all main pages missing it | Schema | Low | Medium |
| 27 | Enrich /prodotti ItemList with Product/Offer data | Schema | Medium | Medium |
| 28 | Add aggregateRating to homepage and agriturismo schema | Local/Schema | Low | Medium |
| 29 | Add Google Business Profile link in footer | Local | Low | Medium |
| 30 | Create /.well-known/ai-plugin.json and webmcp.json | GEO/Agentic | Medium | Medium |
| 31 | Add simple booking/contact form to /agriturismo | SXO | Medium | Medium |
| 32 | Add certification badges visually | SXO | Low | Medium |

### Phase 4: Monitoring & Iteration (Ongoing)

| # | Action | Category | Effort |
|---|--------|----------|--------|
| 33 | Set up Google API credentials for CrUX field data and GSC indexation monitoring | Performance | Medium |
| 34 | Monitor AI crawler user-agents quarterly, update robots.txt | GEO | Low |
| 35 | Manual a11y testing (keyboard + screen reader) quarterly | Agentic | Medium |
| 36 | Add newsletter signup in footer | SXO | Low |
| 37 | Create event/venue section for event planners | SXO | Medium |
| 38 | Add recipe/pairing content for food enthusiasts | Content | Medium |
| 39 | Create press kit page with downloadable assets | SXO | Low |
| 40 | Fix sitemap lastmod to use real content modification dates | Technical | Medium |

---

## Artifacts

All detailed findings are available in the `findings/` directory:

| File | Category | Key Metric |
|------|----------|------------|
| [technical.md](findings/technical.md) | Technical SEO | 72/100 |
| [content.md](findings/content.md) | Content Quality | 68/100 |
| [schema.md](findings/schema.md) | Schema / Structured Data | 72/100 |
| [performance.md](findings/performance.md) | Performance / CWV | 55/100 |
| [visual.md](findings/visual.md) | Visual SEO | 60/100 |
| [local.md](findings/local.md) | Local SEO | 70/100 |
| [geo.md](findings/geo.md) | AI Search Readiness | 55/100 |
| [agentic.md](findings/agentic.md) | AI Agent Accessibility | 68/100 |
| [sxo.md](findings/sxo.md) | Search Experience Optimization | 68/100 |

---

## Limitations & Caveats

1. **No Google API credentials configured** — Core Web Vitals are lab-based estimates, not real-user CrUX field data. GSC indexation status and GA4 organic traffic data unavailable.
2. **No Matomo credentials configured** — Organic traffic analytics unavailable.
3. **No backlink API credentials (Moz/Bing)** — Backlink profile analysis limited to Common Crawl domain-level metrics only.
4. **Screenshots not captured** — screenshot.py not in bundled runtime allowlist. Visual analysis based on source code inspection.
5. **Lighthouse not run** — No local Chrome/Lighthouse binary available. Performance findings based on static asset analysis.
6. **Client-rendered content** — Analysis based on SSR HTML output. React hydration may add content not visible in initial HTML.
7. **Word counts approximate** — Regex-based text extraction from SSR HTML may miss client-rendered content.

---

*Generated by claude-seo full audit · 2026-11-19*
*7 subagents · 9 findings files · 13 pages crawled*