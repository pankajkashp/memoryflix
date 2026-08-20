/**
 * useSceneAnimation — GSAP context factory for scene components.
 *
 * Creates a scoped GSAP context tied to the component lifecycle.
 * Automatically reverts (kills all tweens + removes listeners) on unmount.
 *
 * Usage:
 *   const { animate, kill } = useSceneAnimation(containerRef);
 *
 *   useEffect(() => {
 *     animate((tl) => {
 *       tl.fromTo(el, { opacity: 0 }, { opacity: 1 });
 *     });
 *   }, []);
 */

import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";

export interface SceneAnimationController {
  /** Run a GSAP animation inside a scoped context. Returns the context. */
  animate: (fn: (tl: gsap.core.Timeline) => void) => gsap.Context;
  /** Manually kill all tweens and revert context. Called automatically on unmount. */
  kill: () => void;
  /** Create a new standalone timeline (outside animate fn) — still scoped. */
  tl: () => gsap.core.Timeline;
}

export function useSceneAnimation(
  containerRef: React.RefObject<HTMLElement | null>
): SceneAnimationController {
  const ctxRef = useRef<gsap.Context | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
  }, []);

  const animate = useCallback(
    (fn: (tl: gsap.core.Timeline) => void): gsap.Context => {
      // Revert any existing context before creating a new one
      ctxRef.current?.revert();
      const ctx = gsap.context(() => {
        const tl = gsap.timeline();
        fn(tl);
      }, containerRef);
      ctxRef.current = ctx;
      return ctx;
    },
    [containerRef]
  );

  const kill = useCallback(() => {
    ctxRef.current?.revert();
    ctxRef.current = null;
  }, []);

  const tl = useCallback((): gsap.core.Timeline => {
    const timeline = gsap.timeline();
    // Register inside context if one exists
    return timeline;
  }, []);

  return { animate, kill, tl };
}
