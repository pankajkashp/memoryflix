"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TravelMemoriesSectionProps {
  data: {
    photo1: string;
    photo2: string;
    photo3: string;
    photo4?: string;
    caption?: string;
  };
  isActive: boolean;
  isEditorPreview?: boolean;
}

export default function TravelMemoriesSection({ data, isActive, isEditorPreview = false }: TravelMemoriesSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<Array<HTMLDivElement | null>>([]);
  const captionRef = useRef<HTMLDivElement>(null);

  const photos = [data.photo1, data.photo2, data.photo3, ...(data.photo4 ? [data.photo4] : [])].filter(Boolean);

  useEffect(() => {
    if (!isActive) return;

    if (isEditorPreview) {
      imagesRef.current.forEach(img => {
        if (img) gsap.set(img, { opacity: 1, scale: 1, y: 0 });
      });
      gsap.set(captionRef.current, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // Masonry-like stagger reveal
      imagesRef.current.forEach((img, index) => {
        if (!img) return;
        const direction = index % 2 === 0 ? 50 : -50;
        gsap.fromTo(
          img,
          { opacity: 0, y: 100, x: direction, scale: 0.9 },
          {
            opacity: 1, y: 0, x: 0, scale: 1, duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: img,
              start: "top 85%",
            }
          }
        );
      });

      // Caption reveal
      if (captionRef.current) {
        gsap.fromTo(
          captionRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, duration: 1, ease: "power2.out",
            scrollTrigger: { trigger: captionRef.current, start: "top 90%" }
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isActive, isEditorPreview, photos.length]);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full min-h-screen py-24 px-4 sm:px-8 bg-stone-900 text-stone-100 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 w-full">
          {photos.map((photo, index) => (
            <div 
              key={index}
              ref={(el) => { imagesRef.current[index] = el; }}
              className="relative w-full rounded-2xl overflow-hidden shadow-xl break-inside-avoid bg-stone-800"
            >
              {/* Varying aspect ratios based on index for a masonry feel */}
              <img 
                src={photo || '/2.png'} 
                alt={`Travel memory ${index + 1}`} 
                className={`w-full object-cover ${index % 3 === 0 ? 'aspect-[3/4]' : index % 3 === 1 ? 'aspect-square' : 'aspect-[4/3]'}`} 
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
            </div>
          ))}
        </div>

        {data.caption && (
          <div ref={captionRef} className="mt-20 max-w-2xl text-center">
             <p className="font-serif text-2xl md:text-4xl text-amber-50 leading-snug italic opacity-90">
               "{data.caption}"
             </p>
          </div>
        )}

      </div>
    </section>
  );
}
