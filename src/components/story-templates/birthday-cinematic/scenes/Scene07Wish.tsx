"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface Scene07Props {
  data: { wishMessage: string; recipientName: string };
  onNext: () => void;
}

function CandleFlame({ blown }: { blown: boolean }) {
  return (
    <div className="relative flex flex-col items-center">
      {/* Flame */}
      {!blown && (
        <div className="relative mb-0.5">
          <div className="w-4 h-8 sm:w-5 sm:h-10 bg-gradient-to-t from-orange-400 via-amber-300 to-yellow-100 rounded-full animate-[flicker_0.8s_ease-in-out_infinite_alternate] origin-bottom" style={{ filter: "blur(1px)" }} />
          <div className="absolute inset-x-1 bottom-0 top-2 bg-gradient-to-t from-amber-500/80 to-transparent rounded-full" />
        </div>
      )}
      {/* Candle body */}
      <div className="w-5 h-16 sm:w-6 sm:h-20 bg-gradient-to-br from-rose-300 to-rose-400 rounded-t-sm shadow-md relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-2 bg-rose-200/60" />
        {/* Drip */}
        <div className="absolute -right-0.5 top-3 w-3 h-5 bg-rose-300 rounded-b-full" />
      </div>
      {/* Wick */}
      {blown && (
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-zinc-700 rounded-full">
          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full -mt-1 ml-[-2px] animate-pulse" />
        </div>
      )}
    </div>
  );
}

export default function Scene07Wish({ data, onNext }: Scene07Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cakeRef = useRef<HTMLDivElement>(null);
  const wishTextRef = useRef<HTMLHeadingElement>(null);
  const subTextRef = useRef<HTMLParagraphElement>(null);
  const candlesRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [blown, setBlown] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out" })
        .fromTo(wishTextRef.current, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" }, "-=0.2")
        .fromTo(cakeRef.current, { y: 60, scale: 0.8, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.5)" }, "-=0.3")
        .fromTo(subTextRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.1");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleCandleClick = () => {
    if (blown) return;
    setBlown(true);

    const tl = gsap.timeline({ onComplete: () => setTimeout(onNext, 600) });
    // Glow expands
    tl.to(glowRef.current, { scale: 3, opacity: 0.6, duration: 0.3, ease: "power2.out" })
      .to(glowRef.current, { scale: 6, opacity: 0, duration: 0.8, ease: "power2.in" }, "-=0.1")
      // Background darkens slightly
      .to(containerRef.current, { backgroundColor: "#1a0a0a", duration: 0.4 }, "-=0.5")
      // Text message appears
      .fromTo(subTextRef.current,
        { scale: 1.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.5)" },
        "-=0.2"
      )
      // Scene fades to black
      .to(containerRef.current, { opacity: 0, duration: 0.5 }, "+=0.8");
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex flex-col items-center justify-center gap-6 sm:gap-8 bg-gradient-to-b from-[#1a0520] via-[#2d0a3a] to-[#1a0520] select-none overflow-hidden"
    >
      {/* Glow behind cake */}
      <div
        ref={glowRef}
        className="absolute w-48 h-48 rounded-full bg-amber-400/20 pointer-events-none blur-3xl"
      />

      {/* Wish text */}
      <h1 ref={wishTextRef} className="text-4xl sm:text-5xl md:text-6xl font-black text-white text-center leading-none uppercase tracking-tight px-4 drop-shadow-2xl">
        {data.wishMessage}
      </h1>

      {/* Cake */}
      <div
        ref={cakeRef}
        className="relative flex flex-col items-center cursor-pointer"
        onClick={handleCandleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleCandleClick()}
        aria-label="Click the candle to make a wish"
      >
        {/* Candles row */}
        <div ref={candlesRef} className="flex gap-4 sm:gap-6 mb-1 z-10">
          <CandleFlame blown={blown} />
          <CandleFlame blown={blown} />
          <CandleFlame blown={blown} />
        </div>

        {/* Top tier */}
        <div className="w-36 h-16 sm:w-44 sm:h-20 bg-gradient-to-br from-rose-300 to-pink-400 rounded-t-3xl rounded-b-sm shadow-xl relative overflow-hidden border-2 border-rose-200/40">
          <div className="absolute inset-x-0 bottom-0 h-4 bg-rose-500/30" />
          {/* Frosting drips */}
          <div className="absolute top-0 left-4 w-6 h-8 bg-white/60 rounded-b-full" />
          <div className="absolute top-0 left-16 w-4 h-6 bg-white/60 rounded-b-full" />
          <div className="absolute top-0 right-6 w-5 h-7 bg-white/60 rounded-b-full" />
          <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-white text-xl font-black">🎂</span>
        </div>

        {/* Bottom tier */}
        <div className="w-48 h-20 sm:w-60 sm:h-24 bg-gradient-to-br from-pink-400 to-rose-500 rounded-b-2xl shadow-2xl relative overflow-hidden border-2 border-pink-300/40">
          <div className="absolute inset-x-0 top-0 h-4 bg-white/20" />
          <div className="absolute inset-x-0 bottom-0 h-6 bg-rose-600/30" />
          {/* Sprinkles */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-3 rounded-full"
              style={{
                left: `${10 + i * 11}%`,
                top: `${20 + (i % 3) * 25}%`,
                backgroundColor: ["#fbbf24", "#60a5fa", "#34d399", "#f472b6"][i % 4],
                transform: `rotate(${i * 45}deg)`,
              }}
            />
          ))}
        </div>

        {!blown && (
          <p className="mt-4 font-mono text-[10px] tracking-[0.2em] uppercase text-amber-200/50 animate-pulse">
            tap the candle to wish
          </p>
        )}
      </div>

      {/* Post-blow message */}
      {blown && (
        <p ref={subTextRef} className="text-center text-white text-lg sm:text-xl md:text-2xl font-serif italic max-w-sm px-6 opacity-0">
          ✨ Your wish is on its way ✨
        </p>
      )}
    </div>
  );
}
