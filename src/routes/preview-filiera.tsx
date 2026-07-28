import { createFileRoute } from "@tanstack/react-router";

/**
 * ROUTE TEMPORANEA — MOCKUP STATICO NUOVA FILIERA (Turno B, primo passo).
 * Non linkata. Due varianti del nodo tipo + sdoppiamento + riunione,
 * desktop e mobile. Nessuna animazione, nessun GSAP, nessun Lenis.
 * Superfici: fondo pieno pietra-100, filo unico continuo, nodi come segni.
 * Ruggine ammessa solo sul ramo carne. Oro solo sul filo di riunione.
 * Da rimuovere insieme a /preview-palette a chiusura del Turno B.
 */

export const Route = createFileRoute("/preview-filiera")({
  head: () => ({
    meta: [
      { title: "Preview Filiera — mockup statico" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Route interna di anteprima ridisegno Filiera." },
    ],
  }),
  component: PreviewFiliera,
});

// ─── tokens (mirror di styles.css, solo per rendering statico) ───────
const C = {
  pietra100: "#f4f0e6",
  pietra200: "#e5ddc9",
  pietra400: "#b6a98a",
  pietra800: "#4b4636",
  oliva500: "#7a8551",
  oliva700: "#4d5734",
  oroAntico: "#b2833a",
  ruggine: "#8a4a2e",
  carbone: "#1f1a15",
};

// ═══════════════════ VARIANTE V1 — SEGNO PIENO ══════════════════════
// Il nodo è un disco carbone attraversato dal filo. Il filo è oliva-700,
// hairline continua. Numero in Fraunces bianco dentro il disco. Occhiello
// pietra-400. Titolo carbone. Nessun riquadro, nessuna cornice.
function NodoV1_Desktop() {
  return (
    <div
      style={{ background: C.pietra100, color: C.carbone }}
      className="relative h-[560px] w-full overflow-hidden"
    >
      {/* filo continuo verticale, oliva-700, hairline 1.5px */}
      <svg
        viewBox="0 0 800 560"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <path
          d="M 260 0 C 250 140, 285 220, 275 340 C 268 440, 250 500, 260 560"
          fill="none"
          stroke={C.oliva700}
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
        {/* disco pieno carbone, il filo lo attraversa */}
        <circle cx="270" cy="280" r="42" fill={C.carbone} />
        <text
          x="270"
          y="290"
          textAnchor="middle"
          fontFamily="Fraunces, serif"
          fontSize="26"
          fontStyle="italic"
          fill={C.pietra100}
        >
          01
        </text>
      </svg>

      {/* testo a destra */}
      <div className="absolute left-[46%] top-1/2 max-w-[380px] -translate-y-1/2">
        <div
          className="mb-4 text-[11px] uppercase tracking-[0.22em]"
          style={{ color: C.pietra400, fontFamily: "Inter, sans-serif" }}
        >
          01 · La Terra
        </div>
        <h3
          className="mb-5 text-[42px] leading-[1.05]"
          style={{ fontFamily: "Fraunces, serif", fontWeight: 400, color: C.carbone }}
        >
          Prima si coltiva.
        </h3>
        <p
          className="text-[15px] leading-[1.65]"
          style={{ color: C.carbone, fontFamily: "Inter, sans-serif" }}
        >
          Foraggio, grano tenero, ortaggi e frutta crescono nei terreni della
          masseria. La farina del grano diventa focaccia e frittelle.
        </p>
      </div>

      <TagVariante nome="V1 · Segno pieno — nodo desktop" />
    </div>
  );
}

function NodoV1_Mobile() {
  return (
    <div
      style={{ background: C.pietra100, color: C.carbone }}
      className="relative h-[620px] w-[390px] overflow-hidden"
    >
      <svg
        viewBox="0 0 390 620"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <path
          d="M 78 0 C 72 160, 92 260, 84 400 C 78 500, 70 560, 78 620"
          fill="none"
          stroke={C.oliva700}
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
        <circle cx="82" cy="200" r="34" fill={C.carbone} />
        <text
          x="82" y="209" textAnchor="middle"
          fontFamily="Fraunces, serif" fontSize="22" fontStyle="italic"
          fill={C.pietra100}
        >
          01
        </text>
      </svg>

      <div className="absolute left-[38%] right-6 top-[140px]">
        <div
          className="mb-3 text-[11px] uppercase tracking-[0.22em]"
          style={{ color: C.pietra400, fontFamily: "Inter, sans-serif" }}
        >
          01 · La Terra
        </div>
        <h3
          className="mb-4 text-[28px] leading-[1.1]"
          style={{ fontFamily: "Fraunces, serif", fontWeight: 400, color: C.carbone }}
        >
          Prima si coltiva.
        </h3>
        <p
          className="text-[15px] leading-[1.6]"
          style={{ color: C.carbone, fontFamily: "Inter, sans-serif" }}
        >
          Foraggio, grano tenero, ortaggi e frutta crescono nei terreni della
          masseria.
        </p>
      </div>

      <TagVariante nome="V1 · mobile" small />
    </div>
  );
}

// ═══════════════════ VARIANTE V2 — CERCHIO APERTO ═══════════════════
// Il nodo è un anello oliva-700 (stroke 1.5px), vuoto: il filo si
// interrompe e riemerge. Numero piccolo Inter mono a lato dell'anello,
// pietra-400. Occhiello sopra, titolo grande a fianco. Più aereo.
function NodoV2_Desktop() {
  return (
    <div
      style={{ background: C.pietra100, color: C.carbone }}
      className="relative h-[560px] w-full overflow-hidden"
    >
      <svg
        viewBox="0 0 800 560"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        {/* filo che entra dall'alto e si ferma prima dell'anello */}
        <path
          d="M 270 0 C 260 100, 290 180, 275 232"
          fill="none" stroke={C.oliva700} strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
        {/* anello vuoto */}
        <circle
          cx="270" cy="280" r="46"
          fill="none" stroke={C.oliva700} strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
        {/* filo che riemerge sotto l'anello */}
        <path
          d="M 275 328 C 265 400, 250 460, 265 560"
          fill="none" stroke={C.oliva700} strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
        {/* numero piccolo mono a lato */}
        <text
          x="336" y="286"
          fontFamily="'JetBrains Mono', ui-monospace, monospace"
          fontSize="11"
          letterSpacing="0.15em"
          fill={C.pietra400}
        >
          N.01
        </text>
      </svg>

      <div className="absolute left-[46%] top-1/2 max-w-[380px] -translate-y-1/2">
        <div
          className="mb-4 text-[11px] uppercase tracking-[0.22em]"
          style={{ color: C.oliva700, fontFamily: "Inter, sans-serif" }}
        >
          La Terra
        </div>
        <h3
          className="mb-5 text-[48px] leading-[1.02]"
          style={{ fontFamily: "Fraunces, serif", fontWeight: 300, color: C.carbone, letterSpacing: "-0.01em" }}
        >
          Prima<br/>si coltiva.
        </h3>
        <p
          className="text-[15px] leading-[1.65] max-w-[340px]"
          style={{ color: C.carbone, fontFamily: "Inter, sans-serif" }}
        >
          Foraggio, grano tenero, ortaggi e frutta crescono nei terreni della
          masseria. La farina del grano diventa focaccia e frittelle.
        </p>
      </div>

      <TagVariante nome="V2 · Cerchio aperto — nodo desktop" />
    </div>
  );
}

function NodoV2_Mobile() {
  return (
    <div
      style={{ background: C.pietra100, color: C.carbone }}
      className="relative h-[620px] w-[390px] overflow-hidden"
    >
      <svg
        viewBox="0 0 390 620"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <path d="M 80 0 C 72 100, 92 160, 82 200" fill="none" stroke={C.oliva700} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
        <circle cx="82" cy="238" r="36" fill="none" stroke={C.oliva700} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
        <path d="M 82 276 C 72 380, 65 500, 78 620" fill="none" stroke={C.oliva700} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
        <text x="130" y="242" fontFamily="'JetBrains Mono', ui-monospace, monospace" fontSize="10" letterSpacing="0.15em" fill={C.pietra400}>N.01</text>
      </svg>

      <div className="absolute left-[40%] right-6 top-[150px]">
        <div className="mb-3 text-[11px] uppercase tracking-[0.22em]" style={{ color: C.oliva700, fontFamily: "Inter, sans-serif" }}>
          La Terra
        </div>
        <h3
          className="mb-4 text-[30px] leading-[1.05]"
          style={{ fontFamily: "Fraunces, serif", fontWeight: 300, color: C.carbone }}
        >
          Prima<br/>si coltiva.
        </h3>
        <p className="text-[15px] leading-[1.6]" style={{ color: C.carbone, fontFamily: "Inter, sans-serif" }}>
          Foraggio, grano tenero, ortaggi e frutta crescono nei terreni della
          masseria.
        </p>
      </div>

      <TagVariante nome="V2 · mobile" small />
    </div>
  );
}

// ═══════════════════ SDOPPIAMENTO (comune alle due varianti) ════════
// Il filo unico si divide in due tratti divergenti. Nessun pannello,
// nessun fondo colorato. Latte a sinistra in oliva-700 (identico al filo),
// Carne a destra in ruggine (unico tocco caldo del sito qui). Le etichette
// sono tipografia, non riquadri.
function Sdoppiamento({ variante }: { variante: "v1" | "v2" }) {
  const strokeMain = variante === "v1" ? C.oliva700 : C.oliva700;
  return (
    <div
      style={{ background: C.pietra100, color: C.carbone }}
      className="relative h-[560px] w-full overflow-hidden"
    >
      <svg viewBox="0 0 800 560" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {/* filo unico che scende dal centro */}
        <path
          d="M 400 0 C 400 120, 400 180, 400 240"
          fill="none" stroke={strokeMain} strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
        {/* divergenza: latte a sinistra, carne a destra */}
        <path
          d="M 400 240 C 380 300, 320 360, 260 420 C 220 460, 200 500, 200 560"
          fill="none" stroke={strokeMain} strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 400 240 C 420 300, 480 360, 540 420 C 580 460, 600 500, 600 560"
          fill="none" stroke={C.ruggine} strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
        {/* piccolo trattino orizzontale al punto di biforcazione */}
        <line x1="392" y1="240" x2="408" y2="240" stroke={C.carbone} strokeWidth={1} />

        {/* etichette tipografiche */}
        <text x="180" y="500" fontFamily="Fraunces, serif" fontSize="22" fontStyle="italic" fill={C.carbone}>
          latte
        </text>
        <text x="180" y="520" fontFamily="Inter, sans-serif" fontSize="10" letterSpacing="0.2em" fill={C.pietra400}>
          → CASEIFICIO
        </text>
        <text x="560" y="500" fontFamily="Fraunces, serif" fontSize="22" fontStyle="italic" fill={C.ruggine}>
          carne
        </text>
        <text x="560" y="520" fontFamily="Inter, sans-serif" fontSize="10" letterSpacing="0.2em" fill={C.pietra400}>
          → MACELLERIA
        </text>

        {/* titolo dello sdoppiamento in alto */}
        <text x="400" y="60" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="11" letterSpacing="0.22em" fill={C.pietra400}>
          03 · LA TRASFORMAZIONE
        </text>
        <text x="400" y="140" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="36" fill={C.carbone}>
          Due strade.
        </text>
      </svg>

      <TagVariante nome={`Sdoppiamento — riferimento (compatibile con ${variante.toUpperCase()})`} />
    </div>
  );
}

// ═══════════════════ RIUNIONE ═══════════════════════════════════════
// I due tratti convergono e il filo prosegue in ORO ANTICO fino alla
// tavola. L'oro qui è elemento grafico non testuale: 3:1 non richiesto.
function Riunione() {
  return (
    <div
      style={{ background: C.pietra100, color: C.carbone }}
      className="relative h-[560px] w-full overflow-hidden"
    >
      <svg viewBox="0 0 800 560" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {/* due tratti che scendono e convergono */}
        <path
          d="M 200 0 C 200 80, 260 160, 340 220 C 380 250, 395 270, 400 300"
          fill="none" stroke={C.oliva700} strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 600 0 C 600 80, 540 160, 460 220 C 420 250, 405 270, 400 300"
          fill="none" stroke={C.ruggine} strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
        {/* filo unico ORO ANTICO prosegue verso il basso, leggermente più spesso */}
        <path
          d="M 400 300 C 400 360, 400 440, 400 560"
          fill="none" stroke={C.oroAntico} strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        />
        {/* piccolo cerchio al punto di riunione, carbone pieno */}
        <circle cx="400" cy="300" r="4" fill={C.carbone} />

        <text x="400" y="60" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="11" letterSpacing="0.22em" fill={C.pietra400}>
          04 · LA TAVOLA
        </text>
        <text x="400" y="500" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="34" fill={C.carbone}>
          Allo stesso tavolo.
        </text>
      </svg>

      <TagVariante nome="Riunione — filo oro antico (elemento grafico, non testo)" />
    </div>
  );
}

// ─── UI chrome ───────────────────────────────────────────────────────
function TagVariante({ nome, small }: { nome: string; small?: boolean }) {
  return (
    <div
      className={`absolute left-4 top-4 ${small ? "text-[9px]" : "text-[10px]"} uppercase tracking-[0.2em]`}
      style={{ color: C.pietra400, fontFamily: "Inter, sans-serif" }}
    >
      {nome}
    </div>
  );
}

function Sezione({ titolo, sottotitolo, children }: { titolo: string; sottotitolo?: string; children: React.ReactNode }) {
  return (
    <section className="border-t" style={{ borderColor: C.pietra400 }}>
      <div className="mx-auto max-w-[1280px] px-6 py-10">
        <div className="mb-6">
          <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: C.pietra400, fontFamily: "Inter, sans-serif" }}>
            {titolo}
          </div>
          {sottotitolo && (
            <p className="mt-2 max-w-[720px] text-[14px] leading-[1.6]" style={{ color: C.carbone, fontFamily: "Inter, sans-serif" }}>
              {sottotitolo}
            </p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}

function PreviewFiliera() {
  return (
    <main style={{ background: C.pietra200, color: C.carbone, fontFamily: "Inter, sans-serif" }}>
      <header className="mx-auto max-w-[1280px] px-6 py-12">
        <div className="text-[10px] uppercase tracking-[0.24em]" style={{ color: C.pietra400 }}>
          Turno B · primo passo · mockup statico
        </div>
        <h1 className="mt-3 text-[44px] leading-[1.05]" style={{ fontFamily: "Fraunces, serif", fontWeight: 400 }}>
          Nuova Filiera — due varianti del nodo tipo
        </h1>
        <p className="mt-4 max-w-[720px] text-[14px] leading-[1.65]">
          Fondo pieno pietra-100. Filo unico oliva-700, hairline 1.5px. Nodi come
          segni: pieno in V1, aperto in V2. Nessun pannello, nessun gradiente,
          nessuna finta materia. Il ramo carne porta l'unico tocco ruggine.
          La riunione finale è in oro antico (elemento grafico, non testo).
          Sequenza, timeline e trigger degli atti restano invariati: qui
          cambiano solo le superfici.
        </p>
      </header>

      <Sezione
        titolo="Variante V1 · Segno pieno"
        sottotitolo="Il nodo è un disco carbone attraversato dal filo. Numero in Fraunces bianco dentro il disco. Più diretto, più editoriale, più 'peso'."
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_390px]">
          <NodoV1_Desktop />
          <NodoV1_Mobile />
        </div>
      </Sezione>

      <Sezione
        titolo="Variante V2 · Cerchio aperto"
        sottotitolo="Il nodo è un anello vuoto oliva-700. Il filo si interrompe e riemerge. Numero piccolo mono a lato. Più aereo, più tipografico, più 'aria'."
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_390px]">
          <NodoV2_Desktop />
          <NodoV2_Mobile />
        </div>
      </Sezione>

      <Sezione
        titolo="Sdoppiamento — momento della biforcazione"
        sottotitolo="Il filo unico si divide: latte a sinistra (oliva-700, stesso stroke del filo), carne a destra (ruggine, unico tocco caldo). Etichette in tipografia, senza cornici. Compatibile con entrambe le varianti del nodo."
      >
        <Sdoppiamento variante="v1" />
      </Sezione>

      <Sezione
        titolo="Riunione — arrivo alla tavola"
        sottotitolo="I due tratti convergono in un punto e proseguono come un unico filo in oro antico fino alla tavola. L'oro qui è segno grafico, non testo: la soglia 3:1 non si applica."
      >
        <Riunione />
      </Sezione>

      <footer className="mx-auto max-w-[1280px] px-6 py-16">
        <p className="text-[12px] leading-[1.6]" style={{ color: C.pietra400 }}>
          Route temporanea, noindex, da rimuovere insieme a /preview-palette
          alla chiusura del Turno B. Scegli V1 o V2 (o una fusione motivata):
          poi applico il ridisegno alla Filiera reale e procedo con i passi 2–6.
        </p>
      </footer>
    </main>
  );
}