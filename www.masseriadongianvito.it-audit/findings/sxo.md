# SXO (Search Experience Optimization) Audit — masseriadongianvito.it

## Summary

The site delivers a strong editorial/narrative experience that aligns well with its brand identity as a historic Puglian masseria. Content quality is high across all pages, with evocative copy and consistent tone. However, several SXO gaps exist: the Bottega page has 25 H2 product names creating a flat hierarchy that hurts both SEO and scannability; trust signals are limited (no reviews, no certifications displayed, no team/staff photos); conversion CTAs are present but inconsistently placed; and the user journey from discovery to booking/ordering has friction points, particularly on mobile where the sticky contact bar competes with content. The site serves tourists and food enthusiasts well but underserves locals seeking quick info and event planners looking for venue details.

**Overall SXO Score: 68/100**

---

## User Journey Analysis

### Discovery → Engagement → Conversion Flow

| Stage | Strengths | Gaps |
|-------|-----------|------|
| **Discovery** | Strong H1s with emotional hooks ("Una masseria. Quattro attività.", "Prima di tutto, la terra."); rich meta descriptions with geo qualifiers | Homepage H1 lacks explicit geo qualifier "Noci" in visible text (only in title tag) |
| **Engagement** | Narrative storytelling across all anime pages; immersive scroll-driven animations; consistent editorial voice | No intermediate "quick facts" or summary cards for users who don't want to scroll through full narratives |
| **Conversion** | WhatsApp and phone CTAs present on every page via sticky bar; Bottega has inline cart + WhatsApp ordering | No online booking form for agriturismo; no calendar/availability check; CTA placement varies significantly between pages |

### Navigation Clarity
- Header includes links to all 4 anime + Bottega + Prodotti ✓
- Footer mirrors header navigation ✓
- Breadcrumbs present on inner pages ✓
- **Gap**: No "Prenota" or "Ordina" button in the main header — users must scroll to find conversion CTAs or use the sticky bar

---

## Page-Type Alignment

| Page | Expected Intent | Actual Content | Alignment |
|------|----------------|----------------|-----------|
| `/` | Informational + Navigational | Brand story, 4 anime overview, history | ✅ Strong |
| `/agriturismo` | Informational + Transactional (booking) | Narrative evening experience, menu hints, history | ⚠️ Partial — rich story but weak booking signal above fold |
| `/allevamento` | Informational | Farming practices, animal welfare, seasonal work | ✅ Strong |
| `/caseificio` | Informational | Cheese-making process, daily production | ✅ Strong |
| `/macelleria` | Informational + Transactional (butcher shop) | Filiera explanation, counter description | ⚠️ Partial — no prices, no product list, no "visit us" hours prominently placed |
| `/bottega` | Transactional (e-commerce/ordering) | Product catalog with cart, WhatsApp ordering | ✅ Strong intent match |
| `/prodotti` | Informational + Transactional | Product categories, caseificio focus, visit info | ⚠️ Overlaps with /bottega — potential cannibalization |

### Critical Finding: /prodotti vs /bottega Cannibalization
Both pages serve similar transactional intent. `/prodotti` focuses on caseificio products with a visit CTA, while `/bottega` is the full e-commerce catalog. Users searching "prodotti masseria don gianvito" or "formaggi noci" may land on either page with unclear differentiation. Recommendation: clarify distinct purposes or consolidate.

---

## Persona Coverage

| Persona | Served? | Evidence | Gap |
|---------|---------|----------|-----|
| **Tourists / Visitors** | ✅ Yes | Rich storytelling, history, location details, agriturismo experience | No embedded map on most pages; directions only in footer |
| **Food Enthusiasts** | ✅ Yes | Detailed production processes, filiera narrative, product descriptions | No recipes, pairing suggestions, or seasonal highlights |
| **Locals (repeat customers)** | ⚠️ Partial | Bottega ordering, phone/WhatsApp CTAs | No loyalty program, no seasonal newsletter signup, no "what's new this week" |
| **Event Planners** | ❌ Weak | Agriturismo mentioned as venue | No capacity info, no event packages, no gallery of past events, no dedicated contact for events |
| **Press / Media** | ❌ Missing | No press kit, no media contacts, no downloadable assets | Brand story is strong but not packaged for media use |

---

## Conversion Friction Points

### 1. No Online Booking for Agriturismo (High)
The agriturismo page tells a beautiful story but offers no reservation form, calendar, or availability checker. Users must call or WhatsApp — high friction for international tourists or users browsing outside business hours.

### 2. Sticky Contact Bar Competes with Content on Mobile (Medium)
The 3-button sticky bar (WhatsApp + Chiama + Prenota) occupies significant viewport space on small screens (<375px), potentially obscuring bottom-of-page content including the disclaimer and footer links.

### 3. Bottega Cart Requires WhatsApp Confirmation (Medium)
Adding products to cart doesn't guarantee availability. Users must still confirm via WhatsApp, adding a mandatory extra step. This is honest (prices are indicative) but creates friction vs. true e-commerce expectations.

### 4. Macelleria Has No Product List or Prices (Medium)
Unlike Bottega (which lists all products with prices), the macelleria page describes the experience but doesn't show available cuts or price ranges. Users interested in buying meat must visit physically or ask via WhatsApp without any reference point.

### 5. No Newsletter or Email Capture (Low)
No way for engaged visitors to stay connected beyond social media or repeat visits. A seasonal newsletter ("cosa c'è questa settimana in masseria") would serve locals and repeat tourists.

---

## Trust Signals Assessment

| Signal Type | Present? | Details |
|-------------|----------|---------|
| Reviews / Testimonials | ❌ No | No review section, no AggregateRating schema, no Google Reviews embed |
| Certifications (Bio, DOP, IGP) | ⚠️ Mentioned in text | Referenced narratively but no visual badges or certification logos displayed |
| Team / Staff Photos | ⚠️ Partial | Some people visible in lifestyle photos but no named team members or "chi siamo" with faces |
| History / Years Active | ✅ Yes | "Dal Cinquecento", "dal 2002 CCIAA" consistently referenced |
| Awards / Press | ⚠️ Minimal | Brief mentions but no dedicated press/awards section |
| Real Place Photos | ✅ Yes | Authentic masseria photos throughout (not stock) |
| Transparent Pricing | ⚠️ Partial | Bottega shows indicative prices with disclaimer; other pages have no pricing |

### Critical Gap: No Social Proof
For a restaurant/agriturismo, the absence of reviews is the single biggest trust deficit. Even 3-5 curated testimonials with names and dates would significantly improve conversion confidence.

---

## Above-the-Fold Content Relevance

| Page | Above-Fold Content | Matches Search Intent? |
|------|--------------------|-----------------------|
| `/` | Hero with aerial photo, "Una masseria. Quattro attività." | ✅ Clear value proposition |
| `/agriturismo` | "La sera comincia dalla campagna." + atmospheric hero | ⚠️ Emotional but doesn't immediately signal "book a table" |
| `/bottega` | "La Bottega della Masseria" + category filters | ✅ Clear e-commerce entry |
| `/prodotti` | "I Prodotti della Masseria" | ⚠️ Generic — could be confused with /bottega |

---

## Recommendations (Prioritized)

### Critical (Fix Immediately)
1. **Add review/testimonial section** to at least /agriturismo and homepage. Even 3-5 curated quotes with names improve trust dramatically. Add AggregateRating schema when available.
2. **Clarify /prodotti vs /bottega distinction** — either merge them or give each a clearly different purpose (e.g., /prodotti = educational catalog, /bottega = ordering).

### High (Fix Within 1 Week)
3. **Add "Prenota" button to main header navigation** — don't rely solely on sticky bar for conversion.
4. **Add opening hours prominently** to /macelleria and /agriturismo above the fold.
5. **Fix Bottega H2 hierarchy** — group products under category H2s instead of making each product name an H2.

### Medium (Fix Within 1 Month)
6. **Add simple booking/contact form** to /agriturismo alongside WhatsApp/phone options.
7. **Add certification badges** visually (not just in narrative text) to build trust.
8. **Create event/venue section** or at minimum add capacity and event inquiry contact to /agriturismo.
9. **Add newsletter signup** in footer for seasonal updates.

### Low (Backlog)
10. **Add recipe/pairing content** to strengthen food enthusiast persona.
11. **Create press kit page** with downloadable photos and brand story for media.
12. **Optimize sticky bar for <375px screens** — consider icon-only mode or collapsible design.

---

*Audit date: 2026-11-19*
*Tool: Manual page analysis (curl + regex extraction)*
*Limitation: Analysis based on SSR HTML; client-rendered content (React hydration) may differ from what was measured.*