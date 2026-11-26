import { useEffect, useState } from "react";
import type { AnimaId } from "@/data/masseria";

// Dynamic import of three — only loaded when this component mounts (homepage only).
// shortcut: three is ~664KB; lazy-loading avoids it on other pages.
type ThreeModule = typeof import("three");
type RoomEnvironmentModule = typeof import("three/examples/jsm/environments/RoomEnvironment.js");

let threeModule: ThreeModule | null = null;
let roomEnvModule: RoomEnvironmentModule | null = null;

async function loadThreeBundle(): Promise<{
  THREE: ThreeModule;
  RoomEnvironment: RoomEnvironmentModule["RoomEnvironment"];
}> {
  if (!threeModule || !roomEnvModule) {
    const [t, r] = await Promise.all([
      import("three"),
      import("three/examples/jsm/environments/RoomEnvironment.js"),
    ]);
    threeModule = t;
    roomEnvModule = r;
  }
  return { THREE: threeModule, RoomEnvironment: roomEnvModule.RoomEnvironment };
}

// Shared offscreen renderer & studio environment — single WebGL context for all 5 pins.
let sharedRenderer: InstanceType<ThreeModule["WebGLRenderer"]> | null = null;
let sharedEnvMap: InstanceType<ThreeModule["Texture"]> | null = null;
let rendererRefCount = 0;

function getSharedStudio(
  THREE: ThreeModule,
  RoomEnvironment: RoomEnvironmentModule["RoomEnvironment"],
) {
  if (!sharedRenderer) {
    sharedRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    sharedRenderer.setPixelRatio(2);
    sharedRenderer.setSize(256, 256);
    sharedRenderer.setClearColor(0x000000, 0);
    sharedRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    sharedRenderer.toneMappingExposure = 1.15;

    const pmrem = new THREE.PMREMGenerator(sharedRenderer);
    const envScene = new RoomEnvironment();
    sharedEnvMap = pmrem.fromScene(envScene, 0.04).texture;
    envScene.dispose();
    pmrem.dispose();
  }
  rendererRefCount++;
  return { renderer: sharedRenderer, envMap: sharedEnvMap };
}

function releaseSharedStudio() {
  rendererRefCount--;
  if (rendererRefCount <= 0) {
    sharedEnvMap?.dispose();
    sharedEnvMap = null;
    sharedRenderer?.dispose();
    sharedRenderer = null;
    rendererRefCount = 0;
  }
}

// ── Icon builders (256x256 studio 3/4 view) ────────────────────────────────────

function buildAllevamento(THREE: ThreeModule, scene: InstanceType<ThreeModule["Scene"]>) {
  // Mucca Pezzata Rossa orientata a 3/4 verso la camera
  const g = new THREE.Group();
  g.rotation.y = -0.32;
  g.position.set(-0.04, 0.02, 0);

  const creamMat = new THREE.MeshStandardMaterial({ color: 0xf7f1e5, roughness: 0.58 });
  const redBrownMat = new THREE.MeshStandardMaterial({ color: 0x7d3a1d, roughness: 0.62 });
  const muzzleMat = new THREE.MeshStandardMaterial({ color: 0xe8baa4, roughness: 0.5 });
  const hornMat = new THREE.MeshStandardMaterial({ color: 0xede0c2, roughness: 0.35 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x241a14, roughness: 0.5 });
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.22,
    metalness: 0.88,
  });

  // Tronco pieno
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.34, 14, 28), creamMat);
  body.rotation.z = Math.PI / 2;
  body.scale.set(0.95, 1, 0.88);
  body.position.set(-0.04, -0.04, 0);
  g.add(body);

  // Pezzature castano-rossicce aderenti alla curvatura del dorso (nessuna sfera sporgente)
  const saddle = new THREE.Mesh(
    new THREE.SphereGeometry(0.224, 24, 20, 0.4, 2.2, 0.2, 1.4),
    redBrownMat,
  );
  saddle.scale.set(1.25, 0.96, 0.88);
  saddle.position.set(-0.05, -0.04, 0);
  saddle.rotation.y = 0.4;
  g.add(saddle);

  const flankPatch = new THREE.Mesh(
    new THREE.SphereGeometry(0.223, 20, 18, 2.6, 1.7, 0.6, 1.3),
    redBrownMat,
  );
  flankPatch.scale.set(1.1, 0.96, 0.88);
  flankPatch.position.set(0.06, -0.04, 0);
  g.add(flankPatch);

  // Collo massiccio
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.165, 0.24, 20), creamMat);
  neck.position.set(0.24, 0.09, 0);
  neck.rotation.z = -0.58;
  g.add(neck);

  // Collare in cuoio + campanaccio in ottone
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.142, 0.02, 10, 24), redBrownMat);
  collar.position.set(0.23, 0.08, 0);
  collar.rotation.set(Math.PI / 2, 0, -0.58);
  g.add(collar);

  const bell = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.046, 0.072, 16), brassMat);
  bell.position.set(0.32, -0.06, 0.02);
  g.add(bell);

  // Testa scolpita a 3/4
  const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.145, 22, 20), creamMat);
  cranium.scale.set(1.22, 0.96, 0.92);
  cranium.position.set(0.35, 0.21, 0);
  cranium.rotation.z = -0.25;
  g.add(cranium);

  // Macchia rossa intorno all'occhio destro (tipica Pezzata Rossa)
  const headPatch = new THREE.Mesh(
    new THREE.SphereGeometry(0.148, 18, 16, 0.2, 1.5, 0.6, 1.4),
    redBrownMat,
  );
  headPatch.scale.set(1.2, 0.96, 0.92);
  headPatch.position.set(0.35, 0.21, 0);
  headPatch.rotation.z = -0.25;
  g.add(headPatch);

  // Muso largo e piatto rosato + narici
  const muzzle = new THREE.Mesh(new THREE.CapsuleGeometry(0.082, 0.07, 10, 18), muzzleMat);
  muzzle.rotation.set(Math.PI / 2, 0, 0);
  muzzle.scale.set(0.85, 1, 0.85);
  muzzle.position.set(0.49, 0.14, 0);
  g.add(muzzle);

  for (const nz of [-0.042, 0.042]) {
    const nostril = new THREE.Mesh(new THREE.SphereGeometry(0.014, 8, 8), darkMat);
    nostril.position.set(0.555, 0.15, nz);
    g.add(nostril);
  }

  // Occhi scuri
  for (const ez of [-0.105, 0.105]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.022, 12, 12), darkMat);
    eye.position.set(0.41, 0.24, ez);
    g.add(eye);
  }

  // Corna d'avorio curve verso l'alto
  const hornGeo = new THREE.TorusGeometry(0.078, 0.017, 10, 18, Math.PI * 0.62);
  const hornL = new THREE.Mesh(hornGeo, hornMat);
  hornL.position.set(0.33, 0.34, -0.07);
  hornL.rotation.set(-0.35, Math.PI / 2, 0.35);
  g.add(hornL);

  const hornR = new THREE.Mesh(hornGeo, hornMat);
  hornR.position.set(0.33, 0.34, 0.07);
  hornR.rotation.set(0.35, -Math.PI / 2, -0.35);
  g.add(hornR);

  // Orecchie laterali
  const earGeo = new THREE.CapsuleGeometry(0.024, 0.07, 6, 12);
  const earL = new THREE.Mesh(earGeo, creamMat);
  earL.position.set(0.30, 0.27, -0.16);
  earL.rotation.set(Math.PI / 2.3, 0.2, 0.2);
  g.add(earL);

  const earR = new THREE.Mesh(earGeo, redBrownMat);
  earR.position.set(0.30, 0.27, 0.16);
  earR.rotation.set(-Math.PI / 2.3, -0.2, 0.2);
  g.add(earR);

  // 4 zampe + zoccoli scuri
  const legGeo = new THREE.CylinderGeometry(0.04, 0.032, 0.26, 12);
  const hoofGeo = new THREE.CylinderGeometry(0.035, 0.04, 0.045, 12);
  const legCoords: Array<[number, number]> = [
    [-0.22, -0.11],
    [-0.22, 0.11],
    [0.14, -0.11],
    [0.14, 0.11],
  ];
  for (const [lx, lz] of legCoords) {
    const leg = new THREE.Mesh(legGeo, creamMat);
    leg.position.set(lx, -0.26, lz);
    g.add(leg);
    const hoof = new THREE.Mesh(hoofGeo, darkMat);
    hoof.position.set(lx, -0.4, lz);
    g.add(hoof);
  }

  // Coda posteriore
  const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.01, 0.26, 8), creamMat);
  tail.position.set(-0.37, -0.1, 0);
  tail.rotation.z = -0.25;
  g.add(tail);
  const tailTuft = new THREE.Mesh(new THREE.SphereGeometry(0.024, 10, 10), redBrownMat);
  tailTuft.position.set(-0.4, -0.23, 0);
  g.add(tailTuft);

  scene.add(g);
}

function buildCaseificio(THREE: ThreeModule, scene: InstanceType<ThreeModule["Scene"]>) {
  // Caciocavallo pugliese tornito (LatheGeometry) + Mozzarella nodino lucida
  const g = new THREE.Group();

  const rindMat = new THREE.MeshStandardMaterial({
    color: 0xe4b858,
    roughness: 0.34,
    metalness: 0.04,
  });
  const twineMat = new THREE.MeshStandardMaterial({ color: 0xb08b50, roughness: 0.85 });
  const milkMat = new THREE.MeshStandardMaterial({
    color: 0xfffdf8,
    roughness: 0.14,
    metalness: 0.02,
  });

  // Profilo Caciocavallo a goccia con strozzatura e testina
  const cacioProfile = [
    new THREE.Vector2(0, -0.36),
    new THREE.Vector2(0.14, -0.35),
    new THREE.Vector2(0.24, -0.24),
    new THREE.Vector2(0.275, -0.09),
    new THREE.Vector2(0.22, 0.05),
    new THREE.Vector2(0.11, 0.14),
    new THREE.Vector2(0.075, 0.19), // collo
    new THREE.Vector2(0.132, 0.27), // testina
    new THREE.Vector2(0.105, 0.34),
    new THREE.Vector2(0, 0.37),
  ];
  const cacioGroup = new THREE.Group();
  cacioGroup.position.set(-0.14, 0.03, -0.05);
  cacioGroup.rotation.z = 0.06;

  const cacio = new THREE.Mesh(new THREE.LatheGeometry(cacioProfile, 36), rindMat);
  cacioGroup.add(cacio);

  // Spago stretto attorno al collo + asola superiore
  const neckTwine = new THREE.Mesh(new THREE.TorusGeometry(0.088, 0.017, 10, 24), twineMat);
  neckTwine.rotation.x = Math.PI / 2;
  neckTwine.position.y = 0.19;
  cacioGroup.add(neckTwine);

  const loopTwine = new THREE.Mesh(new THREE.TorusGeometry(0.068, 0.013, 8, 22), twineMat);
  loopTwine.position.set(0, 0.41, 0);
  cacioGroup.add(loopTwine);

  g.add(cacioGroup);

  // Mozzarella / Nodino pugliese in primo piano a destra
  const nodinoGroup = new THREE.Group();
  nodinoGroup.position.set(0.22, -0.18, 0.16);
  nodinoGroup.rotation.y = -0.4;

  const baseBall = new THREE.Mesh(new THREE.SphereGeometry(0.165, 28, 24), milkMat);
  baseBall.scale.set(1.12, 0.82, 1.0);
  nodinoGroup.add(baseBall);

  // Nodo intrecciato sopra la mozzarella
  const knotArc = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.034, 14, 24), milkMat);
  knotArc.position.set(0, 0.115, 0);
  knotArc.rotation.set(0.45, 0.3, 0);
  nodinoGroup.add(knotArc);

  const knotTip = new THREE.Mesh(new THREE.CapsuleGeometry(0.028, 0.045, 8, 14), milkMat);
  knotTip.position.set(0.06, 0.15, 0.02);
  knotTip.rotation.z = -0.9;
  nodinoGroup.add(knotTip);

  g.add(nodinoGroup);
  scene.add(g);
}

function buildMacelleria(THREE: ThreeModule, scene: InstanceType<ThreeModule["Scene"]>) {
  // Mannaia da macellaio piantata nel ceppo tondo in quercia
  const g = new THREE.Group();
  g.rotation.y = -0.22;

  const oakSideMat = new THREE.MeshStandardMaterial({ color: 0x744321, roughness: 0.72 });
  const oakTopMat = new THREE.MeshStandardMaterial({ color: 0xd9af7a, roughness: 0.56 });
  const ironMat = new THREE.MeshStandardMaterial({
    color: 0x262422,
    roughness: 0.35,
    metalness: 0.85,
  });
  const steelMat = new THREE.MeshStandardMaterial({
    color: 0xdce2e8,
    roughness: 0.15,
    metalness: 0.92,
  });
  const walnutMat = new THREE.MeshStandardMaterial({ color: 0x432310, roughness: 0.52 });
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.22,
    metalness: 0.9,
  });

  // Ceppo cilindrico da macellaio
  const blockBody = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.365, 0.24, 36), oakSideMat);
  blockBody.position.y = -0.22;
  g.add(blockBody);

  // Piano superiore chiaro (legno di testa)
  const blockTop = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.016, 36), oakTopMat);
  blockTop.position.y = -0.095;
  g.add(blockTop);

  // Doppia cerchiatura in ferro battuto
  for (const hy of [-0.15, -0.28]) {
    const hoop = new THREE.Mesh(new THREE.TorusGeometry(0.362, 0.016, 10, 36), ironMat);
    hoop.rotation.x = Math.PI / 2;
    hoop.position.y = hy;
    g.add(hoop);
  }

  // Tre piedi corti robusti sotto il ceppo
  const footGeo = new THREE.CylinderGeometry(0.055, 0.045, 0.09, 12);
  for (let i = 0; i < 3; i++) {
    const a = (i * Math.PI * 2) / 3 + 0.4;
    const foot = new THREE.Mesh(footGeo, oakSideMat);
    foot.position.set(Math.cos(a) * 0.24, -0.37, Math.sin(a) * 0.24);
    g.add(foot);
  }

  // Mannaia piantata diagonalmente nel ceppo
  const cleaver = new THREE.Group();
  cleaver.position.set(0.03, 0.09, 0.02);
  cleaver.rotation.set(0, 0.32, 0.46);

  // Lama rettangolare larga con foro d'aggancio vero (ExtrudeGeometry hole)
  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(-0.22, -0.11);
  bladeShape.lineTo(0.2, -0.14);
  bladeShape.quadraticCurveTo(0.24, 0.0, 0.22, 0.14);
  bladeShape.lineTo(-0.22, 0.13);
  bladeShape.closePath();

  const holePath = new THREE.Path();
  holePath.absarc(0.145, 0.075, 0.026, 0, Math.PI * 2, true);
  bladeShape.holes.push(holePath);

  const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, {
    depth: 0.02,
    bevelEnabled: true,
    bevelThickness: 0.005,
    bevelSize: 0.005,
    bevelSegments: 2,
  });
  bladeGeo.center();
  const blade = new THREE.Mesh(bladeGeo, steelMat);
  blade.position.set(0.08, -0.02, 0);
  cleaver.add(blade);

  // Ghiera metallica
  const bolster = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.085, 0.045), steelMat);
  bolster.position.set(-0.16, 0.065, 0);
  cleaver.add(bolster);

  // Manico in noce + 3 rivetti in ottone
  const handle = new THREE.Mesh(new THREE.CapsuleGeometry(0.038, 0.26, 8, 16), walnutMat);
  handle.rotation.z = Math.PI / 2 - 0.08;
  handle.scale.set(0.85, 1, 0.65);
  handle.position.set(-0.33, 0.09, 0);
  cleaver.add(handle);

  const rivetGeo = new THREE.CylinderGeometry(0.011, 0.011, 0.056, 10);
  rivetGeo.rotateX(Math.PI / 2);
  for (let i = 0; i < 3; i++) {
    const r = new THREE.Mesh(rivetGeo, brassMat);
    r.position.set(-0.24 - i * 0.085, 0.078 + i * 0.007, 0);
    cleaver.add(r);
  }

  g.add(cleaver);
  scene.add(g);
}

function buildAgriturismo(THREE: ThreeModule, scene: InstanceType<ThreeModule["Scene"]>) {
  // Piatto in ceramica pugliese (con taralli) + Calice di vino rosso Primitivo
  const g = new THREE.Group();

  const ceramicMat = new THREE.MeshStandardMaterial({
    color: 0xfbf5e8,
    roughness: 0.16,
    metalness: 0.04,
  });
  const carmineMat = new THREE.MeshStandardMaterial({ color: 0x9b2233, roughness: 0.35 });
  const goldTrimMat = new THREE.MeshStandardMaterial({
    color: 0xb2833a,
    roughness: 0.25,
    metalness: 0.6,
  });
  const taralloMat = new THREE.MeshStandardMaterial({ color: 0xd6933e, roughness: 0.68 });
  const oliveMat = new THREE.MeshStandardMaterial({ color: 0x303e20, roughness: 0.4 });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xf0f6fa,
    roughness: 0.06,
    metalness: 0.1,
    transparent: true,
    opacity: 0.42,
    depthWrite: false,
  });
  const wineMat = new THREE.MeshStandardMaterial({
    color: 0x6e0d1d,
    roughness: 0.12,
    metalness: 0.05,
  });

  // Piatto in ceramica tornito (front-left)
  const plateGroup = new THREE.Group();
  plateGroup.position.set(-0.11, -0.22, 0.08);
  plateGroup.rotation.x = 0.15;

  const plateProfile = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.17, 0),
    new THREE.Vector2(0.22, 0.03),
    new THREE.Vector2(0.35, 0.075),
    new THREE.Vector2(0.365, 0.085),
    new THREE.Vector2(0.355, 0.092),
    new THREE.Vector2(0.22, 0.04),
    new THREE.Vector2(0, 0.016),
  ];
  const plate = new THREE.Mesh(new THREE.LatheGeometry(plateProfile, 36), ceramicMat);
  plateGroup.add(plate);

  // Filetto decorativo bicolore sul bordo ceramico
  const rimRed = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.011, 8, 36), carmineMat);
  rimRed.rotation.x = Math.PI / 2;
  rimRed.position.y = 0.078;
  plateGroup.add(rimRed);

  const rimGold = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.007, 8, 36), goldTrimMat);
  rimGold.rotation.x = Math.PI / 2;
  rimGold.position.y = 0.066;
  plateGroup.add(rimGold);

  // Due taralli pugliesi dorati e olive nel piatto
  const t1 = new THREE.Mesh(new THREE.TorusGeometry(0.068, 0.025, 12, 24), taralloMat);
  t1.rotation.set(Math.PI / 2 - 0.12, 0.2, 0);
  t1.position.set(-0.05, 0.052, 0.02);
  plateGroup.add(t1);

  const t2 = new THREE.Mesh(new THREE.TorusGeometry(0.064, 0.024, 12, 24), taralloMat);
  t2.rotation.set(Math.PI / 2 + 0.18, -0.15, 0.1);
  t2.position.set(0.07, 0.062, -0.04);
  plateGroup.add(t2);

  for (const [ox, oz] of [
    [-0.08, -0.07],
    [0.02, 0.08],
  ]) {
    const olive = new THREE.Mesh(new THREE.SphereGeometry(0.024, 10, 10), oliveMat);
    olive.scale.set(1.2, 0.9, 0.9);
    olive.position.set(ox, 0.045, oz);
    plateGroup.add(olive);
  }

  g.add(plateGroup);

  // Calice da vino rosso (back-right)
  const glassGroup = new THREE.Group();
  glassGroup.position.set(0.23, -0.25, -0.06);

  // Volume del vino interno (renderOrder 0)
  const wineProfile = [
    new THREE.Vector2(0, 0.265),
    new THREE.Vector2(0.09, 0.28),
    new THREE.Vector2(0.148, 0.34),
    new THREE.Vector2(0.158, 0.42),
    new THREE.Vector2(0, 0.42),
  ];
  const wine = new THREE.Mesh(new THREE.LatheGeometry(wineProfile, 32), wineMat);
  wine.renderOrder = 0;
  glassGroup.add(wine);

  // Calice in vetro traslucido sopra il vino (renderOrder 1)
  const gobletProfile = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.145, 0),
    new THREE.Vector2(0.14, 0.014),
    new THREE.Vector2(0.024, 0.03),
    new THREE.Vector2(0.017, 0.23),
    new THREE.Vector2(0.11, 0.265),
    new THREE.Vector2(0.168, 0.34),
    new THREE.Vector2(0.174, 0.43),
    new THREE.Vector2(0.148, 0.58),
    new THREE.Vector2(0.14, 0.58),
    new THREE.Vector2(0.164, 0.43),
    new THREE.Vector2(0.158, 0.34),
    new THREE.Vector2(0.095, 0.27),
    new THREE.Vector2(0, 0.258),
  ];
  const goblet = new THREE.Mesh(new THREE.LatheGeometry(gobletProfile, 32), glassMat);
  goblet.renderOrder = 1;
  glassGroup.add(goblet);

  g.add(glassGroup);
  scene.add(g);
}

function buildMarket(THREE: ThreeModule, scene: InstanceType<ThreeModule["Scene"]>) {
  // Cassetta di legno coi prodotti della Masseria (bottiglia d'olio, pane, caciotta, salame)
  const g = new THREE.Group();
  g.rotation.y = -0.34;
  g.position.set(0, -0.06, 0);

  const postMat = new THREE.MeshStandardMaterial({ color: 0x6f3e1e, roughness: 0.72 });
  const slatMat = new THREE.MeshStandardMaterial({ color: 0xba7c42, roughness: 0.62 });
  const labelMat = new THREE.MeshStandardMaterial({ color: 0xfaf2df, roughness: 0.45 });
  const brandBarMat = new THREE.MeshStandardMaterial({ color: 0x9b2233, roughness: 0.4 });

  // Fondo della cassetta
  const bottom = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.04, 0.48), postMat);
  bottom.position.y = -0.24;
  g.add(bottom);

  // 4 montanti angolari
  const postGeo = new THREE.BoxGeometry(0.05, 0.34, 0.05);
  for (const [px, pz] of [
    [-0.31, -0.22],
    [0.31, -0.22],
    [-0.31, 0.22],
    [0.31, 0.22],
  ]) {
    const post = new THREE.Mesh(postGeo, postMat);
    post.position.set(px, -0.09, pz);
    g.add(post);
  }

  // Due listelli orizzontali per lato (con aria in mezzo)
  const fbSlatGeo = new THREE.BoxGeometry(0.68, 0.11, 0.025);
  const lrSlatGeo = new THREE.BoxGeometry(0.025, 0.11, 0.5);
  for (const sy of [-0.17, -0.02]) {
    for (const sz of [-0.23, 0.23]) {
      const s = new THREE.Mesh(fbSlatGeo, slatMat);
      s.position.set(0, sy, sz);
      g.add(s);
    }
    for (const sx of [-0.325, 0.325]) {
      const s = new THREE.Mesh(lrSlatGeo, slatMat);
      s.position.set(sx, sy, 0);
      g.add(s);
    }
  }

  // Targhetta crema sul fronte della cassetta
  const plaque = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.14, 0.015), labelMat);
  plaque.position.set(0, -0.08, 0.246);
  g.add(plaque);

  const bar = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.028, 0.018), brandBarMat);
  bar.position.set(0, -0.08, 0.248);
  g.add(bar);

  // 1) Bottiglia d'olio extravergine verde scuro con tappo dorato (dietro a sinistra)
  const oilMat = new THREE.MeshStandardMaterial({
    color: 0x244c1d,
    roughness: 0.12,
    metalness: 0.08,
  });
  const capMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.22,
    metalness: 0.88,
  });
  const bottleGroup = new THREE.Group();
  bottleGroup.position.set(-0.15, 0.1, -0.08);
  bottleGroup.rotation.z = 0.08;

  const bBody = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.09, 0.32, 20), oilMat);
  bottleGroup.add(bBody);
  const bNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.055, 0.14, 16), oilMat);
  bNeck.position.y = 0.21;
  bottleGroup.add(bNeck);
  const bCap = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.055, 16), capMat);
  bCap.position.y = 0.29;
  bottleGroup.add(bCap);
  g.add(bottleGroup);

  // 2) Forma di caciotta bianca crema (dietro a destra)
  const cheeseMat = new THREE.MeshStandardMaterial({ color: 0xf7eed4, roughness: 0.35 });
  const caciotta = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.145, 0.13, 24), cheeseMat);
  caciotta.position.set(0.13, 0.12, -0.06);
  caciotta.rotation.set(0.28, 0, -0.25);
  g.add(caciotta);

  // 3) Pagnotta / focaccia dorata (davanti a destra)
  const breadMat = new THREE.MeshStandardMaterial({ color: 0xd78f3a, roughness: 0.72 });
  const loaf = new THREE.Mesh(new THREE.SphereGeometry(0.155, 22, 18), breadMat);
  loaf.scale.set(1.08, 0.68, 0.95);
  loaf.position.set(0.11, 0.06, 0.08);
  g.add(loaf);

  // 4) Salame artigianale rosso rubino con legatura in spago (davanti a sinistra)
  const salameMat = new THREE.MeshStandardMaterial({ color: 0x8f1d27, roughness: 0.55 });
  const twineMat = new THREE.MeshStandardMaterial({ color: 0xf0e4ca, roughness: 0.8 });
  const salameGroup = new THREE.Group();
  salameGroup.position.set(-0.11, 0.08, 0.09);
  salameGroup.rotation.set(0.32, 0.2, 0.55);

  const salame = new THREE.Mesh(new THREE.CapsuleGeometry(0.058, 0.2, 10, 18), salameMat);
  salameGroup.add(salame);
  for (const ty of [-0.06, 0.0, 0.06]) {
    const tie = new THREE.Mesh(new THREE.TorusGeometry(0.059, 0.008, 6, 18), twineMat);
    tie.rotation.x = Math.PI / 2;
    tie.position.y = ty;
    salameGroup.add(tie);
  }
  g.add(salameGroup);

  scene.add(g);
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
      const { THREE, RoomEnvironment } = await loadThreeBundle();
      if (cancelled) return;

      const { renderer, envMap } = getSharedStudio(THREE, RoomEnvironment);
      const scene = new THREE.Scene();
      scene.environment = envMap;

      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 10);
      camera.position.set(0.85, 0.92, 1.85);
      camera.lookAt(0, -0.02, 0);

      scene.add(new THREE.AmbientLight(0xfff8ee, 0.55));
      const key = new THREE.DirectionalLight(0xfff2da, 1.6);
      key.position.set(2.4, 3.6, 2.2);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0xffdca0, 0.9);
      rim.position.set(-2.2, 2.0, -1.8);
      scene.add(rim);
      const fill = new THREE.DirectionalLight(0xe6eeff, 0.45);
      fill.position.set(0, -2.0, 1.5);
      scene.add(fill);

      BUILDERS[id](THREE, scene);
      renderer.render(scene, camera);
      if (!cancelled) {
        setIconSrc(renderer.domElement.toDataURL("image/png"));
      }

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
      releaseSharedStudio();
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
