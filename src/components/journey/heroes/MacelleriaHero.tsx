import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { HeroSceneFrame } from "./shared/HeroSceneFrame";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Cerchio di brace: torus con emissive arancione. */
function EmberRing() {
  const ref = useRef<THREE.Mesh>(null);
  const reduced = useReducedMotion();

  useFrame((state) => {
    if (reduced) return;
    const m = ref.current;
    if (!m) return;
    m.rotation.z = state.clock.elapsedTime * 0.1;
    // Pulsazione leggera della luce
    const mat = m.material as THREE.MeshStandardMaterial;
    if (mat) {
      mat.emissiveIntensity = 1.4 + Math.sin(state.clock.elapsedTime * 1.5) * 0.3;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[1.6, 0.18, 24, 64]} />
      <meshStandardMaterial
        color="#b9472a"
        emissive="#ff6a2a"
        emissiveIntensity={1.4}
        roughness={0.4}
        metalness={0}
        toneMapped={false}
      />
    </mesh>
  );
}

/** Particelle di scintille: 60 punti che salgono. */
function Sparks({ count = 60 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const reduced = useReducedMotion();

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = 1.5 + Math.random() * 0.4;
      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = Math.random() * 3 - 1;
      positions[i * 3 + 2] = Math.sin(angle) * r * 0.6;
      speeds[i] = Math.random() * 0.5 + 0.3;
    }
    return { positions, speeds };
  }, [count]);

  useFrame((state, delta) => {
    if (reduced) return;
    const pts = pointsRef.current;
    if (!pts) return;
    const arr = (pts.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i] * delta;
      if (arr[i * 3 + 1] > 3) {
        const angle = (i / count) * Math.PI * 2;
        const r = 1.5 + Math.random() * 0.4;
        arr[i * 3] = Math.cos(angle) * r;
        arr[i * 3 + 1] = -1;
        arr[i * 3 + 2] = Math.sin(angle) * r * 0.6;
      }
    }
    (pts.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#ffb868"
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}

/** "Carbone" centrale: piccola sfera scura sotto la brace. */
function Coal() {
  return (
    <mesh position={[0, -0.1, 0]}>
      <icosahedronGeometry args={[0.45, 1]} />
      <meshStandardMaterial color="#0d0a08" roughness={1} metalness={0} />
    </mesh>
  );
}

/** Hero Macelleria: brace ardente, scintille, carbone centrale, bloom. */
export function MacelleriaHero() {
  const reduced = useReducedMotion();
  return (
    <HeroSceneFrame ambient={0.3} background="#35241f">
      <pointLight position={[0, 0.5, 2]} intensity={2.2} color="#ff7a2a" />
      <pointLight position={[2, 1, 1]} intensity={0.5} color="#dab873" />
      <Coal />
      <EmberRing />
      <Sparks />
      {!reduced && (
        <EffectComposer>
          <Bloom intensity={0.9} luminanceThreshold={0.4} luminanceSmoothing={0.2} mipmapBlur />
        </EffectComposer>
      )}
    </HeroSceneFrame>
  );
}
