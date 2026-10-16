import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ──────────────────────────────────────────────────────────────────────────
   HERO ALLEVAMENTO — diorama 3D procedurale del pascolo murgiano.
   Colline, erba al vento (shader instanziato), vacche podoliche, muretti a
   secco, ulivi, un trullo all'orizzonte, polline nella luce del mattino.
   La camera respira con il mouse e scende nel pascolo con lo scroll.
   ────────────────────────────────────────────────────────────────────────── */

const SKY = "#e9d6ae";
const FOG = "#d9c49a";

/** Altezza del terreno: unica fonte per colline, erba, animali e alberi. */
function heightAt(x: number, z: number) {
  return (
    Math.sin(x * 0.18) * 0.7 +
    Math.cos(z * 0.22) * 0.55 +
    Math.sin((x + z) * 0.09) * 0.9 -
    Math.max(0, 6 - Math.hypot(x, z - 2)) * 0.12
  );
}

/** Generatore pseudo-casuale deterministico (stessa scena a ogni render). */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function Terrain() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(90, 70, 140, 110);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const colors = new Float32Array(pos.count * 3);
    const low = new THREE.Color("#55602f");
    const high = new THREE.Color("#a69a55");
    const dry = new THREE.Color("#c2a86a");
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const y = heightAt(x, z);
      pos.setY(i, y);
      const t = THREE.MathUtils.clamp((y + 1.2) / 3, 0, 1);
      c.copy(low).lerp(high, t);
      const patch = (Math.sin(x * 0.7) * Math.cos(z * 0.6) + 1) / 2;
      c.lerp(dry, patch * 0.35);
      colors.set([c.r, c.g, c.b], i * 3);
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial vertexColors roughness={1} metalness={0} />
    </mesh>
  );
}

/** Erba: migliaia di lame instanziate, piegate dal vento in un vertex shader. */
function WindGrass({ count, reduced }: { count: number; reduced: boolean }) {
  const material = useRef<THREE.ShaderMaterial>(null);

  const { geometry, uniforms } = useMemo(() => {
    const blade = new THREE.PlaneGeometry(0.07, 0.6, 1, 4);
    blade.translate(0, 0.3, 0);
    const geo = new THREE.InstancedBufferGeometry();
    geo.index = blade.index;
    geo.setAttribute("position", blade.attributes.position);
    geo.setAttribute("uv", blade.attributes.uv);
    const offsets = new Float32Array(count * 3);
    const params = new Float32Array(count * 3);
    const r = rng(7);
    for (let i = 0; i < count; i++) {
      const x = (r() - 0.5) * 34;
      const z = -8 + r() * 20;
      offsets.set([x, heightAt(x, z) - 0.02, z], i * 3);
      params.set([r() * Math.PI * 2, 0.6 + r() * 0.9, r()], i * 3);
    }
    geo.setAttribute("aOffset", new THREE.InstancedBufferAttribute(offsets, 3));
    geo.setAttribute("aParams", new THREE.InstancedBufferAttribute(params, 3));
    geo.instanceCount = count;
    return { geometry: geo, uniforms: { uTime: { value: 0 } } };
  }, [count]);

  useFrame((_, delta) => {
    if (reduced || !material.current) return;
    material.current.uniforms.uTime.value += delta;
  });

  return (
    <mesh geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        side={THREE.DoubleSide}
        vertexShader={`
          attribute vec3 aOffset;
          attribute vec3 aParams;
          uniform float uTime;
          varying float vH;
          varying float vTone;
          void main() {
            vec3 p = position;
            float h = uv.y;
            p.y *= aParams.y;
            float c = cos(aParams.x), s = sin(aParams.x);
            p.xz = mat2(c, -s, s, c) * p.xz;
            float gust = sin(uTime * 1.3 + aOffset.x * 0.35 + aOffset.z * 0.2) * 0.5 + 0.5;
            float sway = (sin(uTime * 2.2 + aOffset.x * 1.7) * 0.12 + gust * 0.28) * h * h;
            p.x += sway;
            p.z += sway * 0.4;
            vH = h;
            vTone = aParams.z;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p + aOffset, 1.0);
          }
        `}
        fragmentShader={`
          varying float vH;
          varying float vTone;
          void main() {
            vec3 base = mix(vec3(0.24, 0.29, 0.13), vec3(0.42, 0.45, 0.2), vTone);
            vec3 tip = mix(vec3(0.78, 0.72, 0.42), vec3(0.88, 0.8, 0.52), vTone);
            gl_FragColor = vec4(mix(base, tip, vH), 1.0);
          }
        `}
      />
    </mesh>
  );
}

/** Vacca podolica stilizzata: mantello grigio chiaro, corna a lira. */
function Cow({
  position,
  rotation,
  phase,
  reduced,
  scale = 1,
}: {
  position: [number, number, number];
  rotation: number;
  phase: number;
  reduced: boolean;
  scale?: number;
}) {
  const head = useRef<THREE.Group>(null);
  const tail = useRef<THREE.Mesh>(null);
  const coat = "#d8d2c4";
  const dark = "#4a4339";
  const horn = "#efe4c8";

  useFrame((state) => {
    if (reduced) return;
    const t = state.clock.elapsedTime + phase;
    // Pascola: abbassa la testa, la rialza, guarda intorno.
    const graze = (Math.sin(t * 0.45) + 1) / 2;
    if (head.current) {
      head.current.rotation.z = -0.15 - graze * 0.75;
      head.current.rotation.y = Math.sin(t * 0.3) * 0.25 * (1 - graze);
    }
    if (tail.current) tail.current.rotation.x = Math.sin(t * 2.1) * 0.35;
  });

  const legs: [number, number][] = [
    [0.42, 0.17],
    [0.42, -0.17],
    [-0.42, 0.17],
    [-0.42, -0.17],
  ];

  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <mesh position={[0, 0.82, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <capsuleGeometry args={[0.28, 0.75, 6, 14]} />
        <meshStandardMaterial color={coat} roughness={0.85} />
      </mesh>
      <mesh position={[0.2, 1.02, 0]} castShadow>
        <sphereGeometry args={[0.24, 14, 10]} />
        <meshStandardMaterial color={coat} roughness={0.85} />
      </mesh>
      {legs.map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.32, z]} castShadow>
          <cylinderGeometry args={[0.065, 0.05, 0.64, 8]} />
          <meshStandardMaterial color={coat} roughness={0.9} />
        </mesh>
      ))}
      {legs.map(([x, z]) => (
        <mesh key={`h${x}${z}`} position={[x, 0.03, z]}>
          <cylinderGeometry args={[0.06, 0.065, 0.07, 8]} />
          <meshStandardMaterial color={dark} />
        </mesh>
      ))}
      <group ref={head} position={[0.68, 1.0, 0]}>
        <mesh position={[0.12, 0, 0]} rotation={[0, 0, -0.6]} castShadow>
          <capsuleGeometry args={[0.12, 0.16, 4, 10]} />
          <meshStandardMaterial color={coat} roughness={0.85} />
        </mesh>
        <mesh position={[0.3, -0.12, 0]} rotation={[0, 0, -0.9]} castShadow>
          <capsuleGeometry args={[0.11, 0.22, 4, 10]} />
          <meshStandardMaterial color="#bdb5a5" roughness={0.85} />
        </mesh>
        <mesh position={[0.41, -0.27, 0]}>
          <sphereGeometry args={[0.09, 10, 8]} />
          <meshStandardMaterial color={dark} roughness={0.6} />
        </mesh>
        {[1, -1].map((side) => (
          <group key={side}>
            <mesh position={[0.17, 0.1, 0.13 * side]} rotation={[side * 0.9, 0, 0.5]}>
              <coneGeometry args={[0.035, 0.38, 6]} />
              <meshStandardMaterial color={horn} roughness={0.5} />
            </mesh>
            <mesh position={[0.1, 0.0, 0.14 * side]} rotation={[side * 1.4, 0, 0]}>
              <coneGeometry args={[0.06, 0.16, 6]} />
              <meshStandardMaterial color="#a69c8a" roughness={0.9} />
            </mesh>
          </group>
        ))}
      </group>
      <mesh ref={tail} position={[-0.68, 0.72, 0]}>
        <cylinderGeometry args={[0.02, 0.015, 0.55, 5]} />
        <meshStandardMaterial color={dark} />
      </mesh>
    </group>
  );
}

function Herd({ reduced }: { reduced: boolean }) {
  const walker = useRef<THREE.Group>(null);
  const cows = useMemo(
    () =>
      [
        [-3.4, 1.4, 0.6, 1],
        [-1.2, 0.2, -0.4, 1.05],
        [1.8, 2.2, 2.6, 0.95],
        [4.6, -1.2, 0.3, 1],
        [-6.2, -3.5, 1.9, 0.9],
        [7.5, -4.5, -2.4, 0.85],
        [0.6, -6, 1.1, 0.8],
      ].map(([x, z, r, s], i) => ({
        position: [x, heightAt(x, z), z] as [number, number, number],
        rotation: r,
        scale: s,
        phase: i * 1.9,
      })),
    [],
  );

  // Un capo cammina lentamente lungo il pendio.
  useFrame((state) => {
    if (reduced || !walker.current) return;
    const t = state.clock.elapsedTime * 0.06;
    const x = -9 + ((t * 10) % 18);
    const z = 4.2 + Math.sin(t * 3) * 0.6;
    walker.current.position.set(x, heightAt(x, z), z);
    walker.current.position.y += Math.abs(Math.sin(state.clock.elapsedTime * 3)) * 0.02;
  });

  return (
    <>
      {cows.map((c, i) => (
        <Cow key={i} {...c} reduced={reduced} />
      ))}
      <group ref={walker}>
        <Cow position={[0, 0, 0]} rotation={0} phase={4} reduced={reduced} />
      </group>
    </>
  );
}

/** Muretti a secco: pietre calcaree instanziate lungo linee sinuose. */
function DryStoneWalls() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const stones = useMemo(() => {
    const r = rng(42);
    const list: { p: THREE.Vector3; s: THREE.Vector3; q: THREE.Euler }[] = [];
    const lines = [
      { z0: -2.5, amp: 0.8, freq: 0.25, from: -18, to: 18 },
      { z0: -11, amp: 1.4, freq: 0.15, from: -26, to: 26 },
    ];
    lines.forEach((l) => {
      for (let x = l.from; x < l.to; x += 0.26) {
        const z = l.z0 + Math.sin(x * l.freq) * l.amp;
        for (let row = 0; row < 3; row++) {
          list.push({
            p: new THREE.Vector3(
              x + r() * 0.08,
              heightAt(x, z) + 0.1 + row * 0.17,
              z + (r() - 0.5) * 0.12,
            ),
            s: new THREE.Vector3(0.18 + r() * 0.12, 0.13 + r() * 0.06, 0.2 + r() * 0.1),
            q: new THREE.Euler(r() * 0.5, r() * 3, r() * 0.5),
          });
        }
      }
    });
    return list;
  }, []);

  useEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const color = new THREE.Color();
    const r = rng(9);
    stones.forEach((st, i) => {
      m.compose(st.p, q.setFromEuler(st.q), st.s);
      mesh.setMatrixAt(i, m);
      mesh.setColorAt(i, color.set("#cfc3a6").offsetHSL(0, 0, (r() - 0.5) * 0.12));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [stones]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, stones.length]} castShadow receiveShadow>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial roughness={1} />
    </instancedMesh>
  );
}

/** Ulivo secolare: tronco contorto e chiome argentee. */
function OliveTree({
  position,
  scale = 1,
  phase = 0,
  reduced,
}: {
  position: [number, number, number];
  scale?: number;
  phase?: number;
  reduced: boolean;
}) {
  const crown = useRef<THREE.Group>(null);
  const blobs = useMemo(() => {
    const r = rng(Math.round(position[0] * 100 + 500));
    return Array.from({ length: 9 }, () => ({
      p: [(r() - 0.5) * 2.2, 2.1 + r() * 0.9, (r() - 0.5) * 2] as [number, number, number],
      s: 0.55 + r() * 0.5,
      c: r() > 0.5 ? "#7d8a5c" : "#9aa37a",
    }));
  }, [position]);

  useFrame((state) => {
    if (reduced || !crown.current) return;
    crown.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8 + phase) * 0.025;
  });

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.9, 0]} rotation={[0.1, 0, 0.18]} castShadow>
        <cylinderGeometry args={[0.18, 0.38, 1.9, 7]} />
        <meshStandardMaterial color="#5b4a39" roughness={1} />
      </mesh>
      <mesh position={[0.35, 1.7, 0.1]} rotation={[0, 0, -0.7]} castShadow>
        <cylinderGeometry args={[0.08, 0.15, 1.1, 6]} />
        <meshStandardMaterial color="#5b4a39" roughness={1} />
      </mesh>
      <group ref={crown}>
        {blobs.map((b, i) => (
          <mesh key={i} position={b.p} scale={b.s} castShadow>
            <icosahedronGeometry args={[1, 1]} />
            <meshStandardMaterial color={b.c} roughness={0.9} flatShading />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** Trullo all'orizzonte: richiamo alla Valle d'Itria. */
function Trullo({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} scale={1.6}>
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1.05, 1.2, 20]} />
        <meshStandardMaterial color="#efe6d2" roughness={1} />
      </mesh>
      <mesh position={[0, 1.9, 0]} castShadow>
        <coneGeometry args={[1.05, 1.6, 20]} />
        <meshStandardMaterial color="#6e6658" roughness={1} />
      </mesh>
      <mesh position={[0, 2.8, 0]}>
        <sphereGeometry args={[0.13, 10, 8]} />
        <meshStandardMaterial color="#efe6d2" />
      </mesh>
    </group>
  );
}

/** Polline e pulviscolo sospeso nella luce. */
function Pollen({ count, reduced }: { count: number; reduced: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const r = rng(3);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr.set([(r() - 0.5) * 24, 0.5 + r() * 4, -6 + r() * 14], i * 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return geo;
  }, [count]);

  useFrame((state, delta) => {
    if (reduced || !ref.current) return;
    ref.current.rotation.y += delta * 0.01;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial color="#fff4cf" size={0.045} transparent opacity={0.85} depthWrite={false} />
    </points>
  );
}

function Sun() {
  return (
    <mesh position={[-14, 9, -38]}>
      <circleGeometry args={[3.2, 40]} />
      <meshBasicMaterial color="#fff2c9" fog={false} toneMapped={false} />
    </mesh>
  );
}

/** Camera: respiro col mouse + discesa nel pascolo con lo scroll. */
function CameraRig({ reduced }: { reduced: boolean }) {
  const { camera, pointer } = useThree();
  const scroll = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      scroll.current = THREE.MathUtils.clamp(window.scrollY / window.innerHeight, 0, 1.2);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useFrame((state, delta) => {
    const s = reduced ? 0 : scroll.current;
    const px = reduced ? 0 : pointer.x;
    const py = reduced ? 0 : pointer.y;
    const drift = reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.1) * 0.4;
    const target = new THREE.Vector3(px * 1.4 + drift, 3.4 - s * 1.6 + py * 0.4, 13 - s * 4.5);
    camera.position.lerp(target, Math.min(1, delta * 2.5));
    camera.lookAt(px * 0.6, 1.1 - s * 0.4, -2);
  });

  return null;
}

/** Hero Allevamento: diorama 3D del pascolo nella luce del mattino. */
export function AllevamentoHero() {
  const reduced = useReducedMotion();
  const isSmall = typeof window !== "undefined" && window.innerWidth < 720;
  const grass = isSmall ? 2200 : 6500;

  return (
    <div className="hero-canvas-frame hero-canvas-frame--allevamento" aria-hidden="true">
      <Canvas
        shadows
        dpr={isSmall ? [1, 1.5] : [1, 1.75]}
        camera={{ position: [0, 3.4, 13], fov: 42, near: 0.1, far: 120 }}
        frameloop={reduced ? "demand" : "always"}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={[SKY]} />
        <fog attach="fog" args={[FOG, 14, 55]} />
        <hemisphereLight args={["#fff1d0", "#4d5226", 0.75]} />
        <directionalLight
          position={[-10, 12, 6]}
          intensity={2.1}
          color="#ffe3ad"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-16}
          shadow-camera-right={16}
          shadow-camera-top={12}
          shadow-camera-bottom={-12}
          shadow-bias={-0.0005}
        />
        <Sun />
        <Terrain />
        <WindGrass count={grass} reduced={reduced} />
        <DryStoneWalls />
        <Herd reduced={reduced} />
        <OliveTree position={[-8.5, heightAt(-8.5, -0.5), -0.5]} scale={1.15} reduced={reduced} />
        <OliveTree
          position={[9.5, heightAt(9.5, -4), -4]}
          scale={1.3}
          phase={2}
          reduced={reduced}
        />
        <OliveTree
          position={[-15, heightAt(-15, -9), -9]}
          scale={1.4}
          phase={1}
          reduced={reduced}
        />
        <OliveTree
          position={[3.5, heightAt(3.5, -13), -13]}
          scale={1.1}
          phase={3}
          reduced={reduced}
        />
        <OliveTree
          position={[17, heightAt(17, -15), -15]}
          scale={1.5}
          phase={4}
          reduced={reduced}
        />
        <Trullo position={[-5, heightAt(-5, -17), -17]} />
        <Pollen count={isSmall ? 120 : 260} reduced={reduced} />
        <CameraRig reduced={reduced} />
      </Canvas>
      <div className="hero-canvas-shade" />
    </div>
  );
}
