import { MARQUEE } from "@/lib/content";

/** Slim scrolling brand ribbon used as a section transition. */
export default function Marquee() {
  return (
    <div className="relative flex select-none overflow-hidden border-y border-espresso/10 bg-paper py-6">
      <div className="flex shrink-0 animate-marquee items-center whitespace-nowrap">
        {[...MARQUEE, ...MARQUEE].map((m, i) => (
          <span
            key={i}
            className="mx-7 font-display text-xl font-light tracking-tight text-espresso/55 sm:text-3xl"
          >
            {m}
            <span className="mx-7 align-middle text-bronze">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
