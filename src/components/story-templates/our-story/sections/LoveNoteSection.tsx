"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface LoveNoteSectionProps {
  data: {
    noteHeading: string;
    noteBody: string;
  };
  isActive: boolean;
  isEditorPreview?: boolean;
}

export default function LoveNoteSection({ data, isActive, isEditorPreview = false }: LoveNoteSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!isActive) return;

    if (isEditorPreview) {
      gsap.set([cardRef.current, headingRef.current, bodyRef.current], { opacity: 1, y: 0, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      // Paper card floats up
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 60, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          }
        }
      );

      // Text stagger
      gsap.fromTo(
        [headingRef.current, bodyRef.current],
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 80%",
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isActive, isEditorPreview]);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full min-h-screen py-24 px-4 sm:px-8 bg-[#0a0a0a] flex items-center justify-center"
    >
      <div 
        ref={cardRef}
        className="relative max-w-3xl w-full mx-auto bg-[#F9F7F1] text-[#2D2825] rounded-t-[3rem] rounded-b-xl shadow-2xl overflow-hidden p-12 sm:p-20 md:p-24"
      >
        {/* Paper texture overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" 
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
        />
        
        {/* Subtle handwritten accent mark */}
        <div className="absolute top-12 left-12 w-12 h-[2px] bg-rose-400/40 rounded-full rotate-[-5deg]" />

        <div className="relative z-10 flex flex-col gap-12">
          <h2 
            ref={headingRef}
            className="text-2xl sm:text-3xl md:text-4xl font-serif leading-relaxed italic opacity-90 text-center text-[#4A423C]"
          >
            "{data.noteHeading}"
          </h2>
          
          <div className="w-8 h-[1px] bg-[#4A423C]/20 mx-auto" />
          
          <p 
            ref={bodyRef}
            className="text-base sm:text-lg md:text-xl font-light leading-loose text-center opacity-80 whitespace-pre-wrap max-w-2xl mx-auto"
          >
            {data.noteBody}
          </p>
        </div>
      </div>
    </section>
  );
}
