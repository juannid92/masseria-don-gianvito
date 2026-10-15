import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { HeroSceneFrame } from "./shared/HeroSceneFrame";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Blob di latte stilizzato: sfera con vertex displacement sinusoidale. */
function MilkBlob() {
  const meshRef = useRef<THREE.Mesh>(null);
  const reduced = useReducedMotion();

  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(1.4, 64, 64);
    const pos = geo.attributes.position;
    if (!pos) return geo;
    // Displacement "liquido": seni a frequenze diverse
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const n = Math.sin(v.x * 3 + v.y * 2) * 0.08 + Math.cos(v.z * 4) * 0.06;
      v.normalize().multiplyScalar(1.4 + n);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state) => {
    if (reduced) return;
    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.rotation.y = state.clock.elapsedTime * 0.15;
    mesh.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0, 0, 0]}>
      <meshStandardMaterial
        color="#faf6ec"
        roughness={0.25}
        metalness={0}
        emissive="#fffdf7"
        emissiveIntensity={0.15}
      />
    </mesh>
  );
}

/** Particelle di vapore: 80 sfere piccole che salgono. */
function SteamParticles({ count = 80 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const reduced = useReducedMotion();

  const { positions, sizes, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2.4;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
      sizes[i] = Math.random() * 0.08 + 0.02;
      speeds[i] = Math.random() * 0.3 + 0.15;
    }
    return { positions, sizes, speeds };
  }, [count]);

  useFrame((state, delta) => {
    if (reduced) return;
    const pts = pointsRef.current;
    if (!pts) return;
    const arr = (pts.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i] * delta;
      // Loop: quando una particella esce in alto, ricomincia dal basso
      if (arr[i * 3 + 1] > 3) {
        arr[i * 3 + 1] = -2;
        arr[i * 3] = (Math.random() - 0.5) * 2.4;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
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
        <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        color="#fffdf7"
        transparent
        opacity={0.45}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/** Goccia che cade: piccola sfera che scende periodicamente. */
function FallingDrop() {
  const ref = useRef<THREE.Mesh>(null);
  const reduced = useReducedMotion();
  const lastTime = useRef(0);

  useFrame((state) => {
    if (reduced) return;
    const m = ref.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    const period = 3.5;
    const phase = t % period;
    if (t - lastTime.current > period) lastTime.current = t;
    m.position.y = 4 - phase * 2.5;
    m.position.x = Math.sin(t * 0.4) * 0.3;
    const stretch = 1 + Math.max(0, 1 - phase) * 0.5;
    m.scale.set(0.1, 0.15 * stretch, 0.1);
  });

  return (
    <mesh ref={ref} position={[0, 4, 0]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="#faf6ec" roughness={0.3} transparent opacity={0.85} />
    </mesh>
  );
}

/** Hero Caseificio: blob di latte, vapore, goccia che cade, luce morbida. */
export function CaseificioHero() {
  return (
    <HeroSceneFrame ambient={0.7} background="#3a3226">
      <pointLight position={[0, 3, 3]} intensity={1.4} color="#fffdf7" />
      <pointLight position={[3, -1, 2]} intensity={0.4} color="#dab873" />
      <MilkBlob />
      <FallingDrop />
      <SteamParticles />
    </HeroSceneFrame>
  );
}
