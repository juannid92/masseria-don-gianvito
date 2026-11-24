# GEO — AI Search Readiness Audit

**Site:** https://www.masseriadongianvito.it
**Date:** 2026-11-19
**Business type:** Hybrid Farm + Restaurant + Butcher (Noci, Puglia, Italy)

## Summary

AI search readiness is **partially configured**. The site correctly blocks AI training crawlers while allowing AI search citability crawlers, but lacks key discovery files (llms.txt, ai-plugin.json, WebMCP) that would maximize visibility in AI-generated answers. Content citability is moderate — FAQ content exists but is not structured for snippet extraction, and brand entity signals are consistent across pages.

**Score: 55/100**

## Findings

### HIGH — No llms.txt discovery file
- **Severity:** High
- `/llms.txt` returns HTTP 404. This file is the emerging standard for AI systems to discover site structure, key pages, and citation-ready content summaries. Without it, AI crawlers must infer site structure from navigation alone.
- **Recommendation:** Create `/llms.txt` with site description, key page URLs, business entity summary, and links to FAQ/pricing/hours pages.

### HIGH — No .well-known/ai-plugin.json
- **Severity:** High
- `/.well-known/ai-plugin.json` returns HTTP 404. This file enables AI agent platforms to discover API endpoints and structured capabilities.
- **Recommendation:** Add ai-plugin.json describing the Bottega ordering capability, contact info, and available data endpoints.

### MEDIUM — AI training crawlers blocked, search crawlers allowed (correct)
- **Severity:** Medium (positive finding)
- robots.txt correctly blocks GPTBot, ClaudeBot, Bytespider, CCBot (training crawlers) while allowing OAI-SearchBot, Claude-SearchBot, PerplexityBot, ChatGPT-User (search/citability crawlers). This is the recommended configuration for businesses that want AI citation without training data harvesting.
- **Recommendation:** Maintain this configuration. Monitor for new AI crawler user-agents quarterly.

### MEDIUM — No FAQ content on homepage for AI snippet extraction
- **Severity:** Medium
- Homepage contains zero FAQ-related content blocks. FAQ pages exist elsewhere (/legali/) but are not linked from main navigation or structured with FAQPage schema on content-rich pages.
- **Recommendation:** Add FAQ sections to /agriturismo, /bottega, and /prodotti pages with FAQPage schema markup. Structure questions as H3/H4 headings followed by concise answers for optimal AI snippet extraction.

### MEDIUM — Brand entity consistency is good but not maximized
- **Severity:** Medium
- "Masseria Don Gianvito" appears consistently in title, OG tags, JSON-LD, aria-labels, and image alt text. However, no Organization schema links social profiles, and no sameAs references connect to external authority sources (TripAdvisor, Google Business Profile, etc.).
- **Recommendation:** Add sameAs array to Organization/Farm schema linking to GBP, social profiles, and review platforms.

### LOW — No Markdown versions of key pages
- **Severity:** Low
- All pages return HTML only. Markdown versions (.md) of key content pages would improve parseability for text-only AI agents.
- **Recommendation:** Consider generating static .md mirrors of /agriturismo, /bottega, /prodotti for AI consumption. Low priority given JSON-LD coverage.

### INFO — Semantic HTML structure is strong
- **Severity:** Info
- Homepage uses 8 `<nav>`, 2 `<main>`, 4 `<header>`, 2 `<footer>`, 20 `<article>`, 16 `<section>` elements. Clean semantic markup aids AI parsing.
- **Recommendation:** No action needed. Maintain current semantic structure.

### INFO — 50 aria-labels provide rich accessibility tree
- **Severity:** Info
- Extensive aria-label coverage (50 labels) provides AI agents with meaningful context about interactive elements, navigation landmarks, and content sections.
- **Recommendation:** No action needed.

## Recommendations Priority

| Priority | Action | Effort |
|----------|--------|--------|
| 1 | Create /llms.txt | Low |
| 2 | Add FAQ sections with FAQPage schema to key pages | Medium |
| 3 | Add sameAs to Organization schema | Low |
| 4 | Create /.well-known/ai-plugin.json | Medium |
| 5 | Generate .md mirrors of key pages | Low |