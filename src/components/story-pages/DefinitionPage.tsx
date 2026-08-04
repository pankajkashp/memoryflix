"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Volume2, BookOpen } from "lucide-react";
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

export interface DefinitionPageData {
  word: string;
  phonetic?: string;
  partOfSpeech?: string;
  definition: string;
  photoUrl: string;
  exampleSentence?: string;
}

export interface DefinitionPageProps {
  fixedConfig?: FixedPageConfig;
  data: DefinitionPageData;
  isActive?: boolean;
  isExiting?: boolean;
}

export default function DefinitionPage({
  fixedConfig = {},
  data,
  isActive = true,
  isExiting = false,
}: DefinitionPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLHeadingElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const photoFrameRef = useRef<HTMLDivElement>(null);

  const {
    backgroundColor = "#09090b",
    textColor = "#f4f4f5",
    accentColor = "#ec4899",
    cardBg = "rgba(24, 24, 27, 0.9)",
  } = fixedConfig;

  // Entrance animation
  useEffect(() => {
    if (!isActive) return;
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Reset
      const letters = wordRef.current?.querySelectorAll(".def-letter") || [];
      gsap.set(letters, {
        opacity: 0,
        y: reduced ? 0 : 25,
      });

      const detailLines = detailsRef.current?.children || [];
      gsap.set(detailLines, {
        opacity: 0,
        y: reduced ? 0 : 20,
      });

      gsap.set(photoFrameRef.current, {
        opacity: 0,
        scale: reduced ? 1 : 0.9,
        rotation: reduced ? 0 : 4,
        y: reduced ? 0 : 30,
      });

      // 1. Title word letter stagger
      tl.to(letters, {
        opacity: 1,
        y: 0,
        duration: ENTRANCE_DURATION * 0.8,
        stagger: 0.04,
        ease: DEFAULT_EASE,
      });

      // 2. Definition details fade in line-by-line
      tl.to(
        detailLines,
        {
          opacity: 1,
          y: 0,
          duration: ENTRANCE_DURATION,
          stagger: STAGGER_GAP,
          ease: DEFAULT_EASE,
        },
        "-=0.2"
      );

      // 3. Photo frame rotates in & settles
      tl.to(
        photoFrameRef.current,
        {
          opacity: 1,
          scale: 1,
          rotation: 2,
          y: 0,
          duration: ENTRANCE_DURATION * 1.2,
          ease: DEFAULT_EASE,
        },
        "-=0.4"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isActive, data]);

  // Exit animation
  useEffect(() => {
    if (!isExiting || !containerRef.current) return;
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      gsap.to(photoFrameRef.current, {
        opacity: 0,
        scale: 0.9,
        rotation: 0,
        y: reduced ? 0 : -20,
        duration: EXIT_DURATION,
        ease: "power2.in",
      });

      gsap.to(wordRef.current, {
        opacity: 0,
        y: reduced ? 0 : -15,
        duration: EXIT_DURATION * 0.8,
        ease: "power2.in",
      });

      gsap.to(detailsRef.current, {
        opacity: 0,
        y: reduced ? 0 : -15,
        duration: EXIT_DURATION * 0.8,
        ease: "power2.in",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isExiting]);

  const wordLetters = (data.word || "Love").split("");

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[100dvh] flex flex-col items-center justify-between p-4 sm:p-8 md:p-12 lg:p-16 overflow-hidden select-none cursor-pointer"
      style={{ backgroundColor }}
    >
      {/* Textured Canvas Background */}
      <CanvasTexture texture={fixedConfig.backgroundTexture || "subtle-noise"} />

      {/* Background glow */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full blur-[180px] pointer-events-none opacity-25 -top-20 -left-20"
        style={{ backgroundColor: accentColor }}
      />

      <div className="w-full max-w-[min(94vw,1400px)] lg:max-w-[min(88vw,1600px)] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center z-10 my-auto">
        {/* Left Column: Dictionary definition directly on canvas */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6 sm:space-y-8">
          {/* Header pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs sm:text-sm md:text-base font-mono tracking-widest text-zinc-300 uppercase self-start shadow-sm">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: accentColor }} />
            The Living Dictionary
          </div>

          {/* Word Heading */}
          <h1
            ref={wordRef}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif font-bold tracking-tight flex flex-wrap drop-shadow-md leading-none"
            style={{ color: textColor }}
          >
            {wordLetters.map((char, i) => (
              <span key={i} className="def-letter inline-block">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>

          {/* Details (Phonetic, Part of Speech, Definition, Example) */}
          <div ref={detailsRef} className="space-y-4 sm:space-y-6">
            {/* Phonetics row */}
            <div className="flex items-center gap-3 sm:gap-4 text-base sm:text-xl md:text-2xl text-zinc-300 font-mono">
              <span className="text-zinc-200 font-medium">
                {data.phonetic || "/lʌv/"}
              </span>
              <span className="w-2 h-2 rounded-full bg-zinc-500" />
              <span className="italic font-serif font-semibold" style={{ color: accentColor }}>
                {data.partOfSpeech || "noun"}
              </span>
              <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-400 cursor-pointer hover:text-zinc-200 transition-colors" />
            </div>

            {/* Divider */}
            <div className="w-28 sm:w-36 h-1 bg-white/20 my-2 sm:my-3 rounded-full" />

            {/* Definition */}
            <p
              className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-sans leading-relaxed text-zinc-100 font-normal"
              style={{ color: textColor }}
            >
              <span className="font-bold mr-3 text-zinc-400">1.</span>
              {data.definition}
            </p>

            {/* Example sentence */}
            {data.exampleSentence && (
              <p className="text-base sm:text-xl md:text-2xl lg:text-3xl italic text-zinc-300 pl-5 sm:pl-7 border-l-4 border-white/20 mt-3 sm:mt-4 font-serif">
                &ldquo;{data.exampleSentence}&rdquo;
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Physical Polaroid Memory Card on the Canvas */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <div
            ref={photoFrameRef}
            className="relative w-full max-w-[320px] sm:max-w-[420px] md:max-w-[500px] lg:max-w-[580px] rounded-3xl p-5 sm:p-7 md:p-8 shadow-2xl border-2 border-white/15 backdrop-blur-xl group transition-transform duration-500 hover:rotate-0"
            style={{
              backgroundColor: cardBg,
              boxShadow: `0 30px 70px -15px rgba(0, 0, 0, 0.85), 0 0 45px -10px ${accentColor}30`,
            }}
          >
            {/* Washi Tape detail on top of Polaroid */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-28 sm:w-36 h-8 sm:h-10 bg-white/20 backdrop-blur-md rounded-md rotate-[-2deg] border border-white/30 pointer-events-none shadow-md" />

            {/* Photo inside Polaroid */}
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-inner">
              <Image
                src={data.photoUrl}
                alt={data.word}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 580px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Caption on Polaroid bottom */}
            <div className="pt-4 sm:pt-5 text-center">
              <p
                className="text-xs sm:text-sm md:text-base font-mono uppercase tracking-widest text-zinc-300 truncate"
                style={{ color: `${textColor}90` }}
              >
                Fig. 1 — Definition in Action
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle in-context Tap to Continue visual cue */}
      <div className="pt-4 relative z-20">
        <TapToAdvanceCue accentColor={accentColor} />
      </div>
    </div>
  );
}
