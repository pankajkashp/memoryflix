"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface Scene06Props {
  data: {
    photo1: string;
    caption1: string;
    recipientName: string;
  };
  onNext: () => void;
}

export default function Scene06MemoryReveal({ data, onNext }: Scene06Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const tape1Ref = useRef<HTMLDivElement>(null);
  const tape2Ref = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const dateBadgeRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLSpanElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setReady(true);
          // Auto-advance after 4 seconds
          setTimeout(() => {
            if (document.querySelector('[data-scene06]')) onNext();
          }, 4000);
        }
      });

      // Container fades in from white (gift explosion)
      tl.fromTo(containerRef.current, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" })
        // Photo zooms in from gift center
        .fromTo(photoRef.current,
          { scale: 0.1, opacity: 0, y: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.3)" },
          "-=0.2"
        )
        // Tape pieces slap on
        .fromTo(tape1Ref.current,
          { scale: 0, rotation: -30, opacity: 0 },
          { scale: 1, rotation: -12, opacity: 1, duration: 0.4, ease: "back.out(2)" },
          "-=0.2"
        )
        .fromTo(tape2Ref.current,
          { scale: 0, rotation: 30, opacity: 0 },
          { scale: 1, rotation: 8, opacity: 1, duration: 0.4, ease: "back.out(2)" },
          "-=0.2"
        )
        // Caption reveals
        .fromTo(captionRef.current,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
          "-=0.1"
        )
        // Date badge
        .fromTo(dateBadgeRef.current,
          { x: 20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4, ease: "back.out(1.5)" },
          "-=0.2"
        )
        // Heart
        .fromTo(heartRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: "elastic.out(1.2, 0.5)" },
          "-=0.1"
        )
        .fromTo(hintRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    }, containerRef);

    return () => ctx.revert();
  }, [onNext]);

  return (
    <div
      data-scene06
      ref={containerRef}
      className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50 px-4 cursor-pointer select-none overflow-hidden"
      onClick={onNext}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onNext()}
      aria-label="Continue to next scene"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      {/* Main photo with scrapbook styling */}
      <div className="relative max-w-[85vw] sm:max-w-sm w-full">

        {/* Photo frame */}
        <div
          ref={photoRef}
          className="relative w-full aspect-[3/4] bg-white p-3 sm:p-4 shadow-2xl rounded-sm"
          style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)" }}
        >
          <div className="w-full h-full bg-zinc-100 overflow-hidden rounded-sm">
            <img
              src={data.photo1 || "/1.png"}
              alt={data.caption1}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Inner frame shadow */}
          <div className="absolute inset-3 sm:inset-4 ring-1 ring-inset ring-black/10 pointer-events-none rounded-sm" />
        </div>

        {/* Tape pieces */}
        <div
          ref={tape1Ref}
          className="absolute -top-4 -left-4 w-16 h-6 bg-amber-100/80 border border-amber-200/60 shadow-sm rounded-sm pointer-events-none"
          style={{ transform: "rotate(-12deg)", backdropFilter: "blur(2px)" }}
        />
        <div
          ref={tape2Ref}
          className="absolute -top-3 -right-3 w-14 h-5 bg-amber-100/80 border border-amber-200/60 shadow-sm rounded-sm pointer-events-none"
          style={{ transform: "rotate(8deg)", backdropFilter: "blur(2px)" }}
        />

        {/* Caption below */}
        <div ref={captionRef} className="mt-4 sm:mt-6 text-center space-y-1">
          <p className="font-serif text-xl sm:text-2xl md:text-3xl text-zinc-700 italic leading-snug">
            "{data.caption1}"
          </p>
        </div>

        {/* Date badge */}
        <div
          ref={dateBadgeRef}
          className="absolute -right-2 sm:-right-6 bottom-12 sm:bottom-16 bg-rose-500 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider shadow-lg rotate-6"
        >
          for {data.recipientName} ♡
        </div>

        {/* Heart sticker */}
        <span ref={heartRef} className="absolute -left-4 top-1/3 text-3xl sm:text-4xl -rotate-12 drop-shadow-md">
          🌸
        </span>
      </div>

      {/* Hint */}
      <p ref={hintRef} className="absolute bottom-10 font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-400/60 animate-pulse">
        tap to continue
      </p>
    </div>
  );
}
