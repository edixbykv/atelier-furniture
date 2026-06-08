"use client";

import { Reveal, RevealWords } from "@/components/ui/Reveal";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { STATS } from "@/lib/content";

/** Section 5 — Manufacturing Excellence with animated counters. */
export default function StatsSection() {
  return (
    <section
      id="excellence"
      className="relative overflow-hidden bg-cocoa py-24 text-paper sm:py-32 lg:py-40"
    >
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.04]" />
      <div className="pointer-events-none absolute -left-40 top-1/2 h-[480px] w-[480px] -translate-y-1/2 rounded-full bg-bronze/10 blur-3xl" />

      <div className="relative mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="max-w-3xl">
          <Reveal>
            <span className="eyebrow text-bronze">05 — By The Numbers</span>
          </Reveal>
          <h2 className="mt-6 font-display text-[clamp(2.2rem,5.5vw,5rem)] font-light leading-[1.02] tracking-[-0.02em]">
            <RevealWords text="Manufacturing Excellence," />{" "}
            <span className="italic text-taupe">
              <RevealWords text="proven at scale." delay={0.15} />
            </span>
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="border-t border-paper/15 pt-6">
                <div className="font-display text-[clamp(2.8rem,6vw,4.5rem)] font-light leading-none tracking-tight text-paper">
                  <AnimatedCounter value={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-4 text-sm tracking-wide text-paper/60">
                  {s.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
