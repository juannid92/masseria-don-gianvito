# Task B3-2 Report: Rinomina immagini WhatsApp macelleria

**Status:** DONE
**Base commit:** f2bd9b2aecaf47372c1dd93c36c483d44f41fdbe
**Build:** PASS (298ms)

## Mapping rinomina

| Vecchio nome | Nuovo slug | Contesto d'uso |
|---|---|---|
| `WhatsApp Image 2026-11-03 at 09.34.09.jpeg` | `macelleria-banco-esposizione-01.jpeg` | Banco macelleria con carne/salumi esposti (moment 0) |
| `WhatsApp Image 2026-11-03 at 09.39.55 (2).jpeg` | `macelleria-brace-cottura-01.jpeg` | Bistecche/bombette sulla griglia (moment 1) |
| `WhatsApp Image 2026-11-03 at 09.39.55 (1).jpeg` | `macelleria-tagli-freschi-01.jpeg` | Tagli freschi selezionati/esposti (moment 2 + gallery) |
| `WhatsApp Image 2026-11-04 at 11.11.44.jpeg` | `macelleria-banco-lavorazione-01.jpeg` | Chi lavora al banco (moment 3) |
| `WhatsApp Image 2026-11-03 at 09.39.55.jpeg` | `macelleria-banco-sala-01.jpeg` | Carne dal banco alla sala / banco masseria (moment 4 + gallery) |
| `WhatsApp Image 2026-11-03 at 09.39.55 (3).jpeg` | `macelleria-preparazione-tagli-01.jpeg` | Preparazione tagli al banco (gallery) |
| `WhatsApp Image 2026-11-03 at 09.39.55 (4).jpeg` | `macelleria-selezione-carne-01.jpeg` | Selezione carne fresca (gallery) |
| `WhatsApp Image 2026-11-03 at 09.39.55 (5).jpeg` | `macelleria-lavorazione-dettagli-01.jpeg` | Dettagli lavorazione carne (gallery) |

## File modificati

- `public/images/macelleria/` — 8 file rinominati
- `src/components/journey/Macelleria.tsx` — 10 riferimenti aggiornati (5 moments + 5 gallery)

## Note

- Il file `09.34.09.jpeg` esiste anche in `AgriLaTavola.tsx:114` ma punta a `/images/agriturismo/` (non macelleria). Riferimento fuori scope per questo task.
- Nessun riferimento WhatsApp macelleria residuo in `src/`.
- Animazioni/stili/logica non toccati.