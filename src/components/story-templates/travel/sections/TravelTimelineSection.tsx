"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Plane } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TravelTimelineSectionProps {
  data: {
    day1Title: string;
    day1Desc?: string;
    day2Title: string;
    day2Desc?: string;
    day3Title: string;
    day3Desc?: string;
  };
  isActive: boolean;
  isEditorPreview?: boolean;
}

export default function TravelTimelineSection({ data, isActive, isEditorPreview = false }: TravelTimelineSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const stopsRef = useRef<Array<HTMLDivElement | null>>([]);
  const planeRef = useRef<HTMLDivElement>(null);

  const stops = [
    { title: data.day1Title, desc: data.day1Desc },
    { title: data.day2Title, desc: data.day2Desc },
    { title: data.day3Title, desc: data.day3Desc },
  ].filter(s => s.title);

  useEffect(() => {
    if (!isActive) return;

    if (isEditorPreview) {
      gsap.set(lineRef.current, { scaleY: 1 });
      stopsRef.current.forEach(stop => {
        if (stop) gsap.set(stop, { opacity: 1, x: 0 });
      });
      gsap.set(planeRef.current, { top: "100%" });
      return;
    }

    const ctx = gsap.context(() => {
      // Draw the vertical line
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top center",
            end: "bottom center",
            scrub: true,
          }
        }
      );

      // Plane follows the line
      gsap.to(planeRef.current, {
        top: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "bottom center",
          scrub: true,
        }
      });

      // Stops reveal
      stopsRef.current.forEach((stop, index) => {
        if (!stop) return;
        const xOffset = index % 2 === 0 ? -50 : 50;
        gsap.fromTo(
          stop,
          { opacity: 0, x: xOffset },
          {
            opacity: 1, x: 0, duration: 0.8, ease: "power2.out",
            scrollTrigger: {
              trigger: stop,
              start: "top 70%",
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isActive, isEditorPreview, stops.length]);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full min-h-screen py-32 px-4 bg-stone-100 flex justify-center overflow-hidden"
    >
      {/* Dashed Path Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      <div className="relative max-w-4xl w-full">
        {/* Center Line */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-stone-300 -translate-x-1/2 origin-top" />
        <div 
          ref={lineRef} 
          className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-rose-500 -translate-x-1/2 origin-top" 
        />
        
        {/* Plane tracker */}
        <div 
          ref={planeRef}
          className="absolute left-6 md:left-1/2 -top-4 -translate-x-1/2 -translate-y-1/2 z-20 text-rose-600 bg-stone-100 p-2 rounded-full shadow-md"
        >
          <Plane className="w-5 h-5 rotate-180" />
        </div>

        {/* Stops */}
        <div className="flex flex-col gap-24 py-12 relative z-10">
          {stops.map((stop, index) => {
            const isEven = index % 2 === 0;
            return (
              <div 
                key={index}
                ref={(el) => { stopsRef.current[index] = el; }}
                className={`flex w-full ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 pl-12 md:pl-0`}
              >
                {/* Space on empty side for desktop */}
                <div className="hidden md:block flex-1" />
                
                {/* Dot */}
                <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-white border-4 border-rose-500 -translate-x-1/2 shadow-lg" />
                
                {/* Content */}
                <div className={`flex-1 flex flex-col ${isEven ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                  <div className="bg-white p-6 rounded-2xl shadow-xl border border-stone-200 inline-block w-full max-w-sm ml-0">
                    <h3 className="font-serif text-2xl text-stone-800 mb-2">{stop.title}</h3>
                    {stop.desc && (
                      <p className="text-stone-500 text-sm">{stop.desc}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
