"use client";

import { useEffect, useRef } from "react";
import { Award, Sparkles, ShieldCheck } from "lucide-react";
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
      className="relative w-full h-full min-h-[100dvh] flex flex-col items-center justify-between p-4 sm:p-8 overflow-hidden select-none cursor-pointer"
      style={{ backgroundColor }}
    >
      {/* Textured Canvas Background */}
      <CanvasTexture texture={fixedConfig.backgroundTexture || "linen"} />

      {/* Background ambient gold lighting */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none opacity-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ backgroundColor: accentColor }}
      />

      {/* Certificate Document directly on Canvas */}
      <div
        ref={certFrameRef}
        className="relative w-full max-w-2xl rounded-3xl p-6 sm:p-10 backdrop-blur-2xl border-2 shadow-2xl overflow-hidden z-10 my-auto"
        style={{
          backgroundColor: cardBg,
          borderColor: `${accentColor}50`,
          boxShadow: `0 25px 60px -10px rgba(0, 0, 0, 0.8), 0 0 35px -5px ${accentColor}30`,
        }}
      >
        {/* Certificate Linen/Parchment Texture */}
        <CanvasTexture texture="linen" className="opacity-25 rounded-3xl" />

        {/* Ornate Gold Border lines */}
        <div
          className="absolute inset-3 sm:inset-4 rounded-2xl border border-dashed pointer-events-none"
          style={{ borderColor: `${accentColor}40` }}
        />

        <div ref={textLinesRef} className="relative z-10 text-center space-y-4 sm:space-y-5">
          {/* Header pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[10px] font-mono uppercase tracking-widest text-zinc-300">
            <ShieldCheck className="w-3.5 h-3.5" style={{ color: accentColor }} />
            <span>Official Recognition</span>
          </div>

          {/* Certificate Title */}
          <h1
            className="text-2xl sm:text-4xl font-extrabold font-serif tracking-tight uppercase"
            style={{ color: accentColor }}
          >
            {data.title || "Certificate of Eternal Friendship"}
          </h1>

          <p className="text-xs sm:text-sm font-mono text-zinc-400 uppercase tracking-widest">
            This certifies that
          </p>

          {/* Recipient Name */}
          <div className="py-1">
            <h2
              className="text-3xl sm:text-5xl font-serif font-bold italic tracking-wide pb-2 border-b-2 inline-block px-6"
              style={{
                color: textColor,
                borderColor: accentColor,
              }}
            >
              {data.recipientName}
            </h2>
          </div>

          {/* Certificate Citation */}
          <p className="text-sm sm:text-base text-zinc-300 max-w-lg mx-auto leading-relaxed font-sans pt-2">
            {data.message}
          </p>

          {/* Footer (Date, Seal, Signature) */}
          <div className="pt-6 sm:pt-8 flex items-end justify-between border-t border-white/10 text-left">
            {/* Left: Date */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                Presented On
              </span>
              <span className="text-xs sm:text-sm font-medium font-mono text-zinc-300">
                {data.date || "For All Eternity"}
              </span>
            </div>

            {/* Center: Gold Foil Stamp */}
            <div
              ref={sealRef}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex flex-col items-center justify-center shadow-lg border border-white/30"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, #d97706)`,
                boxShadow: `0 0 20px ${accentColor}80`,
              }}
            >
              <Award className="w-7 h-7 sm:w-8 sm:h-8 text-black" />
            </div>

            {/* Right: Issuer Signature */}
            <div className="text-right space-y-1">
              <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                Signed By
              </span>
              <span
                className="text-xs sm:text-sm font-serif italic font-bold"
                style={{ color: accentColor }}
              >
                {data.issuer || "Your Best Friend"}
              </span>
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
