# Schema / Structured Data Audit — masseriadongianvito.it

## Summary

The site has **good foundational schema coverage** with JSON-LD present on all 13 crawled pages. The global `Farm + Restaurant + Butcher` entity is consistently applied site-wide, and page-specific schemas (Restaurant, LocalBusiness, Store, FAQPage, AboutPage, ContactPage, ItemList, BreadcrumbList) are correctly deployed on relevant pages. However, there are several validation issues, missing recommended properties, and significant opportunities for richer structured data that would improve AI citability and rich result eligibility.

**Overall Schema Score: 72/100**

---

## Current Implementation

### Global Schema (present on ALL pages)
- **@type**: `["Farm", "Restaurant", "Butcher"]`
- **name**: "Masseria Don Gianvito"
- **description**: Consistent across all pages
- **url**: `https://www.masseriadongianvito.it`
- **telephone**: `["tel:+393339395750", "tel:+393333870292"]`
- **address**: Full PostalAddress with streetAddress, locality, region, postalCode, country
- **geo**: GeoCoordinates (40.642739, 17.0426)
- **servesCuisine**: "Pugliese"
- **priceRange**: "$$"
- **additionalType**: `["Farm", "Butcher"]`

### Page-Specific Schemas

| Page | Schema Types | Notes |
|------|-------------|-------|
| `/` | Farm+Restaurant+Butcher (global only) | No page-specific schema |
| `/agriturismo` | Restaurant | Separate Restaurant entity with acceptsReservations |
| `/allevamento` | LocalBusiness + FarmAction | FarmAction is unusual for a business page |
| `/bottega` | Store + BreadcrumbList + OfferCatalog (25 products) | Richest schema on site |
| `/caseificio` | LocalBusiness + DairyStore (additionalType) | Good specialization |
| `/macelleria` | LocalBusiness + ButcherShop | Correct type pairing |
| `/prodotti` | ItemList (8 items) | Simple list without Product details |
| `/chi-siamo` | BreadcrumbList + AboutPage → Organization | foundingDate: "2002" |
| `/dove-siamo` | BreadcrumbList + ContactPage → LocalBusiness | hasMap included |
| `/contatti` | BreadcrumbList + ContactPage → LocalBusiness | openingHoursSpecification (5 days) |
| `/faq` | BreadcrumbList + FAQPage (8 Q&A pairs) | Well-structured |
| `/legali/cookie` | Global only | Acceptable |
| `/legali/privacy` | Global only | Acceptable |

---

## Validation Results

### Critical Issues

1. **`telephone` as array in global schema** — The global schema uses `"telephone": ["tel:+393339395750", "tel:+393333870292"]`. Schema.org expects `telephone` to be a single Text value or an array of Text values, but the `tel:` URI scheme should NOT be included in the value itself. Google Rich Results may fail to parse this.
   - **Fix**: Change to `"telephone": ["+393339395750", "+393333870292"]` (plain E.164 format without `tel:` prefix).

2. **`FarmAction` on /allevamento is semantically incorrect** — `FarmAction` is a CreativeWork subtype (a fictional narrative about farming), NOT a business activity. This misrepresents the page content to search engines and AI crawlers.
   - **Fix**: Replace `FarmAction` with `LocalBusiness` alone, or use `additionalType: "Farm"` if further specialization is needed.

3. **Inconsistent telephone format across schemas** — The global schema uses `tel:` prefixed arrays, while page-specific schemas (agriturismo, allevamento, caseificio, macelleria, contatti) use plain string format `"+393339395750"` or `"333 939 5750"`. This inconsistency confuses entity resolution.
   - **Fix**: Standardize all telephone values to E.164 format: `"+393339395750"`.

### High Issues

4. **Missing `image` property on global schema** — No `image` property exists on the primary Farm/Restaurant/Butcher entity. Google requires at least one image for LocalBusiness rich results.
   - **Fix**: Add `"image": "https://www.masseriadongianvito.it/images/og-image.png"` (or a better representative photo).

5. **Missing `openingHoursSpecification` on most pages** — Only `/contatti` has opening hours. The Restaurant schema on `/agriturismo` and the global schema lack this. For a restaurant/farm business, opening hours are critical for rich results and AI answers.
   - **Fix**: Add `openingHoursSpecification` to the global schema so it propagates everywhere.

6. **`/prodotti` ItemList lacks Product schema** — The ItemList contains 8 ListItem entries with only `name` properties. No `Product`, `Offer`, `price`, `image`, or `description` fields. Meanwhile, `/bottega` has full OfferCatalog with 25 products. The two product pages are inconsistent.
   - **Fix**: Either enrich `/prodotti` ItemList items with Product/Offer data, or consolidate into a single product listing page.

7. **No `Organization` schema on homepage** — The global schema uses `Farm + Restaurant + Butcher` but never declares an `Organization` entity with `logo`, `sameAs` (social profiles), or `founder`. The AboutPage has an Organization but only on `/chi-siamo`.
   - **Fix**: Add `Organization` to the homepage global schema with `logo`, `foundingDate`, and social links.

### Medium Issues

8. **BreadcrumbList missing on key pages** — `/agriturismo`, `/allevamento`, `/bottega` (has it), `/caseificio`, `/macelleria`, `/prodotti` lack BreadcrumbList. Only `/bottega`, `/chi-siamo`, `/dove-siamo`, `/contatti`, `/faq` have breadcrumbs.
   - **Fix**: Add BreadcrumbList to all main content pages.

9. **Store schema on /bottega uses formatted telephone** — `"telephone": "333 939 5750"` uses spaces instead of E.164 format. Inconsistent with other pages.
   - **Fix**: Standardize to `"+393339395750"`.

10. **FAQPage questions lack `url` property** — Each Question in the FAQPage should include a `url` pointing to its anchor or dedicated page for direct linking from SERPs.
    - **Fix**: Add `"url": "https://www.masseriadongianvito.it/faq#question-slug"` to each Question.

11. **No `Menu` schema on /agriturismo** — The agriturismo page describes a restaurant with cuisine but has no `Menu` or `hasMenu` property. The menu content exists in the page (La Carta component) but is not exposed as structured data.
    - **Fix**: Add `hasMenu` → `Menu` with `hasMenuItem` entries for each dish/category.

12. **`additionalType` redundancy** — The global schema already declares `@type: ["Farm", "Restaurant", "Butcher"]` AND `additionalType: ["Farm", "Butcher"]`. This is redundant since Farm and Butcher are already in @type.
    - **Fix**: Remove `additionalType` or use it only for types NOT already in @type (e.g., `"Agritourism"` or `"DairyStore"`).

### Low / Info

13. **No `AggregateRating` or `Review` schema anywhere** — The site has a `/recensioni` page but no Review or AggregateRating structured data. This misses star rating rich results.

14. **No `sameAs` social profile links** — No social media URLs are declared in any schema block.

15. **GeoCoordinates precision** — Latitude/longitude (40.642739, 17.0426) appear consistent across all schemas. ✓ Good.

16. **Address consistency** — Street address varies slightly: some schemas include "70015 Noci (BA)" in streetAddress, others only in postalCode/addressLocality. Minor inconsistency.
    - **Fix**: Standardize streetAddress to just the street portion: "SP237 ex SS377 per Mottola km 6,5, Zona C 76".

---

## Missing Opportunities

### High-Impact Additions

| Schema Type | Where to Add | Benefit |
|------------|-------------|---------|
| **Organization** | Homepage global schema | Entity disambiguation, logo in knowledge panels |
| **Menu + MenuItem** | /agriturismo | Menu rich results, AI meal recommendations |
| **AggregateRating** | Homepage or /agriturismo | Star ratings in SERPs |
| **Review** | /recensioni or embedded | Social proof in search results |
| **Event** | If seasonal events exist | Event rich results |
| **HowTo** | /caseificio or /allevamento | Step-by-step rich results for cheese/meat production |
| **VideoObject** | If video content exists | Video carousels in search |

### AI Citability Enhancements

| Enhancement | Impact |
|------------|--------|
| Add `speakable` schema to homepage and key pages | Enables voice assistant read-aloud |
| Add `citation` or `subjectOf` linking to press/travel guides | Boosts AI authority signals |
| Expand FAQPage with more long-tail questions | Increases AI answer surface area |
| Add `areaServed` to LocalBusiness schemas | Clarifies delivery/service geography for AI |
| Add `brand` to Product schemas in Bottega | Helps AI attribute products correctly |

---

## Recommendations (Prioritized)

### Phase 1: Critical Fixes (Week 1)
1. Fix `telephone` format globally: remove `tel:` prefix, use E.164
2. Replace `FarmAction` with correct type on /allevamento
3. Add `image` to global schema
4. Standardize address format across all schemas

### Phase 2: High-Impact (Weeks 2-3)
5. Add `openingHoursSpecification` to global schema
6. Add `Organization` with `logo` and `sameAs` to homepage
7. Add `Menu` schema to /agriturismo
8. Enrich `/prodotti` ItemList with Product/Offer data or consolidate with /bottega
9. Add BreadcrumbList to all main pages missing it

### Phase 3: Rich Results & AI Readiness (Month 2)
10. Add `AggregateRating` and `Review` schema
11. Add `speakable` schema
12. Expand FAQPage
13. Add `areaServed` and `brand` properties
14. Remove redundant `additionalType` values

---

*Generated by seo-schema agent · 2026-11-19*