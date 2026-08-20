"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface MemoriesSectionProps {
  data: {
    title: string;
    primaryPhoto: string;
    primaryTitle: string;
    primaryDate?: string;
    primaryNote?: string;
    secondaryPhoto1: string;
    secondaryTitle1?: string;
    secondaryPhoto2: string;
    secondaryTitle2?: string;
  };
  isActive: boolean;
  isEditorPreview?: boolean;
}

export default function MemoriesSection({ data, isActive, isEditorPreview = false }: MemoriesSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const primaryCardRef = useRef<HTMLDivElement>(null);
  const secondaryCard1Ref = useRef<HTMLDivElement>(null);
  const secondaryCard2Ref = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!isActive) return;

    if (isEditorPreview) {
      gsap.set([titleRef.current, primaryCardRef.current, secondaryCard1Ref.current, secondaryCard2Ref.current], { opacity: 1, y: 0, x: 0, scale: 1, rotation: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // Title
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          }
        }
      );

      // Primary Card
      gsap.fromTo(
        primaryCardRef.current,
        { opacity: 0, y: 100, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: primaryCardRef.current,
            start: "top 85%",
          }
        }
      );

      // Secondary Card 1 (Left/Top)
      gsap.fromTo(
        secondaryCard1Ref.current,
        { opacity: 0, x: -50, rotation: -5 },
        {
          opacity: 1,
          x: 0,
          rotation: -2,
          duration: 1.2,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: secondaryCard1Ref.current,
            start: "top 85%",
          }
        }
      );

      // Secondary Card 2 (Right/Bottom)
      gsap.fromTo(
        secondaryCard2Ref.current,
        { opacity: 0, x: 50, rotation: 5 },
        {
          opacity: 1,
          x: 0,
          rotation: 3,
          duration: 1.2,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: secondaryCard2Ref.current,
            start: "top 85%",
          }
        }
      );

    }, containerRef);

    return () => ctx.revert();
  }, [isActive, isEditorPreview]);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full min-h-screen py-24 px-4 sm:px-8 md:px-16 overflow-hidden bg-zinc-950"
    >
      <div className="max-w-7xl mx-auto">
        <h2 ref={titleRef} className="text-center text-4xl md:text-5xl font-serif text-white mb-20 tracking-tight">
          {data.title}
        </h2>

        {/* Asymmetric Cinematic Grid */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Secondary 1 - Top Left on Desktop */}
          <div 
            ref={secondaryCard1Ref} 
            className="lg:col-span-4 lg:-mt-32 z-10 hidden lg:block"
          >
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
              <img src={data.secondaryPhoto1 || '/1.png'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Memory 1" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              {data.secondaryTitle1 && (
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-white font-serif text-xl">{data.secondaryTitle1}</h3>
                </div>
              )}
            </div>
          </div>

          {/* Primary - Center Dominant */}
          <div 
            ref={primaryCardRef} 
            className="lg:col-span-6 z-20"
          >
            <div className="relative w-full aspect-[3/4] md:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
              <img src={data.primaryPhoto || '/3.png'} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Primary Memory" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10 flex flex-col gap-3">
                {data.primaryDate && (
                  <span className="font-mono text-xs uppercase tracking-widest text-rose-300">
                    {data.primaryDate}
                  </span>
                )}
                <h3 className="text-3xl sm:text-4xl font-serif text-white">{data.primaryTitle}</h3>
                {data.primaryNote && (
                  <p className="text-zinc-300 font-light mt-2 max-w-sm">
                    {data.primaryNote}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Secondary 2 - Bottom Right on Desktop */}
          <div 
            ref={secondaryCard2Ref} 
            className="lg:col-span-4 lg:col-start-9 lg:mt-48 z-10 hidden lg:block"
          >
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
              <img src={data.secondaryPhoto2 || '/2.png'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Memory 2" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              {data.secondaryTitle2 && (
                <div className="absolute bottom-6 left-6 right-6 text-right">
                  <h3 className="text-white font-serif text-xl">{data.secondaryTitle2}</h3>
                </div>
              )}
            </div>
          </div>

          {/* Mobile view for secondary cards (hidden on desktop to preserve asymmetric layout) */}
          <div className="grid grid-cols-2 gap-4 lg:hidden w-full mt-4">
             <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-xl border border-white/10">
              <img src={data.secondaryPhoto1 || '/1.png'} className="w-full h-full object-cover" alt="Memory 1" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              {data.secondaryTitle1 && (
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-serif text-sm">{data.secondaryTitle1}</h3>
                </div>
              )}
            </div>
            <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-xl border border-white/10">
              <img src={data.secondaryPhoto2 || '/2.png'} className="w-full h-full object-cover" alt="Memory 2" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              {data.secondaryTitle2 && (
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-serif text-sm">{data.secondaryTitle2}</h3>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
