export const DEFAULT_EASE = "power2.out";
export const REWARD_EASE = "back.out(1.4)";
export const ENTRANCE_DURATION = 0.6;
export const EXIT_DURATION = 0.4;
export const STAGGER_GAP = 0.12;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export interface FixedPageConfig {
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
  accentColor?: string;
  cardBg?: string;
  glowColor?: string;
  backgroundTexture?:
    | "paper-grain"
    | "canvas"
    | "subtle-noise"
    | "soft-stripes"
    | "linen"
    | "dots"
    | "cyber-grid"
    | "none"
    | string;
  [key: string]: any;
}

