"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface BirthdayMemoriesSectionProps {
  data: {
    title: string;
    photo1: string;
    caption1: string;
    photo2: string;
    caption2: string;
    photo3?: string;
    caption3?: string;
  };
  isActive: boolean;
  isEditorPreview?: boolean;
}

export default function BirthdayMemoriesSection({ data, isActive, isEditorPreview = false }: BirthdayMemoriesSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);

  const memories = [
    { photo: data.photo1, caption: data.caption1, rotation: -4, yOffset: 20 },
    { photo: data.photo2, caption: data.caption2, rotation: 3, yOffset: -30 },
    ...(data.photo3 && data.caption3 ? [{ photo: data.photo3, caption: data.caption3, rotation: -2, yOffset: 10 }] : [])
  ];

  useEffect(() => {
    if (!isActive) return;

    if (isEditorPreview) {
      gsap.set(titleRef.current, { opacity: 1, y: 0 });
      cardsRef.current.forEach(card => {
        if (card) gsap.set(card, { opacity: 1, y: 0, scale: 1 });
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          }
        }
      );

      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 150, scale: 0.8 },
          {
            opacity: 1,
            y: memories[index].yOffset || 0, // stagger y naturally
            scale: 1,
            duration: 1.2,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isActive, isEditorPreview, memories]);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full min-h-screen py-24 px-6 md:px-12 bg-zinc-50 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        <h2 
          ref={titleRef} 
          className="text-4xl md:text-5xl font-black text-zinc-800 mb-20 text-center tracking-tight"
        >
          {data.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16 items-center w-full">
          {memories.map((mem, index) => (
            <div 
              key={index}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="relative w-full aspect-square md:aspect-[3/4] bg-white p-4 pb-16 sm:p-5 sm:pb-20 rounded-xl shadow-xl border border-zinc-100 group"
              style={{ transform: `rotate(${mem.rotation}deg)` }}
            >
              <div className="w-full h-full rounded-md overflow-hidden bg-zinc-100 relative">
                 <img src={mem.photo || '/2.png'} alt="Memory" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                 <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
              </div>
              <div className="absolute bottom-4 left-0 right-0 text-center px-4">
                <p className="font-serif text-xl md:text-2xl text-zinc-700 -rotate-1">{mem.caption}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
