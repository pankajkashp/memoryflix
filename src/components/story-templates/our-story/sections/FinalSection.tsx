"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUp } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface FinalSectionProps {
  data: {
    preMessage: string;
    finalMessage: string;
    photoUrl: string;
  };
  isActive: boolean;
  isEditorPreview?: boolean;
}

export default function FinalSection({ data, isActive, isEditorPreview = false }: FinalSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;

    if (isEditorPreview) {
      gsap.set(textContainerRef.current?.children || [], { opacity: 1, y: 0 });
      gsap.set(photoRef.current, { opacity: 1, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      // Text fade in
      gsap.fromTo(
        textContainerRef.current?.children || [],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
          }
        }
      );

      // Photo fade & scale
      gsap.fromTo(
        photoRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: photoRef.current,
            start: "top 80%",
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isActive, isEditorPreview]);

  const handleReplay = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section 
      ref={containerRef} 
      className="relative w-full min-h-screen py-32 px-6 sm:px-12 bg-white flex flex-col items-center justify-center text-[#1a1a1a]"
    >
      <div className="max-w-4xl w-full mx-auto flex flex-col items-center text-center gap-16">
        
        <div ref={textContainerRef} className="space-y-8 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#1a1a1a]/50">
            {data.preMessage}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif leading-tight">
            "{data.finalMessage}"
          </h2>
        </div>

        <div 
          ref={photoRef}
          className="w-full max-w-md aspect-square md:aspect-[4/5] rounded-t-full rounded-b-2xl overflow-hidden shadow-2xl relative"
        >
          <img 
            src={data.photoUrl || '/2.png'} 
            className="w-full h-full object-cover" 
            alt="Final Memory" 
          />
        </div>

        <button 
          onClick={handleReplay}
          className="group mt-12 flex flex-col items-center gap-3 text-[#1a1a1a]/60 hover:text-rose-500 transition-colors"
        >
          <div className="w-12 h-12 rounded-full border border-current flex items-center justify-center group-hover:-translate-y-2 transition-transform duration-300">
            <ArrowUp className="w-5 h-5" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest">Replay Our Story</span>
        </button>

      </div>
    </section>
  );
}
