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
    { id: 1, x: "12%", size: 14, duration: 24, delay: 0, type: "heart" as const, color: "text-[#E85D75]/25" },
    { id: 2, x: "85%", size: 16, duration: 28, delay: 5, type: "sparkle" as const, color: "text-[#E9C989]/40" },
    { id: 3, x: "26%", size: 13, duration: 22, delay: 11, type: "sparkle" as const, color: "text-[#B79FD1]/30" },
    { id: 4, x: "74%", size: 14, duration: 26, delay: 16, type: "heart" as const, color: "text-[#E85D75]/20" },
  ];

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#FFF8F2] ${className}`}
      aria-hidden="true"
    >
      {/* ── 1. Soft Center-Top Radial Glow (Rose/Lavender Blend) ── */}
      <div
        className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[90vw] max-w-[900px] h-[580px] rounded-full blur-[130px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(232, 93, 117, 0.16) 0%, rgba(183, 159, 209, 0.14) 45%, rgba(255, 248, 242, 0) 75%)",
        }}
      />

      {/* ── 2. Subtle Fine Dot Pattern Overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage: `radial-gradient(circle, #B9425C 1.2px, transparent 1.2px)`,
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
                className="w-full h-full drop-shadow-[0_0_6px_rgba(232,93,117,0.25)]"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-full h-full drop-shadow-[0_0_6px_rgba(233,201,137,0.35)]"
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


