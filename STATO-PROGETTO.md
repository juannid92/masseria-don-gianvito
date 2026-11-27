# Stato Progetto — Masseria Don Gianvito

> Documento di consegna per continuare il lavoro senza perdere contesto.  
> **Ultimo commit su `main`:** `57e0ba6` (allineato con `origin/main`, deploy automatico su **Cloudflare Pages**).

---

## 1. Regole e Vincoli Fondamentali (`AGENTS.md`)
- **Animazioni intoccabili:** NON modificare, rimuovere o ristrutturare GSAP, Lenis, ScrollTrigger, Framer Motion, transizioni CSS o animazioni scroll-driven.
- **Unica fonte di verità dati aziendali:** `src/data/masseria.ts` (non duplicare telefono, indirizzo o orari altrove).
- **Runtime:** Cloudflare Workers (nessuna API solo-Node lato server). Package manager: `bun` (`bun run build`, `bun run dev`, `bun run deploy`).
- **Commit:** formato convenzionale (`feat:`, `fix:`, `chore:`, `refactor:`).

---

## 2. Riepilogo di Tutto Quello che è Stato Fatto

### A. Contatti & Numero Unico
- Rimosso il vecchio numero `+39 333 939 5750` (`telefono2`) da tutto il sito, componenti, dati strutturati JSON-LD e file pubblici.
- **Numero unico ufficiale per chiamate e WhatsApp:** **`+39 333 387 0292`** (`tel:+393333870292`, `https://wa.me/393333870292`).

### B. Palette 60 / 30 / 10 (Bianco Perla · Marrone Wood · Rame Brace)
- **60% Bianco Perla (`#F2F1EE` / `#FFFFFF`):** sfondi chiari con finitura madreperla (`:where([data-tone="light"])` in `src/styles/tokens.css` e `src/styles/eventi.css`) e card bianche `#FFFFFF` con ombra ambientale.
- **30% Marrone Wood (`#2A180E` / `#4A2E1B` / `#6E4B32`):** sezioni scure, Hero, Footer, locandine Eventi e testi principali (`#1E120A`).
- **10% Rame Brace (`#C84B28` / `#A8391A` su chiaro · `#E86A42` / `#F07B52` su scuro):** pulsanti CTA primari, prezzi del Market, stati attivi, numeri romani, italic in evidenza, nodi della Filiera (`src/components/home/LaFiliera.tsx`).
- File di token e stili aggiornati: `src/styles/tokens.css`, `src/styles/heroes.css`, `src/styles/eventi.css`, `src/styles/journey.css`, `src/styles/market.css`, `src/styles/anime/macelleria.css`, `src/config/site.ts`, `public/site.webmanifest`.

### C. Hero Home & Foto 4K
- Immagine aerea `public/images/masseria-aerial.jpg` upscalata a **4K (`3840×3087`)** con varianti WebP `2560w` e `3840w` collegate in `src/components/home/Hero.tsx`.
- Coordinate pin (`src/data/pin-anime.ts`):
  - **Agriturismo:** `x: 28.5, y: 63`
  - **Caseificio:** `x: 39.5, y: 54` (`lato: "left"`, a sinistra della Macelleria sopra la casa col tetto grigio)
  - **Macelleria:** `x: 44, y: 53`
  - **Market:** `x: 49, y: 64`
  - **Allevamento:** `x: 80, y: 36`
- Aggiunto pulsante CTA nell'Hero: **`Appuntamenti & Menù →`** verso `/eventi`.

### D. Header, Footer & Contrasto Automatico
- **Header (`src/components/site/Header.tsx`):**
  - Voci desktop uniformate (`Esplora`, `Storia`, `Il Luogo`, `La Filiera`, `La Tavola`, `Prodotti`, `Market`, `Appuntamenti & Menù`, menu `La Masseria` con le 4 Anime + `Chi Siamo`, `Dove Siamo`, `Contatti`, `FAQ`, e pulsante `Prenota` collegato a `goToSection("prenota")`).
  - Drawer mobile con `overflow-y-auto` e tutte le voci accessibili.
- Aggiunto `data-tone="light"` su tutte le pagine chiare (`eventi.tsx`, `market.tsx`, `chi-siamo.tsx`, `dove-siamo.tsx`, `contatti.tsx`, `faq.tsx`, `recensioni.tsx`, `LegalLayout.tsx`) per garantire il testo scuro dell'Header prima dello scroll.
- **Footer (`src/components/site/Footer.tsx`):** aggiunti link a `Prodotti`, `Appuntamenti & Menù`, `Chi Siamo`, `Dove Siamo`, `Contatti`, `FAQ`, `Recensioni`.

### E. Pagina Appuntamenti & Menù (`/eventi`)
- File: `src/routes/eventi.tsx` + `src/styles/eventi.css`.
- Locandine interattive Marrone Wood & Rame Brace per i **4 menù**:
  1. **Natale** (25 dicembre) — `€60`
  2. **Santo Stefano** (26 dicembre) — `€50`
  3. **Capodanno** (1 gennaio) — `€60`
  4. **Domenica** (ogni domenica a pranzo) — `€40`
- Prenotazione diretta per ciascun menù via **WhatsApp** (messaggio precompilato dinamico sul menù selezionato) e **Chiama** (`333 387 0292`).
- Inclusi dati strutturati Schema.org `Menu` / `MenuSection`.

### F. Sezioni Caseificio & Macelleria
- **Caseificio (`src/components/journey/heroes/CaseificioHero.tsx`, `Caseificio.tsx`, `src/styles/anime/macelleria.css`):**
  - Sostituito il vecchio canvas 3D chiaro con la foto reale dei caciocavalli `public/images/caseificio/caseificio-hero-caciocavalli.webp`, velo caldo Marrone Wood, `data-tone="dark"` e testi ad alto contrasto Bianco Perla + Rame Brace.
- **Macelleria (`src/components/journey/Macelleria.tsx`):**
  - Sostituite con foto reali `.webp` tutte e 5 le stazioni di *"Il banco · cinque stazioni"*:
    1. `macelleria-banco-esposizione-01.webp`
    2. `macelleria-brace-cottura-01.webp`
    3. `macelleria-tagli-freschi-01.webp`
    4. `macelleria-banco-lavorazione-01.webp`
    5. `macelleria-banco-sala-01.webp`

### G. Catalogo Market (`/market`)
- File: `src/data/market.ts`, `src/routes/market.tsx`, `src/styles/market.css`.
- Supporto **varianti/formati/gusti** (`varianti` su `ProdottoMarket`, cambio foto istantaneo, selettore a chip + frecce sulla foto, gestione separata nel carrello e nell'ordine WhatsApp).
- Tutte le immagini convertite in `.webp` in `public/images/market/`:
  - **Carne:**
    - `Bombette della Masseria` (`€16/kg`) con **13 gusti selezionabili** (Classica, 4 Formaggi, Con pancetta, Speck e scamorza, Pesto e fontina, Pomodoro secco e caciocavallo, Rucola speck e gorgonzola, 'Nduja e gorgonzola, 'Nduja senza glutine, Impanata senza glutine, Piccante, Capocollo senza formaggio, Vitello senza formaggio).
    - Foto reali caricate per: *Bistecca / Costata*, *Agnello*, *Costata di vitello*, *Braciole pronte*, *Spiedino misto*, *Filetti lardati*, *Girelle con capocollo stagionato e formaggio*, *Calippo*, *Gnummirelli*, *Hamburger*, *Polpette*, *Polpettine*, *Salsiccia di maiale nero punta di coltello*, *Capocollo*, *Salsiccia di vitello*, *Costata di Maiale*, *Lonza di maiale*, *Pancetta di maiale*, *Guanciale*, *Costata di maiale con osso*, *Prosciutto di maiale*, *Fettine di vitello*, *Costata disossata o reale*, *Pollo*, *Coniglio*, *Spezzatino con osso*.
    - Rimossi su richiesta: *Spezzatino senza osso* e *Bistecca di Bovino cruda* (sostituita da *Bistecca / Costata*).
    - *Faraona (su prenotazione)* e *Tacchino (su prenotazione)* al momento con placeholder.
  - **Formaggi:** foto reali collegate per *Mozzarella o fiori di latte*, *Mozzarelle*, *Ricotta fresca*, *Provola / Caciocavallo fresco*, *Provola stagionata / Caciocavallo stagionato*, *Primo sale*, *Formaggio fresco*, *Formaggio stagionato* (`€14/kg`), *Ricotta forte*, *Cacio ricotta misto*.
  - **Salumi:** *Capocollo stagionato* (`capocollo-stagionato.webp`), *Salame dolce* e *Salame piccante* (`salame.webp`).
  - **Farine e Pasta** *(categoria rinominata)*:
    - *Semola rimacinata Senatore Cappelli*: `500 g` (`€1,75`) e `1 kg` (`€3,50`).
    - *Grossetto (Semola dura) Senatore Cappelli*: `500 g` (`€1,75`) e `1 kg` (`€3,50`).
    - *Pasta artigianale della Masseria* (`€3 / 500g`): *Strascinati*, *Trofiette*, *Orecchiette*, *Fusilloni*, *Sedanini*, *Pennoni trafilati al bronzo*.
  - **Panificio:** *Focaccia ripiena* (con scelta *Pomodori e cipolla* / *Scarola e olive*), *Focaccia tipo pizza*, *Focaccia integrale ruota*, *Pane casereccio*, *Pane di semola*, *Focaccia barese ruota*.

### H. SEO, Sitemap & Verifiche Motori di Ricerca
- `public/sitemap.xml`: rimossi gli URL obsoleti (`/bottega`, `/braceria`), aggiunti `/market` ed `/eventi` (15 URL canonici totali).
- `public/_redirects`: redirect 301 per `/bottega`, `/braceria`, `/appuntamenti`.
- `public/llms.txt` e `public/.well-known/ai-plugin.json`: allineati ai nuovi contenuti, prezzi e numero unico; corretto `legal_info_url` a `/legali/privacy`.
- Meta tag Open Graph / Twitter Card e JSON-LD completati su tutte le rotte (`__root.tsx`, `eventi.tsx`, `market.tsx`, `dove-siamo.tsx`, `chi-siamo.tsx`, `contatti.tsx`, `faq.tsx`, `recensioni.tsx`, `legali/privacy.tsx`, `legali/cookie.tsx`).
- File di verifica Webmaster in `public/`:
  - Yandex: `public/yandex_7f690e34dbe324c3.html`
  - Seznam: `public/seznam-wmt-ljUJbBEMPW16mxtNFODr5NYrJJOUhqpn.txt`
  - IndexNow / altro: `public/19a32ba91753b28338d2990fe41aa5d3.txt` (preesistente)

---

## 3. Eventuali Cose Rimaste in Sospeso per i Prossimi Passi
- **Foto ancora con placeholder nel Market (`src/data/market.ts`):**
  - Carne: *Filetto di Bovino*, *Macinato tritato*, *Faraona (su prenotazione)*, *Tacchino (su prenotazione)*.
  - Formaggi: *Burrata / Burratine*, *Stracciatella*.
- **Date nella pagina `/eventi` (`src/routes/eventi.tsx`):** se servono anni specifici o menù di nuove festività (es. Pasqua), aggiornare `APPUNTAMENTI`.
- **Verifica visiva online:** controllare i nuovi colori 60/30/10, il pin Caseificio e le schede Market su desktop e mobile una volta completato il deploy Cloudflare.
