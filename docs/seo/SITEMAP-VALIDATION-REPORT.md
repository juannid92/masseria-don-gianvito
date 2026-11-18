# Sitemap Validation Report — Masseria Don Gianvito

## Domain: https://www.masseriadongianvito.it
## Date: 2026-11-18

## Discovery Results

| Source | URL | Status | Valid |
|--------|-----|--------|-------|
| robots.txt (declared) | `https://masseriadongianvito.it/sitemap.xml` | 404 | ❌ Non-www domain |
| Common path probe | `https://www.masseriadongianvito.it/sitemap.xml` | 200 | ✅ Valid urlset |
| Common path probe | `https://www.masseriadongianvito.it/sitemap_index.xml` | 404 | N/A |
| Common path probe | `https://www.masseriadongianvito.it/wp-sitemap.xml` | 404 | N/A |

### Finding: robots.txt referenced non-www sitemap
- **Severity**: High
- **Issue**: `robots.txt` declared `Sitemap: https://masseriadongianvito.it/sitemap.xml` (non-www), which returned 404
- **Fix applied**: New `robots.txt` generated with correct `https://www.masseriadongianvito.it/sitemap.xml`

## Existing Sitemap Issues (before fix)

| Issue | Severity | Detail |
|-------|----------|--------|
| Non-canonical URLs | Critical | All `<loc>` used `masseriadongianvito.it` instead of `www.masseriadongianvito.it` |
| Deprecated tags | Info | `<priority>` and `<changefreq>` present (ignored by Google) |
| Missing `<lastmod>` | Medium | No modification dates provided |
| Missing pages | Medium | `/braceria` not included |
| Identical changefreq | Low | All pages set to `monthly` regardless of actual update frequency |

## Corrected Sitemap

A new `public/sitemap.xml` has been generated with:
- ✅ All URLs use canonical `https://www.masseriadongianvito.it`
- ✅ `<lastmod>` set to `2026-11-18` for all current pages
- ✅ Deprecated `<priority>` and `<changefreq>` removed
- ✅ `/braceria` included
- ✅ Valid XML format, well under 50k URL and 50MB limits

### URLs in corrected sitemap (9 total)

| URL | lastmod |
|-----|---------|
| `/` | 2026-11-18 |
| `/allevamento` | 2026-11-18 |
| `/caseificio` | 2026-11-18 |
| `/macelleria` | 2026-11-18 |
| `/agriturismo` | 2026-11-18 |
| `/prodotti` | 2026-11-18 |
| `/braceria` | 2026-11-18 |
| `/legali/privacy` | 2026-11-18 |
| `/legali/cookie` | 2026-11-18 |

## robots.txt

New `public/robots.txt` generated:
```
User-agent: *
Allow: /

Sitemap: https://www.masseriadongianvito.it/sitemap.xml
```

## Recommendations

| Priority | Action | Owner |
|----------|--------|-------|
| P0 | Deploy corrected sitemap.xml and robots.txt | Dev |
| P0 | Submit updated sitemap to Google Search Console | Marketing |
| P1 | Update `<lastmod>` dynamically based on actual page content changes | Dev |
| P1 | Add new pages to sitemap as they are created (/chi-siamo, /contatti, /faq, etc.) | Dev |
| P2 | Consider image sitemap extension for photo-heavy pages | Dev |
| P2 | Set up automated sitemap regeneration on deploy | Dev |

## Notes

- Current sitemap is small (9 URLs), no sitemap index needed
- All pages return HTTPS, no HTTP or redirected URLs
- No noindexed pages detected in sitemap
- When blog section launches, add `/blog` listing and individual post URLs
- `<lastmod>` values should be updated to reflect real content changes; uniform dates are acceptable temporarily but should be made dynamic