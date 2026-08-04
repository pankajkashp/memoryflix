"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  type: "heart" | "sparkle" | "star" | "orb";
  rotation: number;
  color: string;
}

interface AtmosphericBackgroundProps {
  glowColor?: "rose" | "purple" | "gold";
  includeGrid?: boolean;
  className?: string;
}

export default function AtmosphericBackground({
  glowColor = "rose",
  includeGrid = true,
  className = "",
}: AtmosphericBackgroundProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate sparse, subtle ambient floating elements
    const count = 20;
    const colors = [
      "text-rose-400/25",
      "text-pink-400/20",
      "text-purple-400/20",
      "text-amber-300/20",
    ];

    const items: Particle[] = Array.from({ length: count }).map((_, i) => {
      const rand = Math.random();
      const type: "heart" | "sparkle" | "star" | "orb" =
        rand > 0.65
          ? "heart"
          : rand > 0.4
          ? "sparkle"
          : rand > 0.2
          ? "star"
          : "orb";

      return {
        id: i,
        x: Math.random() * 96 + 2, // 2% to 98% of viewport width
        y: Math.random() * 100, // initial vertical distribution
        size: type === "orb" ? Math.random() * 3 + 2 : Math.random() * 10 + 10,
        duration: Math.random() * 20 + 20, // 20s to 40s slow drift
        delay: Math.random() * -20, // negative delay so they are immediately visible mid-flight
        type,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    });

    setParticles(items);
  }, []);

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* 1. Deep Atmospheric Radial Glows */}
      {/* Top Hero Glow (emanating from behind the hero heading) */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] rounded-full blur-[140px] opacity-80 pointer-events-none"
        style={{
          background:
            glowColor === "gold"
              ? "radial-gradient(ellipse at top, rgba(234, 179, 8, 0.15) 0%, rgba(245, 158, 11, 0.08) 45%, transparent 70%)"
              : glowColor === "purple"
              ? "radial-gradient(ellipse at top, rgba(168, 85, 247, 0.18) 0%, rgba(217, 70, 239, 0.10) 45%, transparent 70%)"
              : "radial-gradient(ellipse at top, rgba(244, 63, 94, 0.18) 0%, rgba(168, 85, 247, 0.12) 45%, transparent 70%)",
        }}
      />

      {/* Mid-right soft ambient flare */}
      <div className="absolute top-[40%] right-[-5%] w-[550px] h-[550px] bg-rose-600/8 blur-[160px] rounded-full pointer-events-none" />

      {/* Bottom-left cool indigo glow */}
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-900/12 blur-[150px] rounded-full pointer-events-none" />

      {/* 2. Subtle Grid & Canvas Texture Overlay */}
      {includeGrid && (
        <div
          className="absolute inset-0 opacity-[0.045] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
      )}

      {/* Noise Grain Layer for rich tactile depth */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle vignette layer */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />

      {/* 3. Floating Ambient Particles (Hearts, Sparkles, Stars, Micro-orbs) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className={`absolute flex items-center justify-center ${p.color}`}
            style={{
              left: `${p.x}%`,
              width: p.size,
              height: p.size,
            }}
            initial={{ y: "110vh", opacity: 0, rotate: p.rotation }}
            animate={{
              y: "-15vh",
              opacity: [0, 0.45, 0.7, 0.45, 0],
              rotate: p.rotation + 180,
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {p.type === "orb" && (
              <div
                className="rounded-full bg-white/40 blur-[0.5px]"
                style={{ width: p.size, height: p.size }}
              />
            )}

            {p.type === "heart" && (
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-full h-full drop-shadow-[0_0_6px_rgba(244,63,94,0.3)]"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            )}

            {p.type === "sparkle" && (
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-full h-full drop-shadow-[0_0_5px_rgba(254,240,138,0.3)]"
              >
                <path d="M12 2L14.09 9.91L22 12L14.09 14.09L12 22L9.91 14.09L2 12L9.91 9.91L12 2Z" />
              </svg>
            )}

            {p.type === "star" && (
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-full h-full drop-shadow-[0_0_5px_rgba(192,132,252,0.3)]"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
