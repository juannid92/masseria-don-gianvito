# Esperienza immersiva — prototipo

## Regia
- Home: mappa con quattro pin selezionabili. La selezione presenta il capitolo, il link entra nella storia.
- Percorso: Allevamento → Caseificio → Macelleria → Agriturismo → Allevamento. Accesso diretto a ogni tappa e ritorno alla mappa.
- Allevamento: anche collegamento diretto al ramo Macelleria.
- Agriturismo resta una sola zona; `/braceria` conserva il redirect.
- Menù in Agriturismo, raggiungibile dall’header e dalla Tavola in home. Categorie navigabili, stato vuoto esplicito, contatto WhatsApp. Nessun piatto o prezzo inventato.

## Animazioni
Un solo Lenis globale sincronizzato al ticker GSAP. Reveal e parallasse con ScrollTrigger, contesti locali smontati al cambio pagina. Cinema con dissolvenze scroll-driven su desktop; scene in flusso naturale su mobile e reduced motion. Ingresso morbido di pagina e progressione della lettura. Nessuna intercettazione dei link o blocco del tasto indietro.

## Contenuti e fotografie
`src/data/journey.ts` contiene SOLO scaffolding editoriale, da sostituire con testimonianze reali. Gli slot fotografici non fingono di rappresentare luoghi reali. I file WebP Agriturismo nella repo sono campiture uniformi (verificati visivamente e con deviazione standard RGB inferiore a 0,1), non fotografie. Il nuovo cinema e il menù usano quindi scenografie tipografiche e slot dichiarati, predisposti per immagini reali.

L’immagine aerea è referenziata da `src/assets/masseria-aerial.asset.json`, ma il file non è nella repo. Il recupero dal preview Lovable ha restituito HTTP 403. Finché manca, la home presenta un percorso schematico dichiarato. I pin mantengono le coordinate desktop originali in `pin-anime.ts`: vanno verificati sulla foto reale. Nessun crop mobile altera le posizioni. Quando arriva la fotografia, salvarla in `public/images/masseria-aerial.jpg` e impostare `url` a `/images/masseria-aerial.jpg` nel JSON. La mappa usa un sistema percentuale unico.

I contenuti preesistenti nelle sezioni successive della home e dell’Agriturismo non sono stati verificati: revisione obbligatoria prima di pubblicare. Dominio SEO, dati di contatto e asset favicon/OG richiedono conferma.

## Sviluppo
`npm install`, `npm run dev`, `npm run build`.
Le modifiche sono locali: nessun push o deploy automatico.
Non è stato creato un file Figma: la regia è implementata nel codice React/CSS.
