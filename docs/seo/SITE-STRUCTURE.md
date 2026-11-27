# Site Structure — Masseria Don Gianvito

> Ultimo aggiornamento: 2026-11-27
> Totale URL canonici in sitemap: 15

## URL Hierarchy Attuale

```
/
├── /allevamento          # Filiera: allevamento bovino brado/semibrado
├── /caseificio           # Filiera: caseificio artigianale interno
├── /macelleria           # Filiera: macelleria con 5 stazioni
├── /agriturismo          # Servizio: ristorante cucina territoriale
├── /market               # E-commerce: catalogo prodotti + carrello WhatsApp
├── /eventi               # Eventi: menù festivi e pranzo domenicale
├── /prodotti             # Panoramica produzioni (link hub)
├── /chi-siamo            # About: storia famiglia, E-E-A-T, CCIAA dal 2002
├── /dove-siamo           # Location: mappa, indicazioni stradali, landmarks
├── /contatti             # Contatti: form, orari, tutti i canali
├── /recensioni           # Social proof: testimonianze clienti
├── /faq                  # FAQ: domande frequenti strutturate
└── /legali/
    ├── /privacy          # GDPR privacy policy
    └── /cookie           # Cookie policy
```

## Redirect Attivi (`public/_redirects`)

| From | To | Status | Note |
|------|----|--------|------|
| `/bottega` | `/market` | 301 | Rinominato Nov 2026, verificato live |
| `/braceria` | `/macelleria` | 301 | Consolidato per evitare cannibalizzazione |
| `/appuntamenti` | `/eventi` | 301 | Rinominato per chiarezza |

## Schema Markup per Pagina

| Route | Schema Type | Proprietà Chiave | Stato |
|-------|-------------|-----------------|-------|
| `/` (root layout) | `LocalBusiness` + `AggregateRating` | name, address, geo, telephone, openingHours, priceRange, servesCuisine, aggregateRating | ✅ |
| `/agriturismo` | `Restaurant` + `Menu`/`MenuSection` | servesCuisine, acceptsReservations, menu | ✅ |
| `/market` | `Store` + `OfferCatalog` + `Product[]` | name, description, image, price, availability | ✅ |
| `/eventi` | `Menu` + `MenuSection` | name, description, hasMenuSection | ✅ |
| `/faq` | `FAQPage` | mainEntity[] | ⏳ Da implementare |
| `/dove-siamo` | `ContactPage` | geo, hasMap, address | ✅ Implementato |
| Journey pages | `BreadcrumbList` | itemListElement[] | ✅ |

## Internal Linking Strategy

### Hub Pages → Spoke Pages
- **Homepage** → Tutte le 4 anime (Allevamento, Caseificio, Macelleria, Agriturismo) + Market + Eventi
- **/prodotti** → /market (acquisto), /caseificio (formaggi), /macelleria (carni)
- **/chi-siamo** → /allevamento, /caseificio, /macelleria (storia filiera)

### Cross-linking tra Filiera
- **/allevamento** ↔ /macelleria (bovini → carne)
- **/caseificio** ↔ /market (formaggi → acquisto)
- **/macelleria** ↔ /market (carni → acquisto)
- **/agriturismo** ↔ /eventi (ristorante → menù festivi)

### Blog → Core Pages (quando attivo)
- Ogni articolo blog deve linkare almeno 1 pagina core
- Anchor text descrittivo (non "clicca qui")
- Link contestuali nel corpo del testo, non solo footer/sidebar

## Sitemap Quality Gates

| Gate | Valore Attuale | Limite | Stato |
|------|---------------|--------|-------|
| URL totali in sitemap | 15 | < 500 | ✅ OK |
| URL con lastmod aggiornato | 15/15 (2026-11-27) | 100% | ✅ OK |
| URL duplicati | 0 | 0 | ✅ OK |
| URL bloccati da robots.txt | 0 | 0 | ✅ OK |
| URL con redirect nella sitemap | 0 | 0 | ✅ OK |

## Pagine Future Pianificate

| Route | Tipo | Priorità | Timeline |
|-------|------|----------|----------|
| `/blog` | Content hub | P1 | Q1 2027 |
| `/blog/*` | Articoli individuali | P1 | Q1 2027+ |
| `/certificazioni` | E-E-A-T / Trust | P2 | Q2 2027 |
| `/team` | E-E-A-T / About | P3 | Q3 2027 |

## Technical Notes

- **Canonical URLs**: Tutti gestiti via `getAbsoluteUrl()` helper in `src/config/site.ts`
- **OG/Twitter Cards**: Implementati su tutte le route tramite `head()` export
- **Mobile-first**: Design responsive con breakpoint 899px, touch-friendly
- **Performance**: Cloudflare Pages edge rendering, WebP images, lazy loading
- **Security Headers**: HSTS, CSP, X-Frame-Options, X-Content-Type-Options in `public/_headers`
- **Single Source of Truth**: Tutti i dati aziendali in `src/data/masseria.ts` (NAP, orari, coordinate)

## AI Discovery Files

| File | Path | Scopo | Stato |
|------|------|-------|-------|
| llms.txt | `/llms.txt` | AI agent discovery, site summary | ✅ Attivo |
| ai-plugin.json | `/.well-known/ai-plugin.json` | AI plugin metadata | ✅ Attivo |
| robots.txt | `/robots.txt` | Crawler access policy (RFC 9309) | ✅ Attivo |
| sitemap.xml | `/sitemap.xml` | Search engine indexing | ✅ Attivo |