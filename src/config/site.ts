/**
 * CONFIGURAZIONE SITO — Masseria Don Gianvito
 * Unico punto di verità per domini, SEO base e metadati globali.
 */

export const SITE_CONFIG = {
  // SITE_URL DA CONFERMARE PRIMA DELLA PUBBLICAZIONE
  url: "https://id-preview--5872b4b3-ae9a-4a92-810f-f585fc35c4e8.lovable.app",
  name: "Masseria Don Gianvito",
  title: "Masseria Don Gianvito — Dalla terra alla tavola",
  description: "Azienda agricola a filiera propria a Noci (BA): allevamento, caseificio, macelleria e agriturismo della Murgia.",
  ogImage: "/og-masseria.jpg", // Immagine Open Graph predefinita (fotografia aerea autentica)
  themeColor: "#f4f0e6",
  twitterCard: "summary_large_image",
} as const;

/**
 * Utility per generare URL assoluti dal SITE_URL configurato.
 */
export function getAbsoluteUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_CONFIG.url}${cleanPath}`;
}
