# Site Structure — Masseria Don Gianvito

## Dominio: https://www.masseriadongianvito.it

## URL Hierarchy Attuale

```
https://www.masseriadongianvito.it/
├── /                          ← Homepage
├── /allevamento               ← Filiera I: Allevamento
├── /caseificio                ← Filiera II: Caseificio
├── /macelleria                ← Filiera III: Macelleria
├── /agriturismo               ← Filiera IV: Agriturismo
├── /prodotti                  ← Catalogo prodotti
├── /braceria                  ← Sotto-servizio macelleria ⚠️
├── /legali/
│   ├── /privacy               ← Privacy Policy
│   └── /cookie                ← Cookie Policy
```

## URL Hierarchy Target (dopo Phase 1-2)

```
https://www.masseriadongianvito.it/
├── /                          ← Homepage (LocalBusiness schema)
├── /chi-siamo                 ← NEW: Storia, famiglia, E-E-A-T
├── /dove-siamo                ← NEW: Mappa, indicazioni, landmarks
├── /contatti                  ← NEW: Form, orari, tutti i canali
├── /faq                       ← NEW: FAQPage schema
├── /recensioni                ← NEW: Social proof, AggregateRating
├── /allevamento               ← Filiera I (LocalBusiness + FarmAction)
├── /caseificio                ← Filiera II (LocalBusiness + Product)
├── /macelleria                ← Filiera III (LocalBusiness + ButcherShop)
├── /agriturismo               ← Filiera IV (Restaurant + LocalBusiness)
├── /prodotti                  ← Catalogo (ItemList + Product[])
├── /blog                      ← NEW: Content hub listing
│   ├── /filiera-propria-autentica
│   ├── /formaggi-tipici-murgia
│   ├── /orecchiette-cime-rapa-ricetta
│   ├── /guida-enogastronomica-alberobello
│   ├── /pranzo-domenica-masseria
│   ├── /burrata-stagionalita
│   ├── /caseificio-artigianale-vs-industriale
│   ├── /carne-brace-segreti
│   ├── /eventi-enogastronomici-puglia
│   └── /degustazione-formaggi-masseria
├── /legali/
│   ├── /privacy
│   └── /cookie
├── /sitemap.xml               ← XML Sitemap
└── /robots.txt                ← Robots directives
```

## Internal Linking Strategy

### Homepage → Pagine Core
- Hero CTA → `/agriturismo` (prenota)
- Sezione Filiera → `/allevamento`, `/caseificio`, `/macelleria`, `/agriturismo`
- Sezione Storia → `/chi-siamo`
- Footer → `/contatti`, `/dove-siamo`, `/faq`, `/legali/privacy`, `/legali/cookie`

### Pagine Filiera → Cross-link
- Ogni pagina filiera linka le altre 3 nella sezione "Scopri le altre anime"
- Ogni pagina filiera linka `/prodotti` per i prodotti correlati
- `/agriturismo` linka `/chi-siamo` (storia della cucina)
- `/caseificio` e `/macelleria` linkano `/agriturismo` (dalla produzione alla tavola)

### Blog → Pagine Servizio
- Ogni blog post include almeno 2 link interni a pagine servizio rilevanti
- Sidebar/CTA blog → `/agriturismo` (prenota) o `/contatti`
- Listing page `/blog` organizzata per content pillar

### Breadcrumb Structure
```
Home > Agriturismo
Home > Caseificio > Prodotti
Home > Blog > Formaggi Tipici Murgia
Home > Chi Siamo
Home > Dove Siamo
Home > Contatti
```

## Schema Markup Map

| URL | Primary Schema | Secondary Schema | Key Properties |
|-----|---------------|-----------------|----------------|
| `/` | LocalBusiness | Organization | name, address, geo, telephone, openingHours, priceRange, areaServed, image |
| `/agriturismo` | Restaurant | LocalBusiness | servesCuisine, acceptsReservations, menu, priceRange |
| `/caseificio` | LocalBusiness | Product (per formaggio) | description, brand, category, productionDate |
| `/macelleria` | LocalBusiness | ButcherShop | description, areaServed, hasOfferCatalog |
| `/allevamento` | LocalBusiness | FarmAction | description, location, provider |
| `/prodotti` | ItemList | Product[] | itemListElement[], name, description, image |
| `/chi-siamo` | AboutPage | Organization | founder, foundingDate, description |
| `/dove-siamo` | ContactPage | LocalBusiness | geo, hasMap, address, publicAccess |
| `/contatti` | ContactPage | LocalBusiness | telephone, email, contactOption, hoursAvailable |
| `/faq` | FAQPage | — | mainEntity[] (Question + acceptedAnswer) |
| `/recensioni` | LocalBusiness | AggregateRating | aggregateRating (ratingValue, reviewCount) |
| `/blog/*` | Article | BreadcrumbList | author, datePublished, headline, image |

## Canonical & Redirect Rules

| Rule | From | To | Type |
|------|------|----|------|
| Canonical www | `masseriadongianvito.it/*` | `www.masseriadongianvito.it/*` | 301 redirect |
| Trailing slash | `/agriturismo/` | `/agriturismo` | 301 redirect |
| Braceria merge (se confermato) | `/braceria` | `/macelleria#braceria` | 301 redirect |
| Legal pages | `/privacy` | `/legali/privacy` | 301 redirect (se vecchi URL esistono) |

## Mobile Navigation Structure

```
Menu Mobile:
├── Home
├── Le Anime
│   ├── Allevamento
│   ├── Caseificio
│   ├── Macelleria
│   └── Agriturismo
├── Chi Siamo
├── Prodotti
├── Blog
├── Prenota (CTA primaria)
└── Contatti
```

## Quality Gates

| Gate | Threshold | Action |
|------|-----------|--------|
| Location pages | Max 5 (solo Noci + aree limitrofe) | Non creare pagine per ogni città |
| Blog thin content | Min 600 parole per post | Non pubblicare sotto soglia |
| Duplicate content | Max 20% overlap tra pagine | Verificare con tool prima di pubblicare |
| Orphan pages | 0 pagine senza inbound link interni | Audit mensile internal linking |
| Broken links | 0 broken links | Check automatizzato pre-deploy |

## Future Expansion (Phase 3+)

| Sezione | Priorità | Note |
|---------|----------|------|
| `/eventi` | P2 | Degustazioni, laboratori, serate tematiche |
| `/shop` | P3 | E-commerce prodotti (formaggi, salumi, olio) |
| `/esperienze` | P2 | Tour masseria, laboratorio pasta, mungitura |
| `/territorio` | P3 | Guida turistica Noci/Alberobello/Valle d'Itria |
| `/en` | P3 | Versione inglese per turisti internazionali |