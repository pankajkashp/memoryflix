"use client";

import { useEffect, useMemo, useRef } from "react";
import { useSceneAnimation } from "@/lib/scene-engine/useSceneAnimation";
import FloatingEmojiField, { usePrefersReducedMotion } from "./FloatingEmojiField";
import CharacterSticker from "./CharacterSticker";
import CanvasTexture from "../CanvasTexture";
import { ScrapbookButton, ScallopFrame, DoodleHeart, DoodleStar } from "../ScrapbookDecor";
import { getFontClassName } from "@/lib/fonts";
import { SceneProps } from "./types";

const PAPER_COLORS = ["#f43f5e", "#fbbf24", "#f472b6", "#38bdf8", "#a3e635"];
const NEON_COLORS = ["#22d3ee", "#e879f9", "#facc15", "#4ade80", "#f472b6"];

// Deterministic (SSR-safe) pseudo-random in [0, 1) — avoids a hydration
// mismatch that Math.random() would cause between server and client render.
function hash(i: number): number {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

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
  const reducedMotion = usePrefersReducedMotion();

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
        left: hash(i * 3 + 1) * 100,
        delay: hash(i * 3 + 2) * 1.2,
        duration: 2.5 + hash(i * 3 + 3) * 2,
        color: palette[i % palette.length],
        rotate: hash(i * 3 + 4) * 360,
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
      <CanvasTexture texture={fixedConfig.backgroundTexture || "canvas"} mode="dark" />
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
      <FloatingEmojiField emojis={fixedConfig.emojiDecor || []} count={isNeon ? 4 : 6} />

      {isNeon ? (
        <>
          {fixedConfig.characterSticker && (
            <div className="relative z-10 w-28 h-28 sm:w-36 sm:h-36 -mb-2">
              <CharacterSticker name={fixedConfig.characterSticker} reducedMotion={reducedMotion} className="w-full h-full" />
            </div>
          )}

          <div className="relative z-10 max-w-xs sm:max-w-sm md:max-w-md w-full text-center space-y-4 sm:space-y-5">
            {lines.map((line: string, idx: number) => (
              <span
                key={idx}
                ref={(el) => {
                  linesRef.current[idx] = el;
                }}
                className={`block text-2xl sm:text-3xl md:text-4xl font-serif leading-snug ${getFontClassName(fixedConfig.fontId)}`}
                style={{ color: "#f8fafc" }}
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
            <ScrapbookButton
              ref={replayRef}
              onClick={handleReplay}
              variant="outline"
              color="#e879f9"
              className="relative z-10 mt-8 min-h-[44px] text-xs tracking-widest uppercase"
              aria-label="Replay the story from the beginning"
            >
              ↩ replay story
            </ScrapbookButton>
          )}
        </>
      ) : (
        <ScallopFrame bg="#fdf6e9" className="relative z-10 w-full max-w-xs sm:max-w-md">
          <CanvasTexture texture="gingham" mode="light" />
          <DoodleHeart color={accentColor} size={26} rotate={-10} className="absolute top-4 left-4" />
          <DoodleStar color={accentColor} size={22} rotate={14} className="absolute top-5 right-5" />

          <div className="relative flex flex-col items-center text-center gap-3 px-6 py-8 sm:px-8 sm:py-10">
            {fixedConfig.characterSticker && (
              <div className="w-24 h-24 sm:w-32 sm:h-32 -mb-1">
                <CharacterSticker name={fixedConfig.characterSticker} reducedMotion={reducedMotion} className="w-full h-full" />
              </div>
            )}

            <div className="max-w-xs sm:max-w-sm w-full space-y-2 sm:space-y-3">
              {lines.map((line: string, idx: number) => (
                <span
                  key={idx}
                  ref={(el) => {
                    linesRef.current[idx] = el;
                  }}
                  className={`block text-2xl sm:text-3xl md:text-4xl leading-snug ${getFontClassName(fixedConfig.fontId || "dancing-script")}`}
                  style={{ color: "#8a2b3a" }}
                >
                  {line.trim()}
                </span>
              ))}
            </div>

            {senderName && (
              <p ref={fromRef} className="mt-4 font-mono text-xs tracking-[0.2em] uppercase" style={{ color: accentColor }}>
                — with love, {senderName}
              </p>
            )}

            {allowReplay && (
              <ScrapbookButton
                ref={replayRef}
                onClick={handleReplay}
                variant="paper"
                color={accentColor}
                className="mt-4 min-h-[44px] text-xs tracking-widest uppercase"
                aria-label="Replay the story from the beginning"
              >
                ↩ replay story
              </ScrapbookButton>
            )}
          </div>
        </ScallopFrame>
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
