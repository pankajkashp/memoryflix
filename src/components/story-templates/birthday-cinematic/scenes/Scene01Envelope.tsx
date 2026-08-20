"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Scene01Props {
  data: { recipientName: string; senderName: string };
  onNext: () => void;
}

export default function Scene01Envelope({ data, onNext }: Scene01Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const envelopeRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      // Background fade in
      tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power2.out" })
        // Envelope arrives
        .fromTo(envelopeRef.current, { scale: 0.88, y: 30, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 1, ease: "back.out(1.4)" }, "-=0.3")
        // Hint text slides up
        .fromTo(hintRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.3")
        // Seal pulse loop
        .to(sealRef.current, { scale: 1.06, duration: 1.2, ease: "sine.inOut", repeat: -1, yoyo: true }, "-=0.5");

      // Gentle float on envelope
      gsap.to(envelopeRef.current, {
        y: -8,
        duration: 2.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 1.2,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleClick = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: onNext });
      // Kill the floating animation
      gsap.killTweensOf(envelopeRef.current);
      gsap.killTweensOf(sealRef.current);

      // Seal presses
      tl.to(sealRef.current, { scale: 1.2, duration: 0.15, ease: "power2.out" })
        .to(sealRef.current, { scale: 0, opacity: 0, duration: 0.3, ease: "power3.in" })
        // Flap lifts open
        .to(flapRef.current, { rotateX: -180, duration: 0.6, ease: "power2.out", transformOrigin: "top center" }, "-=0.1")
        // Letter rises
        .fromTo(letterRef.current, { y: 30, opacity: 0 }, { y: -20, opacity: 1, duration: 0.5, ease: "back.out(2)" }, "-=0.2")
        // Everything scale-zoom out and dissolve
        .to(containerRef.current, { scale: 1.08, opacity: 0, duration: 0.5, ease: "power3.in" }, "+=0.15");
    }, containerRef);

    return () => ctx.revert();
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex flex-col items-center justify-center bg-[#0d0d0d] cursor-pointer select-none"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      aria-label="Click to open the envelope"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-radial from-rose-900/20 via-transparent to-transparent pointer-events-none" />

      {/* Hint text */}
      <p
        ref={hintRef}
        className="absolute top-1/4 text-center font-mono text-xs sm:text-sm tracking-[0.25em] uppercase text-rose-300/60 px-4"
      >
        something is waiting for you
      </p>

      {/* Envelope */}
      <div ref={envelopeRef} className="relative w-72 sm:w-96 aspect-[4/3] cursor-pointer">
        {/* Envelope body */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl shadow-2xl shadow-black/60 border border-rose-200/30" />

        {/* Envelope inner shadow for depth */}
        <div className="absolute inset-x-4 bottom-4 h-8 bg-rose-200/20 rounded-b-lg blur-sm" />

        {/* Envelope V-fold lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          {/* Left fold */}
          <div
            className="absolute bottom-0 left-0 w-0 h-0"
            style={{ borderStyle: "solid", borderWidth: "0 0 200px 160px", borderColor: "transparent transparent rgba(251,207,232,0.5) transparent" }}
          />
          {/* Right fold */}
          <div
            className="absolute bottom-0 right-0 w-0 h-0"
            style={{ borderStyle: "solid", borderWidth: "0 160px 200px 0", borderColor: "transparent rgba(251,207,232,0.5) transparent transparent" }}
          />
        </div>

        {/* Envelope flap */}
        <div
          ref={flapRef}
          className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden pointer-events-none"
          style={{ transformOrigin: "top center", transformStyle: "preserve-3d" }}
        >
          <div className="w-full h-full bg-gradient-to-b from-rose-100 to-rose-50 rounded-t-xl border-b border-rose-200/40"
            style={{
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            }}
          />
        </div>

        {/* Wax seal */}
        <div
          ref={sealRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-gradient-to-br from-rose-500 to-rose-700 shadow-lg shadow-rose-900/60 flex items-center justify-center z-10"
        >
          <div className="w-10 h-10 rounded-full border-2 border-rose-300/40 flex items-center justify-center">
            <span className="text-rose-100 text-xl font-serif">♡</span>
          </div>
          {/* Seal edge detail */}
          <div className="absolute inset-0 rounded-full border-2 border-rose-400/30" style={{ transform: "scale(1.1)" }} />
        </div>

        {/* Rising letter peek */}
        <div
          ref={letterRef}
          className="absolute inset-x-4 top-4 h-1/2 bg-white rounded-t-md shadow-md opacity-0 pointer-events-none flex items-center justify-center"
        >
          <span className="text-rose-400 text-3xl">🎂</span>
        </div>
      </div>

      {/* Tap prompt */}
      <p className="absolute bottom-16 text-center font-mono text-[10px] tracking-[0.2em] uppercase text-white/25 animate-pulse">
        tap to open
      </p>
    </div>
  );
}
