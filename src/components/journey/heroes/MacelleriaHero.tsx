import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ──────────────────────────────────────────────────────────────────────────
   HERO MACELLERIA — "La brace, prima del fuoco".
   Letto di braci che respira (shader emissivo a rumore), ceppi d'ulivo con
   crepe incandescenti, griglia d'acciaio che riflette il rosso, scintille
   che salgono in additive blending, fumo. Palette rosso sangue e carbone.
   ────────────────────────────────────────────────────────────────────────── */

const BG = "#120405";

const NOISE = `
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1,0)), u.x), mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y);
  }
  float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }
`;

/** Letto di braci: rumore animato che pulsa tra nero, rosso sangue e arancio. */
function EmberBed({ reduced }: { reduced: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame((_, d) => {
    if (!reduced && mat.current) mat.current.uniforms.uTime.value += d;
  });
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
      <planeGeometry args={[22, 14, 1, 1]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`}
        fragmentShader={`
          uniform float uTime; varying vec2 vUv;
          ${NOISE}
          void main(){
            vec2 p = vUv * vec2(22.0, 14.0);
            float n = fbm(p * 1.4 + vec2(uTime * 0.05, -uTime * 0.08));
            float pulse = fbm(p * 0.6 - uTime * 0.15);
            float heat = smoothstep(0.45, 0.85, n * 0.7 + pulse * 0.5);
            vec2 q = (vUv - 0.5) * vec2(1.0, 1.6);
            float edge = 1.0 - smoothstep(0.12, 0.5, length(q));
            heat *= edge;
            vec3 ash = vec3(0.05, 0.02, 0.02);
            vec3 blood = vec3(0.55, 0.03, 0.05);
            vec3 hot = vec3(1.0, 0.38, 0.08);
            vec3 c = mix(ash, blood, smoothstep(0.0, 0.5, heat));
            c = mix(c, hot, smoothstep(0.55, 1.0, heat));
            gl_FragColor = vec4(c * 1.6, 1.0);
          }
        `}
      />
    </mesh>
  );
}

/** Ceppo d'ulivo carbonizzato con crepe incandescenti. */
function Log({
  position,
  rotation,
  length = 3.2,
  radius = 0.32,
  reduced,
  seed = 0,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  length?: number;
  radius?: number;
  reduced: boolean;
  seed?: number;
}) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: seed * 10 } }), [seed]);
  useFrame((_, d) => {
    if (!reduced && mat.current) mat.current.uniforms.uTime.value += d;
  });
  return (
    <mesh position={position} rotation={rotation}>
      <cylinderGeometry args={[radius * 0.9, radius, length, 18, 8]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={`varying vec2 vUv; varying vec3 vN; void main(){ vUv = uv; vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`}
        fragmentShader={`
          uniform float uTime; varying vec2 vUv; varying vec3 vN;
          ${NOISE}
          void main(){
            vec2 p = vec2(vUv.x * 10.0, vUv.y * 4.0);
            float cracks = 1.0 - abs(fbm(p * 1.5) * 2.0 - 1.0);
            cracks = pow(cracks, 10.0);
            float flick = 0.6 + 0.4 * noise(vec2(uTime * 1.5, vUv.y * 5.0));
            float under = smoothstep(0.2, -0.6, vN.y);
            vec3 charcoal = vec3(0.06, 0.04, 0.035) + vec3(0.12, 0.02, 0.02) * under;
            vec3 glow = mix(vec3(0.7, 0.04, 0.05), vec3(1.0, 0.45, 0.1), cracks) * cracks * flick * 2.2;
            gl_FragColor = vec4(charcoal + glow, 1.0);
          }
        `}
      />
    </mesh>
  );
}

/** Griglia d'acciaio sopra la brace. */
function Grill() {
  const bars = useMemo(() => Array.from({ length: 17 }, (_, i) => -4 + i * 0.5), []);
  return (
    <group position={[0, -0.25, 0]}>
      {bars.map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.022, 0.022, 5.2, 8]} />
          <meshStandardMaterial color="#6a4a46" metalness={0.3} roughness={0.45} />
        </mesh>
      ))}
      {[-2.6, 2.6].map((z) => (
        <mesh key={z} position={[0, 0, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 8.4, 8]} />
          <meshStandardMaterial color="#4a3432" metalness={0.3} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/** Scintille: particelle additive che salgono, ondeggiano e si spengono. */
function Sparks({ count, reduced }: { count: number; reduced: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const seeds = new Float32Array(count * 3);
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      seeds.set([Math.random(), Math.random(), Math.random()], i * 3);
      pos.set([(Math.random() - 0.5) * 9, -1, (Math.random() - 0.5) * 4], i * 3);
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 3));
    return g;
  }, [count]);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame((_, d) => {
    if (!reduced && mat.current) mat.current.uniforms.uTime.value += d;
  });
  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={`
          uniform float uTime; attribute vec3 aSeed; varying float vLife;
          void main(){
            float speed = 0.35 + aSeed.x * 0.6;
            float life = fract(uTime * speed * 0.25 + aSeed.y);
            vec3 p = position;
            p.y += life * (4.5 + aSeed.z * 3.0);
            p.x += sin(life * 9.0 + aSeed.y * 30.0) * 0.35 * life;
            p.z += cos(life * 7.0 + aSeed.x * 20.0) * 0.25 * life;
            vLife = life;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = (1.0 - life) * (10.0 + aSeed.z * 14.0) * (6.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
          }
        `}
        fragmentShader={`
          varying float vLife;
          void main(){
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.0, d) * (1.0 - vLife);
            vec3 c = mix(vec3(1.0, 0.75, 0.35), vec3(0.8, 0.06, 0.06), vLife);
            gl_FragColor = vec4(c, a);
          }
        `}
      />
    </points>
  );
}

/** Fumo: grandi sprite scuri che salgono lentamente. */
function Smoke({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(255,255,255,0.5)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
  const puffs = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        x: (Math.random() - 0.5) * 8,
        y: Math.random() * 6,
        z: -1 - Math.random() * 3,
        s: 2 + Math.random() * 3,
        r: i,
      })),
    [],
  );
  useFrame((_, d) => {
    if (reduced || !group.current) return;
    group.current.children.forEach((c, i) => {
      c.position.y += d * (0.25 + (i % 4) * 0.05);
      c.rotation.z += d * 0.05;
      if (c.position.y > 7) c.position.y = 0;
    });
  });
  if (!texture) return null;
  return (
    <group ref={group}>
      {puffs.map((p) => (
        <sprite key={p.r} position={[p.x, p.y, p.z]} scale={[p.s, p.s, 1]}>
          <spriteMaterial
            map={texture}
            color="#5a1a1a"
            transparent
            opacity={0.22}
            depthWrite={false}
          />
        </sprite>
      ))}
    </group>
  );
}

/** Luce della brace che tremola. */
function FireLight({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.PointLight>(null);
  useFrame((s) => {
    if (reduced || !ref.current) return;
    const t = s.clock.elapsedTime;
    ref.current.intensity = 22 + Math.sin(t * 7) * 3 + Math.sin(t * 13.3) * 2;
  });
  return (
    <pointLight ref={ref} position={[0, -0.6, 0]} intensity={22} distance={14} color="#ff3a1a" />
  );
}

function CameraRig({ reduced, isSmall }: { reduced: boolean; isSmall: boolean }) {
  const { camera, pointer } = useThree();
  const scroll = useRef(0);
  useEffect(() => {
    const on = () => (scroll.current = Math.min(window.scrollY / window.innerHeight, 1.2));
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useFrame((_, delta) => {
    const s = reduced ? 0 : scroll.current;
    const px = reduced ? 0 : pointer.x;
    const py = reduced ? 0 : pointer.y;
    const target = new THREE.Vector3(1.4 + px * 0.9, 2.1 + py * 0.3 + s * 1.2, 7.2 - s * 2.5);
    camera.position.lerp(target, Math.min(1, delta * 2.5));
    camera.lookAt(isSmall ? 0 : 2.2, -0.2 - s * 0.6, 0);
  });
  return null;
}

export function MacelleriaHero() {
  const reduced = useReducedMotion();
  const isSmall = typeof window !== "undefined" && window.innerWidth < 720;
  return (
    <div className="hero-canvas-frame hero-canvas-frame--macelleria" aria-hidden="true">
      <Canvas
        dpr={isSmall ? [1, 1.5] : [1, 1.75]}
        camera={{ position: [1.4, 2.1, 7.2], fov: 45 }}
        frameloop={reduced ? "demand" : "always"}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={[BG]} />
        <fog attach="fog" args={[BG, 7, 16]} />
        <ambientLight intensity={0.15} color="#ff6a5a" />
        <FireLight reduced={reduced} />
        <EmberBed reduced={reduced} />
        <Log
          position={[-2.4, -0.95, 0.4]}
          rotation={[0, 0.3, Math.PI / 2]}
          reduced={reduced}
          seed={1}
        />
        <Log
          position={[-0.4, -0.9, -0.6]}
          rotation={[0, -0.5, Math.PI / 2]}
          length={3.6}
          radius={0.36}
          reduced={reduced}
          seed={2}
        />
        <Log
          position={[1.8, -0.95, 0.6]}
          rotation={[0, 0.9, Math.PI / 2]}
          length={2.8}
          reduced={reduced}
          seed={3}
        />
        <Log
          position={[-1.4, -0.55, 0.0]}
          rotation={[0, 1.4, Math.PI / 2]}
          length={2.6}
          radius={0.26}
          reduced={reduced}
          seed={4}
        />
        <Grill />
        <Sparks count={isSmall ? 220 : 520} reduced={reduced} />
        <Smoke reduced={reduced} />
        <CameraRig reduced={reduced} isSmall={isSmall} />
      </Canvas>
      <div className="hero-canvas-shade" />
    </div>
  );
}
