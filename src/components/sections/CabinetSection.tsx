"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ScrollSequence from "@/components/ScrollSequence";
import { RevealWords, Reveal } from "@/components/ui/Reveal";
import { useScrollProgress } from "@/lib/useScrollProgress";

/** Section 4 — Cabinet. Pinned sequence; parts explode apart and reassemble. */
export default function CabinetSection() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const labelOpacity = useTransform(scrollYProgress, [0.35, 0.5, 0.65], [0, 1, 0]);

  const specs = [
    { k: "Joinery", v: "Dowel + dovetail" },
    { k: "Hardware", v: "Soft-close, lifetime" },
    { k: "Core", v: "BWP marine ply" },
    { k: "Finish", v: "PU / veneer / lacquer" },
  ];

  return (
    <section
      id="cabinetry"
      ref={ref}
      className="relative h-[260vh] bg-walnut text-paper"
    >
      <div className="sticky top-0 flex h-[100svh] w-full flex-col overflow-hidden">
        {/* Spotlight stage — pale carcass reads crisply against the dark studio */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_54%,rgba(168,123,79,0.18),rgba(31,27,23,0)_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-walnut/90 via-transparent to-walnut/90" />

        {/* Header */}
        <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 pt-[11vh] text-center sm:px-8 lg:px-12">
          <span className="eyebrow text-bronze">04 — Engineered Cabinetry</span>
          <h2 className="mx-auto mt-5 max-w-4xl font-display text-[clamp(2.2rem,6vw,5.5rem)] font-light leading-[1] tracking-[-0.02em] text-paper">
            <RevealWords text="The Anatomy of Craft." />
          </h2>
        </div>

        {/* Exploded cabinet — full-stage sequence behind the copy (preserves the
            captured framing so parts never clip). */}
        <ScrollSequence name="cabinet" progress={progress} className="absolute inset-0 z-0" />
        <div className="relative z-0 flex-1" aria-hidden />

        {/* mid-scroll exploded label */}
        <motion.span
          style={{ opacity: labelOpacity }}
          className="pointer-events-none absolute left-1/2 top-[18%] z-10 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] text-bronze"
        >
          Exploded View
        </motion.span>

        {/* Footer copy + specs */}
        <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 pb-[8vh] sm:px-8 lg:px-12">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-end lg:justify-between">
            <Reveal className="max-w-md text-center lg:text-left">
              <p className="text-pretty text-base leading-relaxed text-paper/75 sm:text-lg">
                Every component machined, tested and assembled to a tolerance you
                will feel for decades — precision made permanent.
              </p>
            </Reveal>
            <div className="grid grid-cols-2 gap-x-10 gap-y-4 sm:grid-cols-4 lg:gap-x-8">
              {specs.map((s, i) => (
                <Reveal key={s.k} delay={i * 0.05} className="text-center lg:text-left">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-paper/45">{s.k}</div>
                  <div className="mt-1 text-sm font-medium text-paper">{s.v}</div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
