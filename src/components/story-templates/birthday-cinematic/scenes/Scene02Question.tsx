"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Scene02Props {
  data: { recipientName: string; questionText: string };
  onYes: () => void;
  onNo: () => void;
}

// Simple character SVG using CSS shapes
function Character({ state }: { state: "calm" | "excited" }) {
  return (
    <div className="relative w-32 h-40 sm:w-40 sm:h-48 mx-auto">
      {/* Body */}
      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-24 sm:w-24 sm:h-28 rounded-t-3xl transition-all duration-300 ${state === "excited" ? "bg-amber-400" : "bg-amber-300"}`} />
      {/* Head */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-amber-200 border-4 border-amber-300 shadow-lg flex items-center justify-center">
        {/* Eyes */}
        <div className="flex gap-4 mb-3">
          <div className={`w-3 h-3 rounded-full transition-all duration-300 ${state === "excited" ? "bg-amber-800 scale-125" : "bg-amber-700"}`} />
          <div className={`w-3 h-3 rounded-full transition-all duration-300 ${state === "excited" ? "bg-amber-800 scale-125" : "bg-amber-700"}`} />
        </div>
      </div>
      {/* Mouth */}
      <div className={`absolute top-[4.5rem] sm:top-[5.5rem] left-1/2 -translate-x-1/2 transition-all duration-300 ${state === "excited" ? "w-8 h-4 rounded-b-full bg-rose-500" : "w-6 h-3 rounded-b-full bg-rose-400"}`} />
      {/* Arms */}
      {state === "excited" && (
        <>
          <div className="absolute top-[5rem] -left-3 w-8 h-3 bg-amber-300 rounded-full rotate-[-30deg] origin-right animate-[wave_0.5s_ease-in-out_infinite_alternate]" />
          <div className="absolute top-[5rem] -right-3 w-8 h-3 bg-amber-300 rounded-full rotate-[30deg] origin-left animate-[wave_0.5s_ease-in-out_infinite_alternate]" />
        </>
      )}
    </div>
  );
}

export default function Scene02Question({ data, onYes, onNo }: Scene02Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 })
        .fromTo(characterRef.current,
          { scale: 0.5, opacity: 0, y: 20 },
          { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: "back.out(2)" }
        )
        .fromTo(textRef.current,
          { clipPath: "inset(0 100% 0 0)", opacity: 0 },
          { clipPath: "inset(0 0% 0 0)", opacity: 1, duration: 0.6, ease: "power2.out" },
          "-=0.2"
        )
        .fromTo(buttonsRef.current?.children || [],
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.5)" },
          "-=0.1"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleYes = () => {
    const tl = gsap.timeline({ onComplete: onYes });
    tl.to(characterRef.current, { scale: 1.1, duration: 0.15, ease: "power2.out" })
      .to(characterRef.current, { scale: 0.9, duration: 0.1 })
      .to(containerRef.current, { scale: 1.05, opacity: 0, duration: 0.4, ease: "power3.in" });
  };

  const handleNo = () => {
    const tl = gsap.timeline({ onComplete: onNo });
    tl.to(buttonsRef.current, { x: -10, duration: 0.05, ease: "power2.out" })
      .to(buttonsRef.current, { x: 10, duration: 0.05 })
      .to(buttonsRef.current, { x: -5, duration: 0.05 })
      .to(buttonsRef.current, { x: 0, duration: 0.05 })
      .to(containerRef.current, { x: -60, opacity: 0, duration: 0.35, ease: "power3.in" });
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex flex-col items-center justify-center gap-8 sm:gap-10 px-6 bg-gradient-to-br from-amber-50 to-rose-50 select-none"
    >
      {/* Subtle top text */}
      <p className="absolute top-8 font-mono text-[10px] tracking-[0.25em] uppercase text-rose-400/60">
        for {data.recipientName}
      </p>

      {/* Character */}
      <div ref={characterRef}>
        <Character state="calm" />
      </div>

      {/* Question text */}
      <div ref={textRef} className="text-center space-y-2 max-w-xs sm:max-w-sm">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-800 leading-tight tracking-tight uppercase">
          {data.questionText}
        </h1>
      </div>

      {/* Buttons */}
      <div ref={buttonsRef} className="flex gap-4 sm:gap-6">
        <button
          onClick={handleYes}
          className="min-w-[120px] sm:min-w-[140px] min-h-[52px] px-8 py-3.5 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white font-black text-lg sm:text-xl tracking-wider shadow-lg shadow-rose-400/30 hover:scale-105 active:scale-95 transition-transform focus:outline-none focus:ring-4 focus:ring-rose-400/50"
          aria-label="Yes, show me!"
        >
          YES
        </button>
        <button
          onClick={handleNo}
          className="min-w-[120px] sm:min-w-[140px] min-h-[52px] px-8 py-3.5 rounded-2xl bg-zinc-200 text-zinc-600 font-black text-lg sm:text-xl tracking-wider hover:bg-zinc-300 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-zinc-300/50"
          aria-label="No"
        >
          NO
        </button>
      </div>
    </div>
  );
}
