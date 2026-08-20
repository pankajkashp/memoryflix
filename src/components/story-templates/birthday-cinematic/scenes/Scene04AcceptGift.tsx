"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Scene04Props {
  data: { recipientName: string };
  onAccept: () => void;
}

export default function Scene04AcceptGift({ data, onAccept }: Scene04Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);
  const giftRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(containerRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" })
        .fromTo(characterRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "back.out(1.7)" }
        )
        .fromTo(giftRef.current,
          { scale: 0, rotation: -20, opacity: 0 },
          { scale: 1, rotation: 0, opacity: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" },
          "-=0.3"
        )
        .fromTo(textRef.current,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
          "-=0.1"
        )
        .fromTo(btnRef.current,
          { y: 20, scale: 0.9, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" }
        );

      // Gift gentle float
      gsap.to(giftRef.current, {
        y: -10,
        rotation: 3,
        duration: 1.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 1,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleAccept = () => {
    gsap.killTweensOf(giftRef.current);
    const tl = gsap.timeline({ onComplete: onAccept });
    // Button press
    tl.to(btnRef.current, { scale: 0.9, duration: 0.1, ease: "power2.out" })
      .to(btnRef.current, { scale: 1.05, duration: 0.15, ease: "back.out(2)" })
      // Character celebrates
      .to(characterRef.current, { y: -15, duration: 0.25, ease: "power2.out" }, "-=0.1")
      .to(characterRef.current, { y: 0, duration: 0.3, ease: "bounce.out" })
      // Gift floats up and scene scales out
      .to(giftRef.current, { y: -40, scale: 1.3, opacity: 0, duration: 0.4, ease: "power2.in" }, "-=0.2")
      .to(containerRef.current, { scale: 1.05, opacity: 0, duration: 0.4, ease: "power3.in" }, "-=0.2");
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex flex-col items-center justify-center gap-6 sm:gap-8 px-6 bg-gradient-to-br from-violet-50 via-pink-50 to-rose-50 select-none"
    >
      <p className="absolute top-8 font-mono text-[10px] tracking-[0.25em] uppercase text-violet-400/60">
        just for you
      </p>

      {/* Character holding gift */}
      <div className="flex items-end gap-6">
        {/* Character */}
        <div ref={characterRef} className="relative w-28 h-36 sm:w-36 sm:h-44">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-24 rounded-t-3xl bg-violet-400" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-amber-200 border-4 border-amber-300 shadow-lg flex items-end justify-center pb-3">
            <div className="flex gap-3 mb-3">
              <div className="w-3 h-3 rounded-full bg-amber-800" />
              <div className="w-3 h-3 rounded-full bg-amber-800" />
            </div>
          </div>
          {/* Smile */}
          <div className="absolute top-[4.5rem] left-1/2 -translate-x-1/2 w-8 h-4 rounded-b-full bg-rose-400" />
          {/* Extended arm toward gift */}
          <div className="absolute top-[5.5rem] -right-8 w-12 h-3 bg-amber-300 rounded-full rotate-[-15deg] origin-left" />
        </div>

        {/* Gift */}
        <div ref={giftRef} className="relative">
          {/* Box */}
          <div className="w-20 h-16 sm:w-24 sm:h-20 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl shadow-xl shadow-rose-400/40 border-2 border-rose-300 relative overflow-hidden">
            {/* Ribbon vertical */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-4 bg-amber-300/70" />
            {/* Ribbon horizontal */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-4 bg-amber-300/70" />
          </div>
          {/* Bow */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-end justify-center">
            <div className="w-6 h-7 border-4 border-yellow-400 rounded-tl-full rounded-bl-full rotate-[35deg] translate-x-2 bg-yellow-200/60" />
            <div className="w-6 h-7 border-4 border-yellow-400 rounded-tr-full rounded-br-full -rotate-[35deg] -translate-x-2 bg-yellow-200/60" />
            <div className="w-4 h-4 bg-yellow-400 rounded-full absolute -bottom-1 z-10" />
          </div>
          {/* Heart floating */}
          <div className="absolute -top-8 -right-4 text-2xl animate-bounce">💕</div>
        </div>
      </div>

      {/* Text */}
      <div ref={textRef} className="text-center space-y-2 max-w-xs">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-800 leading-tight uppercase tracking-tight">
          pls accept the gift 🙏
        </h1>
        <p className="text-zinc-500 font-medium text-sm sm:text-base">
          I made this just for you
        </p>
      </div>

      {/* Accept button */}
      <button
        ref={btnRef}
        onClick={handleAccept}
        className="min-h-[52px] px-10 py-3.5 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-600 text-white font-black text-base sm:text-lg tracking-wider shadow-lg shadow-violet-400/30 hover:scale-105 active:scale-95 transition-transform focus:outline-none focus:ring-4 focus:ring-violet-400/50"
        aria-label="Accept the gift"
      >
        ACCEPT 💌
      </button>
    </div>
  );
}
