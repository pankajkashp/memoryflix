"use client";

import { ButtonHTMLAttributes, CSSProperties, ReactNode, forwardRef } from "react";

/**
 * Shared scrapbook-craft visual language: washi tape, torn paper, rubber
 * stamps, polaroids, doodles and a tactile "sticker" button — used across
 * every template so the handcrafted feel is consistent without making every
 * template's layout/composition identical (each template picks its own
 * subset, colors and placement).
 */

function hash(i: number): number {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/** Deterministic (SSR-safe) jagged rectangle outline simulating a torn paper edge. */
export function tornRectPath(seed = 0, pointsPerSide = 6, jitterPct = 3.2): string {
  const pts: string[] = [];
  let idx = seed * 131 + 1;
  for (let i = 0; i <= pointsPerSide; i++) pts.push(`${((i / pointsPerSide) * 100).toFixed(2)}% ${(hash(idx++) * jitterPct).toFixed(2)}%`);
  for (let i = 1; i <= pointsPerSide; i++) pts.push(`${(100 - hash(idx++) * jitterPct).toFixed(2)}% ${((i / pointsPerSide) * 100).toFixed(2)}%`);
  for (let i = 1; i <= pointsPerSide; i++) pts.push(`${(100 - (i / pointsPerSide) * 100).toFixed(2)}% ${(100 - hash(idx++) * jitterPct).toFixed(2)}%`);
  for (let i = 1; i < pointsPerSide; i++) pts.push(`${(hash(idx++) * jitterPct).toFixed(2)}% ${(100 - (i / pointsPerSide) * 100).toFixed(2)}%`);
  return `polygon(${pts.join(", ")})`;
}

/** Deterministic smooth wavy/scalloped outline around a rectangle (a "sticker-cut" card edge). */
export function scallopRectPath(bumpsPerSide = 7, depthPct = 1.4, pointsPerBump = 12): string {
  const pts: string[] = [];
  const n = Math.max(1, Math.round(bumpsPerSide * pointsPerBump));
  const addEdge = (isHorizontal: boolean, fixed: number, reverse: boolean) => {
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const wave = Math.sin(t * bumpsPerSide * Math.PI * 2) * depthPct;
      const pos = (reverse ? 1 - t : t) * 100;
      if (isHorizontal) pts.push(`${pos.toFixed(2)}% ${(fixed + wave).toFixed(2)}%`);
      else pts.push(`${(fixed + wave).toFixed(2)}% ${pos.toFixed(2)}%`);
    }
  };
  addEdge(true, 0, false);
  addEdge(false, 100, false);
  addEdge(true, 100, true);
  addEdge(false, 0, true);
  return `polygon(${pts.join(", ")})`;
}

/** Lighten (positive) or darken (negative) a #rrggbb hex color by a percent. */
export function shade(hex: string, percent: number): string {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return hex;
  const num = parseInt(clean, 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  const r = clamp((num >> 16) + Math.round(2.55 * percent));
  const g = clamp(((num >> 8) & 0xff) + Math.round(2.55 * percent));
  const b = clamp((num & 0xff) + Math.round(2.55 * percent));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/* ────────────────────────────── Washi Tape ────────────────────────────── */

export interface WashiTapeProps {
  color?: string;
  rotate?: number;
  width?: number;
  className?: string;
  style?: CSSProperties;
}

export function WashiTape({ color = "#f9a8d4", rotate = -4, width = 88, className = "", style }: WashiTapeProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
      style={{
        width,
        height: Math.round(width * 0.32),
        background: `repeating-linear-gradient(127deg, ${color}dd 0px, ${color}dd 7px, ${color}9a 7px, ${color}9a 14px)`,
        transform: `rotate(${rotate}deg)`,
        boxShadow: "0 3px 5px rgba(0,0,0,0.18)",
        borderRadius: "1px",
        opacity: 0.92,
        ...style,
      }}
    />
  );
}

/* ────────────────────────────── Paper Scrap ───────────────────────────── */

export interface PaperScrapProps {
  color?: string;
  rotate?: number;
  seed?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function PaperScrap({ color = "#fffaf0", rotate = -3, seed = 1, className = "", style, children }: PaperScrapProps) {
  return (
    <div
      className={`shadow-lg ${className}`}
      style={{
        backgroundColor: color,
        clipPath: tornRectPath(seed),
        transform: `rotate(${rotate}deg)`,
        boxShadow: "0 10px 22px -8px rgba(0,0,0,0.35)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ────────────────────────────────  Stamp  ─────────────────────────────── */

export interface StampProps {
  color?: string;
  rotate?: number;
  size?: number;
  label?: string;
  className?: string;
  style?: CSSProperties;
}

export function Stamp({ color = "#e11d48", rotate = -10, size = 74, label = "★", className = "", style }: StampProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none flex items-center justify-center rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        border: `2px dashed ${color}`,
        transform: `rotate(${rotate}deg)`,
        opacity: 0.9,
        ...style,
      }}
    >
      <div
        className="rounded-full border-2 flex items-center justify-center text-center leading-none font-black uppercase tracking-wider"
        style={{ borderColor: color, color, width: size - 16, height: size - 16, fontSize: Math.max(8, size * 0.12) }}
      >
        {label}
      </div>
    </div>
  );
}

/* ────────────────────────────  Scallop Frame  ─────────────────────────── */

export interface ScallopFrameProps {
  bg?: string;
  rotate?: number;
  className?: string;
  contentClassName?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** A sticker-cut, wavy-edged paper card — the "scrapbook diary page" frame. */
export function ScallopFrame({ bg = "#fdf6e9", rotate = 0, className = "", contentClassName = "", style, children }: ScallopFrameProps) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        backgroundColor: bg,
        clipPath: scallopRectPath(),
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        boxShadow: "0 20px 45px -16px rgba(30,15,10,0.45)",
        ...style,
      }}
    >
      <div className={`relative ${contentClassName}`}>{children}</div>
    </div>
  );
}

/* ──────────────────────────────  Polaroid  ────────────────────────────── */

export interface PolaroidProps {
  rotate?: number;
  tape?: boolean;
  tapeColor?: string;
  caption?: string;
  captionClassName?: string;
  className?: string;
  frameClassName?: string;
  children?: ReactNode;
}

export function Polaroid({
  rotate = -3,
  tape = true,
  tapeColor = "#fde68a",
  caption,
  captionClassName = "",
  className = "",
  frameClassName = "",
  children,
}: PolaroidProps) {
  return (
    <div
      className={`relative bg-white p-3 pb-9 ${className}`}
      style={{
        transform: `rotate(${rotate}deg)`,
        boxShadow: "0 20px 40px -12px rgba(30,15,10,0.4), 0 6px 14px -6px rgba(30,15,10,0.25)",
      }}
    >
      {tape && (
        <WashiTape
          color={tapeColor}
          rotate={rotate >= 0 ? -9 : 9}
          width={68}
          className="absolute -top-4 left-1/2 -translate-x-1/2 z-10"
        />
      )}
      <div className={`relative overflow-hidden bg-stone-100 ${frameClassName}`}>{children}</div>
      {caption && (
        <p className={`absolute bottom-2 left-0 right-0 text-center text-sm text-stone-600 ${captionClassName}`}>
          {caption}
        </p>
      )}
    </div>
  );
}

/* ───────────────────────────  Doodle accents  ─────────────────────────── */

export function DoodleHeart({ color = "#f43f5e", size = 28, rotate = -8, className = "" }: { color?: string; size?: number; rotate?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={`pointer-events-none ${className}`} style={{ transform: `rotate(${rotate}deg)` }} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20.5c-4-2.7-9-6.6-9-11.2C3 6 5.3 4 8 4c1.7 0 3.2.9 4 2.3C12.8 4.9 14.3 4 16 4c2.7 0 5 2 5 5.3 0 4.6-5 8.5-9 11.2Z" />
    </svg>
  );
}

export function DoodleStar({ color = "#f59e0b", size = 24, rotate = 6, className = "" }: { color?: string; size?: number; rotate?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={`pointer-events-none ${className}`} style={{ transform: `rotate(${rotate}deg)` }} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.5 14.3 9h6.8l-5.5 4 2.1 6.5L12 15.8 6.3 19.5l2.1-6.5-5.5-4h6.8Z" />
    </svg>
  );
}

export function DoodleSquiggleArrow({ color = "#78716c", rotate = 0, className = "" }: { color?: string; rotate?: number; className?: string }) {
  return (
    <svg viewBox="0 0 100 60" width={84} height={50} className={`pointer-events-none ${className}`} style={{ transform: `rotate(${rotate}deg)` }} fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12 C 42 4, 58 48, 92 38" />
      <path d="M78 27 L94 38 L80 50" />
    </svg>
  );
}

export function CorkboardPin({ color = "#ef4444", size = 15, className = "" }: { color?: string; size?: number; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 35% 30%, #fff, ${color} 55%, ${shade(color, -35)} 100%)`,
        boxShadow: "0 3px 4px rgba(0,0,0,0.4)",
      }}
    />
  );
}

/* ────────────────────────────  Scrapbook Button  ──────────────────────── */

export interface ScrapbookButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: string;
  variant?: "sticker" | "paper" | "outline";
  tape?: boolean;
}

export const ScrapbookButton = forwardRef<HTMLButtonElement, ScrapbookButtonProps>(function ScrapbookButton(
  { color = "#f43f5e", variant = "sticker", tape = false, className = "", children, style, ...rest },
  ref
) {
  const base =
    "relative inline-flex items-center justify-center gap-2 font-black tracking-wide select-none " +
    "transition-all duration-150 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.95] " +
    "focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40 disabled:opacity-60 disabled:pointer-events-none";

  const shapeByVariant: Record<string, string> = {
    sticker: "rounded-full px-8 py-3.5 text-white",
    paper: "rounded-xl px-7 py-3 border-2",
    outline: "rounded-full px-7 py-3 border-2 bg-transparent",
  };

  const styleByVariant: Record<string, CSSProperties> = {
    sticker: {
      background: `linear-gradient(155deg, ${shade(color, 8)}, ${shade(color, -16)})`,
      boxShadow: `0 5px 0 ${shade(color, -34)}, 0 12px 22px -6px ${color}80`,
    },
    paper: {
      backgroundColor: "#fffaf0",
      borderColor: `${color}55`,
      color,
      boxShadow: `3px 4px 0 ${color}45, 0 10px 18px -8px rgba(40,25,15,0.35)`,
    },
    outline: {
      borderColor: color,
      color,
      boxShadow: `0 4px 0 ${color}30`,
    },
  };

  return (
    <button ref={ref} className={`${base} ${shapeByVariant[variant]} ${className}`} style={{ ...styleByVariant[variant], ...style }} {...rest}>
      {tape && <WashiTape rotate={-7} width={44} className="absolute -top-3 left-5 z-10" />}
      {children}
    </button>
  );
});
