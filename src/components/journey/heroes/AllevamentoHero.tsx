import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { HeroSceneFrame } from "./shared/HeroSceneFrame";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Terreno collinare stilizzato: PlaneGeometry con vertex displacement sinusoidale. */
function HillsTerrain() {
  const meshRef = useRef<THREE.Mesh>(null);
  const reduced = useReducedMotion();

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(20, 12, 80, 50);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    if (!pos) return geo;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      // Due seni a frequenze diverse per colline morbide
      const y = Math.sin(x * 0.4) * 0.6 + Math.cos(z * 0.5) * 0.5 + Math.sin((x + z) * 0.2) * 0.3;
      pos.setY(i, y);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state) => {
    if (reduced) return;
    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.08;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0, -1.5, -2]}>
      <meshStandardMaterial color="#3a4a2a" roughness={0.95} metalness={0} />
    </mesh>
  );
}

/** Silhouette stilizzata di bovino al pascolo (bassa risoluzione). */
function CattleSilhouettes() {
  const groupRef = useRef<THREE.Group>(null);
  const reduced = useReducedMotion();

  // Posizioni fisse di 5 "capi" sul piano
  const positions: [number, number, number][] = useMemo(
    () => [
      [-3, -1.3, -0.5],
      [-1, -1.2, 0.2],
      [1.5, -1.35, -0.8],
      [3, -1.25, 0.5],
      [0, -1.3, 1.5],
    ],
    [],
  );

  useFrame((state) => {
    if (reduced) return;
    const g = groupRef.current;
    if (!g) return;
    g.children.forEach((m, i) => {
      m.position.y = -1.3 + Math.sin(state.clock.elapsedTime * 0.5 + i * 1.3) * 0.04;
    });
  });

  return (
    <group ref={groupRef}>
      {positions.map((p, i) => (
        <mesh key={i} position={p}>
          {/* Bovino stilizzato: icosaedro (testa) + scatola (corpo). Scatola più grande. */}
          <group>
            <mesh position={[0.5, 0.4, 0]}>
              <boxGeometry args={[0.9, 0.5, 0.4]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
            </mesh>
            <mesh position={[1, 0.5, 0]}>
              <icosahedronGeometry args={[0.18, 0]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
            </mesh>
          </group>
        </mesh>
      ))}
    </group>
  );
}

/** Sorgente di luce calda che simula il sole del mattino. */
function WarmLight() {
  return (
    <>
      <directionalLight position={[5, 6, 3]} intensity={1.2} color="#dfca9f" />
      <pointLight position={[-3, 2, -2]} intensity={0.3} color="#b2833a" />
    </>
  );
}

/** Hero Allevamento: colline, bovini stilizzati, luce calda del mattino. */
export function AllevamentoHero() {
  return (
    <HeroSceneFrame ambient={0.5} background="#29291f">
      <WarmLight />
      <HillsTerrain />
      <CattleSilhouettes />
      {/* Nebbia morbida sul fondo */}
      <mesh position={[0, 0, -5]}>
        <planeGeometry args={[30, 10]} />
        <meshBasicMaterial color="#dfca9f" transparent opacity={0.05} />
      </mesh>
    </HeroSceneFrame>
  );
}
