"use client";

/**
 * FloatingEmojiField — a decorative layer of gently floating emoji
 * (hearts, sparkles, party poppers, bears, ...) shared across scenes so
 * each occasion's "cute factor" is a config choice, not per-scene code.
 *
 * Positions/timings are a fixed table (not Math.random()) so server-rendered
 * and hydrated markup always match — the same approach already used by
 * ConfettiFinaleScene's finale decorations.
 */

const SLOTS = [
  { top: "8%", left: "6%", size: "text-xl sm:text-2xl", duration: 3.2, delay: 0 },
  { top: "14%", left: "82%", size: "text-lg sm:text-xl", duration: 2.6, delay: 0.4 },
  { top: "78%", left: "10%", size: "text-lg sm:text-xl", duration: 3.6, delay: 0.8 },
  { top: "72%", left: "86%", size: "text-xl sm:text-2xl", duration: 2.9, delay: 0.2 },
  { top: "40%", left: "4%", size: "text-base sm:text-lg", duration: 3.3, delay: 1.1 },
  { top: "36%", left: "92%", size: "text-base sm:text-lg", duration: 2.8, delay: 0.6 },
] as const;

export interface FloatingEmojiFieldProps {
  /** Which emoji to scatter, e.g. ["❤️", "✨", "🧸"]. Cycled across the fixed slots. */
  emojis: string[];
  /** How many of the 6 fixed slots to use. Default: all. */
  count?: number;
  className?: string;
}

export default function FloatingEmojiField({ emojis, count = SLOTS.length, className = "" }: FloatingEmojiFieldProps) {
  if (emojis.length === 0) return null;
  const slots = SLOTS.slice(0, Math.min(count, SLOTS.length));

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
      {slots.map((slot, i) => (
        <span
          key={i}
          className={`absolute select-none opacity-70 motion-reduce:animate-none ${slot.size}`}
          style={{
            top: slot.top,
            left: slot.left,
            animation: `mflx-float-emoji ${slot.duration}s ease-in-out ${slot.delay}s infinite alternate`,
          }}
        >
          {emojis[i % emojis.length]}
        </span>
      ))}
      <style>{`
        @keyframes mflx-float-emoji {
          from { transform: translateY(0px) rotate(-6deg); }
          to { transform: translateY(-14px) rotate(6deg); }
        }
      `}</style>
    </div>
  );
}
