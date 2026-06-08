"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Lazy3D from "@/components/three/Lazy3D";
import CanvasLoader from "@/components/three/CanvasLoader";
import { RevealLines } from "@/components/ui/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";
import { useScrollProgress } from "@/lib/useScrollProgress";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => <CanvasLoader label="Preparing the suite" dark />,
});

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref, { start: "top top", end: "bottom top" });

  return (
    <section
      id="craft"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-cocoa"
    >
      {/* 3D bedroom backdrop */}
      <Lazy3D
        className="pointer-events-auto absolute inset-0 z-0"
        fallback={<div className="absolute inset-0 bg-gradient-to-b from-walnut via-cocoa to-walnut" />}
      >
        <div className="absolute inset-0 [&_canvas]:!h-full [&_canvas]:!w-full">
          <HeroScene progress={progress} />
        </div>
      </Lazy3D>

      {/* Cinematic atmosphere: warm tint + corner vignette + bottom scrim for the
          copy. Suite stays visible; legibility reinforced with a text-shadow. */}
      <div
        className="pointer-events-none absolute inset-0 z-[5] mix-blend-soft-light"
        style={{ background: "linear-gradient(160deg, rgba(255,176,102,0.18), rgba(40,22,10,0.32))" }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[48%] bg-gradient-to-t from-walnut via-walnut/40 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-[16%] bg-gradient-to-b from-cocoa/60 to-transparent" />
      <div
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{
          background:
            "radial-gradient(130% 110% at 58% 40%, rgba(15,12,9,0) 52%, rgba(12,9,6,0.55) 100%)",
        }}
      />

      {/* Content */}
      <div className="pointer-events-none relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-end px-5 pb-24 pt-32 sm:px-8 sm:pb-28 lg:px-12 lg:pb-32">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
          className="eyebrow mb-6 text-bronze"
        >
          Premium Furniture Manufacturing
        </motion.span>

        <h1
          className="font-display text-[clamp(2.6rem,8vw,7.5rem)] font-light leading-[0.95] tracking-[-0.02em] text-paper"
          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.45), 0 8px 40px rgba(0,0,0,0.5)" }}
        >
          <RevealLines
            lines={["Crafting Spaces.", "Inspiring Lifestyles."]}
            delay={0.35}
            lineClassName="pb-[0.08em]"
          />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.9 }}
          className="mt-7 max-w-xl text-pretty text-base text-paper/80 sm:text-lg"
          style={{ textShadow: "0 1px 12px rgba(0,0,0,0.6)" }}
        >
          Bespoke wardrobes, modular kitchens and engineered cabinetry —
          designed, built and finished under one roof.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 1.05 }}
          className="pointer-events-auto mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <MagneticButton href="#wardrobes" variant="light">
            Explore Our Craft
          </MagneticButton>
          <MagneticButton href="#contact" variant="ghost">
            Start Your Project
          </MagneticButton>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="pointer-events-none absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.35em] text-paper/50">
          Scroll
        </span>
        <span className="relative h-12 w-px overflow-hidden bg-paper/20">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-bronze"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
