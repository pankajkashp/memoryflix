"use client";

import React from "react";
import { motion } from "framer-motion";

interface AtmosphericBackgroundProps {
  glowColor?: "rose" | "purple" | "gold" | "multi";
  includeGrid?: boolean;
  includeParticles?: boolean;
  intensity?: "subtle" | "vibrant";
  className?: string;
}

export default function AtmosphericBackground({
  glowColor = "multi",
  includeGrid = true,
  includeParticles = true,
  intensity = "subtle",
  className = "",
}: AtmosphericBackgroundProps) {
  // 4 sparse, subtle ambient floating hearts & sparkles (reused from NotificationPage style)
  const floatingItems = [
    { id: 1, x: "12%", size: 14, duration: 24, delay: 0, type: "heart" as const, color: "text-rose-400/20" },
    { id: 2, x: "85%", size: 16, duration: 28, delay: 5, type: "sparkle" as const, color: "text-pink-400/20" },
    { id: 3, x: "26%", size: 13, duration: 22, delay: 11, type: "sparkle" as const, color: "text-purple-400/18" },
    { id: 4, x: "74%", size: 14, duration: 26, delay: 16, type: "heart" as const, color: "text-rose-400/18" },
  ];

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#0a0a0f] ${className}`}
      aria-hidden="true"
    >
      {/* ── 1. Soft Center-Top Radial Glow (Pink/Purple Blend, 15-20% Opacity) ── */}
      <div
        className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[90vw] max-w-[900px] h-[580px] rounded-full blur-[130px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(236, 72, 153, 0.18) 0%, rgba(168, 85, 247, 0.12) 45%, rgba(10, 10, 15, 0) 75%)",
        }}
      />

      {/* ── 2. Subtle Fine Dot Pattern Overlay (3-4% Opacity, Consistent with Story Pages) ── */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #ffffff 1.2px, transparent 1.2px)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* ── 3. 3-5 Small Sparse Floating Heart & Sparkle Elements ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingItems.map((item) => (
          <motion.div
            key={item.id}
            className={`absolute flex items-center justify-center ${item.color}`}
            style={{
              left: item.x,
              width: item.size,
              height: item.size,
            }}
            initial={{ y: "105vh", opacity: 0, rotate: 0 }}
            animate={{
              y: "-10vh",
              opacity: [0, 0.5, 0.5, 0],
              rotate: 360,
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {item.type === "heart" ? (
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-full h-full drop-shadow-[0_0_6px_rgba(244,63,94,0.3)]"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-full h-full drop-shadow-[0_0_6px_rgba(244,114,182,0.3)]"
              >
                <path d="M12 2L14.09 9.91L22 12L14.09 14.09L12 22L9.91 14.09L2 12L9.91 9.91L12 2Z" />
              </svg>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}


