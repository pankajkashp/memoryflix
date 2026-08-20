"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface BirthdayOpeningSectionProps {
  data: {
    recipientName: string;
    hintText: string;
  };
  isActive: boolean;
  isEditorPreview?: boolean;
}

export default function BirthdayOpeningSection({ data, isActive, isEditorPreview = false }: BirthdayOpeningSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const lidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;

    if (isEditorPreview) {
      gsap.set(textRef.current, { opacity: 1, y: 0 });
      gsap.set(boxRef.current, { scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      // Entrance animation
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.2 }
      );

      gsap.fromTo(
        boxRef.current,
        { scale: 0.8, opacity: 0, y: 50 },
        { scale: 1, opacity: 1, y: 0, duration: 1.5, ease: "elastic.out(1, 0.7)", delay: 0.5 }
      );

      // Scroll-based unwrapping (lid pops off as user scrolls down)
      gsap.to(lidRef.current, {
        y: -150,
        rotation: -15,
        opacity: 0,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "center center",
          end: "bottom top",
          scrub: true,
        }
      });
      
      gsap.to(boxRef.current, {
        scale: 1.2,
        opacity: 0,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "center center",
          end: "bottom top",
          scrub: true,
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, [isActive, isEditorPreview]);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-screen min-h-[100dvh] bg-gradient-to-br from-indigo-950 via-purple-900 to-fuchsia-900 flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

      <div ref={textRef} className="text-center z-10 mb-16 space-y-4 px-6">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-xl">
          For {data.recipientName}
        </h2>
        <p className="text-lg md:text-xl text-purple-200/80 font-medium tracking-wide">
          {data.hintText}
        </p>
      </div>

      {/* Abstract Gift Box */}
      <div ref={boxRef} className="relative w-48 h-48 sm:w-64 sm:h-64 z-20 mt-12 flex flex-col items-center justify-end">
        {/* The Box Body */}
        <div className="w-full h-[70%] bg-gradient-to-br from-pink-500 to-rose-600 rounded-b-2xl shadow-2xl relative border-4 border-pink-400 border-t-0 flex items-center justify-center">
            {/* Ribbon Vertical */}
            <div className="absolute top-0 bottom-0 w-8 bg-gradient-to-b from-amber-200 to-yellow-400 shadow-inner" />
        </div>
        
        {/* The Lid */}
        <div ref={lidRef} className="w-[110%] h-[30%] bg-gradient-to-br from-pink-400 to-rose-500 rounded-t-xl rounded-b-md shadow-xl absolute top-0 z-30 border-4 border-pink-300 flex items-center justify-center origin-bottom-left">
           {/* Ribbon Horizontal */}
           <div className="absolute top-0 bottom-0 w-8 bg-gradient-to-b from-amber-200 to-yellow-400 shadow-inner" />
           {/* Bow Placeholder */}
           <div className="absolute -top-12 flex items-end justify-center">
             <div className="w-10 h-12 border-4 border-yellow-400 rounded-tl-full rounded-bl-full rotate-45 translate-x-3 bg-amber-200/50" />
             <div className="w-10 h-12 border-4 border-yellow-400 rounded-tr-full rounded-br-full -rotate-45 -translate-x-3 bg-amber-200/50" />
             <div className="w-6 h-6 bg-yellow-400 rounded-full absolute -bottom-2 z-10 shadow-sm" />
           </div>
        </div>
      </div>

      <div className="absolute bottom-10 flex flex-col items-center gap-2 text-white/50 animate-pulse">
        <span className="text-[10px] font-mono uppercase tracking-widest">Scroll to Unwrap</span>
        <div className="w-[1px] h-8 bg-white/50" />
      </div>

      {/* Floating sparkles in background */}
      <Sparkles className="absolute top-1/4 left-1/4 w-8 h-8 text-yellow-300/40 animate-pulse" />
      <Sparkles className="absolute bottom-1/3 right-1/4 w-6 h-6 text-pink-300/40 animate-pulse delay-150" />
      <Sparkles className="absolute top-1/3 right-1/3 w-10 h-10 text-purple-300/30 animate-pulse delay-300" />
    </section>
  );
}
