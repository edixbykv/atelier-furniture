"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal, RevealWords } from "@/components/ui/Reveal";
import { WARDROBE_RENDERS } from "@/lib/models";

/**
 * Section 2 — Wardrobe. Pre-rendered showcase images (no real-time 3D).
 * A scroll-driven door-opening illusion: matte door panels slide apart to
 * reveal the rendered wardrobe interior.
 */
export default function WardrobeSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Doors open between 18%–62% of the section's scroll.
  const leftX = useTransform(scrollYProgress, [0.18, 0.62], ["0%", "-104%"]);
  const rightX = useTransform(scrollYProgress, [0.18, 0.62], ["0%", "104%"]);
  const leftRot = useTransform(scrollYProgress, [0.18, 0.62], [0, -28]);
  const rightRot = useTransform(scrollYProgress, [0.18, 0.62], [0, 28]);
  const imgScale = useTransform(scrollYProgress, [0.1, 0.7], [1.12, 1]);

  return (
    <section
      id="wardrobes"
      ref={ref}
      className="relative overflow-hidden bg-cream py-24 sm:py-32 lg:py-40"
    >
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:px-12">
        {/* Copy */}
        <div className="order-2 lg:order-1 lg:col-span-5">
          <Reveal>
            <span className="eyebrow text-bronze-deep">02 — Wardrobe Systems</span>
          </Reveal>
          <h2 className="mt-6 font-display text-[clamp(2.2rem,5.5vw,4.5rem)] font-light leading-[1.02] tracking-[-0.02em] text-espresso">
            <RevealWords text="Effortless Order." /> <br className="hidden sm:block" />
            <span className="italic text-bronze-deep">
              <RevealWords text="Lasting Beauty." delay={0.15} />
            </span>
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-md text-pretty text-base leading-relaxed text-espresso/70 sm:text-lg">
              Bespoke wardrobe systems where every shelf, rail and drawer is
              composed around the way you live — and finished to last a lifetime.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <ul className="mt-9 flex flex-col gap-3">
              {[
                "Floor-to-ceiling modular configurations",
                "Soft-close hardware & integrated lighting",
                "Bespoke veneers, lacquers and glass fronts",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm text-espresso/75">
                  <span className="mt-2 h-px w-6 shrink-0 bg-bronze" />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Visual stage with door reveal */}
        <div className="order-1 lg:order-2 lg:col-span-7">
          <div
            className="relative mx-auto aspect-[5/4] w-full max-w-2xl overflow-hidden rounded-[2px] bg-gradient-to-b from-espresso via-cocoa to-walnut shadow-[0_40px_120px_-40px_rgba(43,37,32,0.55)]"
            style={{ perspective: "1600px" }}
          >
            {/* Revealed interior render — deep warm stage gives the pale wardrobe
                crisp contrast (was washing out on the light background). */}
            <motion.div style={{ scale: imgScale }} className="absolute inset-0">
              <Image
                src={WARDROBE_RENDERS.hero}
                alt="Custom modular wardrobe interior with shelving, hanging space and drawers"
                fill
                sizes="(max-width: 1024px) 90vw, 50vw"
                className="object-contain"
                priority={false}
              />
            </motion.div>
            {/* soft spotlight pooled behind the wardrobe */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_42%,rgba(168,123,79,0.18),transparent_70%)]" />

            {/* Left door */}
            <motion.div
              style={{ x: leftX, rotateY: leftRot, transformOrigin: "left center" }}
              className="absolute inset-y-0 left-0 w-1/2 origin-left"
            >
              <Door side="left" />
            </motion.div>
            {/* Right door */}
            <motion.div
              style={{ x: rightX, rotateY: rightRot, transformOrigin: "right center" }}
              className="absolute inset-y-0 right-0 w-1/2"
            >
              <Door side="right" />
            </motion.div>
          </div>

          <Reveal delay={0.1}>
            <p className="mt-5 text-center text-xs uppercase tracking-[0.25em] text-stone">
              Scroll to open · Rendered in-studio
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Door({ side }: { side: "left" | "right" }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-[#e9e2d6] via-[#ded4c4] to-[#cbbfa9] shadow-[inset_0_0_60px_rgba(43,37,32,0.12)]">
      {/* vertical grain sheen */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.18)_0px,rgba(255,255,255,0)_2px,rgba(43,37,32,0.04)_4px)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#2b2520]/10 to-transparent" />
      {/* handle near the centre seam */}
      <div
        className={`absolute top-1/2 h-24 w-[3px] -translate-y-1/2 rounded-full bg-bronze-deep/70 ${
          side === "left" ? "right-3" : "left-3"
        }`}
      />
    </div>
  );
}
