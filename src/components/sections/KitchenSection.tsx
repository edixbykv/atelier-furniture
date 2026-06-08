"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ScrollSequence from "@/components/ScrollSequence";
import { RevealWords } from "@/components/ui/Reveal";
import { useScrollProgress } from "@/lib/useScrollProgress";

/** Section 3 — Kitchen. Pinned scroll-scrubbed image sequence (pre-rendered). */
export default function KitchenSection() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const introOpacity = useTransform(scrollYProgress, [0, 0.12, 0.3], [1, 1, 0]);
  const outroOpacity = useTransform(scrollYProgress, [0.55, 0.75, 1], [0, 1, 1]);
  const outroY = useTransform(scrollYProgress, [0.55, 0.8], [40, 0]);

  return (
    <section
      id="kitchens"
      ref={ref}
      className="relative h-[280vh] bg-gradient-to-b from-cocoa via-walnut to-cocoa"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* warm ambient glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(168,123,79,0.20),transparent_62%)]" />

        <ScrollSequence name="kitchen" progress={progress} className="absolute inset-0" />

        {/* top + bottom scrims keep headlines readable over the model */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-[40%] bg-gradient-to-b from-cocoa via-cocoa/80 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[34%] bg-gradient-to-t from-cocoa via-cocoa/70 to-transparent" />

        {/* Intro headline */}
        <motion.div
          style={{ opacity: introOpacity }}
          className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col items-center px-6 pt-[11vh] text-center"
        >
          <span className="eyebrow mb-5 text-bronze">03 — Modular Kitchens</span>
          <h2 className="font-display text-[clamp(2.2rem,6vw,5.5rem)] font-light leading-[1] tracking-[-0.02em] text-paper drop-shadow-[0_2px_24px_rgba(0,0,0,0.5)]">
            <RevealWords text="The Art of the Kitchen." />
          </h2>
        </motion.div>

        {/* Outro copy */}
        <motion.div
          style={{ opacity: outroOpacity, y: outroY }}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 mx-auto max-w-2xl px-6 pb-[11vh] text-center"
        >
          <p className="text-pretty text-base leading-relaxed text-paper/85 sm:text-xl">
            Modular kitchens composed like architecture — where ergonomics,
            storage and surface craft resolve into effortless living.
          </p>
        </motion.div>

        {/* progress hairline */}
        <div className="absolute bottom-8 left-1/2 hidden h-px w-40 -translate-x-1/2 overflow-hidden bg-paper/15 sm:block">
          <motion.div className="h-full bg-bronze" style={{ scaleX: scrollYProgress, transformOrigin: "left" }} />
        </div>
      </div>
    </section>
  );
}
