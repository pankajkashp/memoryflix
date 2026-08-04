"use client";

import { useEffect, useRef } from "react";
import { Award, ShieldCheck } from "lucide-react";
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

export interface CertificatePageData {
  title?: string;
  recipientName: string;
  message: string;
  issuer?: string;
  date?: string;
  certificateNo?: string;
}

export interface CertificatePageProps {
  fixedConfig?: FixedPageConfig;
  data: CertificatePageData;
  isActive?: boolean;
  isExiting?: boolean;
}

export default function CertificatePage({
  fixedConfig = {},
  data,
  isActive = true,
  isExiting = false,
}: CertificatePageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const certFrameRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const textLinesRef = useRef<HTMLDivElement>(null);

  const {
    backgroundColor = "#09090b",
    textColor = "#f5f5f4",
    accentColor = "#eab308",
    cardBg = "rgba(20, 20, 24, 0.95)",
  } = fixedConfig;

  // Entrance animation
  useEffect(() => {
    if (!isActive) return;
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Reset
      gsap.set(certFrameRef.current, {
        opacity: 0,
        scale: reduced ? 1 : 0.88,
        y: reduced ? 0 : 30,
      });

      gsap.set(sealRef.current, {
        scale: 0,
        rotation: reduced ? 0 : -35,
      });

      const lines = textLinesRef.current?.children || [];
      gsap.set(lines, {
        opacity: 0,
        y: reduced ? 0 : 15,
      });

      // 1. Certificate frame zooms into position
      tl.to(certFrameRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: ENTRANCE_DURATION * 1.1,
        ease: DEFAULT_EASE,
      });

      // 2. Text lines stagger in
      tl.to(
        lines,
        {
          opacity: 1,
          y: 0,
          duration: ENTRANCE_DURATION * 0.8,
          stagger: STAGGER_GAP,
          ease: DEFAULT_EASE,
        },
        "-=0.3"
      );

      // 3. Gold Seal stamps down with bounce
      tl.to(
        sealRef.current,
        {
          scale: 1,
          rotation: 0,
          duration: 0.6,
          ease: "back.out(1.8)",
        },
        "-=0.25"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isActive, data]);

  // Exit animation
  useEffect(() => {
    if (!isExiting || !containerRef.current) return;
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      gsap.to(sealRef.current, {
        scale: 0,
        duration: 0.2,
      });

      gsap.to(certFrameRef.current, {
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
      className="relative w-full h-full min-h-[100dvh] flex flex-col items-center justify-between p-4 sm:p-8 md:p-12 lg:p-16 overflow-hidden select-none cursor-pointer"
      style={{ backgroundColor }}
    >
      {/* Textured Canvas Background */}
      <CanvasTexture texture={fixedConfig.backgroundTexture || "linen"} />

      {/* Background ambient gold lighting */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full blur-[180px] pointer-events-none opacity-25 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ backgroundColor: accentColor }}
      />

      {/* Certificate Document directly on Canvas */}
      <div
        ref={certFrameRef}
        className="relative w-full max-w-[min(94vw,1000px)] lg:max-w-[min(70vw,1150px)] rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 md:p-14 lg:p-16 backdrop-blur-2xl border-2 shadow-2xl overflow-hidden z-10 my-auto"
        style={{
          backgroundColor: cardBg,
          borderColor: `${accentColor}50`,
          boxShadow: `0 30px 70px -15px rgba(0, 0, 0, 0.85), 0 0 50px -5px ${accentColor}35`,
        }}
      >
        {/* Certificate Linen/Parchment Texture */}
        <CanvasTexture texture="linen" className="opacity-25 rounded-3xl sm:rounded-[2.5rem]" />

        {/* Ornate Gold Border lines */}
        <div
          className="absolute inset-3 sm:inset-5 md:inset-6 rounded-2xl sm:rounded-[2rem] border-2 border-dashed pointer-events-none"
          style={{ borderColor: `${accentColor}40` }}
        />

        <div ref={textLinesRef} className="relative z-10 text-center space-y-4 sm:space-y-6 md:space-y-8">
          {/* Header pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-xs sm:text-sm md:text-base font-mono uppercase tracking-widest text-zinc-300 shadow-sm">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: accentColor }} />
            <span>Official Recognition</span>
          </div>

          {/* Certificate Title */}
          <h1
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-serif tracking-tight uppercase"
            style={{ color: accentColor }}
          >
            {data.title || "Certificate of Eternal Friendship"}
          </h1>

          <p className="text-xs sm:text-base md:text-lg font-mono text-zinc-400 uppercase tracking-widest">
            This certifies that
          </p>

          {/* Recipient Name */}
          <div className="py-1 sm:py-2">
            <h2
              className="text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold italic tracking-wide pb-2 sm:pb-3 border-b-2 sm:border-b-4 inline-block px-6 sm:px-10"
              style={{
                color: textColor,
                borderColor: accentColor,
              }}
            >
              {data.recipientName}
            </h2>
          </div>

          {/* Certificate Citation */}
          <p className="text-base sm:text-xl md:text-2xl lg:text-3xl text-zinc-200 max-w-4xl mx-auto leading-relaxed font-sans pt-2 sm:pt-3">
            {data.message}
          </p>

          {/* Footer (Date, Seal, Signature) */}
          <div className="pt-6 sm:pt-10 md:pt-12 flex items-end justify-between border-t border-white/10 text-left">
            {/* Left: Date */}
            <div className="space-y-1 sm:space-y-1.5">
              <span className="text-xs sm:text-sm md:text-base font-mono uppercase text-zinc-400 block">
                Presented On
              </span>
              <span className="text-sm sm:text-lg md:text-2xl font-medium font-mono text-zinc-200">
                {data.date || "For All Eternity"}
              </span>
            </div>

            {/* Center: Gold Foil Stamp */}
            <div
              ref={sealRef}
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full flex flex-col items-center justify-center shadow-2xl border-2 border-white/30"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, #d97706)`,
                boxShadow: `0 0 30px ${accentColor}90`,
              }}
            >
              <Award className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-black" />
            </div>

            {/* Right: Issuer Signature */}
            <div className="text-right space-y-1 sm:space-y-1.5">
              <span className="text-xs sm:text-sm md:text-base font-mono uppercase text-zinc-400 block">
                Signed By
              </span>
              <span
                className="text-sm sm:text-lg md:text-2xl lg:text-3xl font-serif italic font-bold"
                style={{ color: accentColor }}
              >
                {data.issuer || "Your Best Friend"}
              </span>
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
