import React, { useMemo } from "react";

interface AgriturismoSVGProps {
  progress: number; // 0 to 1
}

/**
 * AgriturismoRegiaSVG
 * Illustrazione SVG proprietaria disegnata nel codice.
 * viewBox="0 0 1600 900"
 */
export const AgriturismoRegiaSVG = React.forwardRef<SVGSVGElement, AgriturismoSVGProps>(
  ({ progress }, ref) => {
    // Calcolo trasformazioni base basate sul progresso
    // Capitolo 1: 0-18% (Strada)
    // Capitolo 2: 18-38% (Avvicinamento)
    // Capitolo 3: 38-58% (Arco/Attraversamento)
    // Capitolo 4: 58-78% (Cortile)
    // Capitolo 5: 78-90% (Tavola)

    return (
      <svg
        ref={ref}
        viewBox="0 0 1600 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover will-change-transform"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Filtro Grain Statico Globale */}
        <defs>
          <filter id="grainy">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0" />
          </filter>
        </defs>

        {/* data-svg-sky - Cielo serale piatto */}
        <rect width="1600" height="900" fill="var(--bianco-calce)" data-svg-sky />
        
        {/* data-svg-horizon - Campagna e profilo */}
        <g data-svg-horizon>
          <path d="M0 600 Q 400 580 800 600 T 1600 600 V 900 H 0 Z" fill="var(--pietra-100)" opacity="0.5" />
          <path d="M0 620 Q 300 600 700 620 T 1600 620 V 900 H 0 Z" fill="var(--pietra-200)" />
        </g>

        {/* Gruppo Principale Masseria (Far to Near) */}
        <g id="masseria-camera-group">
          
          {/* data-svg-masseria-far - Sagoma in lontananza */}
          <g data-svg-masseria-far opacity="1">
             <path d="M750 600 H 850 V 550 L 800 530 L 750 550 Z" fill="var(--carbone)" opacity="0.2" />
          </g>

          {/* data-svg-facade & data-svg-arch - La Masseria che si avvicina */}
          <g data-svg-facade>
            {/* Corpo principale */}
            <rect x="500" y="300" width="600" height="400" fill="var(--bianco-calce)" stroke="var(--oro-antico)" strokeWidth="1" />
            {/* Arco Centrale */}
            <path 
              d="M720 700 V 500 Q 720 450 800 450 Q 880 450 880 500 V 700" 
              fill="var(--biscotto-scuro)" 
              stroke="var(--oro-antico)" 
              strokeWidth="2"
              data-svg-arch
            />
            {/* Dettagli facciata */}
            <rect x="550" y="350" width="60" height="80" fill="var(--biscotto)" opacity="0.3" />
            <rect x="990" y="350" width="60" height="80" fill="var(--biscotto)" opacity="0.3" />
          </g>

          {/* data-svg-courtyard - Cortile interno (rivelato dopo l'arco) */}
          <g data-svg-courtyard opacity="0">
             <rect x="0" y="0" width="1600" height="900" fill="var(--bianco-calce)" />
             <path d="M200 900 L 400 400 H 1200 L 1400 900 Z" fill="var(--pietra-100)" />
             {/* data-svg-lights - Punti luce */}
             <g data-svg-lights>
                <circle cx="450" cy="450" r="4" fill="var(--oro-antico)" />
                <circle cx="1150" cy="450" r="4" fill="var(--oro-antico)" />
                <circle cx="800" cy="350" r="3" fill="var(--oro-antico)" />
             </g>
          </g>
        </g>

        {/* data-svg-table - Tavola finale */}
        <g data-svg-table opacity="0">
          <rect width="1600" height="900" fill="var(--bianco-calce)" />
          {/* Piano Tavola */}
          <rect x="100" y="200" width="1400" height="700" rx="10" fill="var(--bianco-latte)" stroke="var(--oro-antico)" strokeWidth="2" />
          {/* data-svg-place-settings - Segni tavola */}
          <g data-svg-place-settings>
             <circle cx="400" cy="550" r="120" stroke="var(--oro-antico)" strokeWidth="1" />
             <circle cx="800" cy="550" r="120" stroke="var(--oro-antico)" strokeWidth="1" />
             <circle cx="1200" cy="550" r="120" stroke="var(--oro-antico)" strokeWidth="1" />
             {/* Accento Carminio */}
             <rect x="760" y="540" width="80" height="4" fill="var(--carminio)" rx="2" />
          </g>
        </g>

        {/* data-svg-road-to-table - L'unico tracciato trasformista */}
        {/* Inizia come strada prospettica, finisce come bordo tavola */}
        <path 
          id="main-path"
          data-svg-road-to-table
          d="M800 600 L 0 900 M 800 600 L 1600 900" 
          stroke="var(--oro-antico)" 
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* data-svg-foreground - Elementi vicini (Muretti a secco / Ulivi stilizzati) */}
        <g data-svg-foreground fill="var(--carbone)" opacity="0.8">
           <path d="M-100 900 L 200 750 L 400 900 Z" />
           <path d="M1700 900 L 1400 750 L 1200 900 Z" />
        </g>

        {/* Grain statico */}
        <rect width="1600" height="900" filter="url(#grainy)" pointerEvents="none" />
      </svg>
    );
  }
);

AgriturismoRegiaSVG.displayName = "AgriturismoRegiaSVG";
