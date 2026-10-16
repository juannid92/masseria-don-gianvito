import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ──────────────────────────────────────────────────────────────────────────
   HERO CASEIFICIO — "Il bianco prende forma".
   Una vasca di latte che respira (shader con onde e cerchi concentrici),
   gocce che cadono e increspano la superficie, forme di pasta filata
   (burrata, treccia, nodini) che emergono e ruotano lente, vapore che sale.
   Palette: bianco latte, crema, oro.
   ────────────────────────────────────────────────────────────────────────── */

const BG = "#f7f1e3";
const DROPS = 3;

/** Superficie del latte: displacement + cerchi concentrici dalle gocce. */
function MilkSurface({
  reduced,
  drops,
}: {
  reduced: boolean;
  drops: React.MutableRefObject<THREE.Vector4[]>;
}) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDrops: { value: drops.current },
      uMilk: { value: new THREE.Color("#fffaf0") },
      uShadow: { value: new THREE.Color("#efe4cc") },
      uGold: { value: new THREE.Color("#c9a35a") },
    }),
    [drops],
  );

  useFrame((_, delta) => {
    if (!mat.current) return;
    if (!reduced) mat.current.uniforms.uTime.value += delta;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
      <circleGeometry args={[9, 220]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime;
          uniform vec4 uDrops[${DROPS}];
          varying float vH;
          varying vec2 vUv2;
          float ripple(vec2 p, vec4 d) {
            float age = uTime - d.z;
            if (age < 0.0 || age > 6.0) return 0.0;
            float r = length(p - d.xy);
            float front = age * 1.6;
            float w = exp(-pow((r - front) * 2.2, 2.0)) * exp(-age * 0.55);
            return sin((r - front) * 9.0) * w * 0.22;
          }
          void main() {
            vec3 p = position;
            vec2 xy = p.xy;
            float h = sin(xy.x * 0.6 + uTime * 0.5) * 0.05 + cos(xy.y * 0.5 - uTime * 0.4) * 0.05;
            for (int i = 0; i < ${DROPS}; i++) h += ripple(xy, uDrops[i]);
            p.z += h;
            vH = h;
            vUv2 = xy;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uMilk;
          uniform vec3 uShadow;
          uniform vec3 uGold;
          varying float vH;
          varying vec2 vUv2;
          void main() {
            float r = length(vUv2) / 9.0;
            vec3 c = mix(uMilk, uShadow, smoothstep(-0.12, -0.02, -vH) * 0.55);
            c = mix(c, uShadow, smoothstep(0.55, 1.0, r) * 0.6);
            // filo d'oro sul bordo della vasca
            c = mix(c, uGold, smoothstep(0.965, 0.985, r) * (1.0 - smoothstep(0.99, 1.0, r)));
            c += smoothstep(0.03, 0.12, vH) * 0.06;
            gl_FragColor = vec4(c, 1.0);
          }
        `}
      />
    </mesh>
  );
}

/** Gocce di latte che cadono e generano un'increspatura all'impatto. */
function MilkDrops({
  reduced,
  drops,
}: {
  reduced: boolean;
  drops: React.MutableRefObject<THREE.Vector4[]>;
}) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const state = useRef(
    Array.from({ length: DROPS }, (_, i) => ({ x: 0, z: 0, y: 6, v: 0, wait: i * 1.7 + 0.5 })),
  );
  const clockRef = useRef(0);

  useFrame((_, delta) => {
    if (reduced) return;
    clockRef.current += delta;
    state.current.forEach((d, i) => {
      const m = refs.current[i];
      if (!m) return;
      if (d.wait > 0) {
        d.wait -= delta;
        m.visible = false;
        if (d.wait <= 0) {
          d.x = (Math.random() - 0.5) * 7;
          d.z = (Math.random() - 0.5) * 4 - 0.5;
          d.y = 5.5;
          d.v = 0;
        }
        return;
      }
      m.visible = true;
      d.v += 14 * delta;
      d.y -= d.v * delta;
      m.position.set(d.x, d.y, d.z);
      m.scale.set(1, 1 + Math.min(d.v * 0.08, 0.8), 1);
      if (d.y <= -1.2) {
        // piano ruotato: (x, -z) nelle coordinate locali della superficie
        drops.current[i].set(d.x, -d.z, clockRef.current, 1);
        d.wait = 2.6 + Math.random() * 2;
        m.visible = false;
      }
    });
  });

  return (
    <>
      {state.current.map((_, i) => (
        <mesh key={i} ref={(el) => (refs.current[i] = el)} visible={false}>
          <sphereGeometry args={[0.07, 16, 12]} />
          <meshPhysicalMaterial color="#fffdf7" roughness={0.15} clearcoat={1} />
        </mesh>
      ))}
    </>
  );
}

const MILKY = {
  color: "#fbf6ea",
  roughness: 0.42,
  sheen: 1,
  sheenColor: "#fff3d6",
  clearcoat: 0.35,
  clearcoatRoughness: 0.4,
};

/** Burrata: sfera morbida con il "nodo" in cima. */
function Burrata() {
  return (
    <group>
      <mesh castShadow>
        <sphereGeometry args={[0.95, 48, 36]} />
        <meshPhysicalMaterial {...MILKY} />
      </mesh>
      <mesh position={[0, 0.98, 0]} rotation={[0.2, 0, 0.3]}>
        <torusGeometry args={[0.16, 0.08, 12, 24]} />
        <meshPhysicalMaterial {...MILKY} />
      </mesh>
      <mesh position={[0, 1.12, 0]} rotation={[0, 0, 0.5]}>
        <coneGeometry args={[0.13, 0.32, 16]} />
        <meshPhysicalMaterial {...MILKY} />
      </mesh>
    </group>
  );
}

/** Treccia: tre fili di pasta filata intrecciati lungo una curva. */
function Treccia() {
  const tubes = useMemo(() => {
    return [0, 1, 2].map((k) => {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 80; i++) {
        const t = i / 80;
        const a = t * Math.PI * 6 + (k * Math.PI * 2) / 3;
        const base = new THREE.Vector3(
          Math.cos(t * Math.PI * 1.6) * 1.1,
          (t - 0.5) * 0.4,
          Math.sin(t * Math.PI * 1.6) * 1.1,
        );
        pts.push(
          base.add(new THREE.Vector3(Math.cos(a) * 0.12, Math.sin(a) * 0.12, Math.cos(a) * 0.06)),
        );
      }
      return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 160, 0.13, 14, false);
    });
  }, []);
  return (
    <group>
      {tubes.map((g, i) => (
        <mesh key={i} geometry={g} castShadow>
          <meshPhysicalMaterial {...MILKY} />
        </mesh>
      ))}
    </group>
  );
}

/** Nodino: piccolo nodo di pasta filata. */
function Nodino() {
  return (
    <mesh castShadow>
      <torusKnotGeometry args={[0.32, 0.14, 120, 16, 2, 3]} />
      <meshPhysicalMaterial {...MILKY} />
    </mesh>
  );
}

function Floating({
  children,
  position,
  speed = 1,
  phase = 0,
  reduced,
  scale = 1,
}: {
  children: React.ReactNode;
  position: [number, number, number];
  speed?: number;
  phase?: number;
  reduced: boolean;
  scale?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (reduced || !ref.current) return;
    const t = s.clock.elapsedTime * speed + phase;
    ref.current.position.y = position[1] + Math.sin(t) * 0.18;
    ref.current.rotation.y = t * 0.25;
    ref.current.rotation.z = Math.sin(t * 0.7) * 0.12;
  });
  return (
    <group ref={ref} position={position} scale={scale}>
      {children}
    </group>
  );
}

/** Vapore: sprite morbidi che salgono e svaniscono. */
function Steam({ count, reduced }: { count: number; reduced: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,0.9)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }, []);
  const geometry = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr.set(
        [(Math.random() - 0.5) * 12, -1 + Math.random() * 5, (Math.random() - 0.5) * 6],
        i * 3,
      );
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, [count]);

  useFrame((_, delta) => {
    if (reduced || !ref.current) return;
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      let y = pos.getY(i) + delta * 0.35;
      if (y > 4) y = -1;
      pos.setY(i, y);
      pos.setX(i, pos.getX(i) + Math.sin(y * 1.5 + i) * delta * 0.08);
    }
    pos.needsUpdate = true;
  });

  if (!texture) return null;
  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        map={texture}
        size={0.9}
        transparent
        opacity={0.28}
        depthWrite={false}
        color="#ffffff"
      />
    </points>
  );
}

/** Camera: leggero respiro col mouse, si avvicina alla vasca con lo scroll. */
function CameraRig({ reduced }: { reduced: boolean }) {
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
    const target = new THREE.Vector3(px * 0.8, 3.2 + py * 0.3 + s * 1.5, 9 - s * 3);
    camera.position.lerp(target, Math.min(1, delta * 2.5));
    camera.lookAt(0, 0.3 - s * 0.8, 0);
  });
  return null;
}

export function CaseificioHero() {
  const reduced = useReducedMotion();
  const isSmall = typeof window !== "undefined" && window.innerWidth < 720;
  const drops = useRef(Array.from({ length: DROPS }, () => new THREE.Vector4(0, 0, -100, 0)));

  return (
    <div className="hero-canvas-frame hero-canvas-frame--caseificio" aria-hidden="true">
      <Canvas
        shadows
        dpr={isSmall ? [1, 1.5] : [1, 1.75]}
        camera={{ position: [0, 3.2, 9], fov: 40 }}
        frameloop={reduced ? "demand" : "always"}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={[BG]} />
        <fog attach="fog" args={[BG, 10, 22]} />
        <hemisphereLight args={["#fffdf7", "#e8d6b0", 1.6]} />
        <directionalLight position={[4, 8, 5]} intensity={1.6} color="#fff1d6" castShadow />
        <pointLight position={[-4, 2, 2]} intensity={6} color="#e8c47e" distance={12} />
        <MilkSurface reduced={reduced} drops={drops} />
        <MilkDrops reduced={reduced} drops={drops} />
        <Floating
          position={isSmall ? [1.1, 2.2, -2] : [3.6, 0.9, -0.5]}
          reduced={reduced}
          speed={0.6}
          scale={isSmall ? 0.55 : 1}
        >
          <Burrata />
        </Floating>
        <Floating
          position={isSmall ? [-1.6, -0.1, 0.5] : [-3.8, 0.4, -0.2]}
          reduced={reduced}
          speed={0.5}
          phase={2}
          scale={0.95}
        >
          <Treccia />
        </Floating>
        <Floating position={[-1.9, 2.3, -3]} reduced={reduced} speed={0.7} phase={1} scale={0.8}>
          <Nodino />
        </Floating>
        <Floating position={[2.4, 2.6, -3.5]} reduced={reduced} speed={0.8} phase={3.5} scale={0.6}>
          <Nodino />
        </Floating>
        <Floating position={[0.8, -0.3, 2.4]} reduced={reduced} speed={0.9} phase={5} scale={0.45}>
          <Nodino />
        </Floating>
        <Steam count={isSmall ? 40 : 80} reduced={reduced} />
        <CameraRig reduced={reduced} />
      </Canvas>
      <div className="hero-canvas-shade" />
    </div>
  );
}
