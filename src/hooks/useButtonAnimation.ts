/**
 * useButtonAnimation — GSAP hover + press micro-animation for CTA buttons.
 *
 * Desktop: hover scale 1→1.04 + glow, press scale 0.96
 * Mobile: no hover (touch-friendly, native active states handle this)
 * prefers-reduced-motion: disabled entirely
 */

"use client";

import { useEffect, RefObject } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap-utils";

export function useButtonAnimation(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const onEnter = () =>
        gsap.to(el, { scale: 1.04, duration: 0.2, ease: "power2.out" });
      const onLeave = () =>
        gsap.to(el, { scale: 1, duration: 0.2, ease: "power2.out" });
      const onDown = () =>
        gsap.to(el, { scale: 0.96, duration: 0.1, ease: "power2.out" });
      const onUp = () =>
        gsap.to(el, { scale: 1, duration: 0.18, ease: "back.out(2)" });

      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
      el.addEventListener("mousedown", onDown);
      el.addEventListener("mouseup", onUp);

      return () => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
        el.removeEventListener("mousedown", onDown);
        el.removeEventListener("mouseup", onUp);
      };
    });

    return () => mm.revert();
  }, [ref]);
}
