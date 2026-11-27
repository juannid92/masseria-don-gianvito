# SEO Audit Report — masseriadongianvito.it
_Audit date: 2026-11-27 · Tool: claude-seo 2.5.0_

## Executive Summary

| Metric | Value |
|--------|-------|
| **SEO Health Score** | **72 / 100** |
| Business Type | Hybrid Local Service (Farm + Restaurant + Butcher + E-commerce) |
| Pages Crawled | 6 key routes + robots.txt + sitemap.xml |
| Structured Data Blocks | 3 (all valid JSON-LD) |
| API Credentials | None configured (crawl-only audit) |

### Top 5 Critical Issues
1. Missing security headers (HSTS, X-Frame-Options, CSP) on all pages
2. No Google API credentials — CWV field data unavailable for performance scoring
3. Duplicate Organization+AggregateRating structured data blocks on homepage
4. /bottega → /market redirect needs live verification for link equity preservation
5. Sitemap lastmod dates stale for some pages (2026-11-18 vs recent deploys)

### Top 5 Quick Wins
1. Add HSTS header via Cloudflare `_headers` file (~5 min)
2. Deduplicate Organization schema block in homepage head (~10 min)
3. Update sitemap lastmod to reflect actual deploy dates (~5 min)
4. Add `X-Content-Type-Options: nosniff` header (~2 min)
5. Configure Google API key for CrUX field data (~15 min)

---

## Category Scores

| Category | Weight | Score | Weighted |
|----------|--------|-------|----------|
| Technical SEO | 22% | 65 | 14.3 |
| Content Quality | 23% | 78 | 17.9 |
| On-Page SEO | 20% | 75 | 15.0 |
| Schema / Structured Data | 10% | 70 | 7.0 |
| Performance (CWV) | 10% | 60 | 6.0 |
| AI Search Readiness | 10% | 82 | 8.2 |
| Images | 5% | 70 | 3.5 |
| **Total** | **100%** | | **71.9 ≈ 72** |

---

## Technical SEO (65/100)

### What Works
- All key pages return HTTP 200 with correct `text/html; charset=utf-8`
- robots.txt properly segments AI training crawlers (blocked) vs AI search citability crawlers (allowed)
- Sitemap.xml present with all major routes including renamed `/market`
- Cloudflare CDN with gzip compression enabled
- Clean semantic URL structure (`/allevamento`, `/caseificio`, `/macelleria`, `/agriturismo`, `/market`)

### Findings

#### [HIGH] Missing HSTS Header
No `Strict-Transport-Security` header detected on any page. Site serves over HTTPS but without HSTS, browsers may still attempt initial HTTP connections, exposing users to downgrade attacks.
**Fix:** Add to `public/_headers`:
```
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains
```

#### [MEDIUM] Missing Security Headers (X-Frame-Options, CSP, X-Content-Type-Options)
No clickjacking protection, MIME sniffing prevention, or content security policy detected.
**Fix:** Add to `public/_headers`:
```
/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
```

#### [LOW] No Cache-Control Headers on HTML Pages
HTML responses lack explicit caching directives. Cloudflare defaults apply but browser caching is uncontrolled.
**Fix:** Add `Cache-Control: public, max-age=0, must-revalidate` for HTML pages.

---

## Content Quality (78/100)

### What Works
- Homepage extracted text: 3,509 chars — substantial narrative content
- Multi-section storytelling structure (Storia, Luogo, Filiera, Tavola, Voce)
- Dedicated vertical pages for each business unit
- FAQ page present for long-tail query capture
- Recensioni page for social proof and review schema

### Findings

#### [MEDIUM] Stale Sitemap lastmod Dates
Pages `/prodotti`, `/chi-siamo`, `/dove-siamo`, `/recensioni` show `lastmod: 2026-11-18` while others show `2026-11-26`. If content was updated more recently, search engines may not prioritize re-crawling.
**Fix:** Ensure sitemap generation uses actual file modification timestamps.

#### [LOW] Market Page Meta Description May Reference Old Categories
After renaming legumi→panificio and updating salumi/farine lists, verify the meta description in `src/routes/market.tsx` `head()` reflects current product categories.

---

## On-Page SEO (75/100)

### What Works
- Semantic URL structure matching business verticals
- Canonical URLs set via `getAbsoluteUrl()` helper
- Open Graph tags present on key pages
- Breadcrumb component available for navigation context
- Internal linking between journey chapters

### Findings

#### [HIGH] Verify /bottega → /market 301 Redirect
Route was renamed from `/bottega` to `/market`. A 301 redirect exists in `public/_redirects` but must be verified live to ensure proper status code and destination. Link equity loss risk if misconfigured.
**Fix:** Run `curl -I https://www.masseriadongianvito.it/bottega` and confirm `HTTP/2 301` with `location: /market`.

---

## Schema / Structured Data (70/100)

### What Works
- 3 valid JSON-LD blocks on homepage (no parse errors)
- `FoodEstablishment` + `Restaurant` + `LocalBusiness` multi-type coverage
- `GeoCoordinates` included for local SEO map pack eligibility
- `AggregateRating` schema present for star rating rich results

### Findings

#### [MEDIUM] Duplicate Organization+AggregateRating Blocks
Two identical JSON-LD blocks (blocks 2 and 3, both 490 bytes) with `Organization` + `AggregateRating` types. Duplicate structured data wastes crawl budget and may confuse parsers about which entity is canonical.
**Fix:** Consolidate into a single Organization block or differentiate with `@id` references.

#### [MEDIUM] Market Page Lacks Product Schema
E-commerce `/market` page with 35 products likely lacks per-product JSON-LD. Product schema enables price, availability, and rating rich results in search.
**Fix:** Add `Product` JSON-LD for top products or `ItemList` schema for the catalog page.

---

## Performance / CWV (60/100)

### What Works
- Cloudflare CDN with gzip compression
- Three.js dynamically imported (lazy-loaded) to avoid blocking homepage render
- Product images use `loading="lazy"` and `decoding="async"` attributes
- Shared WebGL renderer pattern reduces GPU context switches for hero pins

### Findings

#### [HIGH] No CrUX Field Data Available
Google API credentials not configured. Cannot assess real-world LCP, INP, CLS from Chrome UX Report. Performance score is lab-estimate only and may not reflect actual user experience.
**Fix:** Configure `GOOGLE_API_KEY` in `/home/giovannimacina/.config/claude-seo/google-api.json`.

#### [MEDIUM] Homepage HTML is 141KB Uncompressed
Raw HTML payload is 141,223 chars. Gzip compresses this well (~30-40KB estimated), but large initial HTML can delay first paint on slow 3G connections.
**Fix:** Consider streaming SSR or reducing inline content. Verify compressed size via `curl --compressed`.

---

## AI Search Readiness (82/100)

### What Works
- robots.txt explicitly allows `OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`, `ChatGPT-User`
- AI training crawlers (`GPTBot`, `ClaudeBot`, `Bytespider`, `CCBot`) correctly blocked
- Structured data provides machine-readable entity definitions
- Semantic URL structure aids AI citation and answer engine grounding

### Findings

#### [LOW] No llms.txt Discovery File
While `/.well-known/ai-plugin.json` exists, no `/llms.txt` at root for AI agent discovery. This is an emerging standard for AI-readable site summaries.
**Fix:** Add `/llms.txt` with site summary, key pages, and contact info.

---

## Images (70/100)

### What Works
- Product images use lazy loading and async decoding
- Explicit `width`/`height` attributes prevent CLS
- Placeholder images in place for all 5 product categories

### Findings

#### [MEDIUM] Placeholder Images Need Descriptive Alt Text Audit
When real photos replace placeholders, alt text must be descriptive for accessibility and image search ranking. Current component uses `product.nome` as alt text which is acceptable but could be enriched.

---

## Methodology Notes
- Audit conducted via crawl-based analysis only (no Google/Matomo/Moz API credentials configured)
- Homepage rendered in raw mode (non-SPA response detected)
- 6 key routes checked via HTTP HEAD requests
- robots.txt and sitemap.xml fetched and parsed directly
- Structured data validated via render_page.py JSON-LD extraction
- Security headers checked via curl -I on all key pages
- Score weights follow claude-seo 2.5.0 default distribution