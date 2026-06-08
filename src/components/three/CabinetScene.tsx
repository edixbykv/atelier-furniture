"use client";

import Stage from "./Stage";
import { CABINET } from "@/lib/models";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { MutableRefObject } from "react";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

type Part = { node: THREE.Object3D; base: THREE.Vector3; dir: THREE.Vector3 };

/**
 * Cabinet with an exploded-view effect. The 7 authored CABINET_* parts separate
 * outward and reassemble as the section scrolls (sin curve over progress).
 */
function CabinetModel({ progress }: { progress: MutableRefObject<number> }) {
  const { scene } = useGLTF(CABINET.url);
  const rootRef = useRef<THREE.Group>(null);
  const partsRef = useRef<Part[]>([]);
  const spreadRef = useRef(1);

  const cloned = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      m.castShadow = true;
      m.receiveShadow = true;
      m.frustumCulled = false;
      const mats = Array.isArray(m.material) ? m.material : [m.material];
      for (const raw of mats) {
        const mat = raw as THREE.MeshStandardMaterial;
        if (!mat) continue;
        // The source GLB ships mis-authored albedos (e.g. WHITE_BOARD is near-black
        // with high metalness, expecting a bright studio HDR). Remap to premium,
        // physically-sensible finishes so the cabinet reads correctly under any light.
        const name = mat.name || "";
        if (/white|board|panel|body|carcass/i.test(name)) {
          mat.color = new THREE.Color("#efe9dd");
          mat.metalness = 0.05;
          mat.roughness = 0.46;
        } else if (/chrome|steel|polished/i.test(name)) {
          mat.color = new THREE.Color("#d6d7da");
          mat.metalness = 1;
          mat.roughness = 0.18;
        } else if (/marble|stone|granite/i.test(name)) {
          mat.metalness = 0;
          mat.roughness = 0.55;
        } else if (/black|dark/i.test(name)) {
          mat.color = new THREE.Color("#1b1917");
          mat.metalness = 0.85;
          mat.roughness = 0.45;
        }
        if ("envMapIntensity" in mat) mat.envMapIntensity = CABINET.env.intensity + 0.3;
        mat.needsUpdate = true;
      }
    });
    return c;
  }, [scene]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Collect the separable parts and flatten them under the clone root so they
    // share one coordinate frame (stable under parallax rotation).
    const parts: THREE.Object3D[] = [];
    cloned.traverse((o) => {
      if (/cabinet/i.test(o.name) && o !== cloned) parts.push(o);
    });
    parts.forEach((p) => cloned.attach(p));

    // Normalize the whole model: recenter + scale longest axis to targetSize.
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const s = CABINET.targetSize / maxDim;
    cloned.scale.setScalar(s);
    cloned.position.set(-center.x * s, -box.min.y * s, -center.z * s);

    // Compute explosion vectors in the clone-root local space.
    const usable = parts.length ? parts : [cloned];
    const centroid = new THREE.Vector3();
    usable.forEach((p) => centroid.add(p.position));
    centroid.multiplyScalar(1 / usable.length);

    spreadRef.current = maxDim * 0.26;
    partsRef.current = usable.map((node, i) => {
      const dir = node.position.clone().sub(centroid);
      if (dir.lengthSq() < 1e-4) {
        const a = (i / usable.length) * Math.PI * 2;
        dir.set(Math.cos(a), 0.4, Math.sin(a));
      }
      dir.normalize();
      return { node, base: node.position.clone(), dir };
    });
  }, [cloned]);

  const tmp = useMemo(() => new THREE.Vector3(), []);
  useFrame((_, delta) => {
    const p = clamp01(progress.current);
    const amt = Math.sin(p * Math.PI); // 0 → 1 → 0 : separate then reassemble
    const spread = spreadRef.current;
    const k = 1 - Math.pow(0.0025, delta);
    for (const part of partsRef.current) {
      tmp.copy(part.dir).multiplyScalar(amt * spread).add(part.base);
      part.node.position.lerp(tmp, k);
    }
  });

  return (
    <group ref={rootRef}>
      <primitive object={cloned} />
    </group>
  );
}

export default function CabinetScene({
  progress,
}: {
  progress: MutableRefObject<number>;
}) {
  return (
    <Stage config={CABINET} shadowScale={11} shadowOpacity={0.34}>
      <CabinetModel progress={progress} />
    </Stage>
  );
}
