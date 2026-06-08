"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * Returns a ref whose `.current` tracks 0..1 scroll progress across `target`,
 * driven by GSAP ScrollTrigger (kept in sync with Lenis). Reading from a ref in
 * the R3F useFrame loop avoids re-renders and keeps FPS high.
 */
export function useScrollProgress(
  target: React.RefObject<HTMLElement | null>,
  opts?: { start?: string; end?: string }
) {
  const progress = useRef(0);
  useEffect(() => {
    const el = target.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: opts?.start ?? "top top",
      end: opts?.end ?? "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        progress.current = self.progress;
      },
    });
    return () => st.kill();
  }, [target, opts?.start, opts?.end]);
  return progress;
}
