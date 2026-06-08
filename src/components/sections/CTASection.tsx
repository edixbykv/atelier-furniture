"use client";

import { motion } from "framer-motion";
import { Reveal, RevealLines } from "@/components/ui/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";
import { BRAND, MARQUEE } from "@/lib/content";

/** Section 7 — Final CTA. */
export default function CTASection() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-gradient-to-b from-walnut to-cocoa py-24 text-paper sm:py-32 lg:py-40"
    >
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.05]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-bronze/15 blur-[120px]" />

      {/* marquee ribbon */}
      <div className="relative mb-16 flex select-none overflow-hidden border-y border-paper/10 py-5 sm:mb-24">
        <div className="flex shrink-0 animate-marquee items-center whitespace-nowrap">
          {[...MARQUEE, ...MARQUEE].map((m, i) => (
            <span key={i} className="mx-8 font-display text-2xl font-light text-paper/40 sm:text-4xl">
              {m}
              <span className="mx-8 text-bronze">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-[1600px] px-5 text-center sm:px-8 lg:px-12">
        <Reveal>
          <span className="eyebrow text-bronze">07 — Let&apos;s Collaborate</span>
        </Reveal>
        <h2 className="mx-auto mt-7 max-w-5xl font-display text-[clamp(2.6rem,7vw,7rem)] font-light leading-[0.98] tracking-[-0.02em]">
          <RevealLines lines={["Let's Build Something", "Exceptional."]} />
        </h2>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-8 max-w-xl text-pretty text-base text-paper/70 sm:text-lg">
            Transform your ideas into beautifully crafted furniture solutions.
          </p>
        </Reveal>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <MagneticButton href={`mailto:${BRAND.email}`} variant="light">
            Request Consultation
          </MagneticButton>
          <MagneticButton href={`mailto:${BRAND.email}`} variant="ghost">
            Get In Touch
          </MagneticButton>
        </motion.div>

        <Reveal delay={0.2}>
          <div className="mx-auto mt-16 flex max-w-3xl flex-col items-center justify-center gap-6 border-t border-paper/10 pt-10 text-sm text-paper/60 sm:flex-row sm:gap-12">
            <a href={`mailto:${BRAND.email}`} className="transition-colors hover:text-paper">
              {BRAND.email}
            </a>
            <a href={`tel:${BRAND.phone.replace(/\s/g, "")}`} className="transition-colors hover:text-paper">
              {BRAND.phone}
            </a>
            <span>{BRAND.location}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
