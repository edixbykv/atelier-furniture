"use client";

import Stage from "./Stage";
import AutoModel from "./AutoModel";
import { KITCHEN } from "@/lib/models";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { MutableRefObject } from "react";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Drives a cinematic fly-through using the section's scroll progress (0..1). */
function Flythrough({ progress }: { progress: MutableRefObject<number> }) {
  const target = new THREE.Vector3();
  useFrame((state, delta) => {
    const p = clamp01(progress.current);
    // Eased path: a realistic eye-level glide — sweeps from a 3/4 left vantage to a
    // 3/4 right, staying low so we read true interior depth & perspective (not a
    // dollhouse top-down). Subtle dolly-in keeps it cinematic.
    const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; // easeInOut
    const yaw = lerp(-0.62, 0.46, e);
    const pitch = lerp(0.16, 0.06, e); // near eye-level throughout
    const dist = lerp(10.6, 7.8, e);
    const ty = lerp(KITCHEN.targetSize * 0.34, KITCHEN.targetSize * 0.3, e);

    const px = state.pointer.x * 0.3;
    const py = state.pointer.y * 0.18;

    const cx = Math.sin(yaw) * Math.cos(pitch) * dist + px;
    const cz = Math.cos(yaw) * Math.cos(pitch) * dist;
    const cy = Math.sin(pitch) * dist + ty + py;

    const k = 1 - Math.pow(0.0009, delta);
    state.camera.position.x += (cx - state.camera.position.x) * k;
    state.camera.position.y += (cy - state.camera.position.y) * k;
    state.camera.position.z += (cz - state.camera.position.z) * k;
    target.set(0, KITCHEN.targetSize * 0.32, 0);
    state.camera.lookAt(target);
  });
  return null;
}

export default function KitchenScene({
  progress,
}: {
  progress: MutableRefObject<number>;
}) {
  return (
    <Stage
      config={KITCHEN}
      disableDrift
      disableParallax
      shadowScale={14}
      shadowOpacity={0.32}
      sceneRig={<Flythrough progress={progress} />}
    >
      <AutoModel
        url={KITCHEN.url}
        targetSize={KITCHEN.targetSize}
        groundY={KITCHEN.groundY}
        envMapIntensity={KITCHEN.env.intensity}
      />
    </Stage>
  );
}
