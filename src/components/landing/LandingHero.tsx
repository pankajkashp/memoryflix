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
      className="relative min-h-[100svh] w-full bg-gradient-to-br from-[#020617] via-[#0a0516] to-[#1e0510] overflow-hidden flex flex-col md:flex-row items-center pt-24 md:pt-0"
    >
      {/* ── Background Glows & Optical Flare ─────────────────────────────── */}
      
      {/* Deep purple/blue ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#1e0a2d]/50 via-transparent to-transparent opacity-90 pointer-events-none" />

      {/* Glow behind the photo collage */}
      <div className="absolute top-[75%] md:top-1/2 right-[10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] -translate-y-1/2 bg-rose-600/20 md:bg-rose-600/30 blur-[80px] md:blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

      {/* The strong optical lens flare (like in reference) */}
      <div className="hidden md:block absolute top-1/2 left-[50%] md:left-[60%] -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none mix-blend-screen opacity-100 scale-100">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-white rounded-full blur-[60px] opacity-80" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] bg-rose-500 rounded-full blur-[100px] opacity-60" />
        {/* Diagonal light streak */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-2 bg-rose-400 blur-[8px] opacity-90 rotate-[18deg]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[2px] bg-white blur-[2px] opacity-80 rotate-[18deg]" />
      </div>

      {/* ── Floating Particles (Stars and Hearts) ────────────────────────── */}
      <div className="hidden md:block">
        <FloatingParticles />
      </div>

      {/* ── Glowing Film Strip Bottom Border ───────────────────────────────── */}
      <div className="absolute bottom-0 left-0 w-full h-12 overflow-hidden opacity-30 pointer-events-none z-10 drop-shadow-[0_-5px_15px_rgba(236,72,153,0.3)]">
        <svg width="100%" height="100%" preserveAspectRatio="none">
          <defs>
            <linearGradient id="bottom-film-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(168,85,247,0.4)" />
              <stop offset="50%" stopColor="rgba(236,72,153,0.8)" />
              <stop offset="100%" stopColor="rgba(168,85,247,0.4)" />
            </linearGradient>
            <mask id="bottom-film-mask">
              <rect width="100%" height="100%" fill="white" />
              <pattern id="bottom-holes" width="40" height="48" patternUnits="userSpaceOnUse">
                <rect x="10" y="4" width="20" height="12" rx="2" fill="black" />
                <rect x="10" y="32" width="20" height="12" rx="2" fill="black" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#bottom-holes)" />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="url(#bottom-film-grad)" mask="url(#bottom-film-mask)" />
        </svg>
      </div>

      {/* ── Main Content Container ───────────────────────────────────────── */}
      <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between z-20 min-h-[100svh] md:min-h-0">
        
        {/* LEFT COLUMN (Text) */}
        <div className="w-full md:w-[50%] flex flex-col items-start justify-center text-left pt-32 pb-32 md:pt-0 md:pb-0 relative z-30 min-h-[100svh] md:min-h-0">
          
          <h1 className="animate-text font-sans text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-bold tracking-tight text-white leading-[1.1] mb-6 whitespace-normal break-words md:whitespace-nowrap w-full">
            Turn Your Memories <br className="hidden md:block" />
            Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-500 drop-shadow-lg">Cinematic Stories</span>
          </h1>

          <p className="animate-text text-lg text-zinc-400 max-w-[420px] mb-10 leading-relaxed font-medium">
            Create beautiful stories with your photos and videos. Cherish, preview, and share your unforgettable moments.
          </p>

          <div className="animate-text flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16">
            <Link
              href={ctaHref}
              className="group relative flex items-center justify-center gap-2 w-full sm:w-auto h-12 sm:h-14 px-8 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-base transition-all hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)]"
            >
              <Sparkles className="w-5 h-5" />
              {ctaText}
            </Link>
            
            <Link
              href="/demo"
              className="flex items-center justify-center gap-2 w-full sm:w-auto h-12 sm:h-14 px-8 rounded-full border border-zinc-700 hover:border-zinc-400 hover:bg-white/5 bg-transparent text-zinc-300 hover:text-white font-semibold text-base transition-all"
            >
              <PlayCircle className="w-5 h-5" />
              Watch Demo
            </Link>
          </div>

          {/* Value Props Row */}
          <div className="animate-text flex items-center justify-between gap-4 sm:gap-10 w-full max-w-[420px] relative z-40">
            <div className="flex flex-col items-center gap-2">
              <Film className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500" />
              <span className="text-[10px] sm:text-xs text-zinc-300 font-medium text-center tracking-wide">Add Memories</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
              <span className="text-[10px] sm:text-xs text-zinc-300 font-medium text-center tracking-wide">Cinematic Preview</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" />
              <span className="text-[10px] sm:text-xs text-zinc-300 font-medium text-center tracking-wide">Share & Cherish</span>
            </div>
          </div>
        </div>

        {/* RIGHT/BACKGROUND COLUMN (Photo Collage) */}
        <div className="absolute inset-0 md:relative md:inset-auto w-full md:w-[50%] h-full md:h-[700px] mt-0 perspective-[1200px] z-0 md:z-20 flex-shrink-0 overflow-hidden md:overflow-visible opacity-100 pointer-events-none md:pointer-events-auto">
          
          {/* Mobile dark scrim overlay for text readability (Gradient Mask) */}
          <div 
            className="absolute inset-0 z-50 md:hidden block pointer-events-none" 
            style={{
              background: 'linear-gradient(to bottom, rgba(2,6,23,0.3) 0%, rgba(10,5,22,0.85) 30%, rgba(10,5,22,0.95) 75%, rgba(10,5,22,0.6) 100%)'
            }}
          />

          {/* Intense glow right behind the main hero photo (Reduced) */}
          <div className="hidden md:block absolute top-[15%] left-0 w-[65%] aspect-[4/5] bg-rose-500/15 blur-[60px] rounded-[2rem] pointer-events-none mix-blend-screen" style={{ transform: 'rotate(-5deg)' }} />

          <div className="absolute inset-0 flex items-center justify-center translate-x-0 md:translate-x-12 lg:translate-x-20 scale-[1.3] md:scale-100 opacity-90 md:opacity-100 mt-12 md:mt-0">
            
            {/* Satellite 1 (Top right: Lake) */}
            <div 
              className="photo-card absolute w-[45%] md:w-[40%] aspect-square rounded-2xl overflow-hidden shadow-2xl border border-white/10 z-20"
              style={{ top: '8%', right: '-5%', transform: 'rotate(8deg)' }}
              data-rotate="8"
            >
              <Image src={PHOTOS[1].src} alt={PHOTOS[1].alt} fill className="object-cover opacity-95 hover:scale-105 transition-transform duration-700" />
            </div>

            {/* Satellite 2 (Bottom right: Campfire) */}
            <div 
              className="photo-card absolute w-[55%] md:w-[48%] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 z-20"
              style={{ bottom: '12%', right: '-10%', transform: 'rotate(-4deg)' }}
              data-rotate="-4"
            >
              <Image src={PHOTOS[2].src} alt={PHOTOS[2].alt} fill className="object-cover opacity-95 hover:scale-105 transition-transform duration-700" />
            </div>

            {/* Dominant Hero Card (Sunset couple) */}
            <div 
              className="photo-card hero-photo absolute w-[75%] md:w-[65%] max-w-[420px] aspect-[4/5] rounded-[2rem] p-2 bg-white/5 backdrop-blur-md border border-white/20 shadow-[0_30px_60px_rgba(0,0,0,0.6),_0_0_40px_rgba(236,72,153,0.15)] z-30"
              style={{ top: '15%', left: '0%', transform: 'rotate(-5deg)' }}
              data-rotate="-5"
            >
              <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden">
                <Image src={PHOTOS[0].src} alt={PHOTOS[0].alt} fill priority className="object-cover" />
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
