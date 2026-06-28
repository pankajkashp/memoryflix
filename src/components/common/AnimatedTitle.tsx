"use client";

/**
 * AnimatedTitle — SplitText word-by-word scroll reveal for section headings.
 * Falls back to simple opacity fade for prefers-reduced-motion.
 */

import { useRef, useEffect, ElementType } from "react";
import { gsap, animateSectionTitle } from "@/lib/gsap-utils";

interface AnimatedTitleProps {
  as?: ElementType;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function AnimatedTitle({
  as: Tag = "h2",
  children,
  className,
  delay = 0,
}: AnimatedTitleProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      if (delay) {
        gsap.delayedCall(delay, () => animateSectionTitle(el));
      } else {
        animateSectionTitle(el);
      }
    }, el);

    return () => ctx.revert();
  }, [delay]);

  return (
    <Tag
      ref={ref as React.RefObject<HTMLHeadingElement>}
      className={className}
      style={{ willChange: "transform, opacity, filter" }}
    >
      {children}
    </Tag>
  );
}
