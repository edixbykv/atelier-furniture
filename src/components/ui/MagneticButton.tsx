"use client";

import { useRef, type ReactNode } from "react";
import { motion } from "framer-motion";

type Variant = "solid" | "outline" | "ghost" | "light";

const styles: Record<Variant, string> = {
  solid:
    "bg-espresso text-paper hover:bg-bronze-deep border border-transparent",
  outline:
    "bg-transparent text-espresso border border-espresso/30 hover:border-espresso hover:bg-espresso/[0.04]",
  ghost:
    "bg-transparent text-paper border border-paper/30 hover:border-paper hover:bg-paper/[0.06]",
  light:
    "bg-paper text-espresso border border-transparent hover:bg-cream",
};

/** Magnetic, springy CTA button with an arrow flourish. */
export default function MagneticButton({
  children,
  href = "#contact",
  variant = "solid",
  className = "",
  arrow = true,
}: {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  className?: string;
  arrow?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={reset}
      data-cursor=""
      className={`group inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm font-medium tracking-wide transition-colors duration-300 ease-out [will-change:transform] ${styles[variant]} ${className}`}
      style={{ transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1), background-color 0.3s, border-color 0.3s, color 0.3s" }}
    >
      <span>{children}</span>
      {arrow && (
        <span className="relative h-4 w-4 overflow-hidden">
          <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-5 group-hover:-translate-y-5">
            ↗
          </span>
          <span className="absolute inset-0 flex -translate-x-5 translate-y-5 items-center justify-center transition-transform duration-300 group-hover:translate-x-0 group-hover:translate-y-0">
            ↗
          </span>
        </span>
      )}
    </motion.a>
  );
}
