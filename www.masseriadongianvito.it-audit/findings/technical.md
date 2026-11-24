# Technical SEO Audit — masseriadongianvito.it

**Date:** 2026-11-19
**URL:** https://www.masseriadongianvito.it
**Auditor:** seo-technical subagent

---

## Summary

The site is technically sound in most areas: it serves valid HTML over HTTPS, has a well-structured sitemap, proper robots.txt configuration, and correct canonical tags on nearly all pages. However, there are several **critical security header gaps**, a **missing redirect strategy** for domain variants, and one page missing its canonical tag. The site blocks AI training crawlers while allowing AI search citability crawlers — a deliberate and well-implemented geo/AI visibility strategy.

**Overall Technical Health: 72/100**

---

## Findings

### 1. [CRITICAL] Missing Security Headers

**Severity:** Critical
**Evidence:** HTTP response headers from `curl -sI https://www.masseriadongianvito.it/` return only:
```
HTTP/2 200
content-type: text/html; charset=utf-8
server: cloudflare
cf-ray: ...
alt-svc: h3=":443"; ma=86400
```

Missing headers:
- **Strict-Transport-Security (HSTS):** Not present. Without HSTS, users can be downgraded to HTTP via MITM attacks on first visit.
- **Content-Security-Policy (CSP):** Not present. No protection against XSS or inline script injection.
- **X-Frame-Options / X-Content-Type-Options:** Not present. Site could be embedded in iframes (clickjacking risk) and MIME-type sniffing is not prevented.
- **Referrer-Policy:** Not present. Full referrer URLs may leak to third parties.
- **Permissions-Policy:** Not present. Browser features (camera, microphone, geolocation) are not restricted.

**Recommendation:** Add the following headers via Cloudflare dashboard (Rules → Transform Rules → Modify Response Header) or server config:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```
For CSP, start with a report-only policy and tighten after monitoring. Given the site uses inline scripts (TanStack Start SSR), a nonce-based CSP will require framework integration.

---

### 2. [HIGH] No Redirect Strategy for Domain Variants

**Severity:** High
**Evidence:** All four domain variants return HTTP 200 with identical content and NO redirects:
- `http://masseriadongianvito.it/` → 200 (no redirect)
- `https://masseriadongianvito.it/` → 200 (no redirect)
- `http://www.masseriadongianvito.it/` → 200 (no redirect)
- `https://www.masseriadongianvito.it/` → 200 (canonical version)

This means search engines see 4 separate URLs serving identical content. While the canonical tag mitigates duplicate content penalties, the lack of 301 redirects wastes crawl budget and dilutes link equity.

**Recommendation:** Configure Cloudflare Page Rules or URL Redirects:
- `http://masseriadongianvito.it/*` → 301 → `https://www.masseriadongianvito.it/$1`
- `https://masseriadongianvito.it/*` → 301 → `https://www.masseriadongianvito.it/$1`
- `http://www.masseriadongianvito.it/*` → 301 → `https://www.masseriadongianvito.it/$1`

Only `https://www.masseriadongianvito.it` should serve content directly.

---

### 3. [MEDIUM] Missing Canonical Tag on /chi-siamo

**Severity:** Medium
**Evidence:** Canonical tag check across 13 key pages shows `/chi-siamo` returns NO canonical tag:
```
=== /chi-siamo ===
(no output)
```
All other pages (/allevamento, /caseificio, /macelleria, /agriturismo, /bottega, /prodotti, /dove-siamo, /contatti, /faq, /legali/privacy, /legali/cookie, /) have correct self-referencing canonicals.

**Recommendation:** Add `<link rel="canonical" href="https://www.masseriadongianvito.it/chi-siamo"/>` to the `/chi-siamo` route's head metadata. In TanStack Start, this is done via the `head()` function in the route file.

---

### 4. [LOW] Sitemap lastmod Dates Are Stale/Uniform

**Severity:** Low
**Evidence:** The sitemap at `/sitemap.xml` contains 18 URLs. Most entries have `lastmod: 2026-11-18`, with only `/bottega` showing `2026-11-19`. This suggests either:
- All pages were genuinely updated on the same date (unlikely for 18 diverse pages), OR
- The build system sets lastmod to the build date rather than actual content modification dates.

Stale/uniform lastmod dates reduce sitemap effectiveness as a freshness signal.

**Recommendation:** If using a static build, configure the sitemap generator to use git commit dates or file modification times per route. For TanStack Start, consider a build plugin that reads `git log -1 --format=%aI -- <route-file>` for each route.

---

### 5. [INFO] robots.txt Blocks AI Training Crawlers, Allows AI Search

**Severity:** Info (positive finding)
**Evidence:** robots.txt correctly implements a modern AI visibility strategy:
```
User-agent: GPTBot        → Disallow: /
User-agent: ClaudeBot     → Disallow: /
User-agent: Bytespider    → Disallow: /
User-agent: CCBot         → Disallow: /
User-agent: OAI-SearchBot → Allow: /
User-agent: Claude-SearchBot → Allow: /
User-agent: PerplexityBot → Allow: /
User-agent: ChatGPT-User  → Allow: /
User-agent: *             → Allow: /
Sitemap: https://www.masseriadongianvito.it/sitemap.xml
```

This blocks model training scrapers while allowing AI search citability crawlers — exactly the recommended approach for businesses that want to appear in AI-generated answers without having their content used for model training.

**Recommendation:** No action needed. Monitor for new AI crawler user-agents quarterly and update as needed. Consider adding `Google-Extended` (blocks Gemini training) if not already intended to allow it.

---

### 6. [INFO] Clean URL Structure

**Severity:** Info (positive finding)
**Evidence:** All URLs follow a clean, semantic, lowercase pattern:
- `/allevamento`, `/caseificio`, `/macelleria`, `/agriturismo` (core business verticals)
- `/bottega`, `/prodotti` (commerce)
- `/chi-siamo`, `/dove-siamo`, `/contatti`, `/faq` (informational)
- `/legali/privacy`, `/legali/cookie` (legal, properly nested)

No query parameters, no session IDs, no uppercase characters, no trailing slashes inconsistency. URL depth is flat (max 2 levels for legal pages).

**Recommendation:** No action needed. Maintain this convention for any future pages.

---

### 7. [INFO] JSON-LD Structured Data Present on Homepage

**Severity:** Info
**Evidence:** Homepage contains 1 JSON-LD block with multi-type schema:
```json
{ "@type": ["Farm", "Restaurant", "Butcher"], "name": "Masseria Don Gianvito" }
```

Multi-type schema is valid and appropriate for a business that operates across multiple verticals. Validation of the full schema payload should be done by the `seo-schema` subagent.

**Recommendation:** Delegate full schema validation to the `seo-schema` agent. Ensure all required properties (address, telephone, openingHours, priceRange, image) are present for each type.

---

### 8. [INFO] No hreflang Tags (Expected)

**Severity:** Info
**Evidence:** No hreflang tags found on any of the 13 pages checked. The site is Italian-language only, targeting a local/regional audience in Puglia, Italy.

**Recommendation:** No action needed unless international expansion is planned. If adding English or other languages in the future, implement hreflang at that time.

---

## Recommendations Priority Matrix

| Priority | Finding | Effort | Impact |
|----------|---------|--------|--------|
| 🔴 Critical | Add security headers (HSTS, CSP, X-Frame-Options) | Low (Cloudflare config) | High |
| 🟠 High | Implement 301 redirects for all domain variants | Low (Cloudflare rules) | High |
| 🟡 Medium | Add missing canonical on /chi-siamo | Very Low (one line) | Medium |
| 🟢 Low | Fix sitemap lastmod to use real content dates | Medium (build plugin) | Low |
| ℹ️ Info | AI crawler strategy, URL structure, schema, hreflang | N/A | Positive signals confirmed |

---

*Generated by seo-technical subagent as part of full SEO audit for masseriadongianvito.it*