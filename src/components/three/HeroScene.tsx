"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import Stage from "./Stage";
import AutoModel from "./AutoModel";
import { BEDROOM } from "@/lib/models";

useGLTF.preload(BEDROOM.url);

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// Push-in geometry derives only from the constant BEDROOM config — module-scope
// scratch vectors keep the per-frame math allocation-free.
const _base = new THREE.Vector3(...(BEDROOM.camera.position as [number, number, number]));
const _look = new THREE.Vector3(...(BEDROOM.camera.look as [number, number, number]));
const _forward = _look.clone().sub(_base).normalize();
const _from = _base.clone().addScaledVector(_forward, -1.0);
const _tmp = new THREE.Vector3();
const _pointer = new THREE.Vector3();

/**
 * Slow cinematic push-in: on load the camera eases forward into the suite (the
 * "entering the room" feel); continued scroll pushes a touch deeper. A whisper
 * of pointer drift keeps the frame alive.
 */
function HeroCamera({ progress }: { progress?: MutableRefObject<number> }) {
  const start = useRef(0);
  const inited = useRef(false);

  useFrame((state, delta) => {
    if (!inited.current) {
      inited.current = true;
      start.current = performance.now();
      state.camera.position.copy(_from);
    }
    const elapsed = (performance.now() - start.current) / 1000;
    const it = clamp01(elapsed / 2.6);
    const intro = 1 - Math.pow(1 - it, 3); // ease-out cubic
    const scroll = progress ? clamp01(progress.current) : 0;
    const push = Math.min(1, intro) + scroll * 0.5;

    _tmp.copy(_from).lerp(_base, Math.min(1, push));
    if (push > 1) _tmp.addScaledVector(_forward, (push - 1) * 1.0);
    _tmp.add(_pointer.set(state.pointer.x * 0.14, state.pointer.y * 0.09, 0));

    const k = 1 - Math.pow(0.0006, delta);
    state.camera.position.lerp(_tmp, k);
    state.camera.lookAt(_look.x, _look.y + state.pointer.y * 0.04, _look.z);
  });
  return null;
}

/** Section 1 hero — bedroom interior with a slow load/scroll push-in. */
export default function HeroScene({
  progress,
}: {
  progress?: MutableRefObject<number>;
}) {
  return (
    <Stage
      config={BEDROOM}
      shadowOpacity={0}
      shadowScale={16}
      disableParallax
      disableDrift
      sceneRig={<HeroCamera progress={progress} />}
    >
      <AutoModel
        url={BEDROOM.url}
        targetSize={BEDROOM.targetSize}
        groundY={false}
        castShadow={false}
        envMapIntensity={BEDROOM.env.intensity + 0.2}
      />
    </Stage>
  );
}
