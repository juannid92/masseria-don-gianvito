# Implementation Roadmap — Masseria Don Gianvito

> Ultimo aggiornamento: 2026-11-27
> Health Score audit: 72/100 → Target: 85+ entro 6 mesi

## Phase 1: Foundation ✅ COMPLETATA (Novembre 2026)

| # | Azione | Stato | Note |
|---|--------|-------|------|
| 1 | Header di sicurezza (HSTS, CSP, X-Frame-Options) | ✅ Fatto | `public/_headers` |
| 2 | Redirect 301 /bottega → /market verificato | ✅ Fatto | Live confermato |
| 3 | JSON-LD duplicato rimosso da homepage | ✅ Fatto | AggregateRating nel root layout |
| 4 | Sitemap XML con lastmod aggiornati | ✅ Fatto | 15 URL, 2026-11-27 |
| 5 | robots.txt RFC 9309 compliant (ASCII puro) | ✅ Fatto | No Content-Signal |
| 6 | llms.txt e ai-plugin.json attivi | ✅ Fatto | AI discovery pronto |
| 7 | Pagine core create (chi-siamo, dove-siamo, contatti, faq, recensioni) | ✅ Fatto | Tutte live |
| 8 | Schema markup su homepage e pagine core | ✅ Fatto | LocalBusiness, Store, Restaurant |
| 9 | Numero unico consolidato (+39 333 387 0292) | ✅ Fatto | In masseria.ts |
| 10 | Market page con OfferCatalog schema | ✅ Fatto | Carrello WhatsApp attivo |

**Risultato Phase 1**: Sito tecnicamente solido, tutti i fondamentali SEO implementati.

---

## Phase 2: Expansion (Dicembre 2026 - Febbraio 2027)

| # | Azione | Effort | Impatto | Priorità |
|---|--------|--------|---------|----------|
| 11 | Implementare FAQ schema su /faq | 20 min | MEDIUM | P1 |
| 12 | Configurare Google API key per CrUX field data | 15 min | HIGH | P1 |
| 13 | Integrare review widget (Google/TripAdvisor) | 1h | HIGH | P1 |
| 14 | Aggiungere certificazioni visibili nel sito | 2h | MEDIUM | P2 |
| 15 | Creare primo articolo blog ("agriturismo filiera corta") | 4h | HIGH | P1 |
| 16 | Outreach guide locali (Gambero Rosso, Slow Food) | Ongoing | HIGH | P1 |
| 17 | Monitorare AI citations mensilmente | 30 min/mese | MEDIUM | P2 |
| 18 | Verificare NAP consistency su directory esterne | 2h | MEDIUM | P2 |

### KPI Target Phase 2
- Indexed pages: 15 → 18 (blog launch)
- Keyword rankings top 20: 5 nuove keyword
- Review count: +10 recensioni verificate
- AI citations: Presenza in almeno 1 risposta ChatGPT/Perplexity

---

## Phase 3: Scale (Marzo - Agosto 2027)

| # | Azione | Effort | Impatto | Priorità |
|---|--------|--------|---------|----------|
| 19 | Blog: 2 articoli/mese su long-tail keywords | 8h/mese | HIGH | P1 |
| 20 | Link building da contenuti blog | Ongoing | HIGH | P1 |
| 21 | Video contenuti (dietro le quinte caseificio/macelleria) | 4h/video | MEDIUM | P2 |
| 22 | Ottimizzazione CWV basata su dati CrUX reali | 4h | HIGH | P1 |
| 23 | Internal linking strutturato tra blog e pagine core | 2h | MEDIUM | P2 |
| 24 | Schema Article + BreadcrumbList su ogni post blog | 30 min/post | MEDIUM | P2 |
| 25 | Social sharing automatizzato nuovi contenuti | 1h setup | LOW | P3 |

### KPI Target Phase 3
- Organic traffic: +150% vs baseline
- Keyword rankings top 20: 25 keyword
- Backlink acquisiti: 15+
- Blog posts pubblicati: 12
- Conversioni organiche: 30+ prenotazioni/mese

---

## Phase 4: Authority (Settembre 2027 - Novembre 2027)

| # | Azione | Effort | Impatto | Priorità |
|---|--------|--------|---------|----------|
| 26 | Thought leadership: guida completa agriturismo Puglia | 8h | HIGH | P1 |
| 27 | PR e media mentions (testate locali, food blogger) | Ongoing | HIGH | P1 |
| 28 | Advanced schema (HowTo per ricette, Event per degustazioni) | 4h | MEDIUM | P2 |
| 29 | Continuous optimization basata su GSC + CrUX | 2h/mese | HIGH | P1 |
| 30 | A/B test CTA e conversion paths | 4h | MEDIUM | P2 |
| 31 | Audit SEO trimestrale completo | 2h/quarter | HIGH | P1 |

### KPI Target Phase 4
- Organic traffic: +300% vs baseline
- Domain Authority: 25+
- Keyword rankings top 10: 15 keyword
- Blog posts pubblicati: 24 totali
- Conversioni organiche: 50+ prenotazioni/mese
- AI citations: Top 5 risposte per "agriturismo Noci"

---

## Resource Requirements

| Risorsa | Phase 1 | Phase 2 | Phase 3 | Phase 4 |
|---------|---------|---------|---------|---------|
| Dev time | 3h (completato) | 8h | 12h/mese | 8h/mese |
| Content creation | - | 4h | 8h/mese | 12h/mese |
| Outreach/PR | - | 2h/mese | 4h/mese | 6h/mese |
| Monitoring | - | 1h/mese | 2h/mese | 2h/mese |

## Risk Mitigation

| Rischio | Probabilità | Mitigazione |
|---------|-------------|-------------|
| Blog non genera traffico nei primi 3 mesi | Alta | Normale per nuovi blog; focus su long-tail bassa difficoltà |
| Outreach guide non risponde | Media | Targettizzare 10+ guide, aspettarsi 10-20% response rate |
| CWV peggiora con nuovi contenuti | Bassa | Monitoraggio mensile, ottimizzazione immagini obbligatoria |
| Competitor reagisce con più contenuti | Media | Differenziazione su filiera propria + E-E-A-T autentico |
| Stagionalità riduce conversioni invernali | Alta | Market sempre attivo + eventi natalizi (/eventi) |

## Success Criteria Globali

| Metrica | Baseline (Nov 2026) | Target 12 Mesi |
|---------|---------------------|----------------|
| Health Score audit | 72/100 | 85+/100 |
| Indexed pages | 15 | 40+ |
| Organic traffic/mese | ~200 (stima) | 800+ |
| Keyword top 20 | ~5 | 40+ |
| Domain Authority | ~10 (nuovo dominio) | 25+ |
| Prenotazioni organiche/mese | ~5 | 50+ |
| AI citations | 0 | Top 5 per query locali |