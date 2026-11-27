import { Star } from "lucide-react";
import { MASSERIA } from "@/data/masseria";

/**
 * Badge statico Google Reviews — segnale E-E-A-T per SEO locale.
 * Nessun JS esterno, zero dipendenze, funziona anche senza JavaScript.
 * Link diretto alla pagina Google Business Profile per leggere/lasciare recensioni.
 */
export function GoogleReviewBadge() {
  return (
    <a
      href={MASSERIA.googleReviews}
      target="_blank"
      rel="noreferrer noopener"
      className="group inline-flex items-center gap-2 rounded-full border border-[color:var(--carbone)]/10 bg-white px-4 py-2 text-sm shadow-sm transition-shadow hover:shadow-md"
      aria-label={`Leggi le ${MASSERIA.reviewCount} recensioni su Google`}
    >
      <span className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={
              i < Math.round(Number(MASSERIA.ratingValue))
                ? "fill-[color:var(--terra-cotta)] text-[color:var(--terra-cotta)]"
                : "text-[color:var(--carbone)]/20"
            }
          />
        ))}
      </span>
      <span className="font-medium text-[color:var(--carbone)]">{MASSERIA.ratingValue}/5</span>
      <span className="text-[color:var(--carbone)]/60">({MASSERIA.reviewCount} recensioni)</span>
    </a>
  );
}
