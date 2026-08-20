"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TimelineEvent {
  year: string;
  text: string;
}

interface TimelineSectionProps {
  data: {
    event1Year: string;
    event1Text: string;
    event2Year: string;
    event2Text: string;
    event3Year?: string;
    event3Text?: string;
    event4Year?: string;
    event4Text?: string;
  };
  isActive: boolean;
  isEditorPreview?: boolean;
}

export default function TimelineSection({ data, isActive, isEditorPreview = false }: TimelineSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Array<HTMLDivElement | null>>([]);

  // Filter valid events
  const events: TimelineEvent[] = [
    { year: data.event1Year, text: data.event1Text },
    { year: data.event2Year, text: data.event2Text },
    ...(data.event3Year && data.event3Text ? [{ year: data.event3Year, text: data.event3Text }] : []),
    ...(data.event4Year && data.event4Text ? [{ year: data.event4Year, text: data.event4Text }] : []),
  ].filter(e => e.year && e.text);

  useEffect(() => {
    if (!isActive) return;

    if (isEditorPreview) {
      gsap.set(lineRef.current, { height: "100%" });
      gsap.set(itemsRef.current, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // Draw center line down
      gsap.fromTo(
        lineRef.current,
        { height: "0%" },
        {
          height: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 50%",
            end: "bottom 80%",
            scrub: true
          }
        }
      );

      // Fade/slide each timeline item
      itemsRef.current.forEach((item, i) => {
        if (!item) return;
        const isLeft = i % 2 === 0;
        gsap.fromTo(
          item,
          { opacity: 0, x: isLeft ? -30 : 30, y: 20 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isActive, isEditorPreview]);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full min-h-screen py-32 px-6 sm:px-12 bg-[#050505] flex items-center justify-center overflow-hidden"
    >
      <div className="max-w-4xl w-full mx-auto relative">
        
        {/* The Vertical Line */}
        <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[1px] bg-white/10 -translate-x-1/2" />
        <div 
          ref={lineRef}
          className="absolute left-[20px] md:left-1/2 top-0 w-[2px] bg-gradient-to-b from-rose-500 via-rose-400 to-transparent -translate-x-1/2 origin-top"
          style={{ height: "0%" }}
        />

        <div className="space-y-24 md:space-y-32 py-12 relative z-10">
          {events.map((event, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div 
                key={index}
                ref={(el) => { itemsRef.current[index] = el; }}
                className={`relative flex items-center justify-start md:justify-between w-full opacity-0 ${
                  isLeft ? "md:flex-row-reverse" : "md:flex-row"
                }`}
              >
                {/* Desktop Empty space for alternating layout */}
                <div className="hidden md:block w-5/12" />

                {/* Center Node */}
                <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#050505] border-2 border-rose-500 flex items-center justify-center">
                   <div className="w-1 h-1 rounded-full bg-rose-500" />
                </div>

                {/* Content Card */}
                <div className={`w-[calc(100%-40px)] ml-[40px] md:ml-0 md:w-5/12 ${isLeft ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'}`}>
                  <div className="inline-block px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-4">
                    <span className="font-mono text-sm tracking-widest text-rose-300">
                      {event.year}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif text-white leading-tight">
                    {event.text}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
