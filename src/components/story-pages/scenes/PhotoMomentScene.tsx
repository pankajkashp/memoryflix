"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useSceneAnimation } from "@/lib/scene-engine/useSceneAnimation";
import { useFloatingObject } from "@/lib/scene-engine/useFloatingObject";
import FloatingEmojiField from "./FloatingEmojiField";
import AnimatedSticker from "./AnimatedSticker";
import CharacterSticker from "./CharacterSticker";
import CanvasTexture from "../CanvasTexture";
import TapToAdvanceCue from "../TapToAdvanceCue";
import { ScallopFrame, WashiTape, shade } from "../ScrapbookDecor";
import { getFontClassName } from "@/lib/fonts";
import { SceneProps } from "./types";

/**
 * A full-bleed "photo + note" moment: a large torn-edge photo dominates one
 * side of the screen, an asymmetrical text block sits on the other — the
 * photo/text sides alternate across a template's 3 pages (fixedConfig.side)
 * so the sequence doesn't read as one repeated centered layout.
 */

function hash(i: number): number {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/** A deterministic (SSR-safe) jagged rectangle outline simulating a torn paper edge. */
function tornEdgePolygon(pointsPerSide = 7, jitterPct = 3.2): string {
  const pts: string[] = [];
  let idx = 0;
  for (let i = 0; i <= pointsPerSide; i++) pts.push(`${((i / pointsPerSide) * 100).toFixed(2)}% ${(hash(idx++) * jitterPct).toFixed(2)}%`);
  for (let i = 1; i <= pointsPerSide; i++) pts.push(`${(100 - hash(idx++) * jitterPct).toFixed(2)}% ${((i / pointsPerSide) * 100).toFixed(2)}%`);
  for (let i = 1; i <= pointsPerSide; i++) pts.push(`${(100 - (i / pointsPerSide) * 100).toFixed(2)}% ${(100 - hash(idx++) * jitterPct).toFixed(2)}%`);
  for (let i = 1; i < pointsPerSide; i++) pts.push(`${(hash(idx++) * jitterPct).toFixed(2)}% ${(100 - (i / pointsPerSide) * 100).toFixed(2)}%`);
  return `polygon(${pts.join(", ")})`;
}

const TORN_EDGE_CLIP_PATH = tornEdgePolygon();

export default function PhotoMomentScene({ fixedConfig, fieldValues, onExit }: SceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const { animate } = useSceneAnimation(containerRef);
  useFloatingObject(photoRef, { y: 12, rotation: 1.5, duration: 3.4, delay: 0.6 });

  const { backgroundColor = "#1b0a12" } = fixedConfig;
  const accentColor = fieldValues.accentColor || fixedConfig.accentColor || "#fb7185";
  const side: "left" | "right" = fixedConfig.side === "right" ? "right" : "left";
  const photoUrl = fieldValues.photoUrl as string | undefined;
  const heading = fieldValues.heading || "";
  const message = fieldValues.message || "";
  const cornerSticker = fixedConfig.cornerSticker || "💕";

  useEffect(() => {
    animate((tl) => {
      tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out" })
        .fromTo(
          photoRef.current,
          { opacity: 0, scale: 0.85, rotate: side === "left" ? -10 : 10 },
          { opacity: 1, scale: 1, rotate: side === "left" ? -3 : 3, duration: 0.9, ease: "back.out(1.5)" },
          "-=0.3"
        )
        .fromTo(
          textRef.current?.children ? Array.from(textRef.current.children) : [],
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.14, ease: "power2.out" },
          "-=0.45"
        );
    });
  }, []);

  const handleContinue = () => onExit("default");

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden select-none cursor-pointer"
      style={{ backgroundColor }}
      onClick={handleContinue}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleContinue()}
      aria-label="Tap to continue"
    >
      <CanvasTexture texture={fixedConfig.backgroundTexture || "roses"} mode="dark" />
      <FloatingEmojiField emojis={fixedConfig.emojiDecor || []} count={3} />

      <div className={`absolute inset-0 flex flex-col ${side === "left" ? "sm:flex-row" : "sm:flex-row-reverse"}`}>
        {/* Photo half — fills its side of the screen, not centered on the whole page */}
        <div className="relative w-full sm:w-[58%] h-[54%] sm:h-full flex items-center justify-center p-6 sm:p-10">
          <div
            ref={photoRef}
            className={`relative w-[82%] sm:w-[78%] aspect-[4/5] max-h-full shadow-2xl bg-white/10 ${
              side === "left" ? "sm:-translate-y-[6%]" : "sm:translate-y-[10%]"
            }`}
            style={{ clipPath: TORN_EDGE_CLIP_PATH, boxShadow: "0 25px 60px -15px rgba(0,0,0,0.7)" }}
          >
            {photoUrl && <Image src={photoUrl} alt="" fill className="object-cover" sizes="50vw" />}
          </div>

          <div
            className={`absolute top-2 sm:top-8 ${side === "left" ? "right-4 sm:right-8" : "left-4 sm:left-8"} w-14 h-14 sm:w-20 sm:h-20`}
            style={{ animation: "mflx-corner-revolve 9s linear infinite" }}
          >
            <AnimatedSticker emoji={cornerSticker} className="w-full h-full" />
          </div>
        </div>

        {/* Text half — deliberately offset, not vertically centered to match the photo */}
        <div
          ref={textRef}
          className={`relative w-full sm:w-[42%] h-[46%] sm:h-full flex flex-col gap-3 px-8 sm:px-10 justify-end sm:justify-center pb-6 sm:pb-0 ${
            side === "left" ? "items-start text-left sm:pt-16" : "items-start text-left sm:pb-16"
          }`}
        >
          <ScallopFrame
            rotate={side === "left" ? 1.5 : -1.5}
            className="max-w-sm"
            contentClassName="px-5 py-6 sm:px-7 sm:py-7 space-y-3"
          >
            <CanvasTexture texture="paper-grain" mode="light" />
            <WashiTape
              color={accentColor}
              rotate={side === "left" ? -8 : 8}
              width={72}
              className="absolute -top-3 left-1/2 -translate-x-1/2 z-10"
            />
            {heading && (
              <h2
                className={`relative text-3xl sm:text-4xl md:text-5xl font-bold leading-tight ${getFontClassName(fixedConfig.fontId)}`}
                style={{ color: shade(accentColor, -30) }}
              >
                {heading}
              </h2>
            )}
            <p className="relative text-base sm:text-lg leading-relaxed max-w-xs" style={{ color: "#4b3a2f" }}>
              {message}
            </p>
          </ScallopFrame>
        </div>
      </div>

      {fixedConfig.characterSticker && (
        <div className={`absolute bottom-4 sm:bottom-8 ${side === "left" ? "left-4 sm:left-10" : "right-4 sm:right-10"} w-20 h-20 sm:w-28 sm:h-28`}>
          <CharacterSticker name={fixedConfig.characterSticker} className="w-full h-full" />
        </div>
      )}

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
        <TapToAdvanceCue accentColor={accentColor} />
      </div>

      <style>{`
        @keyframes mflx-corner-revolve {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
