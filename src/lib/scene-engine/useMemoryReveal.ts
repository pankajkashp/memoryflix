/**
 * useMemoryReveal — Consistent photo/memory reveal animation pattern.
 *
 * Plays a cinematic reveal: photo zooms in from slight scale,
 * then decorative elements stagger in after.
 *
 * Usage:
 *   const { playReveal } = useMemoryReveal(photoRef, decorRefs);
 *   useEffect(() => { playReveal(); }, []);
 */

import { RefObject, useCallback } from "react";
import gsap from "gsap";

export interface MemoryRevealOptions {
  /** Delay before the reveal starts. Default: 0 */
  delay?: number;
  /** Whether to animate blur (from blurred to sharp). Default: false */
  withBlur?: boolean;
  /** Photo initial scale. Default: 0.85 */
  fromScale?: number;
  /** Duration. Default: 0.8 */
  duration?: number;
  /** Decor stagger amount. Default: 0.1 */
  decorStagger?: number;
}

export function useMemoryReveal(
  photoRef: RefObject<HTMLElement | null>,
  decorRefs: RefObject<HTMLElement | null>[] = [],
  options: MemoryRevealOptions = {}
) {
  const {
    delay = 0,
    withBlur = false,
    fromScale = 0.85,
    duration = 0.8,
    decorStagger = 0.1,
  } = options;

  const playReveal = useCallback(
    (onComplete?: () => void) => {
      const tl = gsap.timeline({ onComplete, delay });

      // Photo reveal
      tl.fromTo(
        photoRef.current,
        {
          scale: fromScale,
          opacity: 0,
          filter: withBlur ? "blur(20px)" : "blur(0px)",
        },
        {
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          duration,
          ease: "power3.out",
          clearProps: "filter",
        }
      );

      // Decorations stagger in after photo
      const validDecors = decorRefs
        .map((r) => r.current)
        .filter(Boolean);
      if (validDecors.length > 0) {
        tl.fromTo(
          validDecors,
          { scale: 0, opacity: 0, y: 10 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: decorStagger,
            ease: "back.out(1.8)",
          },
          "-=0.3"
        );
      }

      return tl;
    },
    [photoRef, decorRefs, delay, withBlur, fromScale, duration, decorStagger]
  );

  const playExit = useCallback(
    (onComplete?: () => void) => {
      return gsap.to(photoRef.current, {
        scale: 0.9,
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: "power3.in",
        onComplete,
      });
    },
    [photoRef]
  );

  return { playReveal, playExit };
}
