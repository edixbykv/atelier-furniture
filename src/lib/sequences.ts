/**
 * Pre-rendered scroll image-sequences (replaces real-time WebGL for the showcase
 * sections). Frames are produced by scripts/capture.mjs into public/seq/<name>/.
 * Keep `count` in sync with the SCENES map in that script.
 */
export type SeqName = "hero" | "kitchen" | "cabinet";

export type SeqConfig = {
  dir: string;
  count: number;
  pad: number;
  ext: string;
  /** intrinsic frame aspect (w/h) — used for fallback poster sizing only. */
  aspect: number;
};

export const SEQUENCES: Record<SeqName, SeqConfig> = {
  hero: { dir: "/seq/hero", count: 30, pad: 3, ext: "webp", aspect: 1.6 },
  kitchen: { dir: "/seq/kitchen", count: 48, pad: 3, ext: "webp", aspect: 1.6 },
  cabinet: { dir: "/seq/cabinet", count: 40, pad: 3, ext: "webp", aspect: 1.6 },
};

export const frameSrc = (cfg: SeqConfig, i: number) =>
  `${cfg.dir}/${String(i).padStart(cfg.pad, "0")}.${cfg.ext}`;
