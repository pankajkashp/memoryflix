/**
 * useFloatingObject — Adds a physical-feeling float loop to a DOM ref.
 *
 * Creates a gentle yoyo animation on the target element.
 * Automatically stops when the component unmounts.
 *
 * Usage:
 *   useFloatingObject(heartRef, { y: 8, rotation: 3, duration: 2.5 });
 */

import { RefObject, useEffect } from "react";
import gsap from "gsap";

export interface FloatingOptions {
  /** Vertical travel in px. Default: 8 */
  y?: number;
  /** Horizontal travel in px. Default: 0 */
  x?: number;
  /** Max rotation in degrees. Default: 0 */
  rotation?: number;
  /** Duration of one half-cycle in seconds. Default: 2 */
  duration?: number;
  /** Easing. Default: "sine.inOut" */
  ease?: string;
  /** Delay before starting. Default: 0 */
  delay?: number;
  /** Whether to randomise the start offset slightly. Default: false */
  randomOffset?: boolean;
}

export function useFloatingObject(
  ref: RefObject<HTMLElement | null>,
  options: FloatingOptions = {}
): void {
  const {
    y = 8,
    x = 0,
    rotation = 0,
    duration = 2,
    ease = "sine.inOut",
    delay = 0,
    randomOffset = false,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const actualDelay = delay + (randomOffset ? Math.random() * 0.5 : 0);
    const actualDuration = duration + (randomOffset ? Math.random() * 0.4 : 0);

    const tweens: gsap.core.Tween[] = [];

    if (y !== 0) {
      tweens.push(
        gsap.to(el, {
          y: -y,
          duration: actualDuration,
          ease,
          repeat: -1,
          yoyo: true,
          delay: actualDelay,
        })
      );
    }

    if (x !== 0) {
      tweens.push(
        gsap.to(el, {
          x: x,
          duration: actualDuration * 1.3,
          ease,
          repeat: -1,
          yoyo: true,
          delay: actualDelay + 0.2,
        })
      );
    }

    if (rotation !== 0) {
      tweens.push(
        gsap.to(el, {
          rotation: rotation,
          duration: actualDuration * 1.5,
          ease,
          repeat: -1,
          yoyo: true,
          delay: actualDelay + 0.1,
        })
      );
    }

    return () => {
      tweens.forEach((t) => t.kill());
    };
  }, [ref, y, x, rotation, duration, ease, delay, randomOffset]);
}
