"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Send } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TravelPostcardEndingSectionProps {
  data: {
    stampText?: string;
    message: string;
    signOff: string;
    photoUrl: string;
  };
  isActive: boolean;
  isEditorPreview?: boolean;
}

export default function TravelPostcardEndingSection({ data, isActive, isEditorPreview = false }: TravelPostcardEndingSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;

    if (isEditorPreview) {
      gsap.set(cardRef.current, { opacity: 1, rotation: -2, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, rotation: 10, y: 100 },
        {
          opacity: 1, rotation: -2, y: 0, duration: 1.5, ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isActive, isEditorPreview]);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full min-h-screen py-32 px-4 sm:px-8 bg-[url('/textures/cork.jpg')] bg-stone-800 flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-stone-900/40 mix-blend-multiply" />
      
      <div 
        ref={cardRef}
        className="relative z-10 max-w-4xl w-full bg-[#fdfaf6] p-4 sm:p-6 pb-8 shadow-2xl origin-bottom border border-stone-200"
      >
        {/* Postcard Frame */}
        <div className="w-full border-4 border-stone-200 flex flex-col md:flex-row relative">
          
          {/* Stamp/Postmark */}
          {data.stampText && (
            <div className="absolute top-4 right-4 md:right-8 w-24 h-24 rounded-full border-4 border-rose-600/30 flex items-center justify-center -rotate-12 z-20 pointer-events-none mix-blend-multiply opacity-70">
               <div className="w-20 h-20 rounded-full border-2 border-rose-600/30 flex items-center justify-center text-center">
                 <span className="font-mono text-[10px] text-rose-600 font-bold uppercase w-16">{data.stampText}</span>
               </div>
               <Send className="absolute w-6 h-6 text-rose-600/30 opacity-50" />
            </div>
          )}

          {/* Left Side: Photo */}
          <div className="flex-1 border-b-4 md:border-b-0 md:border-r-4 border-stone-200 p-2 sm:p-4">
             <div className="w-full h-64 md:h-full min-h-[300px] bg-stone-200 relative overflow-hidden">
                <img src={data.photoUrl || '/3.png'} alt="Travel memory" className="w-full h-full object-cover grayscale-[30%] sepia-[20%]" />
             </div>
          </div>

          {/* Right Side: Message */}
          <div className="flex-1 p-6 md:p-12 flex flex-col relative bg-[#fdfaf6]">
             {/* Divider line */}
             <div className="absolute left-1/2 top-8 bottom-8 w-[2px] bg-stone-200 hidden md:block" />
             
             {/* Text lines */}
             <div className="flex-1 space-y-6 md:space-y-8 flex flex-col justify-center font-serif text-lg md:text-xl text-stone-700 leading-loose relative z-10">
                <p>"{data.message}"</p>
                <p className="font-cursive text-3xl md:text-4xl text-rose-700">{data.signOff}</p>
             </div>

             {/* Address lines hint */}
             <div className="absolute right-8 bottom-12 w-32 space-y-4 opacity-30 hidden md:block pointer-events-none">
                <div className="w-full h-[1px] bg-stone-800" />
                <div className="w-full h-[1px] bg-stone-800" />
                <div className="w-full h-[1px] bg-stone-800" />
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}
