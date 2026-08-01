import { MASSERIA, ORARI, ANIME } from "../src/data/masseria";

const SITE_URL = "https://masseriadongianvito.it";

export const structuredData = {
  "@context": "https://schema.org",
  "@type": "Agriturismo",
  "name": MASSERIA.nome,
  "description": "Azienda agricola a filiera propria a Noci (BA): allevamento, caseificio, macelleria e agriturismo della Murgia.",
  "url": SITE_URL,
  "telephone": [MASSERIA.telefonoHref, MASSERIA.telefono2Href],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": MASSERIA.indirizzo,
    "addressLocality": "Noci",
    "addressRegion": "BA",
    "postalCode": "70015",
    "addressCountry": "IT"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": MASSERIA.coordinate.lat,
    "longitude": MASSERIA.coordinate.lng
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "19:30",
      "closes": "23:00",
      "description": "Cena"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Sunday"],
      "opens": "12:30",
      "closes": "15:30",
      "description": "Pranzo"
    }
  ],
  "servesCuisine": "Pugliese",
  "hasMenu": `${SITE_URL}/agriturismo`,
  "subOrganization": ANIME.map(a => ({
    "@type": "Organization",
    "name": a.nome,
    "url": `${SITE_URL}${a.to}`
  }))
};
