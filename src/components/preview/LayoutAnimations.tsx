"use client";

/**
 * LayoutAnimations — Per-layout GSAP animation hooks for memory grid sections.
 *
 * Exports hooks for each layout type:
 * - useMasonryAnimation
 * - useTimelineAnimation
 * - usePolaroidAnimation
 * - useFilmStripAnimation
 *
 * Each hook takes a containerRef and fires on mount with proper cleanup.
 */

import { useEffect, RefObject } from "react";
import {
  gsap,
  animateMasonryGrid,
  animateTimelineGrid,
  animatePolaroidGrid,
  animateFilmStrip,
} from "@/lib/gsap-utils";

/** Hook for Masonry layout */
export function useMasonryAnimation(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      animateMasonryGrid(el);
    }, el);
    return () => ctx.revert();
  }, [containerRef]);
}

/** Hook for Timeline layout */
export function useTimelineAnimation(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      animateTimelineGrid(el);
    }, el);
    return () => ctx.revert();
  }, [containerRef]);
}

/** Hook for Polaroid layout */
export function usePolaroidAnimation(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      animatePolaroidGrid(el);
    }, el);
    return () => ctx.revert();
  }, [containerRef]);
}

/** Hook for Film Strip layout */
export function useFilmStripAnimation(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      animateFilmStrip(el);
    }, el);
    return () => ctx.revert();
  }, [containerRef]);
}


