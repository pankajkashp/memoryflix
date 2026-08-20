"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Scene03Props {
  data: { recipientName: string };
  onTryAgain: () => void;
}

export default function Scene03Reaction({ data, onTryAgain }: Scene03Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const subTextRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(containerRef.current, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.35, ease: "power3.out" })
        // Character shakes
        .fromTo(characterRef.current, { scale: 0.7, rotation: -10, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 0.5, ease: "back.out(2)" })
        .to(characterRef.current, { rotation: 5, duration: 0.1, ease: "power2.out" })
        .to(characterRef.current, { rotation: -5, duration: 0.1 })
        .to(characterRef.current, { rotation: 3, duration: 0.08 })
        .to(characterRef.current, { rotation: 0, duration: 0.08 })
        // Text pops in
        .fromTo(textRef.current, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "elastic.out(1.2, 0.5)" }, "-=0.2")
        .fromTo(subTextRef.current, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 })
        .fromTo(btnRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "back.out(2)" });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleTryAgain = () => {
    const tl = gsap.timeline({ onComplete: onTryAgain });
    tl.to(containerRef.current, { x: 60, opacity: 0, duration: 0.3, ease: "power3.in" });
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex flex-col items-center justify-center gap-6 sm:gap-8 px-6 bg-gradient-to-br from-orange-50 to-amber-50 select-none"
    >
      {/* Shocked character */}
      <div ref={characterRef} className="relative w-36 h-44 sm:w-44 sm:h-52 mx-auto">
        {/* Body */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-28 rounded-t-3xl bg-orange-400" />
        {/* Head */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-amber-200 border-4 border-amber-300 shadow-lg flex items-end justify-center pb-3">
          {/* Wide shocked eyes */}
          <div className="flex gap-4 mb-5">
            <div className="w-5 h-5 rounded-full bg-amber-800 ring-2 ring-amber-600" />
            <div className="w-5 h-5 rounded-full bg-amber-800 ring-2 ring-amber-600" />
          </div>
        </div>
        {/* Shocked O mouth */}
        <div className="absolute top-[5.8rem] left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-rose-600 border-2 border-rose-700" />
        {/* Shocked arms up */}
        <div className="absolute top-[5.5rem] -left-5 w-10 h-3 bg-amber-300 rounded-full -rotate-45 origin-right" />
        <div className="absolute top-[5.5rem] -right-5 w-10 h-3 bg-amber-300 rounded-full rotate-45 origin-left" />
        {/* Sweat drop */}
        <div className="absolute top-2 right-2 w-3 h-4 bg-blue-300 rounded-full rounded-tl-none rotate-12 opacity-70" />
      </div>

      {/* Reaction text */}
      <div ref={textRef} className="text-center">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-orange-600 leading-none tracking-tight uppercase">
          HOW DARE YOU!
        </h1>
      </div>

      <p ref={subTextRef} className="text-center text-zinc-600 font-medium text-base sm:text-lg max-w-xs">
        That was the wrong answer, {data.recipientName}. Try again... please 🥺
      </p>

      <button
        ref={btnRef}
        onClick={handleTryAgain}
        className="min-h-[52px] px-10 py-3.5 rounded-2xl bg-orange-500 text-white font-black text-base sm:text-lg tracking-wider shadow-lg hover:bg-orange-600 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-orange-400/50"
        aria-label="Try again"
      >
        TRY AGAIN →
      </button>
    </div>
  );
}
