"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface HeroSectionProps {
  data: {
    coupleNames: string;
    subtitle?: string;
    date?: string;
    location?: string;
    photoUrl: string;
  };
  isActive: boolean;
  isEditorPreview?: boolean;
}

export default function HeroSection({ data, isActive, isEditorPreview = false }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const scrollPromptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;

    if (isEditorPreview) {
      gsap.set(bgRef.current, { scale: 1 });
      gsap.set(textRef.current?.children || [], { y: 0, opacity: 1 });
      gsap.set(scrollPromptRef.current, { y: 0, opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      // Background slow zoom in
      gsap.fromTo(
        bgRef.current,
        { scale: 1.05 },
        { scale: 1, duration: 4, ease: "power2.out" }
      );

      // Text elements stagger fade in up
      gsap.fromTo(
        textRef.current?.children || [],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: "power3.out", delay: 0.5 }
      );

      // Scroll prompt bounce and fade in
      gsap.fromTo(
        scrollPromptRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 2 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isActive]);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-screen min-h-[100dvh] overflow-hidden flex items-center justify-center snap-start"
    >
      {/* Background Image */}
      <div 
        ref={bgRef}
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat origin-center"
        style={{ backgroundImage: `url(${data.photoUrl || '/1.png'})` }}
      />
      
      {/* Cinematic Dark Gradient & Grain */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/90 pointer-events-none" />
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto h-full pb-20">
        <div ref={textRef} className="space-y-6">
          {data.subtitle && (
            <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.3em] text-white/70">
              {data.subtitle}
            </p>
          )}
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif text-white tracking-tighter drop-shadow-2xl">
            {data.coupleNames}
          </h1>
          
          {(data.date || data.location) && (
            <div className="flex items-center justify-center gap-3 text-white/60 font-mono text-xs uppercase tracking-widest mt-8">
              {data.date && <span>{data.date}</span>}
              {data.date && data.location && <span>•</span>}
              {data.location && <span>{data.location}</span>}
            </div>
          )}
        </div>
      </div>

      {/* Scroll Prompt */}
      <div ref={scrollPromptRef} className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center gap-2 pointer-events-none text-white/50">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Begin Our Story</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
      </div>
    </section>
  );
}
