"use client";

import { useEffect, useMemo, useRef } from "react";
import { useSceneAnimation } from "@/lib/scene-engine/useSceneAnimation";
import { SceneProps } from "./types";

const PAPER_COLORS = ["#f43f5e", "#fbbf24", "#f472b6", "#38bdf8", "#a3e635"];
const NEON_COLORS = ["#22d3ee", "#e879f9", "#facc15", "#4ade80", "#f472b6"];

interface Piece {
  left: number;
  delay: number;
  duration: number;
  color: string;
  rotate: number;
}

export default function ConfettiFinaleScene({ fixedConfig, fieldValues, onExit }: SceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<Array<HTMLSpanElement | null>>([]);
  const fromRef = useRef<HTMLParagraphElement>(null);
  const replayRef = useRef<HTMLButtonElement>(null);
  const { animate } = useSceneAnimation(containerRef);

  const { backgroundColor = "#0d0d0d", animationPreset = "paper-confetti" } = fixedConfig;
  const accentColor = fieldValues.accentColor || fixedConfig.accentColor || "#f43f5e";
  const finalMessage = fieldValues.finalMessage || "Happy Birthday! 🎂";
  const senderName = fieldValues.senderName;
  const allowReplay = fixedConfig.next !== undefined;

  const lines = finalMessage.split("\n").filter((l: string) => l.trim() !== "");
  const isNeon = animationPreset === "neon-burst";
  const palette = isNeon ? NEON_COLORS : PAPER_COLORS;

  const pieces: Piece[] = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 1.2,
        duration: 2.5 + Math.random() * 2,
        color: palette[i % palette.length],
        rotate: Math.random() * 360,
      })),
    [palette]
  );

  useEffect(() => {
    animate((tl) => {
      tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power2.out" })
        .fromTo(
          linesRef.current.filter(Boolean),
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.3, ease: "power2.out" },
          "-=0.2"
        )
        .fromTo(fromRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.1")
        .fromTo(replayRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.5)" });
    });
  }, []);

  const handleReplay = () => onExit("default");

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex flex-col items-center justify-center px-8 sm:px-12 py-6 select-none overflow-hidden"
      style={{ background: isNeon ? "radial-gradient(circle at 50% 20%, #1e1b4b, #020617)" : backgroundColor }}
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {pieces.map((p, i) => (
          <span
            key={i}
            className="absolute top-[-5%] w-2 h-3 rounded-sm"
            style={{
              left: `${p.left}%`,
              backgroundColor: p.color,
              transform: `rotate(${p.rotate}deg)`,
              animation: `mflx-confetti-fall ${p.duration}s linear ${p.delay}s infinite`,
              boxShadow: isNeon ? `0 0 8px ${p.color}` : undefined,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-xs sm:max-w-sm md:max-w-md w-full text-center space-y-4 sm:space-y-5">
        {lines.map((line: string, idx: number) => (
          <span
            key={idx}
            ref={(el) => {
              linesRef.current[idx] = el;
            }}
            className="block text-2xl sm:text-3xl md:text-4xl font-serif leading-snug"
            style={{ color: isNeon ? "#f8fafc" : "#fafafa" }}
          >
            {line.trim()}
          </span>
        ))}
      </div>

      {senderName && (
        <p ref={fromRef} className="relative z-10 mt-10 sm:mt-12 font-mono text-sm tracking-[0.2em] uppercase" style={{ color: accentColor }}>
          — with love, {senderName}
        </p>
      )}

      {allowReplay && (
        <button
          ref={replayRef}
          onClick={handleReplay}
          className="relative z-10 mt-8 min-h-[44px] px-6 py-2.5 rounded-full bg-white/10 border border-white/20 text-white/60 text-xs font-mono tracking-widest uppercase hover:bg-white/15 hover:text-white/80 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-white/20 backdrop-blur-sm"
          aria-label="Replay the story from the beginning"
        >
          ↩ replay story
        </button>
      )}

      <style>{`
        @keyframes mflx-confetti-fall {
          from { transform: translateY(0) rotate(0deg); opacity: 1; }
          to { transform: translateY(110vh) rotate(360deg); opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
