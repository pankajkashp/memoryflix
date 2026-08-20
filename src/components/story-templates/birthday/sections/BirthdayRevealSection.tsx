"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface BirthdayRevealSectionProps {
  data: {
    heading: string;
    subheading: string;
    photoUrl: string;
  };
  isActive: boolean;
  isEditorPreview?: boolean;
}

export default function BirthdayRevealSection({ data, isActive, isEditorPreview = false }: BirthdayRevealSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;

    if (isEditorPreview) {
      gsap.set(textRef.current?.children || [], { opacity: 1, scale: 1, y: 0 });
      gsap.set(photoRef.current, { opacity: 1, scale: 1, rotation: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current?.children || [],
        { opacity: 0, scale: 0.5, y: 100 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.5,
          stagger: 0.2,
          ease: "elastic.out(1, 0.5)",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
          }
        }
      );

      gsap.fromTo(
        photoRef.current,
        { opacity: 0, scale: 0.8, rotation: -10 },
        {
          opacity: 1,
          scale: 1,
          rotation: 3,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: photoRef.current,
            start: "top 50%",
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isActive, isEditorPreview]);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full min-h-screen py-24 px-6 md:px-12 flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24 bg-white overflow-hidden"
    >
      <div className="absolute top-[-20%] left-[-10%] w-[50%] aspect-square bg-pink-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] aspect-square bg-yellow-100 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div ref={textRef} className="flex-1 flex flex-col items-center md:items-start text-center md:text-left z-10 space-y-6">
        <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-pink-500 via-rose-500 to-orange-400 drop-shadow-sm pb-2">
          {data.heading}
        </h2>
        <p className="text-xl md:text-2xl text-zinc-600 font-medium leading-relaxed max-w-xl">
          {data.subheading}
        </p>
      </div>

      <div className="flex-1 flex justify-center md:justify-end z-10 w-full">
        <div 
          ref={photoRef} 
          className="relative w-full max-w-sm aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-[8px] border-white origin-center bg-zinc-100"
        >
          <img src={data.photoUrl || '/1.png'} alt="Birthday Reveal" className="w-full h-full object-cover" />
          <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-[1.2rem]" />
        </div>
      </div>
    </section>
  );
}
