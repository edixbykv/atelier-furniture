// GLB analysis: bounds, center, dimensions, node hierarchy, animations.
// Auto-computes recommended scale, position, camera framing and lighting per model.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { getBounds } from '@gltf-transform/core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MODELS = path.join(ROOT, 'Models');

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);

const FILES = [
  'bedroom_-_interior.glb',
  'wardrobe.glb',
  'kitchen_design_set_v.001.glb',
  'cabinet.glb',
];

// Recommended on-screen target size (in three.js world units) so every model
// reads consistently regardless of its authored units (cm vs m, etc.)
const TARGET_SIZE = 4;

function fmt(n) { return Math.round(n * 1000) / 1000; }

const report = {};

for (const file of FILES) {
  const fp = path.join(MODELS, file);
  if (!fs.existsSync(fp)) { console.log(`MISSING: ${file}`); continue; }
  const sizeMB = (fs.statSync(fp).size / 1024 / 1024).toFixed(1);
  const doc = await io.read(fp);
  const root = doc.getRoot();
  const scene = root.listScenes()[0];

  // World-space bounds of the default scene
  const bb = getBounds(scene);
  const min = bb.min, max = bb.max;
  const size = [max[0] - min[0], max[1] - min[1], max[2] - min[2]];
  const center = [(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2];
  const maxDim = Math.max(...size);

  // Auto scale so the largest dimension maps to TARGET_SIZE
  const autoScale = maxDim > 0 ? TARGET_SIZE / maxDim : 1;

  // Offset to recenter model at origin (apply * autoScale on the client)
  const recenter = [-center[0], -center[1], -center[2]];

  // Camera framing: fit object in view for a 35deg vertical FOV camera.
  // distance = (maxDim/2) / tan(fov/2), with margin.
  const fovDeg = 35;
  const fov = (fovDeg * Math.PI) / 180;
  const fitDist = (TARGET_SIZE / 2) / Math.tan(fov / 2);
  const camDist = fitDist * 1.6; // margin for cinematic breathing room

  // Node hierarchy (top 2 levels) + flag interesting parts (doors/drawers/etc.)
  const interesting = [];
  const allNodeNames = [];
  for (const node of root.listNodes()) {
    const nm = node.getName() || '';
    allNodeNames.push(nm);
    if (/door|drawer|handle|shelf|panel|cabinet|part|component|module|left|right|front/i.test(nm)) {
      interesting.push(nm);
    }
  }

  const sceneNodes = scene.listChildren().map((n) => ({
    name: n.getName(),
    children: n.listChildren().map((c) => c.getName()).slice(0, 30),
  }));

  const animations = root.listAnimations().map((a) => ({
    name: a.getName(),
    channels: a.listChannels().length,
  }));

  const meshCount = root.listMeshes().length;
  const matCount = root.listMaterials().length;
  const texCount = root.listTextures().length;
  let totalTexBytes = 0;
  for (const t of root.listTextures()) {
    const img = t.getImage();
    if (img) totalTexBytes += img.byteLength;
  }

  report[file] = {
    file, sizeMB,
    dimensions: size.map(fmt),
    center: center.map(fmt),
    maxDim: fmt(maxDim),
    autoScale: fmt(autoScale),
    recenterOffset: recenter.map(fmt),
    recommended: {
      targetWorldSize: TARGET_SIZE,
      cameraFovDeg: fovDeg,
      cameraDistance: fmt(camDist),
      // a pleasing 3/4 cinematic angle
      cameraPos: [fmt(camDist * 0.7), fmt(camDist * 0.45), fmt(camDist * 0.9)],
      cameraTarget: [0, fmt(TARGET_SIZE * 0.0), 0],
      keyLight: [fmt(TARGET_SIZE * 1.2), fmt(TARGET_SIZE * 1.8), fmt(TARGET_SIZE * 1.2)],
      fillLight: [fmt(-TARGET_SIZE * 1.5), fmt(TARGET_SIZE * 0.8), fmt(TARGET_SIZE * 0.6)],
      rimLight: [0, fmt(TARGET_SIZE * 1.2), fmt(-TARGET_SIZE * 1.6)],
    },
    stats: { meshCount, matCount, texCount, animations, totalTexMB: (totalTexBytes/1024/1024).toFixed(1) },
    sceneTopLevel: sceneNodes.slice(0, 12),
    interestingNodes: [...new Set(interesting)].slice(0, 40),
    totalNodeCount: allNodeNames.length,
  };

  console.log(`\n=== ${file} (${sizeMB} MB) ===`);
  console.log(`  dims: [${size.map(fmt).join(', ')}]  maxDim: ${fmt(maxDim)}`);
  console.log(`  center: [${center.map(fmt).join(', ')}]`);
  console.log(`  autoScale -> ${fmt(autoScale)} (target world size ${TARGET_SIZE})`);
  console.log(`  camDistance: ${fmt(camDist)}  fov: ${fovDeg}`);
  console.log(`  meshes:${meshCount} mats:${matCount} texs:${texCount} texMB:${(totalTexBytes/1024/1024).toFixed(1)} anims:${animations.length} nodes:${allNodeNames.length}`);
  if (animations.length) console.log(`  animations: ${animations.map(a=>a.name+`(${a.channels})`).join(', ')}`);
  if (interesting.length) console.log(`  interesting nodes: ${[...new Set(interesting)].slice(0,20).join(', ')}`);
}

fs.writeFileSync(path.join(ROOT, 'scripts', 'analysis.json'), JSON.stringify(report, null, 2));
console.log('\nWrote scripts/analysis.json');
