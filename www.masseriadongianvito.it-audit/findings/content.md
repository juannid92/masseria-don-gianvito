# SEO Content Audit — masseriadongianvito.it

## Summary

The site covers 7 main content pages with word counts ranging from 472 (Caseificio) to 1,037 (Homepage). All pages have unique titles, meta descriptions, and proper H1 tags. Content is editorially strong with a consistent narrative voice tied to the farm-to-table story. E-E-A-T signals are present but could be strengthened with more specific factual claims, author attribution, and structured data that AI systems can cite directly. No keyword stuffing detected. Heading hierarchy has structural issues on several pages.

---

## Findings

### 1. [Medium] Homepage H1 lacks primary keyword "Noci" or geographic qualifier
- **Page:** `/`
- **Current H1:** "Una masseria. Quattro attività."
- **Issue:** The H1 is evocative but does not include the location "Noci" or "Puglia/Murgia" which are critical for local SEO. The title tag includes "a Noci" but the H1 does not reinforce this.
- **Recommendation:** Consider revising H1 to include geographic context, e.g., "Una masseria a Noci. Quattro attività." or add a visible subtitle with location near the H1.

### 2. [Medium] Multiple pages have word counts below 500 — borderline thin content
- **Pages affected:** Caseificio (472 words), Prodotti (483 words), Allevamento (514 words)
- **Issue:** While these pages are rich in narrative, search engines may consider them thin for competitive agricultural/restaurant queries. Each page covers a distinct business vertical that deserves depth.
- **Recommendation:** Add 150–300 words of factual content per page: specific breeds raised, hectares cultivated, production volumes, certifications, seasonal calendars, or FAQ sections relevant to each vertical.

### 3. [High] Bottega page uses product names as H2 — no semantic grouping
- **Page:** `/bottega`
- **Current structure:** 25 individual product names as H2 headings (Bistecca di costata, Filetto di bovino, Mozzarella fior di latte, etc.)
- **Issue:** This creates a flat heading hierarchy with no category-level H2 groupings. Search engines cannot understand the product taxonomy. Screen readers face a wall of 25 sequential H2s with no nesting.
- **Recommendation:** Restructure headings: use H2 for categories ("Carne", "Formaggi e Latticini", "Salumi", "Farine", "Legumi") and H3 for individual products. This improves both SEO semantics and accessibility.

### 4. [Medium] Missing E-E-A-T experience signals across all pages
- **All pages**
- **Issue:** Content describes processes ("il latte lavorato ogni mattina", "animali cresciuti negli stessi campi") but lacks first-person experience markers, staff names, years of operation per activity, or specific anecdotes that demonstrate direct experience. Google's E-E-A-T guidelines reward demonstrated personal experience.
- **Recommendation:** Add brief team/staff mentions, years active per vertical, or first-person narrative snippets. Example: "Dal 2005, Giovanni cura personalmente la frollatura di ogni taglio..." or "La nostra famiglia alleva bovini Pezzata Rossa da tre generazioni."

### 5. [Low] Meta descriptions are good but lack calls-to-action on some pages
- **Pages affected:** Allevamento, Caseificio, Macelleria
- **Issue:** These meta descriptions are descriptive but don't include action-oriented language (e.g., "Prenota una visita", "Scopri i tagli disponibili", "Ordina per consegna a domicilio"). CTR from SERPs benefits from actionable meta descriptions.
- **Recommendation:** Add a soft CTA to each meta description while keeping it under 155 characters.

### 6. [Info] Strong narrative voice supports brand differentiation
- **All pages**
- **Observation:** The editorial tone is distinctive and consistent — poetic, grounded, anti-marketing. This is a strength for brand recall and user engagement. The "dalla terra alla tavola" thread runs through every page coherently.
- **No action needed.** Preserve this voice in any content additions.

### 7. [Medium] AI citation readiness is weak — few structured factual claims
- **All pages**
- **Issue:** Content is narrative-heavy but lacks discrete, citable facts that AI systems (ChatGPT, Perplexity, Gemini) can extract and attribute. Examples of missing citable claims: exact founding year, number of hectares, animal breeds by name, cheese aging durations, specific product origins.
- **Recommendation:** Embed 3–5 concrete, verifiable facts per page in declarative sentences. Example: "Il caciocavallo stagiona minimo 90 giorni nelle grotte naturali della masseria" is more citable than "Ogni formaggio ha il suo tempo." Also ensure JSON-LD schemas (handled by schema audit) mirror these facts.

### 8. [Low] OG image is generic on most pages
- **Pages affected:** /, /allevamento, /caseificio, /macelleria, /bottega
- **Issue:** Five of seven pages share the same `og-image.png`. Social sharing and AI crawlers see identical previews regardless of page topic. Only /agriturismo and /prodotti have unique OG images.
- **Recommendation:** Create unique OG images per vertical page showing representative imagery (cows for allevamento, cheese wheels for caseificio, meat counter for macelleria, product grid for bottega).

### 9. [Info] No keyword stuffing detected
- **All pages**
- **Observation:** Keyword density for target terms (masseria, Noci, allevamento, caseificio, macelleria, agriturismo) is natural and proportional. No over-optimization risk.

### 10. [Medium] Heading hierarchy skips levels on some pages
- **Pages affected:** Homepage (H1 → H2 → H3, OK), Agriturismo (H1 → H2 → H3, OK), Macelleria (H1 → H2 → H3, OK), but Prodotti jumps H1 → H2 → H3 with inconsistent nesting
- **Issue:** On /prodotti, H3 items (Mozzarella e Nodini, Burrata e Treccia, etc.) appear to be siblings rather than children of their parent H2 category. Verify the DOM nesting matches the visual hierarchy.
- **Recommendation:** Audit the rendered DOM to confirm H3s are properly nested under their parent H2 in the HTML tree, not just visually grouped.

---

## Recommendations Priority Matrix

| Priority | Finding | Effort | Impact |
|----------|---------|--------|--------|
| High | #3 Bottega H2 restructuring | Low | High |
| Medium | #1 Homepage H1 geographic qualifier | Low | Medium |
| Medium | #2 Thin content expansion | Medium | High |
| Medium | #4 E-E-A-T experience signals | Medium | High |
| Medium | #7 AI citation readiness | Medium | High |
| Medium | #8 Unique OG images | Low | Medium |
| Medium | #10 Heading nesting verification | Low | Medium |
| Low | #5 Meta description CTAs | Low | Low |
| Low | #10 Heading nesting audit | Low | Low |

---

*Audit date: 2026-11-19*
*Tool: seo-content subagent (inline analysis)*