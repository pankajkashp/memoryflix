"use client";

import { useEffect, useState } from "react";
import AnimatedSticker from "./AnimatedSticker";

/**
 * FloatingEmojiField — a decorative layer of continuously drifting animated
 * stickers (hearts, sparkles, party poppers, bears, ...) shared across
 * scenes so each occasion's "cute factor" is a config choice, not
 * per-scene code. See AnimatedSticker for where the animation comes from.
 *
 * Each slot wanders along its own long, slow path (not just a fixed-spot
 * bob) so the screen keeps feeling alive. Paths/timings are a fixed table
 * (not Math.random()) so server-rendered and hydrated markup always match —
 * the same approach already used by ConfettiFinaleScene's finale decorations.
 */

const SLOTS = [
  { top: "10%", left: "8%", size: 52, duration: 11, delay: 0, driftX: 70, driftY: 90 },
  { top: "16%", left: "80%", size: 44, duration: 13, delay: 1.2, driftX: -60, driftY: 110 },
  { top: "78%", left: "12%", size: 44, duration: 12, delay: 2.4, driftX: 90, driftY: -70 },
  { top: "74%", left: "84%", size: 50, duration: 14, delay: 0.6, driftX: -80, driftY: -60 },
  { top: "42%", left: "6%", size: 38, duration: 10, delay: 3, driftX: 55, driftY: 60 },
  { top: "38%", left: "90%", size: 38, duration: 12.5, delay: 1.8, driftX: -65, driftY: 50 },
] as const;

export interface FloatingEmojiFieldProps {
  /** Which emoji to scatter, e.g. ["❤️", "✨", "🧸"]. Cycled across the fixed slots. */
  emojis: string[];
  /**
   * How many of the 6 fixed slots to use. Default: 3 — each is a real,
   * independently-animating Lottie instance, and mounting too many at once
   * across a scene noticeably slows down the concurrent GSAP timelines.
   */
  count?: number;
  className?: string;
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

export default function FloatingEmojiField({ emojis, count = 3, className = "" }: FloatingEmojiFieldProps) {
  const reducedMotion = usePrefersReducedMotion();
  if (emojis.length === 0) return null;
  const slots = SLOTS.slice(0, Math.min(count, SLOTS.length));

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
      {slots.map((slot, i) => (
        <span
          key={i}
          className="absolute inline-block select-none opacity-80 drop-shadow-sm text-4xl leading-none motion-reduce:animate-none"
          style={
            {
              top: slot.top,
              left: slot.left,
              width: slot.size,
              height: slot.size,
              "--drift-x": `${slot.driftX}px`,
              "--drift-y": `${slot.driftY}px`,
              animation: reducedMotion ? undefined : `mflx-drift-emoji ${slot.duration}s ease-in-out ${slot.delay}s infinite`,
            } as React.CSSProperties
          }
        >
          <AnimatedSticker
            emoji={emojis[i % emojis.length]}
            reducedMotion={reducedMotion}
            className="w-full h-full"
          />
        </span>
      ))}
      <style>{`
        @keyframes mflx-drift-emoji {
          0% { transform: translate(0, 0) rotate(-6deg); }
          25% { transform: translate(calc(var(--drift-x) * 0.6), calc(var(--drift-y) * -0.5)) rotate(4deg); }
          50% { transform: translate(var(--drift-x), var(--drift-y)) rotate(8deg); }
          75% { transform: translate(calc(var(--drift-x) * 0.3), calc(var(--drift-y) * 0.8)) rotate(-4deg); }
          100% { transform: translate(0, 0) rotate(-6deg); }
        }
      `}</style>
    </div>
  );
}
