"use client";

import React from "react";

export type BackgroundTexture =
  | "paper-grain"
  | "canvas"
  | "subtle-noise"
  | "soft-stripes"
  | "linen"
  | "dots"
  | "cyber-grid"
  | "none";

interface CanvasTextureProps {
  texture?: BackgroundTexture | string;
  className?: string;
}

export function CanvasTexture({
  texture = "subtle-noise",
  className = "",
}: CanvasTextureProps) {
  if (texture === "none") return null;

  return (
    <div
      className={`absolute inset-0 pointer-events-none z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Texture 1: Soft diagonal stripes (Canva-inspired, pastel / cheerful) */}
      {texture === "soft-stripes" && (
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #ffffff, #ffffff 8px, transparent 8px, transparent 20px)`,
          }}
        />
      )}

      {/* Texture 2: Dotted Grid (Modern & playful) */}
      {texture === "dots" && (
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `radial-gradient(circle, #ffffff 1.2px, transparent 1.2px)`,
            backgroundSize: "24px 24px",
          }}
        />
      )}

      {/* Texture 3: Linen woven canvas (Elegant, romantic, tactile) */}
      {texture === "linen" && (
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, #ffffff 0px, #ffffff 1px, transparent 1px, transparent 5px),
              repeating-linear-gradient(90deg, #ffffff 0px, #ffffff 1px, transparent 1px, transparent 5px)
            `,
          }}
        />
      )}

      {/* Texture 4: Cyber / Party grid (Celebration / Neon) */}
      {texture === "cyber-grid" && (
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #38bdf8 1px, transparent 1px),
              linear-gradient(to bottom, #38bdf8 1px, transparent 1px)
            `,
            backgroundSize: "44px 44px",
          }}
        />
      )}

      {/* Texture 5: Paper grain & organic subtle noise (Default / Certificate / Letter) */}
      {(texture === "paper-grain" ||
        texture === "canvas" ||
        texture === "subtle-noise" ||
        !["soft-stripes", "dots", "linen", "cyber-grid"].includes(texture)) && (
        <div
          className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      )}

      {/* Subtle vignette layer for natural canvas depth and contrast */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.38)_100%)] pointer-events-none" />
    </div>
  );
}

export default CanvasTexture;
