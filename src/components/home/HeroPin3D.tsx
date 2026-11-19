import { useEffect, useState } from "react";
import * as THREE from "three";
import type { AnimaId } from "@/data/masseria";

/**
 * Render a 3D icon to an offscreen canvas using Three.js, then display it as
 * an <img> inside the CSS flip-card. Each icon is built from real 3D geometry
 * (not SVG line art) and lit with directional + ambient lights for depth.
 */

// Shared renderer — reused across all four pins to avoid creating four WebGL contexts.
let sharedRenderer: THREE.WebGLRenderer | null = null;
let rendererRefCount = 0;

function getSharedRenderer(): THREE.WebGLRenderer {
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

function buildAllevamento(scene: THREE.Scene) {
  const bodyGeo = new THREE.CapsuleGeometry(0.35, 0.6, 8, 16);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xf5f0e8, roughness: 0.7, metalness: 0.0 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.rotation.z = Math.PI / 2;
  body.position.y = -0.05;
  scene.add(body);

  const headGeo = new THREE.SphereGeometry(0.22, 16, 16);
  const head = new THREE.Mesh(headGeo, bodyMat);
  head.position.set(0.45, 0.1, 0);
  scene.add(head);

  const snoutGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.12, 12);
  const snoutMat = new THREE.MeshStandardMaterial({ color: 0xe8c9a0, roughness: 0.6 });
  const snout = new THREE.Mesh(snoutGeo, snoutMat);
  snout.rotation.z = Math.PI / 2;
  snout.position.set(0.62, 0.05, 0);
  scene.add(snout);

  const earGeo = new THREE.ConeGeometry(0.06, 0.15, 8);
  const earL = new THREE.Mesh(earGeo, bodyMat);
  earL.position.set(0.42, 0.3, -0.12);
  earL.rotation.x = -0.4;
  earL.rotation.z = 0.3;
  scene.add(earL);
  const earR = earL.clone();
  earR.position.set(0.42, 0.3, 0.12);
  earR.rotation.x = 0.4;
  scene.add(earR);

  const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.35, 8);
  const legMat = new THREE.MeshStandardMaterial({ color: 0xd4c4a8, roughness: 0.8 });
  for (const [x, y, z] of [[-0.2, -0.35, -0.15], [-0.2, -0.35, 0.15], [0.2, -0.35, -0.15], [0.2, -0.35, 0.15]]) {
    const leg = new THREE.Mesh(legGeo, legMat);
    leg.position.set(x, y, z);
    scene.add(leg);
  }

  const spotGeo = new THREE.SphereGeometry(0.12, 12, 12);
  const spotMat = new THREE.MeshStandardMaterial({ color: 0x5c4a3a, roughness: 0.7 });
  const spot1 = new THREE.Mesh(spotGeo, spotMat);
  spot1.scale.set(1, 0.6, 1);
  spot1.position.set(-0.05, 0.08, 0.28);
  scene.add(spot1);
  const spot2 = new THREE.Mesh(spotGeo, spotMat);
  spot2.scale.set(0.8, 0.5, 0.8);
  spot2.position.set(0.15, 0.1, -0.25);
  scene.add(spot2);
}

function buildCaseificio(scene: THREE.Scene) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0.7, 0);
  shape.lineTo(0.7, 0.45);
  shape.lineTo(0, 0);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.35, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3,
  });
  geo.center();
  const mat = new THREE.MeshStandardMaterial({ color: 0xf0d060, roughness: 0.4, metalness: 0.05 });
  const wedge = new THREE.Mesh(geo, mat);
  wedge.rotation.y = -0.3;
  scene.add(wedge);

  const holeGeo = new THREE.SphereGeometry(0.04, 10, 10);
  const holeMat = new THREE.MeshStandardMaterial({ color: 0xd4b030, roughness: 0.5 });
  for (const [x, y, z] of [[0.08, 0.05, 0.1], [-0.1, -0.02, 0.05], [0.15, -0.05, -0.08], [-0.05, 0.08, -0.05]]) {
    const hole = new THREE.Mesh(holeGeo, holeMat);
    hole.position.set(x, y, z);
    scene.add(hole);
  }

  const rindGeo = new THREE.TorusGeometry(0.32, 0.02, 8, 24, Math.PI * 0.6);
  const rindMat = new THREE.MeshStandardMaterial({ color: 0xc89820, roughness: 0.6 });
  const rind = new THREE.Mesh(rindGeo, rindMat);
  rind.rotation.x = Math.PI / 2;
  rind.rotation.z = 0.8;
  rind.position.set(0.05, 0, 0);
  scene.add(rind);
}

function buildMacelleria(scene: THREE.Scene) {
  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(0, 0);
  bladeShape.lineTo(0.6, 0.02);
  bladeShape.lineTo(0.65, 0.08);
  bladeShape.lineTo(0.6, 0.14);
  bladeShape.lineTo(0, 0.12);
  bladeShape.lineTo(0, 0);

  const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, {
    depth: 0.03, bevelEnabled: true, bevelThickness: 0.005, bevelSize: 0.005, bevelSegments: 2,
  });
  bladeGeo.center();
  const bladeMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, roughness: 0.15, metalness: 0.9 });
  const blade = new THREE.Mesh(bladeGeo, bladeMat);
  blade.position.set(0.1, 0.1, 0);
  blade.rotation.z = 0.15;
  scene.add(blade);

  const handleGeo = new THREE.CylinderGeometry(0.05, 0.045, 0.35, 12);
  const handleMat = new THREE.MeshStandardMaterial({ color: 0x5c3a1e, roughness: 0.8, metalness: 0.0 });
  const handle = new THREE.Mesh(handleGeo, handleMat);
  handle.rotation.z = Math.PI / 2 + 0.15;
  handle.position.set(-0.28, -0.05, 0);
  scene.add(handle);

  const guardGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.04, 12);
  const guardMat = new THREE.MeshStandardMaterial({ color: 0xa0a0a0, roughness: 0.2, metalness: 0.8 });
  const guard = new THREE.Mesh(guardGeo, guardMat);
  guard.rotation.z = Math.PI / 2 + 0.15;
  guard.position.set(-0.1, 0.02, 0);
  scene.add(guard);

  const rivetGeo = new THREE.SphereGeometry(0.015, 8, 8);
  const rivetMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.2, metalness: 0.9 });
  for (let i = 0; i < 3; i++) {
    const rivet = new THREE.Mesh(rivetGeo, rivetMat);
    rivet.position.set(-0.2 - i * 0.08, -0.05 + i * 0.01, 0.04);
    scene.add(rivet);
  }
}

function buildAgriturismo(scene: THREE.Scene) {
  const plateGeo = new THREE.CylinderGeometry(0.4, 0.38, 0.04, 32);
  const plateMat = new THREE.MeshStandardMaterial({ color: 0xf8f4ec, roughness: 0.3, metalness: 0.05 });
  const plate = new THREE.Mesh(plateGeo, plateMat);
  plate.position.y = -0.1;
  scene.add(plate);

  const rimGeo = new THREE.TorusGeometry(0.38, 0.025, 12, 32);
  const rimMat = new THREE.MeshStandardMaterial({ color: 0xe8dcc8, roughness: 0.25, metalness: 0.1 });
  const rim = new THREE.Mesh(rimGeo, rimMat);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = -0.08;
  scene.add(rim);

  const cutleryMat = new THREE.MeshStandardMaterial({ color: 0xb8b8b8, roughness: 0.15, metalness: 0.85 });

  const forkHandleGeo = new THREE.CylinderGeometry(0.015, 0.012, 0.45, 8);
  const forkHandle = new THREE.Mesh(forkHandleGeo, cutleryMat);
  forkHandle.rotation.z = 0.25;
  forkHandle.position.set(-0.22, 0.12, 0);
  scene.add(forkHandle);

  const tineGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.12, 6);
  for (let i = 0; i < 4; i++) {
    const tine = new THREE.Mesh(tineGeo, cutleryMat);
    tine.position.set(-0.22 + (i - 1.5) * 0.015, 0.38, 0);
    tine.rotation.z = 0.25;
    scene.add(tine);
  }

  const knifeBladeGeo = new THREE.BoxGeometry(0.02, 0.2, 0.008);
  const knifeBlade = new THREE.Mesh(knifeBladeGeo, cutleryMat);
  knifeBlade.rotation.z = -0.25;
  knifeBlade.position.set(0.22, 0.32, 0);
  scene.add(knifeBlade);

  const knifeHandleGeo = new THREE.CylinderGeometry(0.018, 0.014, 0.25, 8);
  const knifeHandleMat = new THREE.MeshStandardMaterial({ color: 0x4a3520, roughness: 0.7 });
  const knifeHandle = new THREE.Mesh(knifeHandleGeo, knifeHandleMat);
  knifeHandle.rotation.z = -0.25;
  knifeHandle.position.set(0.22, 0.08, 0);
  scene.add(knifeHandle);

  const foodGeo = new THREE.SphereGeometry(0.08, 12, 12);
  const foodMat = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.6 });
  const food = new THREE.Mesh(foodGeo, foodMat);
  food.position.set(0, -0.06, 0);
  food.scale.y = 0.6;
  scene.add(food);

  const garnishGeo = new THREE.SphereGeometry(0.04, 8, 8);
  const garnishMat = new THREE.MeshStandardMaterial({ color: 0x4a7c3f, roughness: 0.5 });
  const garnish = new THREE.Mesh(garnishGeo, garnishMat);
  garnish.position.set(0.1, -0.06, 0.05);
  scene.add(garnish);
}

const BUILDERS: Record<AnimaId, (scene: THREE.Scene) => void> = {
  allevamento: buildAllevamento,
  caseificio: buildCaseificio,
  macelleria: buildMacelleria,
  agriturismo: buildAgriturismo,
};

// ── Component ──────────────────────────────────────────────────────────────────

interface HeroPin3DProps {
  id: AnimaId;
  numero: string;
  nome: string;
}

export function HeroPin3D({ id, numero, nome }: HeroPin3DProps) {
  // useState triggers a re-render once the Three.js icon is rendered to a data URL.
  // useRef would NOT cause a re-render, leaving the circle empty.
  const [iconSrc, setIconSrc] = useState<string | null>(null);

  useEffect(() => {
    const renderer = getSharedRenderer();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 10);
    camera.position.set(0, 0.3, 1.8);
    camera.lookAt(0, 0, 0);

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xfff5e0, 1.2);
    dirLight.position.set(2, 3, 2);
    scene.add(dirLight);
    const fillLight = new THREE.DirectionalLight(0xe0e8ff, 0.4);
    fillLight.position.set(-2, 1, -1);
    scene.add(fillLight);

    BUILDERS[id](scene);

    renderer.render(scene, camera);
    const dataUrl = renderer.domElement.toDataURL("image/png");
    setIconSrc(dataUrl);

    // Cleanup scene resources
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    });

    return () => {
      releaseSharedRenderer();
    };
  }, [id]);

  return (
    <div className="hero-pin-3d" aria-label={nome}>
      <div className="hero-pin-3d-object">
        <div className="hero-pin-3d-face hero-pin-3d-face--front">
          {iconSrc ? (
            <img
              src={iconSrc}
              alt=""
              aria-hidden="true"
              width={64}
              height={64}
              className="hero-pin-3d-icon"
            />
          ) : null}
        </div>
        <div className="hero-pin-3d-face hero-pin-3d-face--back">
          <span>{numero}</span>
        </div>
      </div>
      <span className="hero-pin-3d-shadow" aria-hidden="true" />
    </div>
  );
}