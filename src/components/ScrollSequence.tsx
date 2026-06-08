"use client";

import { useEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import { SEQUENCES, frameSrc, type SeqName } from "@/lib/sequences";

/**
 * Scroll-scrubbed image sequence — the lightweight replacement for the live
 * WebGL showcase scenes. Preloads the frame set, then paints the frame matching
 * `progress.current` (0..1) onto a canvas with object-cover fit. No GPU, no
 * model decode: smooth and hitch-free even on weak hardware.
 */
export default function ScrollSequence({
  name,
  progress,
  className = "",
  priority = false,
}: {
  name: SeqName;
  progress: MutableRefObject<number>;
  className?: string;
  /** Eager-load frame 0 + early frames (use for the hero, above the fold). */
  priority?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgsRef = useRef<HTMLImageElement[]>([]);
  const loadedRef = useRef<boolean[]>([]);
  const cfg = SEQUENCES[name];

  // Preload all frames once.
  useEffect(() => {
    const imgs: HTMLImageElement[] = [];
    const loaded: boolean[] = new Array(cfg.count).fill(false);
    for (let i = 0; i < cfg.count; i++) {
      const img = new Image();
      img.decoding = "async";
      img.fetchPriority = priority && i < 4 ? "high" : "low";
      img.onload = () => {
        loaded[i] = true;
      };
      img.src = frameSrc(cfg, i);
      imgs.push(img);
    }
    imgsRef.current = imgs;
    loadedRef.current = loaded;
  }, [cfg, priority]);

  // Canvas sizing (DPR-aware) + scrub loop.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dispW = 0,
      dispH = 0,
      dpr = 1,
      lastIdx = -1,
      raf = 0,
      visible = true;

    const sizeToParent = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (w !== dispW || h !== dispH) {
        dispW = w;
        dispH = h;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        lastIdx = -1; // force redraw at new size
      }
    };

    // Nearest already-decoded frame at or before idx (avoids flashing blanks
    // while later frames are still streaming in).
    const pick = (idx: number) => {
      const loaded = loadedRef.current;
      if (loaded[idx]) return idx;
      for (let j = idx; j >= 0; j--) if (loaded[j]) return j;
      for (let j = idx + 1; j < cfg.count; j++) if (loaded[j]) return j;
      return -1;
    };

    const drawCover = (img: HTMLImageElement) => {
      const cw = canvas.width,
        ch = canvas.height;
      const ir = img.width / img.height;
      const cr = cw / ch;
      let dw = cw,
        dh = ch;
      if (cr > ir) dh = cw / ir;
      else dw = ch * ir;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      sizeToParent();
      const p = Math.min(1, Math.max(0, progress.current));
      const idx = Math.round(p * (cfg.count - 1));
      if (idx === lastIdx) return;
      const use = pick(idx);
      if (use < 0) return;
      const img = imgsRef.current[use];
      if (img && img.complete && img.naturalWidth) {
        drawCover(img);
        lastIdx = idx;
      }
    };

    // Pause the loop entirely when the canvas is far from the viewport.
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
      },
      { rootMargin: "200px" }
    );
    io.observe(canvas);

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [cfg, progress]);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
