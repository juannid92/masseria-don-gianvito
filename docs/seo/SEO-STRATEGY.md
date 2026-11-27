# Strategia SEO — Masseria Don Gianvito

> Ultimo aggiornamento: 2026-11-27
> Health Score audit: 72/100 (claude-seo 2.5.0)

## Business Profile

- **Tipo**: Hybrid Local Service (agriturismo + caseificio + macelleria + market online)
- **URL**: https://www.masseriadongianvito.it
- **Location**: SP237 ex SS377 per Mottola km 6,5, Zona C 76, 70015 Noci (BA)
- **Coordinate**: 40.642739, 17.042600
- **Servizi**: Allevamento, Caseificio, Macelleria, Agriturismo, Market con consegna a domicilio
- **Target**: Famiglie, coppie, turisti enogastronomici in Puglia/Murgia barese
- **Conversione primaria**: Prenotazione tavolo (WhatsApp / telefono) + Ordini Market
- **Orari**: Chiuso lun-mar; cena mer-sab; pranzo dom/festivi
- **Numero unico**: +39 333 387 0292 (chiamate + WhatsApp)

## Obiettivi SEO

| Priorità | Obiettivo | KPI Target 12 mesi |
|----------|-----------|-------------------|
| P0 | Visibilità locale "agriturismo Noci" e dintorni | Top 3 local pack |
| P1 | Traffico organico da ricerca enogastronomica Puglia | +300% vs baseline |
| P2 | Conversioni prenotazione da organico | 50+ prenotazioni/mese |
| P3 | Citazioni AI (ChatGPT, Perplexity) per agriturismo Murgia | Presenza in top 5 risposte |

## Architettura Contenuti (Stato Novembre 2026)

| Route | Tipo | Stato SEO | Note |
|-------|------|-----------|------|
| `/` | Homepage | ✅ Completa | JSON-LD LocalBusiness nel root layout |
| `/allevamento` | Filiera | ✅ Completa | Foto reali, schema BreadcrumbList |
| `/caseificio` | Filiera | ✅ Completa | Hero foto caciocavalli, schema BreadcrumbList |
| `/macelleria` | Filiera | ✅ Completa | 5 stazioni con foto reali |
| `/agriturismo` | Servizio | ✅ Completa | Schema Restaurant, menu strutturato |
| `/market` | E-commerce | ✅ Completa | Store + OfferCatalog schema, carrello WhatsApp |
| `/eventi` | Eventi/Menu | ✅ Completa | Menu schema, locandine interattive |
| `/prodotti` | Catalogo | ✅ Completa | Panoramica produzioni |
| `/chi-siamo` | About/E-E-A-T | ✅ Completa | Storia famiglia, CCIAA dal 2002 |
| `/dove-siamo` | Location | ✅ Completa | Mappa, indicazioni stradali |
| `/contatti` | Contatti | ✅ Completa | Form, orari, tutti i canali |
| `/recensioni` | Social proof | ✅ Completa | Testimonianze clienti |
| `/faq` | FAQ | ✅ Completa | Domande frequenti strutturate |
| `/legali/privacy` | Legal | ✅ Completa | GDPR compliant |
| `/legali/cookie` | Legal | ✅ Completa | Cookie policy |

### Redirect Attivi
- `/bottega` → `/market` (301 verificato live)
- `/braceria` → `/macelleria` (301)
- `/appuntamenti` → `/eventi` (301)

## Schema Markup Implementato

| Pagina | Schema Type | Stato |
|--------|-------------|-------|
| Root Layout | `LocalBusiness` + `AggregateRating` | ✅ Implementato |
| /agriturismo | `Restaurant` + `Menu`/`MenuSection` | ✅ Implementato |
| /market | `Store` + `OfferCatalog` + `Product[]` | ✅ Implementato |
| /eventi | `Menu` + `MenuSection` | ✅ Implementato |
| /faq | `FAQPage` | ⏳ Da implementare |
| /dove-siamo | `ContactPage` | ⏳ Da implementare |
| Tutte le journey | `BreadcrumbList` | ✅ Implementato |

## GEO / AI Visibility Strategy

### Completato
- ✅ `robots.txt` con segmentazione AI crawler (training bloccati, search citability permessi)
- ✅ `llms.txt` con informazioni chiave, orari, pagine principali
- ✅ `/.well-known/ai-plugin.json` per discovery agenti AI
- ✅ Schema markup completo su homepage e pagine core
- ✅ NAP consistency verificata (numero unico +39 333 387 0292)
- ✅ Foto originali di alta qualità su tutte le sezioni

### In Progress
- ⏳ Presenza su liste curate (Gambero Rosso, Slow Food, guide locali)
- ⏳ Monitoraggio citazioni AI (ChatGPT, Perplexity)
- ⏳ Review volume e quality building

## Technical Foundation

| Aspetto | Stato | Note |
|---------|-------|------|
| Hosting | ✅ Cloudflare Pages | Edge rendering, global CDN |
| SSR | ✅ TanStack Start | Server-side rendering |
| Mobile-first | ✅ Responsive | Breakpoint 899px |
| Security Headers | ✅ HSTS + CSP + X-Frame-Options | In `public/_headers` |
| Sitemap XML | ✅ 15 URL canonici | lastmod aggiornati al 2026-11-27 |
| robots.txt | ✅ RFC 9309 compliant | ASCII puro, no direttive non standard |
| Image optimization | ✅ WebP + lazy loading | Dimensioni esplicite width/height |
| Core Web Vitals | ⚠️ Da misurare con CrUX | API key Google necessaria |

## Gap Analysis Aggiornata

### Risolto (Novembre 2026)
- ✅ Pagine mancanti create: chi-siamo, dove-siamo, contatti, recensioni, faq
- ✅ Schema markup implementato su homepage e pagine core
- ✅ Sitemap XML generata e mantenuta
- ✅ robots.txt configurato correttamente
- ✅ Numero unico consolidato (+39 333 387 0292)
- ✅ Redirect /bottega → /market verificato
- ✅ JSON-LD duplicato rimosso dalla homepage
- ✅ Content-Signal rimosso (non RFC 9309)
- ✅ llms.txt e ai-plugin.json attivi

### Ancora Aperto
- ⏳ Blog/content hub non ancora creato
- ⏳ FAQ schema markup da implementare
- ⏳ Google API key per CrUX field data
- ⏳ Outreach per inclusioni su guide (Gambero Rosso, Slow Food)
- ⏳ Review widget integration (Google/TripAdvisor)
- ⏳ Certificazioni visibili nel sito

## Risk Assessment

| Rischio | Probabilità | Impatto | Mitigazione |
|---------|-------------|---------|-------------|
| Orari non aggiornati | Media | Alto | ORARI in masseria.ts come single source of truth |
| Foto pesanti senza ottimizzazione | Bassa | Medio | WebP + lazy loading già attivo |
| Recensioni negative non gestite | Media | Alto | Monitoraggio settimanale GSC + risposta tempestiva |
| Stagionalità del business | Alta | Medio | Eventi stagionali (/eventi) + Market sempre attivo |
| OTA dominano SERP transazionali | Alta | Alto | Differenziazione con filiera propria + contenuti unici |

## Prossimi Step Prioritari

1. **Implementare FAQ schema** su `/faq` (20 min)
2. **Configurare Google API key** per dati CrUX reali (15 min)
3. **Creare primo contenuto blog** su keyword long-tail (2h)
4. **Outreach guide locali** per inclusioni "best of" (ongoing)
5. **Monitorare AI citations** mensilmente (ChatGPT, Perplexity)