"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BRAND } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Cinematic intro curtain with a counting progress meter. */
export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const D = 1700;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / D);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 350);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-cocoa"
          exit={{ y: "-100%" }}
          transition={{ duration: 1, ease: EASE }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="flex flex-col items-center"
          >
            <span className="eyebrow mb-4 text-taupe/70">Est. 2000 · Bengaluru</span>
            <h1 className="font-display text-5xl font-light tracking-tight text-paper sm:text-7xl">
              {BRAND.name}
            </h1>
            <span className="mt-3 text-xs uppercase tracking-[0.4em] text-taupe/60">
              Furniture Manufacturing
            </span>
          </motion.div>

          <div className="absolute bottom-12 left-0 right-0 mx-auto flex w-[min(78vw,420px)] flex-col gap-3">
            <div className="flex items-end justify-between">
              <span className="text-xs tracking-widest text-taupe/60">LOADING</span>
              <span className="font-display text-2xl text-paper tabular-nums">{progress}</span>
            </div>
            <div className="h-px w-full overflow-hidden bg-paper/15">
              <motion.div
                className="h-full bg-bronze"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
