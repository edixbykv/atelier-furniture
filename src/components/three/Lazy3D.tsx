"use client";

import { useInView } from "@/lib/hooks";
import type { ReactNode } from "react";

/**
 * Mounts heavy 3D content only while its container is near the viewport,
 * unmounting (and freeing the GPU context) once scrolled well away.
 */
export default function Lazy3D({
  children,
  className = "",
  fallback,
  rootMargin = "500px",
}: {
  children: ReactNode;
  className?: string;
  fallback?: ReactNode;
  rootMargin?: string;
}) {
  const [ref, inView] = useInView<HTMLDivElement>(rootMargin);
  return (
    <div ref={ref} className={className}>
      {inView ? children : fallback ?? null}
    </div>
  );
}
