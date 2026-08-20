"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Plane } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TravelOpeningSectionProps {
  data: {
    tripName: string;
    travelers: string;
    dates?: string;
    photoUrl: string;
  };
  isActive: boolean;
  isEditorPreview?: boolean;
}

export default function TravelOpeningSection({ data, isActive, isEditorPreview = false }: TravelOpeningSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;

    if (isEditorPreview) {
      gsap.set(textRef.current?.children || [], { opacity: 1, y: 0 });
      gsap.set(planeRef.current, { opacity: 1, x: 0, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // Text fade in
      gsap.fromTo(
        textRef.current?.children || [],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: "power2.out", delay: 0.2 }
      );

      // Plane flies in
      gsap.fromTo(
        planeRef.current,
        { opacity: 0, x: -100, y: 100 },
        { opacity: 1, x: 0, y: 0, duration: 2, ease: "power2.out", delay: 0.5 }
      );

      // Plane flies away on scroll
      gsap.to(planeRef.current, {
        x: 300,
        y: -300,
        opacity: 0,
        ease: "power1.in",
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
      className="relative w-full h-screen min-h-[100dvh] bg-stone-900 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Cover */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${data.photoUrl || '/3.png'})` }}
      />
      <div className="absolute inset-0 bg-stone-900/60 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-stone-900/40" />
      
      {/* Film grain texture */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl px-6 sm:px-12 flex flex-col items-center text-center">
        
        <div ref={planeRef} className="mb-12 text-amber-100/80 drop-shadow-lg">
           <Plane className="w-12 h-12 rotate-45" />
        </div>

        <div ref={textRef} className="space-y-6">
          <h4 className="font-mono text-sm tracking-[0.3em] uppercase text-amber-100/70">
            {data.travelers}
          </h4>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif text-white uppercase tracking-wider drop-shadow-2xl">
            {data.tripName}
          </h1>
          {data.dates && (
            <div className="inline-block mt-8 border border-white/20 rounded-full px-6 py-2 bg-white/5 backdrop-blur-sm">
              <span className="font-sans text-sm font-semibold tracking-widest uppercase text-amber-50">
                {data.dates}
              </span>
            </div>
          )}
        </div>
      </div>
      
    </section>
  );
}
