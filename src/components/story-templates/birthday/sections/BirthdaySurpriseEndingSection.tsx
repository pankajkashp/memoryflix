"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Gift } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface BirthdaySurpriseEndingSectionProps {
  data: {
    message: string;
    signOff: string;
    photoUrl: string;
  };
  isActive: boolean;
  isEditorPreview?: boolean;
}

export default function BirthdaySurpriseEndingSection({ data, isActive, isEditorPreview = false }: BirthdaySurpriseEndingSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;

    if (isEditorPreview) {
      gsap.set([cardRef.current, photoRef.current], { opacity: 1, y: 0, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
          }
        }
      );

      gsap.fromTo(
        photoRef.current,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: "elastic.out(1, 0.5)",
          scrollTrigger: {
            trigger: photoRef.current,
            start: "top 70%",
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isActive, isEditorPreview]);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full min-h-screen py-32 px-6 flex items-center justify-center bg-gradient-to-t from-pink-50 to-white overflow-hidden"
    >
      <div className="absolute top-10 left-10 text-pink-200/50 hidden md:block">
        <Gift className="w-32 h-32 -rotate-12" />
      </div>
      <div className="absolute bottom-20 right-10 text-yellow-200/50 hidden md:block">
        <Gift className="w-24 h-24 rotate-12" />
      </div>

      <div className="max-w-4xl w-full mx-auto flex flex-col items-center z-10">
        <div 
          ref={photoRef}
          className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-2xl border-8 border-white z-20 -mb-16 md:-mb-24 relative bg-zinc-100"
        >
           <img src={data.photoUrl || '/3.png'} alt="Final memory" className="w-full h-full object-cover" />
        </div>

        <div 
          ref={cardRef}
          className="bg-white pt-24 pb-12 md:pt-32 md:pb-16 px-8 md:px-16 rounded-3xl shadow-2xl border border-pink-100 text-center w-full"
        >
          <p className="text-xl md:text-3xl font-serif text-zinc-700 leading-relaxed mb-12">
            "{data.message}"
          </p>
          <div className="flex flex-col items-center gap-4">
             <div className="w-16 h-[2px] bg-pink-200" />
             <p className="font-mono text-sm tracking-[0.2em] uppercase text-pink-500 font-bold">
               {data.signOff}
             </p>
          </div>
        </div>
      </div>
    </section>
  );
}
