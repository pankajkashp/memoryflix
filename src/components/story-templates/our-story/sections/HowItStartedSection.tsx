"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface HowItStartedSectionProps {
  data: {
    title: string;
    description: string;
    photoUrl: string;
  };
  isActive: boolean;
  isEditorPreview?: boolean;
}

export default function HowItStartedSection({ data, isActive, isEditorPreview = false }: HowItStartedSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;

    if (isEditorPreview) {
      // In editor preview, show immediately without scroll triggers
      gsap.set([imageContainerRef.current, textRef.current], { opacity: 1, y: 0, x: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // Parallax and fade for image
      gsap.fromTo(
        imageContainerRef.current,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Text slide in from side
      gsap.fromTo(
        textRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
            toggleActions: "play none none reverse"
          }
        }
      );
      
      // Image internal subtle parallax
      const img = imageContainerRef.current?.querySelector('img');
      if (img) {
         gsap.to(img, {
           yPercent: 15,
           ease: "none",
           scrollTrigger: {
             trigger: containerRef.current,
             start: "top bottom",
             end: "bottom top",
             scrub: true
           }
         });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isActive, isEditorPreview]);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full min-h-screen py-24 px-6 sm:px-12 md:px-24 flex items-center justify-center bg-[#0a0a0a]"
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center gap-12 md:gap-24">
        
        {/* Text Content */}
        <div ref={textRef} className="w-full md:w-5/12 flex flex-col items-start text-left order-2 md:order-1 z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-[1px] bg-rose-500/50" />
            <span className="font-mono text-xs uppercase tracking-widest text-rose-400">
              The Beginning
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-8 tracking-tight">
            {data.title}
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed whitespace-pre-wrap">
            {data.description}
          </p>
        </div>

        {/* Image Container */}
        <div ref={imageContainerRef} className="w-full md:w-7/12 order-1 md:order-2 h-[60vh] md:h-[80vh] relative rounded-3xl overflow-hidden group shadow-2xl">
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700 z-10 pointer-events-none" />
          {/* Using next/img pattern but standard img for dynamic urls */}
          <img 
            src={data.photoUrl || '/2.png'} 
            alt="How it started"
            className="w-full h-[120%] object-cover object-center absolute -top-[10%]"
          />
        </div>

      </div>
    </section>
  );
}
