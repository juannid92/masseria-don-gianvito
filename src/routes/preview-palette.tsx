import { createFileRoute } from "@tanstack/react-router";

/**
 * ROUTE TEMPORANEA — PREVIEW PALETTE "Pietra e Oliva" (Turno A).
 * Non linkata dalla navigazione. Da rimuovere alla chiusura del Turno B.
 *
 * Mostra:
 *  1) i nove token della palette con hex e nome,
 *  2) sei campioni di atto tipo (fondo × accento) con occhiello/titolo/corpo/nota,
 *  3) i contrasti misurati (WCAG 2.1) etichettati PASS/FAIL sulle soglie:
 *     - corpo (Inter 16 px)  ≥ 4.5:1
 *     - titoli grandi (Fraunces ≥ 24 px bold) ≥ 3:1
 */

export const Route = createFileRoute("/preview-palette")({
  head: () => ({
    meta: [
      { title: "Preview palette — Pietra e Oliva" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Route interna di anteprima palette." },
    ],
  }),
  component: PreviewPalette,
});

// ─── contrast utilities ────────────────────────────────────────────────
function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function relLum({ r, g, b }: { r: number; g: number; b: number }) {
  const c = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function contrast(a: string, b: string) {
  const l1 = relLum(hexToRgb(a));
  const l2 = relLum(hexToRgb(b));
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
}

// ─── palette ───────────────────────────────────────────────────────────
const TOKENS = [
  { name: "--pietra-100", hex: "#f4f0e6", role: "fondo chiaro dominante" },
  { name: "--pietra-200", hex: "#e5ddc9", role: "fondo chiaro alternativo" },
  { name: "--pietra-400", hex: "#b6a98a", role: "bordi, hairline neutri" },
  { name: "--pietra-800", hex: "#4b4636", role: "fondo scuro dominante" },
  { name: "--oliva-500", hex: "#7a8551", role: "accento primario" },
  { name: "--oliva-700", hex: "#4d5734", role: "accento scuro" },
  { name: "--oro-antico", hex: "#b2833a", role: "accento raro (max 1/atto)" },
  { name: "--ruggine", hex: "#8a4a2e", role: "solo carne/cottura (max 2/sito)" },
  { name: "--carbone", hex: "#1f1a15", role: "testo di lettura, mai fondo" },
];

type Campione = {
  id: string;
  titolo: string;
  fondoHex: string;
  fondoName: string;
  testoHex: string;
  accentoHex: string;
  accentoName: string;
  occhiello: string;
  titoloTesto: string;
  corpo: string;
  nota: string;
  fotografico?: boolean;
};

const CAMPIONI: Campione[] = [
  {
    id: "chiaro-oliva",
    titolo: "Chiaro con OLIVA",
    fondoHex: "#f4f0e6",
    fondoName: "pietra-100",
    testoHex: "#1f1a15",
    accentoHex: "#7a8551",
    accentoName: "oliva-500",
    occhiello: "04 — LA FILIERA",
    titoloTesto: "Dalla terra alla tavola",
    corpo:
      "Un solo luogo, un solo filo: cinque anime che si tengono per mano dalla campagna alla cucina.",
    nota: "Nota — accento oliva su titolo secondario, filo continuo.",
  },
  {
    id: "chiaro-oro",
    titolo: "Chiaro con ORO ANTICO",
    fondoHex: "#f4f0e6",
    fondoName: "pietra-100",
    testoHex: "#1f1a15",
    accentoHex: "#b2833a",
    accentoName: "oro-antico",
    occhiello: "01 — IL MANIFESTO",
    titoloTesto: "Coltiviamo, alleviamo, cuciniamo.",
    corpo:
      "Tre verbi che descrivono ciò che facciamo ogni giorno, senza scorciatoie e senza intermediari.",
    nota: "Nota — oro antico riservato a un solo elemento per atto.",
  },
  {
    id: "chiaro-ruggine",
    titolo: "Chiaro con RUGGINE (solo carne)",
    fondoHex: "#f4f0e6",
    fondoName: "pietra-100",
    testoHex: "#1f1a15",
    accentoHex: "#8a4a2e",
    accentoName: "ruggine",
    occhiello: "LA MACELLERIA",
    titoloTesto: "Frollatura lenta, tagli veri.",
    corpo:
      "La carne dei nostri animali torna intera in macelleria: nessun passaggio in più, nessuna filiera che non conosciamo.",
    nota: "Nota — ruggine ammessa solo qui e nella braceria. Mai altrove.",
  },
  {
    id: "scuro-oliva",
    titolo: "Scuro con OLIVA",
    fondoHex: "#4b4636",
    fondoName: "pietra-800",
    testoHex: "#f4f0e6",
    accentoHex: "#7a8551",
    accentoName: "oliva-500",
    occhiello: "02 — LA STORIA",
    titoloTesto: "Da tre generazioni, stesse mani.",
    corpo:
      "Il nonno ha piantato i primi ulivi. Il padre ha aperto la caseificio. Oggi la stessa terra produce ciò che serve alla tavola.",
    nota: "Nota — atto scuro, contrasto alto. Oliva usata sul filetto sottotitolo.",
  },
  {
    id: "scuro-oro",
    titolo: "Scuro con ORO ANTICO",
    fondoHex: "#4b4636",
    fondoName: "pietra-800",
    testoHex: "#f4f0e6",
    accentoHex: "#b2833a",
    accentoName: "oro-antico",
    occhiello: "06 — LA VOCE",
    titoloTesto: "Vieni a vedere. Poi decidi.",
    corpo:
      "La masseria è aperta ogni giorno: la strada per Mottola, i campi, il cortile. Da qui entra tutto il resto.",
    nota: "Nota — oro antico sulla parola-chiave, una sola volta.",
  },
  {
    id: "fotografico-chiaro",
    titolo: "Fotografico su CHIARO",
    fondoHex: "#f4f0e6",
    fondoName: "pietra-100",
    testoHex: "#1f1a15",
    accentoHex: "#b2833a",
    accentoName: "oro-antico",
    occhiello: "03 — IL LUOGO",
    titoloTesto: "Fuori Noci, dove la strada smette di correre.",
    corpo:
      "La masseria si trova lungo la provinciale per Mottola, tra campi coltivati e muretti a secco.",
    nota: "Nota — la fotografia autentica riempie il fondo; testo pietra-100 con scrim leggero.",
    fotografico: true,
  },
];

function ContrastBadge({
  value,
  soglia,
  label,
}: {
  value: number;
  soglia: number;
  label: string;
}) {
  const pass = value >= soglia;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-[11px] font-medium"
      style={{
        background: pass ? "rgba(122,133,81,0.16)" : "rgba(138,74,46,0.18)",
        color: pass ? "#4d5734" : "#8a4a2e",
        border: `1px solid ${pass ? "#7a8551" : "#8a4a2e"}`,
      }}
    >
      <strong>{label}</strong> {value.toFixed(2)}:1 · min {soglia}:1 · {pass ? "PASS" : "FAIL"}
    </span>
  );
}

function TokenSwatch({ token }: { token: (typeof TOKENS)[number] }) {
  const onDark = contrast(token.hex, "#1f1a15");
  const onLight = contrast(token.hex, "#f4f0e6");
  return (
    <article
      className="flex flex-col overflow-hidden rounded-sm border"
      style={{ borderColor: "rgba(31,26,21,0.14)" }}
    >
      <div className="h-24 w-full" style={{ background: token.hex }} />
      <div className="flex flex-col gap-1 p-3" style={{ background: "#faf7ef" }}>
        <code className="font-mono text-[12px] font-semibold" style={{ color: "#1f1a15" }}>
          {token.name}
        </code>
        <span className="font-mono text-[11px]" style={{ color: "#4b4636" }}>
          {token.hex}
        </span>
        <span className="text-[11px] italic" style={{ color: "#4b4636" }}>
          {token.role}
        </span>
        <div className="mt-1 flex flex-col gap-1 text-[10px]" style={{ color: "#4b4636" }}>
          <span>vs carbone: {onDark.toFixed(2)}:1</span>
          <span>vs pietra-100: {onLight.toFixed(2)}:1</span>
        </div>
      </div>
    </article>
  );
}

function Campione({ c }: { c: Campione }) {
  const ratioCorpo = contrast(c.testoHex, c.fondoHex);
  const ratioTitolo = contrast(c.testoHex, c.fondoHex); // stesso testo del corpo
  const ratioAccento = contrast(c.accentoHex, c.fondoHex);

  return (
    <article
      className="overflow-hidden rounded-sm border"
      style={{ borderColor: "rgba(31,26,21,0.14)" }}
    >
      <header
        className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-2 text-[11px]"
        style={{ background: "#e5ddc9", color: "#1f1a15" }}
      >
        <strong className="font-mono text-[12px]">{c.titolo}</strong>
        <span className="font-mono">
          fondo {c.fondoName} · accento {c.accentoName}
        </span>
      </header>

      {/* Superficie del campione */}
      <div
        className="relative flex min-h-[320px] flex-col justify-between p-6 md:min-h-[340px] md:p-8"
        style={{
          background: c.fotografico
            ? // Fotografico chiaro: uso pietra-100 con una simulazione di scrim
              // (in produzione qui c'è la foto autentica; per la preview mostro
              // il fondo pieno per rispettare la regola "niente finte materie").
              c.fondoHex
            : c.fondoHex,
          color: c.testoHex,
        }}
      >
        <div>
          <p
            className="font-eyebrow text-[10px] tracking-[0.34em] md:text-[11px]"
            style={{ color: c.accentoHex }}
          >
            {c.occhiello}
          </p>
          <h3
            className="mt-4 max-w-[22ch] font-display text-[clamp(1.8rem,3.6vw,2.6rem)] leading-[1.02]"
            style={{ color: c.testoHex }}
          >
            {c.titoloTesto.split(" ").slice(0, -2).join(" ")}{" "}
            <em style={{ color: c.accentoHex, fontStyle: "italic" }}>
              {c.titoloTesto.split(" ").slice(-2).join(" ")}
            </em>
          </h3>
          <p
            className="mt-4 max-w-[46ch] text-[16px] leading-relaxed"
            style={{ color: c.testoHex, opacity: 0.9 }}
          >
            {c.corpo}
          </p>
        </div>

        <p
          className="mt-8 text-[11px] italic"
          style={{
            color: c.testoHex,
            opacity: 0.65,
            borderTop: `1px solid ${c.accentoHex}`,
            paddingTop: "10px",
          }}
        >
          {c.nota}
        </p>
      </div>

      {/* Contrasti misurati */}
      <footer
        className="flex flex-wrap gap-2 px-4 py-3"
        style={{ background: "#faf7ef" }}
      >
        <ContrastBadge value={ratioCorpo} soglia={4.5} label="corpo" />
        <ContrastBadge value={ratioTitolo} soglia={3} label="titolo" />
        <ContrastBadge value={ratioAccento} soglia={3} label="accento" />
      </footer>
    </article>
  );
}

function PreviewPalette() {
  return (
    <div style={{ background: "#faf7ef", color: "#1f1a15" }} className="min-h-screen">
      <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-12 md:py-20">
        <header className="mb-10 border-b pb-8" style={{ borderColor: "rgba(31,26,21,0.14)" }}>
          <p className="font-eyebrow text-[11px] tracking-[0.32em]" style={{ color: "#4d5734" }}>
            TURNO A · MOCKUP STATICO
          </p>
          <h1 className="mt-4 font-display text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02]">
            Opzione A — <em className="italic" style={{ color: "#b2833a" }}>Pietra e Oliva</em>
          </h1>
          <p className="mt-4 max-w-[64ch] text-[15px] leading-relaxed" style={{ color: "#4b4636" }}>
            Nove token, sei campioni di atto tipo. Nessuna finta materia:
            fondi pieni della palette, tipografia come voce principale,
            accento vivo mai duplicato nella stessa schermata.
          </p>
        </header>

        <section aria-label="Token" className="mb-16">
          <h2 className="mb-6 font-display text-[22px]">1. Token</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {TOKENS.map((t) => (
              <TokenSwatch key={t.name} token={t} />
            ))}
          </div>
          <p className="mt-6 max-w-[64ch] text-[13px] italic" style={{ color: "#4b4636" }}>
            Le proporzioni di contrasto sono calcolate con la formula WCAG 2.1
            relative luminance sui valori esatti dei token, indipendentemente
            dallo schermo.
          </p>
        </section>

        <section aria-label="Campioni">
          <h2 className="mb-6 font-display text-[22px]">2. Campioni di atto</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {CAMPIONI.map((c) => (
              <Campione key={c.id} c={c} />
            ))}
          </div>
        </section>

        <section aria-label="Regole" className="mt-16 border-t pt-8" style={{ borderColor: "rgba(31,26,21,0.14)" }}>
          <h2 className="mb-4 font-display text-[22px]">3. Regole di distribuzione</h2>
          <ol
            className="max-w-[72ch] space-y-2 pl-5 text-[14px] leading-relaxed"
            style={{ color: "#1f1a15", listStyle: "decimal" }}
          >
            <li>Un solo fondo dominante per atto: chiaro (pietra-100/200) O scuro (pietra-800).</li>
            <li>Un solo accento vivo per atto: oliva O oro-antico O ruggine. Mai due insieme.</li>
            <li>Ruggine: esclusivamente carne/cottura. Max 2 momenti in tutto il sito.</li>
            <li>Oro-antico: max 1 occorrenza per atto, su un solo elemento.</li>
            <li>Carbone: solo testo di lettura, mai fondo di un intero atto.</li>
            <li>Bordeaux e terracotta: rimossi.</li>
            <li>Alternanza obbligatoria fra atti: Hero foto → Manifesto chiaro → Storia scuro → Luogo foto/chiaro → Filiera chiaro (oliva + 1 tocco ruggine) → Tavola chiaro → Voce scuro.</li>
          </ol>
        </section>
      </div>
    </div>
  );
}