import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  chiudiPreferenze,
  inizializzaConsenso,
  salvaConsenso,
  useConsenso,
} from "@/lib/consent";

const btn =
  "h-11 min-w-[8.5rem] flex-1 border border-[color:var(--oro-su-scuro)] px-5 font-eyebrow text-[11px] tracking-[0.22em] text-[color:var(--bianco-calce)] transition-colors hover:bg-[color:var(--oro-su-scuro)] hover:text-[color:var(--carbone)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--oro-su-scuro)]";

export function CookieBanner() {
  const { pronto, consenso, pannello } = useConsenso();
  const [dettagli, setDettagli] = useState(false);
  const [maps, setMaps] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inizializzaConsenso();
  }, []);

  const visibile = pronto && (!consenso || pannello);

  useEffect(() => {
    if (!visibile) return;
    setMaps(consenso?.maps ?? false);
    setDettagli(pannello);
  }, [visibile, pannello, consenso]);

  useEffect(() => {
    if (visibile && pannello) ref.current?.focus();
  }, [visibile, pannello]);

  if (!visibile) return null;

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-titolo"
      aria-describedby="cookie-testo"
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-[760px] border border-[color:var(--oro-su-scuro)]/50 bg-[color:var(--carbone)] p-5 text-[color:var(--bianco-calce)] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.6)] outline-none md:inset-x-6 md:bottom-6 md:p-7"
    >
      <p id="cookie-titolo" className="font-display text-[22px] leading-tight">
        La tua privacy
      </p>
      <p id="cookie-testo" className="mt-3 text-[14px] leading-relaxed text-[color:var(--bianco-calce)]/85">
        Questo sito usa solo strumenti tecnici necessari al funzionamento. Con il tuo consenso
        carica anche contenuti di terze parti (la mappa di Google Maps), che possono ricevere il
        tuo indirizzo IP e impostare cookie. Se non scegli, non viene caricato nulla. Puoi cambiare
        scelta in ogni momento da «Preferenze cookie» in fondo alla pagina. Maggiori informazioni
        nella{" "}
        <Link to="/legali/cookie" className="underline underline-offset-4">
          Cookie Policy
        </Link>{" "}
        e nella{" "}
        <Link to="/legali/privacy" className="underline underline-offset-4">
          Privacy Policy
        </Link>
        .
      </p>

      {dettagli && (
        <div className="mt-5 space-y-4 border-t border-[color:var(--bianco-calce)]/15 pt-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[15px] font-medium">Necessari</p>
              <p className="mt-1 text-[13px] leading-relaxed text-[color:var(--bianco-calce)]/70">
                Ricordano la tua scelta su questo avviso. Non si possono disattivare e non
                tracciano la navigazione.
              </p>
            </div>
            <span className="shrink-0 text-[12px] text-[color:var(--oro-su-scuro)]">Sempre attivi</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <label htmlFor="cookie-maps" className="text-[15px] font-medium">
                Mappa (Google Maps)
              </label>
              <p className="mt-1 text-[13px] leading-relaxed text-[color:var(--bianco-calce)]/70">
                Mostra la posizione della masseria. Google riceve il tuo indirizzo IP e può
                impostare cookie.
              </p>
            </div>
            <input
              id="cookie-maps"
              type="checkbox"
              role="switch"
              checked={maps}
              onChange={(e) => setMaps(e.target.checked)}
              className="mt-1 h-5 w-5 shrink-0 accent-[color:var(--oro-su-scuro)]"
            />
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button type="button" className={btn} onClick={() => salvaConsenso(false)}>
          RIFIUTA
        </button>
        {dettagli ? (
          <button type="button" className={btn} onClick={() => salvaConsenso(maps)}>
            SALVA SCELTA
          </button>
        ) : (
          <button type="button" className={btn} onClick={() => setDettagli(true)}>
            PERSONALIZZA
          </button>
        )}
        <button type="button" className={btn} onClick={() => salvaConsenso(true)}>
          ACCETTA
        </button>
      </div>
      {pannello && consenso && (
        <button
          type="button"
          onClick={chiudiPreferenze}
          className="mt-4 text-[12px] text-[color:var(--bianco-calce)]/60 underline underline-offset-4"
        >
          Chiudi senza modificare
        </button>
      )}
    </div>
  );
}
