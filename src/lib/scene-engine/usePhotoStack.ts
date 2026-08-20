/**
 * usePhotoStack — Manages a collection of physical-looking photos.
 *
 * Provides:
 * - Staggered entrance for a stack of photo refs
 * - Tap-to-expand: one photo moves to center, others shrink back
 * - Navigation: cycle through expanded photos
 * - Exit: all photos scatter/fade
 *
 * Usage:
 *   const { enterAll, expandPhoto, collapseAll, exitAll } = usePhotoStack(photoRefs, containerRef);
 */

import { RefObject, useCallback, useRef } from "react";
import gsap from "gsap";

export interface PhotoStackConfig {
  /** Initial rotations per photo. Provide one per photo. */
  rotations?: number[];
  /** Initial y offsets per photo. */
  yOffsets?: number[];
  /** Stagger amount for entrance. Default: 0.12 */
  entranceStagger?: number;
}

export function usePhotoStack(
  photoRefs: RefObject<HTMLElement | null>[],
  containerRef: RefObject<HTMLElement | null>,
  config: PhotoStackConfig = {}
) {
  const { rotations = [], yOffsets = [], entranceStagger = 0.12 } = config;
  const expandedIdx = useRef<number | null>(null);

  /** Play entrance: photos fly in from below with stagger */
  const enterAll = useCallback(
    (delay = 0) => {
      const els = photoRefs.map((r) => r.current).filter(Boolean);
      return gsap.fromTo(
        els,
        { y: 80, scale: 0.7, opacity: 0, rotation: 0 },
        {
          y: (i) => yOffsets[i] ?? 0,
          scale: 1,
          opacity: 1,
          rotation: (i) => rotations[i] ?? 0,
          duration: 0.6,
          stagger: entranceStagger,
          ease: "back.out(1.4)",
          delay,
        }
      );
    },
    [photoRefs, rotations, yOffsets, entranceStagger]
  );

  /** Expand a specific photo to center; others scale down */
  const expandPhoto = useCallback(
    (idx: number, onComplete?: () => void) => {
      expandedIdx.current = idx;
      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const centerX = containerRect.width / 2;
      const centerY = containerRect.height / 2;

      photoRefs.forEach((ref, i) => {
        const el = ref.current;
        if (!el) return;

        if (i === idx) {
          const rect = el.getBoundingClientRect();
          const elCenterX = rect.left - containerRect.left + rect.width / 2;
          const elCenterY = rect.top - containerRect.top + rect.height / 2;

          gsap.to(el, {
            x: centerX - elCenterX,
            y: centerY - elCenterY,
            scale: 1.3,
            rotation: 0,
            zIndex: 50,
            duration: 0.55,
            ease: "back.out(1.2)",
            onComplete,
          });
        } else {
          gsap.to(el, {
            scale: 0.75,
            opacity: 0.4,
            duration: 0.4,
            ease: "power2.out",
          });
        }
      });
    },
    [photoRefs, containerRef]
  );

  /** Return all photos to their original positions */
  const collapseAll = useCallback(() => {
    expandedIdx.current = null;
    photoRefs.forEach((ref, i) => {
      const el = ref.current;
      if (!el) return;
      gsap.to(el, {
        x: 0,
        y: yOffsets[i] ?? 0,
        scale: 1,
        opacity: 1,
        rotation: rotations[i] ?? 0,
        zIndex: "auto",
        duration: 0.5,
        ease: "power2.out",
      });
    });
  }, [photoRefs, rotations, yOffsets]);

  /** Exit: photos scatter and fade */
  const exitAll = useCallback(
    (onComplete?: () => void) => {
      const els = photoRefs.map((r) => r.current).filter(Boolean);
      const directions = [-1, 1, -1, 1];
      return gsap.to(els, {
        x: (i) => directions[i % 2] * (150 + i * 40),
        y: (i) => -80 - i * 20,
        opacity: 0,
        scale: 0.6,
        rotation: (i) => directions[i % 2] * 15,
        duration: 0.5,
        stagger: 0.06,
        ease: "power3.in",
        onComplete,
      });
    },
    [photoRefs]
  );

  return { enterAll, expandPhoto, collapseAll, exitAll, expandedIdx };
}
