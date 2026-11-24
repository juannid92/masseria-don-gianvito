# Local SEO Audit — masseriadongianvito.it

## Summary

Masseria Don Gianvito is a hybrid brick-and-mortar business (Farm + Restaurant + Butcher) in Noci, Puglia, Italy. The site demonstrates strong local SEO fundamentals with consistent NAP data, multiple LocalBusiness schema blocks across pages, structured reviews with aggregateRating, Google Maps embeds, and opening hours. Several opportunities exist to strengthen local signals further.

## Findings

### [High] Homepage JSON-LD uses multi-type ['Farm', 'Restaurant', 'Butcher'] instead of LocalBusiness
- **Severity:** High
- **Description:** The root layout (`__root.tsx`) declares `@type: ["Farm", "Restaurant", "Butcher"]` but does NOT include `LocalBusiness`. Individual pages (caseificio, macelleria, allevamento, contatti, recensioni) correctly use `LocalBusiness` or subtypes. The homepage is the most important page for local search and should explicitly declare `LocalBusiness` as a type.
- **Recommendation:** Add `"LocalBusiness"` to the homepage JSON-LD @type array: `["LocalBusiness", "Farm", "Restaurant", "Butcher"]`. Ensure it includes `address`, `geo`, `telephone`, `openingHoursSpecification`, and `priceRange`.

### [Medium] Opening hours lack structured `openingHoursSpecification` on most pages
- **Severity:** Medium
- **Description:** Only `/contatti` includes `openingHoursSpecification` in its JSON-LD. The homepage, agriturismo, and other key pages omit this. Google uses structured opening hours for rich results and "open now" indicators. The ORARI data exists in `masseria.ts` but is described as "nessun orario numerico" — suggesting hours may be qualitative rather than specific.
- **Recommendation:** If specific hours exist, add `openingHoursSpecification` to the homepage and agriturismo JSON-LD. If hours are genuinely variable/seasonal, add a textual description and consider `openingHours` with a note about seasonal variation.

### [Medium] No dedicated Google Business Profile link or badge
- **Severity:** Medium
- **Description:** No visible link to the Google Business Profile (GBP) was found in the footer, header, or contact sections. While `maps` and `mapsEmbed` links point to Google Maps coordinates, there is no explicit GBP review link or "See us on Google" badge that would encourage review generation and signal GBP ownership.
- **Recommendation:** Add a GBP link in the footer and/or StickyContactBar. Consider adding a reviews widget or badge showing the Google rating.

### [Medium] Review schema only on /recensioni page, not on homepage
- **Severity:** Medium
- **Description:** `aggregateRating` (4.8 stars) and individual `Review` markup exist only in `/recensioni.tsx`. The homepage and other high-traffic pages don't surface review schema, missing opportunities for star ratings in SERPs.
- **Recommendation:** Add `aggregateRating` to the homepage and agriturismo JSON-LD blocks. Reference the same rating entity to maintain consistency.

### [Low] Two phone numbers without clear role differentiation
- **Severity:** Low
- **Description:** The site lists two phone numbers (333 939 5750 and 333 387 0292) in the footer. Neither has a label indicating which department/service they serve (e.g., "Prenotazioni agriturismo" vs "Ordini bottega"). This can confuse users and dilute NAP consistency signals.
- **Recommendation:** Label each phone number with its purpose. Use the primary number consistently in all JSON-LD `telephone` fields.

### [Low] Address format could be more structured
- **Severity:** Low
- **Description:** The address "SP237 ex SS377 per Mottola km 6,5, Zona C 76, 70015 Noci (BA)" is a rural road reference, not a standard street address. This is accurate for the location but may cause issues with some local citation platforms that expect `streetAddress` format.
- **Recommendation:** Keep the current format (it's correct for rural Puglia) but ensure `addressLocality`, `addressRegion`, `postalCode`, and `addressCountry` are always present in every LocalBusiness schema block. Verify consistency across all pages.

### [Info] Strong NAP consistency across all touchpoints
- **Severity:** Info
- **Description:** Name, address, phone numbers, WhatsApp, and Maps links are sourced from a single `MASSERIA` data object in `src/data/masseria.ts` and referenced consistently across Footer, StickyContactBar, Prenota component, DoveSiamo route, and all JSON-LD blocks. This centralized approach prevents NAP drift.

### [Info] Map embed present on key conversion pages
- **Severity:** Info
- **Description:** Google Maps iframe embed (`mapsEmbed`) appears on `/dove-siamo` and in the `Prenota` component. Coordinates (40.642739, 17.042600) are consistent across all geo schema blocks.

### [Info] Multiple LocalBusiness schema variants by page type
- **Severity:** Info
- **Description:** Each anima page has appropriately typed schema: Caseificio → `LocalBusiness`, Macelleria → `["LocalBusiness", "ButcherShop"]`, Allevamento → `["LocalBusiness", "FarmAction"]`, Agriturismo → `Restaurant`, Contatti → `LocalBusiness`, Recensioni → `LocalBusiness` with reviews. This granular typing is good practice.

## Recommendations (Prioritized)

1. **Add `LocalBusiness` to homepage JSON-LD** — highest impact for local pack eligibility
2. **Add `aggregateRating` to homepage and agriturismo schema** — enables star ratings in SERPs
3. **Add structured `openingHoursSpecification`** to homepage if specific hours exist
4. **Add Google Business Profile link** in footer and/or sticky bar
5. **Label phone numbers** with their purpose (prenotazioni vs ordini)
6. **Verify all LocalBusiness blocks** include complete address components