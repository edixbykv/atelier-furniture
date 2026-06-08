"use client";

import { useGLTF } from "@react-three/drei";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type Props = {
  url: string;
  /** Longest authored axis is normalized to this world size. */
  targetSize?: number;
  /** Rest model base on y=0 instead of vertical centering. */
  groundY?: boolean;
  envMapIntensity?: number;
  castShadow?: boolean;
  onReady?: (info: { height: number; radius: number }) => void;
};

/**
 * Loads a (meshopt-compressed) GLB and auto-frames it: recenters to origin and
 * scales so its longest dimension equals `targetSize`. Works for any model
 * regardless of authored units/offset — no manual scale/position needed.
 */
export default function AutoModel({
  url,
  targetSize = 5,
  groundY = false,
  envMapIntensity = 1,
  castShadow = true,
  onReady,
}: Props) {
  const { scene } = useGLTF(url);
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);

  // Clone so the same GLB can be mounted independently and mutated safely.
  const cloned = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if ((mesh as THREE.Mesh).isMesh) {
        mesh.castShadow = castShadow;
        mesh.receiveShadow = true;
        mesh.frustumCulled = false;
        const mat = mesh.material as THREE.MeshStandardMaterial | THREE.MeshStandardMaterial[];
        const apply = (m: THREE.MeshStandardMaterial) => {
          if ("envMapIntensity" in m) m.envMapIntensity = envMapIntensity;
          m.needsUpdate = true;
        };
        if (Array.isArray(mat)) mat.forEach(apply);
        else if (mat) apply(mat);
      }
    });
    return c;
  }, [scene, castShadow, envMapIntensity]);

  useLayoutEffect(() => {
    if (!inner.current) return;
    // Reset any prior transform first so measurement is always on the raw
    // geometry — the effect can run more than once on the same cloned object
    // (dev double-invoke / remount) and must be idempotent, otherwise it
    // re-measures an already-scaled model and collapses the framing.
    cloned.scale.setScalar(1);
    cloned.position.set(0, 0, 0);
    cloned.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const s = targetSize / maxDim;

    cloned.scale.setScalar(s);
    if (groundY) {
      cloned.position.set(-center.x * s, -box.min.y * s, -center.z * s);
    } else {
      cloned.position.set(-center.x * s, -center.y * s, -center.z * s);
    }

    const height = size.y * s;
    const radius = (Math.max(size.x, size.z) * s) / 2;
    onReady?.({ height, radius });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cloned, targetSize, groundY]);

  return (
    <group ref={outer}>
      <group ref={inner}>
        <primitive object={cloned} />
      </group>
    </group>
  );
}
