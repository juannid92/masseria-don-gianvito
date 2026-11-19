import type { AnimaId } from "@/data/masseria";

/** Icone SVG inline che rappresentano ogni anima della masseria. */
const ICONS: Record<AnimaId, React.ReactNode> = {
  allevamento: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Mucca stilizzata */}
      <path
        d="M12 32c0-6 4-12 12-12s12 6 12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="18" cy="24" r="2" fill="currentColor" />
      <circle cx="30" cy="24" r="2" fill="currentColor" />
      <path d="M8 28c2-4 4-6 4-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M40 28c-2-4-4-6-4-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="14" y="32" width="4" height="8" rx="1" fill="currentColor" opacity=".7" />
      <rect x="30" y="32" width="4" height="8" rx="1" fill="currentColor" opacity=".7" />
    </svg>
  ),
  caseificio: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Forma di formaggio / cuneo */}
      <path d="M8 36L24 8l16 28H8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path
        d="M16 28h16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity=".5"
      />
      <circle cx="20" cy="22" r="1.5" fill="currentColor" opacity=".6" />
      <circle cx="28" cy="26" r="1.5" fill="currentColor" opacity=".6" />
      <circle cx="24" cy="18" r="1" fill="currentColor" opacity=".4" />
    </svg>
  ),
  macelleria: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Coltello da macellaio */}
      <path d="M14 38L34 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M34 10c4-2 8 0 8 4s-4 6-8 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="10" y="34" width="8" height="6" rx="2" fill="currentColor" opacity=".7" />
    </svg>
  ),
  agriturismo: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Piatto con posate */}
      <ellipse cx="24" cy="28" rx="16" ry="10" stroke="currentColor" strokeWidth="2" />
      <path d="M24 18v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M18 14c0-4 2-6 6-6s6 2 6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="10"
        y1="22"
        x2="10"
        y2="36"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity=".6"
      />
      <line
        x1="38"
        y1="22"
        x2="38"
        y2="36"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity=".6"
      />
    </svg>
  ),
};

interface HeroPin3DProps {
  id: AnimaId;
  numero: string;
  nome: string;
}

/** Pin 3D con icona rappresentativa, effetto prospettiva CSS e rotazione al passaggio del mouse. */
export function HeroPin3D({ id, numero, nome }: HeroPin3DProps) {
  return (
    <div className="hero-pin-3d" aria-label={nome}>
      <div className="hero-pin-3d-object">
        <div className="hero-pin-3d-face hero-pin-3d-face--front">{ICONS[id]}</div>
        <div className="hero-pin-3d-face hero-pin-3d-face--back">
          <span>{numero}</span>
        </div>
      </div>
      <span className="hero-pin-3d-shadow" aria-hidden="true" />
    </div>
  );
}
