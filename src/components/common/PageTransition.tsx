"use client";

/**
 * PageTransition — Wraps page content with a cinematic entrance animation.
 * Fade + subtle upward translate + blur on enter.
 * Uses GSAP context for proper cleanup.
 */

import { useRef, useEffect } from "react";
import { gsap, animatePageEntrance } from "@/lib/gsap-utils";

export default function PageTransition({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      animatePageEntrance(el);
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ willChange: "transform, opacity, filter" }}
    >
      {children}
    </div>
  );
}
