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
      className="relative w-full h-full min-h-[100dvh] flex flex-col items-center justify-between p-6 sm:p-12 overflow-hidden select-none cursor-pointer"
      style={{ backgroundColor }}
    >
      {/* Textured Canvas Background */}
      <CanvasTexture texture={fixedConfig.backgroundTexture || "subtle-noise"} />

      {/* Background glow */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none opacity-20 -top-20 -left-20"
        style={{ backgroundColor: accentColor }}
      />

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center z-10 my-auto">
        {/* Left Column: Dictionary definition directly on canvas */}
        <div className="md:col-span-7 flex flex-col justify-center space-y-6">
          {/* Header pill */}
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-zinc-400 uppercase">
            <BookOpen className="w-3.5 h-3.5" style={{ color: accentColor }} />
            The Living Dictionary
          </div>

          {/* Word Heading */}
          <h1
            ref={wordRef}
            className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight flex flex-wrap drop-shadow-sm"
            style={{ color: textColor }}
          >
            {wordLetters.map((char, i) => (
              <span key={i} className="def-letter inline-block">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>

          {/* Details (Phonetic, Part of Speech, Definition, Example) */}
          <div ref={detailsRef} className="space-y-4">
            {/* Phonetics row */}
            <div className="flex items-center gap-3 text-sm sm:text-base text-zinc-400 font-mono">
              <span className="text-zinc-300 font-medium">
                {data.phonetic || "/lʌv/"}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
              <span className="italic font-serif font-semibold" style={{ color: accentColor }}>
                {data.partOfSpeech || "noun"}
              </span>
              <Volume2 className="w-4 h-4 text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors" />
            </div>

            {/* Divider */}
            <div className="w-20 h-0.5 bg-white/20 my-2" />

            {/* Definition */}
            <p
              className="text-base sm:text-xl font-sans leading-relaxed text-zinc-200"
              style={{ color: textColor }}
            >
              <span className="font-bold mr-2 text-zinc-400">1.</span>
              {data.definition}
            </p>

            {/* Example sentence */}
            {data.exampleSentence && (
              <p className="text-sm sm:text-base italic text-zinc-400 pl-4 border-l-2 border-white/20 mt-2 font-serif">
                &ldquo;{data.exampleSentence}&rdquo;
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Physical Polaroid Memory Card on the Canvas */}
        <div className="md:col-span-5 flex justify-center items-center">
          <div
            ref={photoFrameRef}
            className="relative w-full max-w-[300px] sm:max-w-[340px] rounded-2xl p-4 shadow-2xl border border-white/10 backdrop-blur-xl group transition-transform duration-500 hover:rotate-0"
            style={{
              backgroundColor: cardBg,
              boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 35px -10px ${accentColor}25`,
            }}
          >
            {/* Washi Tape detail on top of Polaroid */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-white/15 backdrop-blur-md rounded-sm rotate-[-2deg] border border-white/20 pointer-events-none" />

            {/* Photo inside Polaroid */}
            <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden shadow-inner">
              <Image
                src={data.photoUrl}
                alt={data.word}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 340px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Caption on Polaroid bottom */}
            <div className="pt-3 text-center">
              <p
                className="text-xs font-mono uppercase tracking-widest text-zinc-400 truncate"
                style={{ color: `${textColor}90` }}
              >
                Fig. 1 — Definition in Action
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle in-context Tap to Continue visual cue */}
      <div className="pt-6 relative z-20">
        <TapToAdvanceCue accentColor={accentColor} />
      </div>
    </div>
  );
}
