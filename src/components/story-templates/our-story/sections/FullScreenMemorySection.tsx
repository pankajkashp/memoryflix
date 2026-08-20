"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface FullScreenMemorySectionProps {
  data: {
    caption: string;
    photoUrl: string;
  };
  isActive: boolean;
  isEditorPreview?: boolean;
}

export default function FullScreenMemorySection({ data, isActive, isEditorPreview = false }: FullScreenMemorySectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!isActive) return;

    if (isEditorPreview) {
      gsap.set([textRef.current], { opacity: 1, y: 0 });
      gsap.set(bgRef.current, { scale: 1.05 });
      return;
    }

    const ctx = gsap.context(() => {
      // Background Image Parallax & Scale
      gsap.fromTo(
        bgRef.current,
        { scale: 1 },
        {
          scale: 1.15,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        }
      );

      // Caption fade in up
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 40%",
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isActive, isEditorPreview]);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-screen min-h-[100dvh] overflow-hidden flex items-center justify-center bg-black snap-start"
    >
      {/* Background Parallax Layer */}
      <div 
        ref={bgRef}
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${data.photoUrl || '/3.png'})` }}
      />

      {/* Dark overlay for text legibility */}
      <div className="absolute inset-0 bg-black/50 md:bg-black/40" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl w-full mx-auto px-6 text-center">
        <h2 
          ref={textRef}
          className="text-3xl sm:text-4xl md:text-6xl font-serif text-white tracking-tight drop-shadow-2xl"
        >
          {data.caption}
        </h2>
      </div>
    </section>
  );
}
