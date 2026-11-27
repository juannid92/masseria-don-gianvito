# SEO Action Plan — masseriadongianvito.it
_Generated: 2026-11-27 · Health Score: 72/100_

## Phase 1: Critical Fixes (Week 1)

| # | Action | Effort | Impact | File/Location |
|---|--------|--------|--------|---------------|
| 1 | Add HSTS header (`Strict-Transport-Security: max-age=31536000; includeSubDomains`) | 5 min | HIGH | `public/_headers` |
| 2 | Add X-Frame-Options + X-Content-Type-Options headers | 2 min | MEDIUM | `public/_headers` |
| 3 | Verify `/bottega → /market` 301 redirect live | 2 min | HIGH | `curl -I https://www.masseriadongianvito.it/bottega` |
| 4 | Deduplicate Organization+AggregateRating JSON-LD on homepage | 10 min | MEDIUM | `src/routes/index.tsx` or shared layout |
| 5 | Configure Google API key for CrUX field data | 15 min | HIGH | `~/.config/claude-seo/google-api.json` |

### Implementation: Security Headers
Create or update `public/_headers`:
```
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

---

## Phase 2: High-Impact Improvements (Weeks 2-3)

| # | Action | Effort | Impact | File/Location |
|---|--------|--------|--------|---------------|
| 6 | Add Product or ItemList schema to `/market` page | 30 min | HIGH | `src/routes/market.tsx` head() |
| 7 | Update sitemap lastmod dates to actual deploy timestamps | 5 min | MEDIUM | Sitemap generation config |
| 8 | Add Cache-Control headers for HTML pages | 5 min | LOW | `public/_headers` |
| 9 | Audit market.tsx meta description for current categories | 5 min | LOW | `src/routes/market.tsx:16-22` |
| 10 | Measure compressed HTML size and optimize if >50KB gzip | 15 min | MEDIUM | `curl --compressed -o /dev/null -w '%{size_download}'` |

### Implementation: Market Page Schema
Add `ItemList` JSON-LD to market.tsx head():
```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Prodotti Tipici Masseria Don Gianvito",
  "numberOfItems": 35,
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "...", "offers": { "@type": "Offer", "price": "...", "priceCurrency": "EUR" } }
  ]
}
```

---

## Phase 3: Content & Authority (Month 2)

| # | Action | Effort | Impact | File/Location |
|---|--------|--------|--------|---------------|
| 11 | Add `/llms.txt` for AI agent discovery | 15 min | MEDIUM | `public/llms.txt` |
| 12 | Ensure all product images have descriptive alt text | 20 min | MEDIUM | `src/data/market.ts` + component |
| 13 | Add FAQ schema markup to `/faq` page | 20 min | MEDIUM | `src/routes/faq.tsx` |
| 14 | Build internal links between journey chapters and market products | 15 min | MEDIUM | Journey chapter components |
| 15 | Add breadcrumb schema to all vertical pages | 15 min | LOW | Shared Breadcrumb component |

---

## Phase 4: Monitoring & Iteration (Ongoing)

| # | Action | Frequency | Tool |
|---|--------|-----------|------|
| 16 | Monitor CrUX field data (LCP, INP, CLS) | Monthly | Google CrUX API |
| 17 | Track `/market` organic traffic post-rename | Weekly | GA4 / Matomo |
| 18 | Review AI crawler access logs | Monthly | Cloudflare analytics |
| 19 | Re-run full SEO audit | Quarterly | `/claude-seo:seo-audit` |
| 20 | Check Google Search Console for indexing issues | Weekly | GSC |

---

## Priority Legend
- **Critical**: Blocks indexing or causes penalties — fix immediately
- **High**: Significantly impacts rankings — fix within 1 week
- **Medium**: Optimization opportunity — fix within 1 month
- **Low**: Nice to have — backlog

## Estimated Total Effort
- Phase 1: ~35 minutes
- Phase 2: ~1 hour
- Phase 3: ~1.5 hours
- Phase 4: Ongoing (~30 min/month)
- **Total one-time: ~3 hours**