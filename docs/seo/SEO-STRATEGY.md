# Strategia SEO — Masseria Don Gianvito

## Business Profile

- **Tipo**: Local service business (agriturismo + azienda agricola a filiera propria)
- **URL**: https://www.masseriadongianvito.it
- **Location**: SP237 ex SS377 per Mottola km 6,5, Zona C 76, 70015 Noci (BA)
- **Coordinate**: 40.642739, 17.042600
- **Servizi**: Allevamento, Caseificio, Macelleria, Agriturismo
- **Target**: Famiglie, coppie, turisti enogastronomici in Puglia/Murgia barese
- **Conversione primaria**: Prenotazione tavolo (WhatsApp / telefono)
- **Orari**: Chiuso lun-mar; cena mer-sab; pranzo dom/festivi

## Obiettivi SEO

| Priorità | Obiettivo | KPI Target 12 mesi |
|----------|-----------|-------------------|
| P0 | Visibilità locale "agriturismo Noci" e dintorni | Top 3 local pack |
| P1 | Traffico organico da ricerca enogastronomica Puglia | +300% vs baseline |
| P2 | Conversioni prenotazione da organico | 50+ prenotazioni/mese |
| P3 | Citazioni AI (ChatGPT, Perplexity) per agriturismo Murgia | Presenza in top 5 risposte |

## Architettura Contenuti Attuale

| Route | Tipo | Stato SEO |
|-------|------|-----------|
| `/` | Homepage | ✅ Core page |
| `/allevamento` | Servizio/Filiera | ✅ Core page |
| `/caseificio` | Servizio/Filiera | ✅ Core page |
| `/macelleria` | Servizio/Filiera | ✅ Core page |
| `/agriturismo` | Servizio/Filiera | ✅ Core page |
| `/prodotti` | Catalogo prodotti | ⚠️ Needs optimization |
| `/braceria` | Sotto-servizio | ⚠️ Duplicate risk vs macelleria |
| `/legali/privacy` | Legal | ✅ OK |
| `/legali/cookie` | Legal | ✅ OK |

## Gap Analysis

### Pagine Mancanti (High Priority)
1. **`/chi-siamo`** — Storia della famiglia, E-E-A-T, team
2. **`/dove-siamo`** — Location page con mappa, indicazioni stradali, landmarks
3. **`/contatti`** — Contact page dedicata con form, orari, tutti i canali
4. **`/recensioni`** — Testimonianze clienti, social proof
5. **`/faq`** — Domande frequenti (prenotazioni, allergeni, animali, parcheggio)
6. **`/blog`** — Content hub per long-tail keywords

### Contenuti Blog Prioritari
- Stagionalità dei prodotti della Murgia
- Ricette tradizionali pugliesi con ingredienti della masseria
- Guida agli eventi enogastronomici in zona Noci/Alberobello
- Come riconoscere un vero agriturismo a filiera propria
- Differenza tra caseificio artigianale e industriale

## Schema Markup Plan

| Pagina | Schema Type | Proprietà Chiave |
|--------|-------------|-----------------|
| Homepage | `LocalBusiness` + `Organization` | name, address, geo, telephone, openingHours, priceRange, areaServed |
| /agriturismo | `Restaurant` + `LocalBusiness` | servesCuisine, acceptsReservations, menu |
| /caseificio | `LocalBusiness` + `Product` (per formaggi) | description, brand, category |
| /macelleria | `LocalBusiness` + `ButcherShop` | description, areaServed |
| /allevamento | `LocalBusiness` + `FarmAction` | description, location |
| /prodotti | `ItemList` + `Product[]` | name, description, image, category |
| /dove-siamo | `ContactPage` + `LocalBusiness` | geo, hasMap, address |
| /blog/* | `Article` + `BreadcrumbList` | author, datePublished, headline |
| /faq | `FAQPage` | mainEntity[] |

## GEO / AI Visibility Strategy

1. **Presenza su liste curate**: Gambero Rosso, Slow Food, TripAdvisor "Best of", guide locali Puglia
2. **NAP consistency**: Verificare coerenza nome/indirizzo/telefono su Google, Facebook, Instagram, Apple Maps, Yelp
3. **Contenuto citabile**: Descrizioni servizi chiare e quotabili, prezzi indicativi, orari precisi
4. **Foto originali**: Foto reali di piatti, animali, caseificio, team (già presenti nel sito)
5. **FAQ strutturata**: Risposte dirette alle domande più comuni sugli agriturismi in Puglia
6. **LocalBusiness schema completo**: geo, openingHours, priceRange, areaServed, servesCuisine

## Technical Foundation

- **Hosting**: Cloudflare Pages (edge rendering, global CDN) ✅
- **SSR**: TanStack Start con server-side rendering ✅
- **Mobile-first**: Design responsive con breakpoint 899px ✅
- **Performance target**: LCP < 2.5s, CLS < 0.1, INP < 200ms
- **Image optimization**: Formato JPEG, lazy loading, dimensioni esplicite ✅
- **robots.txt**: Da creare/verificare
- **sitemap.xml**: Da generare (vedi SITE-STRUCTURE.md)

## Risk Assessment

| Rischio | Probabilità | Impatto | Mitigazione |
|---------|-------------|---------|-------------|
| Cannibalizzazione /braceria vs /macelleria | Alta | Medio | Consolidare o differenziare chiaramente |
| Thin content su /prodotti | Media | Alto | Aggiungere descrizioni uniche per prodotto |
| Orari non aggiornati | Media | Alto | Mantenere ORARI in masseria.ts come single source |
| Foto pesanti senza ottimizzazione | Bassa | Medio | Verificare compressione e formati moderni |
| Mancanza di recensioni strutturate | Alta | Alto | Implementare schema AggregateRating quando disponibile |