"use client";

/** Minimal, premium loading state shown beneath/while a 3D scene initializes. */
export default function CanvasLoader({
  label = "Rendering",
  dark = false,
}: {
  label?: string;
  dark?: boolean;
}) {
  const ring = dark ? "border-paper/15" : "border-espresso/15";
  const text = dark ? "text-paper/60" : "text-stone/70";
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-10 w-10">
          <span className={`absolute inset-0 rounded-full border ${ring}`} />
          <span className="absolute inset-0 animate-spin rounded-full border-t border-bronze [animation-duration:1.1s]" />
        </div>
        <span className={`eyebrow ${text}`}>{label}</span>
      </div>
    </div>
  );
}
