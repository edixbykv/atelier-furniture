"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Reveal, RevealWords } from "@/components/ui/Reveal";
import { WHY_US } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Section 6 — Why Choose Us. Six premium, hover-reactive cards. */
export default function WhyUsSection() {
  const gridRef = useRef(null);
  const inView = useInView(gridRef, { once: true, margin: "-10% 0px" });

  return (
    <section className="relative overflow-hidden bg-paper py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Reveal>
              <span className="eyebrow text-bronze-deep">06 — Why Choose Us</span>
            </Reveal>
            <h2 className="mt-6 font-display text-[clamp(2.2rem,5.5vw,5rem)] font-light leading-[1.02] tracking-[-0.02em] text-espresso">
              <RevealWords text="A partner for the" />{" "}
              <span className="italic text-bronze-deep">
                <RevealWords text="extraordinary." delay={0.12} />
              </span>
            </h2>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-pretty text-sm leading-relaxed text-espresso/65">
              From concept to installation, every discipline lives under one roof —
              so quality, timeline and vision never get lost in translation.
            </p>
          </Reveal>
        </div>

        <div
          ref={gridRef}
          className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-espresso/10 bg-espresso/10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3"
        >
          {WHY_US.map((c, i) => (
            <motion.article
              key={c.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: EASE, delay: i * 0.08 }}
              className="group relative bg-cream p-8 transition-colors duration-500 hover:bg-espresso sm:p-10 lg:p-12"
            >
              <div className="flex items-start justify-between">
                <span className="font-display text-2xl text-bronze transition-colors duration-500 group-hover:text-bronze">
                  {c.no}
                </span>
                <span className="text-espresso/20 transition-all duration-500 group-hover:rotate-45 group-hover:text-paper">
                  ↗
                </span>
              </div>
              <h3 className="mt-10 font-display text-2xl font-medium text-espresso transition-colors duration-500 group-hover:text-paper sm:text-[1.7rem]">
                {c.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-espresso/65 transition-colors duration-500 group-hover:text-paper/70">
                {c.body}
              </p>
              <span className="mt-8 block h-px w-0 bg-bronze transition-all duration-500 group-hover:w-12" />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
