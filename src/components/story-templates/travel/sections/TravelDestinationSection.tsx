"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TravelDestinationSectionProps {
  data: {
    locationName: string;
    description: string;
    photoUrl: string;
  };
  isActive: boolean;
  isEditorPreview?: boolean;
}

export default function TravelDestinationSection({ data, isActive, isEditorPreview = false }: TravelDestinationSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapPinRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;

    if (isEditorPreview) {
      gsap.set([mapPinRef.current, textRef.current, imageRef.current], { opacity: 1, y: 0, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      // Map pin drops in
      gsap.fromTo(
        mapPinRef.current,
        { y: -50, opacity: 0, scale: 0.5 },
        {
          y: 0, opacity: 1, scale: 1, duration: 1, ease: "bounce.out",
          scrollTrigger: { trigger: containerRef.current, start: "top 60%" }
        }
      );

      // Text slides up
      gsap.fromTo(
        textRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 0.2,
          scrollTrigger: { trigger: containerRef.current, start: "top 60%" }
        }
      );

      // Image parallax & fade
      gsap.fromTo(
        imageRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.5, ease: "power3.out",
          scrollTrigger: { trigger: imageRef.current, start: "top 75%" }
        }
      );
      
      const img = imageRef.current?.querySelector('img');
      if (img) {
        gsap.to(img, {
          yPercent: 15,
          ease: "none",
          scrollTrigger: { trigger: imageRef.current, start: "top bottom", end: "bottom top", scrub: true }
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isActive, isEditorPreview]);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full min-h-screen py-24 px-6 md:px-12 bg-stone-100 flex flex-col items-center overflow-hidden text-stone-900"
    >
      <div className="max-w-5xl w-full flex flex-col items-center text-center space-y-6 z-10">
        
        <div ref={mapPinRef} className="text-rose-600 bg-rose-100 p-4 rounded-full shadow-lg">
          <MapPin className="w-8 h-8" />
        </div>

        <div ref={textRef} className="max-w-2xl space-y-4">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif text-stone-800">
            {data.locationName}
          </h2>
          <p className="text-lg md:text-xl text-stone-600 font-light leading-relaxed">
            {data.description}
          </p>
        </div>

      </div>

      <div className="w-full max-w-6xl mt-16 md:mt-24 z-10 px-4">
        <div 
          ref={imageRef}
          className="w-full h-[50vh] md:h-[70vh] rounded-3xl overflow-hidden shadow-2xl relative border-8 border-white bg-stone-200"
        >
          <img src={data.photoUrl || '/1.png'} alt="Destination" className="w-full h-[120%] object-cover object-center absolute -top-[10%]" />
        </div>
      </div>
      
      {/* Background topographic lines hint */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    </section>
  );
}
