"use client";

import { useEffect, useRef, useState } from "react";
import { useIsTouch } from "@/lib/hooks";

/** Elegant dual-ring cursor with magnetic hover states. Hidden on touch. */
export default function CustomCursor() {
  const touch = useIsTouch();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (touch) return;
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...pos };
    let raf = 0;

    const move = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      setHidden(false);
      if (dot.current) {
        dot.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
      const t = e.target as HTMLElement;
      const interactive = t.closest("a, button, [data-cursor]");
      setHovering(!!interactive);
      setLabel(interactive?.getAttribute("data-cursor") ?? null);
    };

    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.18;
      ringPos.y += (pos.y - ringPos.y) * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };

    const leave = () => setHidden(true);

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
      cancelAnimationFrame(raf);
    };
  }, [touch]);

  if (touch) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{ opacity: hidden ? 0 : 1, transition: "opacity 0.3s" }}
    >
      <div
        ref={dot}
        className="fixed left-0 top-0 -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-espresso mix-blend-difference"
      />
      <div
        ref={ring}
        className="fixed left-0 top-0 flex items-center justify-center rounded-full border border-espresso/40 transition-[width,height,background-color] duration-300 ease-out"
        style={{
          width: hovering ? 64 : 34,
          height: hovering ? 64 : 34,
          marginLeft: hovering ? -32 : -17,
          marginTop: hovering ? -32 : -17,
          backgroundColor: hovering ? "rgba(168,123,79,0.12)" : "transparent",
          backdropFilter: hovering ? "invert(0)" : "none",
        }}
      >
        {label && (
          <span className="text-[9px] font-medium uppercase tracking-[0.15em] text-espresso">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
