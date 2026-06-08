"use client";

/**
 * Off-site frame-capture harness (dev only). Renders a single scene fullscreen
 * on a transparent background with the camera/explosion driven instantly from
 * `window.__setProgress(0..1)`. scripts/capture.mjs steps progress and shoots a
 * webp frame at each step; the live site then scrubs those frames on scroll
 * instead of running three WebGL canvases. Not linked anywhere in the UI.
 */

import { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import HeroScene from "@/components/three/HeroScene";
import KitchenScene from "@/components/three/KitchenScene";
import CabinetScene from "@/components/three/CabinetScene";

declare global {
  interface Window {
    __setProgress?: (p: number) => void;
    __captureReady?: boolean;
  }
}

export default function CapturePage() {
  const progress = useRef(0);
  const [scene, setScene] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setScene(params.get("scene") || "kitchen");
    window.__captureReady = false;
    window.__setProgress = (p: number) => {
      progress.current = Math.min(1, Math.max(0, p));
    };
    // Strip the opaque page background so puppeteer can shoot transparent frames.
    document.documentElement.style.background = "transparent";
    document.body.style.background = "transparent";
    return () => {
      delete window.__setProgress;
    };
  }, []);

  if (!scene) return null;

  return (
    <main style={{ position: "fixed", inset: 0, background: "transparent" }}>
      <div className="absolute inset-0 [&_canvas]:!h-full [&_canvas]:!w-full">
        {scene === "hero" && <HeroScene progress={progress} instant />}
        {scene === "kitchen" && <KitchenScene progress={progress} instant />}
        {scene === "cabinet" && <CabinetScene progress={progress} instant />}
      </div>
      <ReadyGate />
    </main>
  );
}

/** Flips window.__captureReady once drei reports all assets decoded. */
function ReadyGate() {
  const { active, loaded } = useProgress();
  useEffect(() => {
    if (!active && loaded > 0) {
      const t = setTimeout(() => {
        window.__captureReady = true;
      }, 400);
      return () => clearTimeout(t);
    }
  }, [active, loaded]);
  return null;
}
