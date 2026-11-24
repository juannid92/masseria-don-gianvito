# Agentic — AI Agent Accessibility & Discovery Audit

**Site:** https://www.masseriadongianvito.it
**Date:** 2026-11-19
**Business type:** Hybrid Farm + Restaurant + Butcher (Noci, Puglia, Italy)

## Summary

The site has **strong accessibility foundations** for AI agents: 50 aria-labels, clean semantic HTML (8 nav, 2 main, 4 header, 2 footer, 20 article, 16 section elements), and zero reported a11y issues from the render engine. However, it lacks agent discovery files (WebMCP, ai-plugin.json) and Markdown content mirrors that would enable text-only AI agents to consume site data efficiently. The Lighthouse accessibility audit could not be run (no local Chrome/Lighthouse binary available), so findings are based on static HTML analysis only.

**Score: 68/100**

## Findings

### HIGH — No WebMCP or agent discovery protocol
- **Severity:** High
- `/.well-known/webmcp.json` returns HTTP 404. No MCP (Model Context Protocol) server manifest exists. AI agents using MCP cannot discover available tools, endpoints, or capabilities on this site.
- **Recommendation:** Create `/.well-known/webmcp.json` describing available actions: view menu, check opening hours, place Bottega order via WhatsApp, get contact info. Reference the Bottega product catalog as a structured data source.

### HIGH — No Markdown content mirrors for text-only agents
- **Severity:** High
- All pages (`/`, `/agriturismo`, `/allevamento`, `/bottega`, `/caseificio`, `/macelleria`, `/prodotti`) return HTML only. Text-only AI agents (CLI-based, low-bandwidth, or non-browser agents) cannot efficiently extract structured content without parsing full HTML+JS bundles.
- **Recommendation:** Generate static `.md` versions of key content pages, especially `/bottega` (product catalog with prices), `/agriturismo` (menu/hours), and `/prodotti`. Serve at same paths with `.md` extension or via content negotiation.

### MEDIUM — Strong semantic HTML structure (positive)
- **Severity:** Medium (positive finding)
- Homepage uses proper landmark elements: 8 `<nav>`, 2 `<main>`, 4 `<header>`, 2 `<footer>`, 20 `<article>`, 16 `<section>`. This provides AI agents with a well-structured accessibility tree for navigation and content extraction.
- **Recommendation:** Maintain current semantic structure. Ensure all new pages follow the same pattern.

### MEDIUM — 50 aria-labels provide rich context (positive)
- **Severity:** Medium (positive finding)
- Extensive aria-label coverage includes navigation landmarks ("Esplora la Masseria Don Gianvito"), chapter entries ("Entra nel capitolo Allevamento"), interactive elements ("Carica la mappa interattiva di Google Maps"), and content sections ("Il Manifesto", "La Storia", "Il Luogo"). This gives AI agents meaningful context about page structure and interactive affordances.
- **Recommendation:** No action needed. Continue adding aria-labels to new interactive elements.

### MEDIUM — 4 images with empty alt attributes
- **Severity:** Medium
- Out of 16 total `alt` attributes on the homepage, 4 are empty strings. These appear to be decorative/background images (hero parallax layers, logo emblems). Empty alt is correct for purely decorative images, but should be verified that none convey meaningful content.
- **Recommendation:** Audit the 4 empty-alt images to confirm they are truly decorative. If any convey information (e.g., product photos, location markers), add descriptive alt text.

### LOW — No form elements on homepage
- **Severity:** Low
- Zero `<input>` elements found on homepage. Contact/ordering flows use WhatsApp deep links and phone hrefs instead of traditional forms. This simplifies the accessibility tree but means AI agents cannot submit inquiries through standard form interfaces.
- **Recommendation:** Acceptable for this business model. Ensure WhatsApp/phone CTAs have clear aria-labels (already confirmed: 50 labels present).

### LOW — Only 1 ARIA role used (complementary)
- **Severity:** Low
- Only `role="complementary"` found in explicit role attributes. Other landmarks rely on native HTML5 semantics (`<nav>`, `<main>`, etc.) which is correct and preferred over redundant ARIA roles.
- **Recommendation:** No action needed. Native semantics are superior to explicit ARIA roles when equivalent.

### INFO — Zero a11y issues from render engine
- **Severity:** Info
- The Playwright-based render reported 0 accessibility violations. This indicates good baseline compliance with WCAG automated checks.
- **Recommendation:** Supplement with manual a11y testing (keyboard navigation, screen reader walkthrough) quarterly. Automated checks catch ~30% of real-world a11y issues.

### INFO — Structured data is agent-consumable
- **Severity:** Info
- JSON-LD with `@type=['Farm', 'Restaurant', 'Butcher']` provides AI agents with machine-readable business entity data. Combined with Store schema on /bottega (OfferCatalog with 25 products), agents can extract pricing, availability, and product descriptions programmatically.
- **Recommendation:** Ensure JSON-LD remains valid after content updates. Consider adding `sameAs` links to external authority sources for entity disambiguation.

## Recommendations Priority

| Priority | Action | Effort | Impact |
|----------|--------|--------|--------|
| 1 | Create /.well-known/webmcp.json | Medium | Enables MCP-compatible AI agents to discover site capabilities |
| 2 | Generate .md mirrors of /bottega, /agriturismo, /prodotti | Medium | Enables text-only agents to consume structured content |
| 3 | Audit 4 empty-alt images | Low | Ensures no meaningful content is hidden from agents |
| 4 | Add sameAs to JSON-LD Organization | Low | Improves entity resolution across AI systems |
| 5 | Manual a11y testing (keyboard + screen reader) | Medium | Catches issues automated tools miss |

## Skipped / Limitations

- **Lighthouse accessibility audit not run:** No local Chrome/Lighthouse binary available in this environment. Findings are based on static HTML analysis from Playwright render only.
- **No live agent testing performed:** Did not test actual AI agent interactions (e.g., Claude browsing, Perplexity citation). Findings are structural/predictive.
- **Risk:** Static HTML analysis may miss client-rendered content or dynamic a11y issues that only appear after JavaScript execution. The site uses TanStack Start with SSR, so most content should be in the initial HTML, but interactive components (Three.js hero, GSAP animations) were not tested for runtime a11y.