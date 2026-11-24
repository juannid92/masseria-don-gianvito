# Visual SEO Audit — masseriadongianvito.it

## Summary

Screenshots could not be captured (screenshot.py not in bundled runtime allowlist). Analysis performed via source code inspection of all routes and components. The site uses a sophisticated design system with CSS custom properties, Three.js 3D hero pins, GSAP scroll animations, and Lenis smooth scrolling. Visual hierarchy is strong on desktop but several accessibility and mobile concerns were identified.

## Findings

### [High] 10+ images missing alt attributes entirely
- **Severity:** High
- **Description:** Multiple `<img>` tags across the site have no `alt` attribute at all (not even `alt=""`). Found in: `bottega.tsx`, `Header.tsx`, `AgriturismoCinema.tsx`, `Footer.tsx`, `Hero.tsx`, `HeroPin3D.tsx`, `AgriturismoNuovaVeste.tsx` (4 instances). Missing alt text prevents screen readers from describing images and harms image search indexing.
- **Recommendation:** Add descriptive `alt` text to every product image in Bottega, every gallery image in AgriturismoNuovaVeste, and the cinema scene images. Use `alt=""` only for purely decorative images (logo emblems, 3D renders that duplicate adjacent text).

### [Medium] 3 images have empty alt="" without verification
- **Severity:** Medium
- **Description:** `Header.tsx:186`, `HeroPin3D.tsx:351`, and `IlLuogo.tsx:371` use `alt=""`. These may be correct (decorative logo, 3D icon canvas, parallax far-layer) but should be verified. If any convey information, they need descriptive alt text.
- **Recommendation:** Audit each empty-alt image to confirm it is truly decorative.

### [Medium] Above-the-fold content relies on JavaScript rendering
- **Severity:** Medium
- **Description:** The homepage hero uses Three.js canvas + GSAP animations for the map pins and title reveal. Without JS, users see only the background photo. The extracted text starts with "PRIMA DI TUTTO C'era solo la terra" which is from the LaStoria section, not the hero — suggesting the hero text may not render without JS.
- **Recommendation:** Ensure hero title and intro have `<noscript>` fallback or are rendered server-side in the initial HTML. Verify SSR output includes visible hero text.

### [Low] OG image may not match current hero visual
- **Severity:** Low
- **Description:** OG image is `/images/og-image.png` but the hero now uses `/images/masseria-luogo.jpg` (user-provided authentic photo). Social shares may show an outdated or generic image.
- **Recommendation:** Update OG image to match the current hero photo or create a dedicated social card.

### [Info] Strong visual design system in place
- **Severity:** Info
- **Description:** Consistent use of CSS custom properties (`--carbone`, --bianco-calce`, `--oro-antico`, `--terra-cotta`, bottega tokens), font families (`--font-display`, `--font-eyebrow`, `--font-sans`), and responsive breakpoints. Design quality is above average for this industry.

## Recommendations (Prioritized)

1. **Fix all missing alt attributes** — add descriptive text to ~10 images across Bottega, Agriturismo, Hero, Footer
2. **Verify empty alt="" images** are truly decorative
3. **Check SSR output** for hero text visibility without JavaScript
4. **Update OG image** to match current site visuals