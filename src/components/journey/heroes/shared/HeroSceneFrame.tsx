import { Canvas } from "@react-three/fiber";
import { Suspense, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Props {
  children: ReactNode;
  /** Luminosità ambiente per l'hero (varia per capitolo). */
  ambient?: number;
  /** Colore sfondo 3D, fallback se Canvas non riesce a montare. */
  background?: string;
}

/** Wrapper del Canvas R3F: gestisce dpr, fallback reduced-motion, fallback SSR. */
export function HeroSceneFrame({ children, ambient = 0.4, background = "#1f1a15" }: Props) {
  const reduced = useReducedMotion();

  return (
    <div className="hero-canvas-frame" aria-hidden="true">
      <Canvas
        dpr={reduced ? [1, 1] : [1, 1.5]}
        camera={{ position: [0, 0, 5], fov: 50 }}
        frameloop={reduced ? "demand" : "always"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <color attach="background" args={[background]} />
        <ambientLight intensity={ambient} />
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  );
}
