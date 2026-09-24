"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Film, Sparkles, Share2, PlayCircle } from "lucide-react";
import { gsap } from "@/lib/gsap-utils";
import { GSAP_CONFIG } from "@/lib/gsapConfig";
import { prefersReducedMotion } from "@/lib/gsap-utils";
import Image from "next/image";
import { Caveat } from "next/font/google";
import FloatingParticles from "./FloatingParticles";

const caveat = Caveat({ subsets: ["latin"], weight: "700" });

// Sample high-quality Unsplash photos
const PHOTOS = [
  { src: "/1.png", alt: "Sunset couple" },
  { src: "/2.png", alt: "Mountain lake" },
  { src: "/3.png", alt: "Campfire friends" },
];

export default function LandingHero({
  ctaHref,
  ctaText,
}: {
  ctaHref: string;
  ctaText: string;
}) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      // 1. Text elements entrance
      const textElements = containerRef.current?.querySelectorAll(".animate-text");
      if (textElements) {
        gsap.fromTo(
          textElements,
          { opacity: 0, y: reduced ? 0 : 30 },
          {
            opacity: 1,
            y: 0,
            duration: GSAP_CONFIG.duration.enter * 1.5,
            stagger: 0.1,
            ease: GSAP_CONFIG.ease,
          }
        );
      }

      // 2. Photo collage entrance
      const photoCards = containerRef.current?.querySelectorAll(".photo-card");
      if (photoCards && !reduced) {
        photoCards.forEach((card, i) => {
          const targetRotate = parseFloat(card.getAttribute("data-rotate") || "0");
          gsap.fromTo(
            card,
            { opacity: 0, scale: 0.8, rotation: targetRotate - (i % 2 === 0 ? 10 : -10), y: 40 },
            {
              opacity: 1,
              scale: 1,
              rotation: targetRotate,
              y: 0,
              duration: GSAP_CONFIG.duration.enter * 1.8,
              delay: 0.4 + (i * 0.15),
              ease: "back.out(1.2)",
            }
          );
        });
      } else if (photoCards && reduced) {
        gsap.to(photoCards, { opacity: 1, duration: 1 });
      }

      // 3. Ambient floating motion (Hero photo & Optical flare)
      if (!reduced) {
        const heroCard = containerRef.current?.querySelector(".hero-photo");
        if (heroCard) {
          gsap.to(heroCard, {
            y: "-=15",
            rotation: "+=1.5",
            duration: 5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          });
        }
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] w-full bg-[#FFF8F2] overflow-hidden flex flex-col md:flex-row items-center pt-24 md:pt-0"
    >
      {/* ── 1. Dreamy Pastel Mesh Blobs ────────────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-80">
        {/* Blob 1: Blush Rose Aurora */}
        <div
          className="absolute -top-[10%] left-[5%] w-[55vw] h-[55vw] max-w-[850px] max-h-[850px] rounded-full blur-[120px] sm:blur-[150px] animate-mesh-1 mix-blend-multiply pointer-events-none"
          style={{
            background: "radial-gradient(circle at center, rgba(232, 93, 117, 0.22) 0%, rgba(247, 201, 207, 0.28) 50%, transparent 75%)",
          }}
        />
        {/* Blob 2: Lavender Aurora */}
        <div
          className="absolute top-[10%] -right-[5%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] rounded-full blur-[130px] sm:blur-[160px] animate-mesh-2 mix-blend-multiply pointer-events-none"
          style={{
            background: "radial-gradient(circle at center, rgba(183, 159, 209, 0.24) 0%, rgba(221, 208, 236, 0.22) 50%, transparent 75%)",
          }}
        />
        {/* Blob 3: Champagne Gold Accent Blob */}
        <div
          className="absolute top-[50%] -left-[5%] w-[45vw] h-[45vw] max-w-[700px] max-h-[700px] rounded-full blur-[110px] sm:blur-[140px] animate-mesh-3 mix-blend-multiply pointer-events-none"
          style={{
            background: "radial-gradient(circle at center, rgba(233, 201, 137, 0.24) 0%, rgba(255, 158, 125, 0.16) 50%, transparent 70%)",
          }}
        />
        {/* Blob 4: Soft Coral Fusion Blob */}
        <div
          className="absolute bottom-[-10%] right-[10%] w-[55vw] h-[55vw] max-w-[800px] max-h-[800px] rounded-full blur-[120px] sm:blur-[150px] animate-mesh-4 mix-blend-multiply pointer-events-none"
          style={{
            background: "radial-gradient(circle at center, rgba(255, 158, 125, 0.20) 0%, rgba(232, 93, 117, 0.14) 50%, transparent 75%)",
          }}
        />
      </div>

      {/* ── 2. Tactile Paper Grain Texture Layer ──────────────────────────── */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── 3. Soft Warm Edge Vignette ─────────────────────────────────────── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(232,93,117,0.08)_100%)] pointer-events-none" />

      {/* Glow behind the photo collage */}
      <div className="absolute top-[75%] md:top-1/2 right-[10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] -translate-y-1/2 bg-[#E85D75]/15 blur-[80px] md:blur-[120px] rounded-full pointer-events-none mix-blend-multiply" />

      {/* Soft magic sparkle bloom (replaces the old lens flare) */}
      <div className="hidden md:block absolute top-1/2 left-[50%] md:left-[60%] -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none opacity-90">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-[#F7C9CF] rounded-full blur-[60px] opacity-60 mix-blend-multiply" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] bg-[#E9C989] rounded-full blur-[100px] opacity-35 mix-blend-multiply" />
        {/* Diagonal light streak */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-2 bg-[#E85D75] blur-[8px] opacity-25 rotate-[18deg] mix-blend-multiply" />
      </div>

      {/* ── Floating Particles (Stars and Hearts) ────────────────────────── */}
      <div className="hidden md:block">
        <FloatingParticles />
      </div>

      {/* ── Main Content Container ───────────────────────────────────────── */}
      <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between z-20 min-h-[100svh] md:min-h-0">
        
        {/* LEFT COLUMN (Text) */}
        <div className="w-full md:w-[50%] flex flex-col items-start justify-center text-left pt-32 pb-32 md:pt-0 md:pb-0 relative z-30 min-h-[100svh] md:min-h-0">
          
          <h1 className="animate-text font-sans text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-bold tracking-tight text-[#3B2436] leading-[1.1] mb-6 whitespace-normal break-words md:whitespace-nowrap w-full">
            Turn Your Memories <br className="hidden md:block" />
            Into <span className="font-serif italic font-normal tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#B9425C] via-[#E85D75] to-[#C98A3E] drop-shadow-[0_2px_10px_rgba(232,93,117,0.25)]" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>Magical Stories</span>
          </h1>

          <p className="animate-text text-lg text-[#6B4C58] max-w-[440px] mb-10 leading-relaxed font-normal">
            Turn your shared jokes, polaroids, and heartfelt notes into an unforgettable interactive surprise. Beautiful. Private. Yours.
          </p>

          {/* Distinctive CTAs */}
          <div className="animate-text flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16">
            <Link
              href={ctaHref}
              className="group relative flex items-center justify-center gap-2 w-full sm:w-auto h-12 sm:h-14 px-8 rounded-full bg-gradient-to-r from-[#E85D75] via-[#E0708A] to-[#B79FD1] text-white font-bold text-base transition-all duration-300 hover:scale-[1.03] shadow-[0_10px_30px_-8px_rgba(232,93,117,0.55)] hover:shadow-[0_14px_38px_-8px_rgba(232,93,117,0.7)]"
            >
              <Sparkles className="w-5 h-5 text-white/90 animate-pulse" />
              <span>{ctaText}</span>
            </Link>

            <Link
              href="/demo"
              className="group flex items-center justify-center gap-2 w-full sm:w-auto h-12 sm:h-14 px-8 rounded-full border border-[#F0DCE0] hover:border-[#E85D75]/50 bg-white/70 hover:bg-white text-[#8B6B7A] hover:text-[#3B2436] font-semibold text-base backdrop-blur-md transition-all duration-300 shadow-sm hover:shadow-magical"
            >
              <PlayCircle className="w-5 h-5 text-[#B79FD1] group-hover:text-[#E85D75] transition-colors" />
              <span>Watch Demo</span>
            </Link>
          </div>

          {/* Value Props Row */}
          <div className="animate-text flex items-center justify-between gap-4 sm:gap-10 w-full max-w-[420px] relative z-40">
            <div className="flex flex-col items-center gap-2">
              <Film className="w-5 h-5 sm:w-6 sm:h-6 text-[#E85D75]" />
              <span className="text-[10px] sm:text-xs text-[#6B4C58] font-medium text-center tracking-wide">Add Memories</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#B79FD1]" />
              <span className="text-[10px] sm:text-xs text-[#6B4C58] font-medium text-center tracking-wide">Magical Preview</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#E9C989]" />
              <span className="text-[10px] sm:text-xs text-[#6B4C58] font-medium text-center tracking-wide">Share & Cherish</span>
            </div>
          </div>
        </div>

        {/* RIGHT/BACKGROUND COLUMN (Photo Collage) */}
        <div className="absolute inset-0 md:relative md:inset-auto w-full md:w-[50%] h-full md:h-[700px] mt-0 perspective-[1200px] z-0 md:z-20 flex-shrink-0 overflow-hidden md:overflow-visible opacity-100 pointer-events-none md:pointer-events-auto">
          
          {/* Mobile cream scrim overlay for text readability (Gradient Mask) */}
          <div
            className="absolute inset-0 z-50 md:hidden block pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(255,248,242,0.35) 0%, rgba(255,248,242,0.88) 30%, rgba(255,248,242,0.96) 75%, rgba(255,248,242,0.7) 100%)'
            }}
          />

          {/* Intense glow right behind the main hero photo (Reduced) */}
          <div className="hidden md:block absolute top-[15%] left-0 w-[65%] aspect-[4/5] bg-[#E85D75]/12 blur-[60px] rounded-[2rem] pointer-events-none mix-blend-multiply" style={{ transform: 'rotate(-5deg)' }} />

          <div className="absolute inset-0 flex items-center justify-center translate-x-0 md:translate-x-12 lg:translate-x-20 scale-[1.3] md:scale-100 opacity-90 md:opacity-100 mt-12 md:mt-0">

            {/* Satellite 1 (Top right: Lake) */}
            <div
              className="photo-card absolute w-[45%] md:w-[40%] aspect-square rounded-2xl overflow-hidden shadow-magical border-4 border-white z-20"
              style={{ top: '8%', right: '-5%', transform: 'rotate(8deg)' }}
              data-rotate="8"
            >
              <Image src={PHOTOS[1].src} alt={PHOTOS[1].alt} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover opacity-95 hover:scale-105 transition-transform duration-700" />
            </div>

            {/* Satellite 2 (Bottom right: Campfire) */}
            <div
              className="photo-card absolute w-[55%] md:w-[48%] aspect-[4/3] rounded-2xl overflow-hidden shadow-magical border-4 border-white z-20"
              style={{ bottom: '12%', right: '-10%', transform: 'rotate(-4deg)' }}
              data-rotate="-4"
            >
              <Image src={PHOTOS[2].src} alt={PHOTOS[2].alt} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover opacity-95 hover:scale-105 transition-transform duration-700" />
            </div>

            {/* Dominant Hero Card (Sunset couple) */}
            <div
              className="photo-card hero-photo absolute w-[75%] md:w-[65%] max-w-[420px] aspect-[4/5] rounded-[2rem] p-2 bg-white/80 backdrop-blur-md border border-white shadow-[0_30px_60px_-15px_rgba(178,110,120,0.4),_0_0_40px_-10px_rgba(232,93,117,0.25)] z-30"
              style={{ top: '15%', left: '0%', transform: 'rotate(-5deg)' }}
              data-rotate="-5"
            >
              <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden">
                <Image src={PHOTOS[0].src} alt={PHOTOS[0].alt} fill priority sizes="(max-width: 768px) 80vw, 50vw" className="object-cover" />
                {/* Script text overlay */}
                <div className="hidden md:flex absolute bottom-8 left-0 right-0 text-center pointer-events-none rotate-[-4deg] flex-col items-center">
                  <span 
                    className={`${caveat.className} text-4xl sm:text-5xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] relative`}
                    style={{ textShadow: "0 4px 20px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.8)" }}
                  >
                    Every memory<br/>tells a story
                    {/* Little heart */}
                    <span className="absolute text-rose-400 text-xl ml-2 top-10 rotate-[12deg] drop-shadow-md">♥</span>
                  </span>
                  
                  {/* Wavy underline SVG */}
                  <svg width="180" height="20" viewBox="0 0 180 20" className="mt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" fill="none">
                    <path d="M2,15 C40,5 90,20 178,5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M10,18 C50,10 100,22 170,10" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                  </svg>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
