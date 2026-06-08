"use client";

import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { KITCHEN, CABINET } from "@/lib/models";

/**
 * Warms the GLB cache for the heavier downstream scenes shortly after the hero
 * settles, so scrolling into the kitchen/cabinet sections never hitches on a
 * cold decode. Runs once, on idle, after first paint.
 */
export default function AssetPreloader() {
  useEffect(() => {
    let done = false;
    const run = () => {
      if (done) return;
      done = true;
      useGLTF.preload(KITCHEN.url);
      useGLTF.preload(CABINET.url);
    };
    const ric = (window as unknown as {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
    }).requestIdleCallback;
    const t = setTimeout(run, 4500);
    const id = ric ? ric(run, { timeout: 6000 }) : 0;
    return () => {
      clearTimeout(t);
      const cic = (window as unknown as {
        cancelIdleCallback?: (id: number) => void;
      }).cancelIdleCallback;
      if (cic && id) cic(id);
    };
  }, []);
  return null;
}
