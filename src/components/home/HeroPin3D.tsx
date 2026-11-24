import { useEffect, useState } from "react";
import type { AnimaId } from "@/data/masseria";

// Dynamic import of three — only loaded when this component mounts (homepage only).
// shortcut: three is ~664KB; lazy-loading avoids it on 12/13 pages. Upgrade to React.lazy wrapper if SSR hydration issues arise.
type ThreeModule = typeof import("three");
let threeModule: ThreeModule | null = null;

async function loadThree(): Promise<ThreeModule> {
  if (!threeModule) {
    threeModule = await import("three");
  }
  return threeModule;
}

// Shared renderer — single WebGL context for all pins.
let sharedRenderer: InstanceType<ThreeModule["WebGLRenderer"]> | null = null;
let rendererRefCount = 0;

function getSharedRenderer(THREE: ThreeModule) {
  if (!sharedRenderer) {
    sharedRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    sharedRenderer.setPixelRatio(2);
    sharedRenderer.setSize(128, 128);
    sharedRenderer.setClearColor(0x000000, 0);
    sharedRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    sharedRenderer.toneMappingExposure = 1.2;
  }
  rendererRefCount++;
  return sharedRenderer;
}

function releaseSharedRenderer() {
  rendererRefCount--;
  if (rendererRefCount <= 0 && sharedRenderer) {
    sharedRenderer.dispose();
    sharedRenderer = null;
    rendererRefCount = 0;
  }
}

// ── Icon builders ──────────────────────────────────────────────────────────────

function buildAllevamento(THREE: ThreeModule, scene: InstanceType<ThreeModule["Scene"]>) {
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xf5f0e8, roughness: 0.7 });
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.35, 0.6, 8, 16), bodyMat);
  body.rotation.z = Math.PI / 2;
  body.position.y = -0.05;
  scene.add(body);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), bodyMat);
  head.position.set(0.45, 0.1, 0);
  scene.add(head);

  const snout = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.12, 0.12, 12),
    new THREE.MeshStandardMaterial({ color: 0xe8c9a0, roughness: 0.6 }),
  );
  snout.rotation.z = Math.PI / 2;
  snout.position.set(0.62, 0.05, 0);
  scene.add(snout);

  const earGeo = new THREE.ConeGeometry(0.06, 0.15, 8);
  const earL = new THREE.Mesh(earGeo, bodyMat);
  earL.position.set(0.42, 0.3, -0.12);
  earL.rotation.set(-0.4, 0, 0.3);
  scene.add(earL);
  const earR = earL.clone();
  earR.position.set(0.42, 0.3, 0.12);
  earR.rotation.set(0.4, 0, 0);
  scene.add(earR);

  const legMat = new THREE.MeshStandardMaterial({ color: 0xd4c4a8, roughness: 0.8 });
  const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.35, 8);
  for (const [x, y, z] of [
    [-0.2, -0.35, -0.15],
    [-0.2, -0.35, 0.15],
    [0.2, -0.35, -0.15],
    [0.2, -0.35, 0.15],
  ]) {
    const leg = new THREE.Mesh(legGeo, legMat);
    leg.position.set(x, y, z);
    scene.add(leg);
  }

  const spotMat = new THREE.MeshStandardMaterial({ color: 0x5c4a3a, roughness: 0.7 });
  const spotGeo = new THREE.SphereGeometry(0.12, 12, 12);
  const s1 = new THREE.Mesh(spotGeo, spotMat);
  s1.scale.set(1, 0.6, 1);
  s1.position.set(-0.05, 0.08, 0.28);
  scene.add(s1);
  const s2 = new THREE.Mesh(spotGeo, spotMat);
  s2.scale.set(0.8, 0.5, 0.8);
  s2.position.set(0.15, 0.1, -0.25);
  scene.add(s2);
}

function buildCaseificio(THREE: ThreeModule, scene: InstanceType<ThreeModule["Scene"]>) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0.7, 0);
  shape.lineTo(0.7, 0.45);
  shape.lineTo(0, 0);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.35,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.03,
    bevelSegments: 3,
  });
  geo.center();
  const wedge = new THREE.Mesh(
    geo,
    new THREE.MeshStandardMaterial({ color: 0xf0d060, roughness: 0.4, metalness: 0.05 }),
  );
  wedge.rotation.y = -0.3;
  scene.add(wedge);

  const holeMat = new THREE.MeshStandardMaterial({ color: 0xd4b030, roughness: 0.5 });
  const holeGeo = new THREE.SphereGeometry(0.04, 10, 10);
  for (const [x, y, z] of [
    [0.08, 0.05, 0.1],
    [-0.1, -0.02, 0.05],
    [0.15, -0.05, -0.08],
    [-0.05, 0.08, -0.05],
  ]) {
    const h = new THREE.Mesh(holeGeo, holeMat);
    h.position.set(x, y, z);
    scene.add(h);
  }

  const rind = new THREE.Mesh(
    new THREE.TorusGeometry(0.32, 0.02, 8, 24, Math.PI * 0.6),
    new THREE.MeshStandardMaterial({ color: 0xc89820, roughness: 0.6 }),
  );
  rind.rotation.set(Math.PI / 2, 0, 0.8);
  rind.position.set(0.05, 0, 0);
  scene.add(rind);
}

function buildMacelleria(THREE: ThreeModule, scene: InstanceType<ThreeModule["Scene"]>) {
  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(0, 0);
  bladeShape.lineTo(0.6, 0.02);
  bladeShape.lineTo(0.65, 0.08);
  bladeShape.lineTo(0.6, 0.14);
  bladeShape.lineTo(0, 0.12);
  bladeShape.lineTo(0, 0);
  const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, {
    depth: 0.03,
    bevelEnabled: true,
    bevelThickness: 0.005,
    bevelSize: 0.005,
    bevelSegments: 2,
  });
  bladeGeo.center();
  const blade = new THREE.Mesh(
    bladeGeo,
    new THREE.MeshStandardMaterial({ color: 0xc0c0c0, roughness: 0.15, metalness: 0.9 }),
  );
  blade.position.set(0.1, 0.1, 0);
  blade.rotation.z = 0.15;
  scene.add(blade);

  const handle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.045, 0.35, 12),
    new THREE.MeshStandardMaterial({ color: 0x5c3a1e, roughness: 0.8 }),
  );
  handle.rotation.z = Math.PI / 2 + 0.15;
  handle.position.set(-0.28, -0.05, 0);
  scene.add(handle);

  const guard = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 0.04, 12),
    new THREE.MeshStandardMaterial({ color: 0xa0a0a0, roughness: 0.2, metalness: 0.8 }),
  );
  guard.rotation.z = Math.PI / 2 + 0.15;
  guard.position.set(-0.1, 0.02, 0);
  scene.add(guard);

  const rivetMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.2,
    metalness: 0.9,
  });
  const rivetGeo = new THREE.SphereGeometry(0.015, 8, 8);
  for (let i = 0; i < 3; i++) {
    const r = new THREE.Mesh(rivetGeo, rivetMat);
    r.position.set(-0.2 - i * 0.08, -0.05 + i * 0.01, 0.04);
    scene.add(r);
  }
}

function buildAgriturismo(THREE: ThreeModule, scene: InstanceType<ThreeModule["Scene"]>) {
  const plate = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.38, 0.04, 32),
    new THREE.MeshStandardMaterial({ color: 0xf8f4ec, roughness: 0.3, metalness: 0.05 }),
  );
  plate.position.y = -0.1;
  scene.add(plate);

  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(0.38, 0.025, 12, 32),
    new THREE.MeshStandardMaterial({ color: 0xe8dcc8, roughness: 0.25, metalness: 0.1 }),
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.y = -0.08;
  scene.add(rim);

  const cutleryMat = new THREE.MeshStandardMaterial({
    color: 0xb8b8b8,
    roughness: 0.15,
    metalness: 0.85,
  });

  const forkHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.012, 0.45, 8), cutleryMat);
  forkHandle.rotation.z = 0.25;
  forkHandle.position.set(-0.22, 0.12, 0);
  scene.add(forkHandle);

  const tineGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.12, 6);
  for (let i = 0; i < 4; i++) {
    const t = new THREE.Mesh(tineGeo, cutleryMat);
    t.position.set(-0.22 + (i - 1.5) * 0.015, 0.38, 0);
    t.rotation.z = 0.25;
    scene.add(t);
  }

  const knifeBlade = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.2, 0.008), cutleryMat);
  knifeBlade.rotation.z = -0.25;
  knifeBlade.position.set(0.22, 0.32, 0);
  scene.add(knifeBlade);

  const knifeHandle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.018, 0.014, 0.25, 8),
    new THREE.MeshStandardMaterial({ color: 0x4a3520, roughness: 0.7 }),
  );
  knifeHandle.rotation.z = -0.25;
  knifeHandle.position.set(0.22, 0.08, 0);
  scene.add(knifeHandle);

  const food = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.6 }),
  );
  food.position.set(0, -0.06, 0);
  food.scale.y = 0.6;
  scene.add(food);

  const garnish = new THREE.Mesh(
    new THREE.SphereGeometry(0.04, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0x4a7c3f, roughness: 0.5 }),
  );
  garnish.position.set(0.1, -0.06, 0.05);
  scene.add(garnish);
}

function buildMarket(THREE: ThreeModule, scene: InstanceType<ThreeModule["Scene"]>) {
  // Warm brown bag body — wider & shorter so it reads as a shopping bag at 64px
  const bagMat = new THREE.MeshStandardMaterial({ color: 0xa0522d, roughness: 0.7 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.3), bagMat);
  body.position.y = -0.15;
  scene.add(body);

  // Open/folded top rim — darker strip to suggest an opening
  const rim = new THREE.Mesh(
    new THREE.BoxGeometry(0.72, 0.06, 0.32),
    new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.75 }),
  );
  rim.position.y = 0.12;
  scene.add(rim);

  // Thick handle arc — visible at small render size
  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(0.18, 0.04, 8, 20, Math.PI),
    new THREE.MeshStandardMaterial({ color: 0x6b3410, roughness: 0.5, metalness: 0.05 }),
  );
  handle.rotation.x = Math.PI / 2;
  handle.position.set(0, 0.28, 0);
  scene.add(handle);

  // Cream front panel — contrasting label area for depth
  const panel = new THREE.Mesh(
    new THREE.PlaneGeometry(0.38, 0.26),
    new THREE.MeshStandardMaterial({ color: 0xfaf3e0, roughness: 0.4 }),
  );
  panel.position.set(0, -0.12, 0.151);
  scene.add(panel);

  // Accent stripe on panel — warm red-brown brand mark
  const stripe = new THREE.Mesh(
    new THREE.PlaneGeometry(0.28, 0.04),
    new THREE.MeshStandardMaterial({ color: 0xb5451b, roughness: 0.45 }),
  );
  stripe.position.set(0, -0.12, 0.153);
  scene.add(stripe);
}

type PinId = AnimaId | "market";

const BUILDERS: Record<
  PinId,
  (THREE: ThreeModule, scene: InstanceType<ThreeModule["Scene"]>) => void
> = {
  allevamento: buildAllevamento,
  caseificio: buildCaseificio,
  macelleria: buildMacelleria,
  agriturismo: buildAgriturismo,
  market: buildMarket,
};

// ── Component ──────────────────────────────────────────────────────────────────

interface HeroPin3DProps {
  id: PinId;
  numero: string;
  nome: string;
}

export function HeroPin3D({ id, numero, nome }: HeroPin3DProps) {
  const [iconSrc, setIconSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const THREE = await loadThree();
      if (cancelled) return;

      const renderer = getSharedRenderer(THREE);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 10);
      camera.position.set(0, 0.3, 1.8);
      camera.lookAt(0, 0, 0);

      scene.add(new THREE.AmbientLight(0xffffff, 0.6));
      const dir = new THREE.DirectionalLight(0xfff5e0, 1.2);
      dir.position.set(2, 3, 2);
      scene.add(dir);
      const fill = new THREE.DirectionalLight(0xe0e8ff, 0.4);
      fill.position.set(-2, 1, -1);
      scene.add(fill);

      BUILDERS[id](THREE, scene);
      renderer.render(scene, camera);
      setIconSrc(renderer.domElement.toDataURL("image/png"));

      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          const mats = Array.isArray(child.material) ? child.material : [child.material];
          mats.forEach((m) => m.dispose());
        }
      });
    })();

    return () => {
      cancelled = true;
      releaseSharedRenderer();
    };
  }, [id]);

  return (
    <div className="hero-pin-marker" aria-label={nome}>
      {/* Animated map marker ring */}
      <span className="hero-pin-pulse" aria-hidden="true" />
      <span className="hero-pin-pulse hero-pin-pulse--delayed" aria-hidden="true" />

      {/* 3D icon — no background, no circle */}
      <div className="hero-pin-icon-wrap">
        {iconSrc && (
          <img
            src={iconSrc}
            alt=""
            aria-hidden="true"
            width={64}
            height={64}
            className="hero-pin-icon"
          />
        )}
      </div>

      {/* Label on hover */}
      <span className="hero-pin-label">{numero}</span>

      {/* Ground shadow */}
      <span className="hero-pin-ground-shadow" aria-hidden="true" />
    </div>
  );
}
