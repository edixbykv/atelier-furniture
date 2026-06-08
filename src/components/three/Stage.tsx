"use client";

import { Canvas } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  ContactShadows,
  AdaptiveDpr,
  PerspectiveCamera,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useRef, type ReactNode, type MutableRefObject } from "react";
import * as THREE from "three";
import type { ModelConfig } from "@/lib/models";

/** Camera position orbiting a look-at point at height `lookY`. */
function orbitToPos(yawDeg: number, pitchDeg: number, dist: number, lookY: number) {
  const yaw = (yawDeg * Math.PI) / 180;
  const pitch = (pitchDeg * Math.PI) / 180;
  return new THREE.Vector3(
    Math.sin(yaw) * Math.cos(pitch) * dist,
    Math.sin(pitch) * dist + lookY,
    Math.cos(yaw) * Math.cos(pitch) * dist
  );
}

/** Cursor parallax + idle float rig. Rotates content toward pointer, gently. */
function ParallaxRig({
  children,
  amount,
  idle = true,
}: {
  children: ReactNode;
  amount: number;
  idle?: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    const { pointer, clock } = state;
    const targetRy = pointer.x * amount + (idle ? Math.sin(clock.elapsedTime * 0.25) * 0.04 : 0);
    const targetRx = -pointer.y * amount * 0.6;
    const k = 1 - Math.pow(0.0015, delta); // frame-rate independent damping
    ref.current.rotation.y += (targetRy - ref.current.rotation.y) * k;
    ref.current.rotation.x += (targetRx - ref.current.rotation.x) * k;
  });
  return <group ref={ref}>{children}</group>;
}

/** Subtle camera depth-drift toward the cursor for a luxe interactive feel. */
function CameraDrift({
  base,
  depth,
  lookTarget,
}: {
  base: THREE.Vector3;
  depth: number;
  lookTarget: THREE.Vector3;
}) {
  useFrame((state, delta) => {
    const { camera, pointer } = state;
    const tx = base.x + pointer.x * depth;
    const ty = base.y + pointer.y * depth * 0.6;
    const k = 1 - Math.pow(0.004, delta);
    camera.position.x += (tx - camera.position.x) * k;
    camera.position.y += (ty - camera.position.y) * k;
    camera.position.z = base.z;
    camera.lookAt(lookTarget);
  });
  return null;
}

type StageProps = {
  config: ModelConfig;
  children: ReactNode;
  /** Extra rig that reads scroll progress; rendered inside parallax group. */
  className?: string;
  /** Optional render hook inside the canvas for scene-driven camera work. */
  sceneRig?: ReactNode;
  shadowOpacity?: number;
  shadowScale?: number;
  cameraRef?: MutableRefObject<THREE.PerspectiveCamera | null>;
  /** Disable the built-in cursor camera drift (when a scene drives the camera). */
  disableDrift?: boolean;
  /** Disable parallax rig rotation (when a scene rotates content itself). */
  disableParallax?: boolean;
};

export default function Stage({
  config,
  children,
  className,
  sceneRig,
  shadowOpacity = 0.35,
  shadowScale = 12,
  cameraRef,
  disableDrift = false,
  disableParallax = false,
}: StageProps) {
  const { camera, env, lights, parallax } = config;
  const lookY = camera.targetY * config.targetSize;
  const basePos = camera.position
    ? new THREE.Vector3(...camera.position)
    : orbitToPos(camera.yaw, camera.pitch, camera.dist, lookY);
  const lookTarget = camera.look
    ? new THREE.Vector3(...camera.look)
    : new THREE.Vector3(0, lookY, 0);

  return (
    <Canvas
      className={className}
      shadows
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
        preserveDrawingBuffer: false,
      }}
      dpr={[1, 1.6]}
      performance={{ min: 0.5 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = env.exposure;
        gl.setClearAlpha(0);
      }}
    >
      <PerspectiveCamera
        ref={cameraRef as never}
        makeDefault
        fov={camera.fov}
        position={[basePos.x, basePos.y, basePos.z]}
        near={0.1}
        far={100}
      />

      {/* Premium studio lighting — warm key, cool fill, bright back-rim for edges */}
      <ambientLight intensity={lights.ambient} />
      <directionalLight
        position={[6, 9, 5]}
        intensity={lights.key}
        color="#ffe9d2"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      >
        <orthographicCamera attach="shadow-camera" args={[-9, 9, 9, -9, 0.5, 40]} />
      </directionalLight>
      <directionalLight position={[-7, 3.5, 3]} intensity={lights.fill} color="#dfe7f5" />
      {/* Back-rim from behind/above for a luminous separating edge */}
      <directionalLight position={[-3, 7, -8]} intensity={lights.rim} color="#fff6ec" />
      <directionalLight position={[4, 4, -7]} intensity={lights.rim * 0.7} color="#ffffff" />
      {/* Tight overhead spotlight to pool light onto the hero object */}
      <spotLight
        position={[0, 11, 2]}
        angle={0.5}
        penumbra={0.8}
        intensity={lights.key * 0.5}
        color="#fff1df"
        distance={40}
        castShadow={false}
      />

      <Suspense fallback={null}>
        {disableParallax ? children : <ParallaxRig amount={parallax}>{children}</ParallaxRig>}
        {sceneRig}

        {/* Studio reflections without any network HDR fetch */}
        <Environment resolution={256} environmentIntensity={env.intensity}>
          <group rotation={[0, 0, 0]}>
            <Lightformer
              form="rect"
              intensity={2.6}
              color="#fff1df"
              position={[0, 6, -4]}
              scale={[14, 8, 1]}
            />
            <Lightformer
              form="rect"
              intensity={0.9}
              color="#cdd6e6"
              position={[-6, 3, 2]}
              scale={[8, 8, 1]}
              rotation={[0, Math.PI / 4, 0]}
            />
            <Lightformer
              form="rect"
              intensity={1.3}
              color="#ffffff"
              position={[6, 2, 4]}
              scale={[8, 6, 1]}
              rotation={[0, -Math.PI / 4, 0]}
            />
            <Lightformer
              form="ring"
              intensity={1.8}
              color="#ffce98"
              position={[3, 8, 3]}
              scale={[3, 3, 1]}
            />
          </group>
        </Environment>

        <ContactShadows
          position={[0, config.groundY ? -0.01 : -config.targetSize * 0.32, 0]}
          opacity={shadowOpacity}
          scale={shadowScale}
          blur={3}
          far={12}
          resolution={768}
          color="#160f08"
        />
      </Suspense>

      {!disableDrift && (
        <CameraDrift base={basePos} depth={parallax * 6} lookTarget={lookTarget} />
      )}
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
