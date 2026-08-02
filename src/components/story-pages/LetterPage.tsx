"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import {
  DEFAULT_EASE,
  ENTRANCE_DURATION,
  EXIT_DURATION,
  FixedPageConfig,
  STAGGER_GAP,
  prefersReducedMotion,
} from "@/lib/pageAnimations";
import CanvasTexture from "./CanvasTexture";
import TapToAdvanceCue from "./TapToAdvanceCue";

export interface LetterPageData {
  date?: string;
  recipientName?: string;
  senderName?: string;
  message: string;
  photoUrl?: string;
}

export interface LetterPageProps {
  fixedConfig?: FixedPageConfig;
  data: LetterPageData;
  isActive?: boolean;
  isExiting?: boolean;
}

export default function LetterPage({
  fixedConfig = {},
  data,
  isActive = true,
  isExiting = false,
}: LetterPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const {
    backgroundColor = "#09090b",
    textColor = "#fafafa",
    accentColor = "#f43f5e",
    cardBg = "rgba(24, 24, 27, 0.9)",
  } = fixedConfig;

  // Entrance animation
  useEffect(() => {
    if (!isActive) return;
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Reset
      gsap.set(cardRef.current, {
        opacity: 0,
        scale: reduced ? 1 : 0.9,
        y: reduced ? 0 : 35,
      });

      const textNodes = contentRef.current?.children || [];
      gsap.set(textNodes, {
        opacity: 0,
        y: reduced ? 0 : 15,
      });

      // 1. Paper / Letter card scales in
      tl.to(cardRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: ENTRANCE_DURATION * 1.1,
        ease: DEFAULT_EASE,
      });

      // 2. Stagger text content sequentially
      tl.to(
        textNodes,
        {
          opacity: 1,
          y: 0,
          duration: ENTRANCE_DURATION * 0.8,
          stagger: STAGGER_GAP,
          ease: DEFAULT_EASE,
        },
        "-=0.3"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isActive, data]);

  // Exit animation
  useEffect(() => {
    if (!isExiting || !containerRef.current) return;
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const textNodes = contentRef.current?.children || [];
      gsap.to(textNodes, {
        opacity: 0,
        y: reduced ? 0 : -10,
        duration: 0.2,
        stagger: 0.04,
      });

      gsap.to(cardRef.current, {
        opacity: 0,
        scale: 0.95,
        y: reduced ? 0 : -20,
        duration: EXIT_DURATION,
        ease: "power2.in",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isExiting]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[100dvh] flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden select-none cursor-pointer"
      style={{ backgroundColor }}
    >
      {/* Textured Canvas Background */}
      <CanvasTexture texture={fixedConfig.backgroundTexture || "paper-grain"} />

      {/* Background ambient lighting */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-20 -top-20 -right-20"
        style={{ backgroundColor: accentColor }}
      />
      <div className="absolute w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none opacity-15 -bottom-20 -left-20 bg-amber-500/20" />

      {/* Physical Letter Card Document directly on Canvas */}
      <div
        ref={cardRef}
        className="relative w-full max-w-xl rounded-2xl p-6 sm:p-10 backdrop-blur-xl border border-white/15 shadow-2xl overflow-hidden z-10"
        style={{
          backgroundColor: cardBg,
          boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.75), 0 0 35px -10px ${accentColor}20`,
        }}
      >
        {/* Letter Card Paper Grain Texture */}
        <CanvasTexture texture="paper-grain" className="opacity-30 rounded-2xl" />

        {/* Subtle decorative letterhead accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-500/60 to-transparent" />

        <div ref={contentRef} className="space-y-6 relative z-10">
          {/* Header (Date / Salutation) */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span
              className="text-xs uppercase tracking-widest font-mono text-zinc-400"
              style={{ color: `${textColor}80` }}
            >
              {data.date || "A Note For You"}
            </span>
            {data.recipientName && (
              <span
                className="text-sm sm:text-base font-semibold tracking-wide"
                style={{ color: accentColor }}
              >
                Dear {data.recipientName},
              </span>
            )}
          </div>

          {/* Letter Body */}
          <div
            className="text-base sm:text-lg leading-relaxed font-serif whitespace-pre-line text-zinc-200"
            style={{ color: textColor }}
          >
            {data.message}
          </div>

          {/* Optional Attached Photo */}
          {data.photoUrl && (
            <div className="relative w-full h-48 sm:h-56 rounded-xl overflow-hidden shadow-md border border-white/10 mt-4 group">
              <Image
                src={data.photoUrl}
                alt="Attached memory"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 500px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>
          )}

          {/* Signature / Footer */}
          {data.senderName && (
            <div className="flex flex-col items-end pt-4 border-t border-white/10">
              <span className="text-xs italic text-zinc-400 font-mono">With love,</span>
              <span
                className="text-lg sm:text-xl font-bold font-serif tracking-tight mt-1"
                style={{ color: accentColor }}
              >
                {data.senderName}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Subtle in-context Tap to Continue visual cue */}
      <div className="pt-6 relative z-20">
        <TapToAdvanceCue accentColor={accentColor} />
      </div>
    </div>
  );
}
