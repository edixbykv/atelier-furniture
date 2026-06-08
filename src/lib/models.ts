/**
 * 3D model configuration — values derived automatically from scripts/analysis.json
 * (bounding boxes, centers, dimensions). Each model is normalized at RUNTIME by
 * <AutoModel> (recenter + scale-to-target) so no manual tuning is required; the
 * presets below only describe per-section cinematic intent (camera, lights, motion).
 */

export type ModelConfig = {
  url: string;
  /** Longest authored axis is scaled to this world size. */
  targetSize: number;
  /** Rest the model on the ground plane (y=0) instead of centering vertically. */
  groundY: boolean;
  /**
   * Camera placement. Either orbit angles (yaw/pitch/dist around a look point at
   * height targetY*targetSize) OR an absolute interior position + look target
   * (used for room-interior models that must be framed from the inside).
   */
  camera: {
    yaw: number;
    pitch: number;
    dist: number;
    fov: number;
    targetY: number;
    position?: [number, number, number];
    look?: [number, number, number];
  };
  /** Environment + light tuning. */
  env: { intensity: number; exposure: number };
  lights: { key: number; fill: number; rim: number; ambient: number };
  /** How much the cursor parallax rotates the model (radians at screen edge). */
  parallax: number;
};

// Derived: bedroom maxDim 6.42 (meters), centered scene, no offset needed at runtime.
export const BEDROOM: ModelConfig = {
  url: "/models/bedroom.glb",
  targetSize: 7.5,
  groundY: false,
  // Interior vantage (tuned): camera sits inside the suite looking down its length
  // toward the wardrobe wall, past the bed. Slight downward tilt keeps the ceiling
  // fixture out of frame. HeroScene drives a slow push-in from `position` toward
  // the look target on load + initial scroll.
  // Interior vantage that fills the frame from inside the suite (known-good
  // framing). Cinematic mood comes from CSS scrims/grade in the Hero, not from
  // crushing the 3D render.
  camera: {
    yaw: 0,
    pitch: 0,
    dist: 3.2,
    fov: 56,
    targetY: 0,
    position: [0.5, -0.2, 3.15],
    look: [0.05, -0.42, -3.4],
  },
  env: { intensity: 0.92, exposure: 0.99 },
  lights: { key: 2.7, fill: 0.7, rim: 1.2, ambient: 0.42 },
  parallax: 0.045,
};

// Derived: kitchen maxDim 148 (cm), center far off-origin [349,47,1.6] — recentered at runtime.
export const KITCHEN: ModelConfig = {
  url: "/models/kitchen.glb",
  targetSize: 6.4,
  groundY: true,
  // Camera is driven by KitchenScene's scroll fly-through; these are fallbacks.
  camera: { yaw: 24, pitch: 4, dist: 8.6, fov: 38, targetY: 0.4 },
  env: { intensity: 0.92, exposure: 0.98 },
  lights: { key: 3.0, fill: 0.7, rim: 1.8, ambient: 0.34 },
  parallax: 0.04,
};

// Derived: cabinet maxDim 2.7 (m); 7 separable CABINET_* nodes for the exploded view.
export const CABINET: ModelConfig = {
  url: "/models/cabinet.glb",
  targetSize: 5.6,
  groundY: true,
  // targetY tuned to the cabinet's true vertical centre — its longest axis is the
  // width, so model height ≈ 0.27·targetSize; looking at 0.5 framed above it and
  // dropped the unit into the lower third.
  camera: { yaw: 22, pitch: 5, dist: 7.4, fov: 34, targetY: 0.27 },
  // Gallery-spotlight mood: strong key + rim against a dark pedestal backdrop so
  // the pale carcass reads with crisp edges and deep contact shadow.
  env: { intensity: 0.95, exposure: 1.0 },
  lights: { key: 3.2, fill: 0.6, rim: 2.2, ambient: 0.3 },
  parallax: 0.05,
};

// Wardrobe is NOT rendered in real-time — pre-rendered showcase images.
export const WARDROBE_RENDERS = {
  hero: "/renders/wardrobe-hero.webp",
  front: "/renders/wardrobe-front.webp",
  angleR: "/renders/wardrobe-angle-r.webp",
  detail: "/renders/wardrobe-detail.webp",
  heroJpg: "/renders/wardrobe-hero.jpg",
} as const;

export const MODEL_PRELOAD = [BEDROOM.url, KITCHEN.url, CABINET.url];
