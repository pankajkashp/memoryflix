"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useSceneAnimation } from "@/lib/scene-engine/useSceneAnimation";
import { useFloatingObject } from "@/lib/scene-engine/useFloatingObject";
import FloatingEmojiField from "./FloatingEmojiField";
import { SceneProps } from "./types";

export default function EnvelopeScene({ fixedConfig, fieldValues, onExit }: SceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const envelopeRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const isAnimatingRef = useRef(false);

  const { animate } = useSceneAnimation(containerRef);
  useFloatingObject(envelopeRef, { y: 8, duration: 2.5, delay: 1.2 });

  const { backgroundColor = "#0d0d0d" } = fixedConfig;
  const accentColor = fieldValues.accentColor || fixedConfig.accentColor || "#f43f5e";

  const recipientName = fieldValues.recipientName || "You";

  useEffect(() => {
    animate((tl) => {
      tl.fromTo(envelopeRef.current, { scale: 0.88, y: 30, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 1, ease: "back.out(1.4)" })
        .fromTo(hintRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.3")
        .to(sealRef.current, { scale: 1.06, duration: 1.2, ease: "sine.inOut", repeat: -1, yoyo: true }, "-=0.5");
    });
  }, []);

  const handleClick = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    animate((tl) => {
      gsap.killTweensOf(envelopeRef.current);
      gsap.killTweensOf(sealRef.current);

      tl.to(sealRef.current, { scale: 1.2, duration: 0.15, ease: "power2.out" })
        .to(sealRef.current, { scale: 0, opacity: 0, duration: 0.3, ease: "power3.in" })
        .to(flapRef.current, { rotateX: -180, duration: 0.6, ease: "power2.out", transformOrigin: "top center" }, "-=0.1")
        .fromTo(
          letterRef.current,
          { y: 30, opacity: 0 },
          { y: -20, opacity: 1, duration: 0.5, ease: "back.out(2)" },
          "-=0.2"
        )
        .to(
          containerRef.current,
          { scale: 1.08, opacity: 0, duration: 0.5, ease: "power3.in", onComplete: () => onExit("default") },
          "+=0.15"
        );
    });
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden"
      style={{ backgroundColor }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      aria-label="Click to open the envelope"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(circle at center, ${accentColor}22 0%, transparent 70%)` }}
      />
      <FloatingEmojiField emojis={fixedConfig.emojiDecor || []} />

      <p
        ref={hintRef}
        className="absolute top-1/4 text-center font-mono text-xs sm:text-sm tracking-[0.25em] uppercase px-4"
        style={{ color: `${accentColor}99` }}
      >
        something is waiting for {recipientName}
      </p>

      <div ref={envelopeRef} className="relative w-72 sm:w-96 aspect-[4/3]">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl shadow-2xl shadow-black/60 border border-rose-200/30" />
        <div className="absolute inset-x-4 bottom-4 h-8 bg-rose-200/20 rounded-b-lg blur-sm" />

        <div
          ref={flapRef}
          className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden pointer-events-none"
          style={{ transformOrigin: "top center", transformStyle: "preserve-3d" }}
        >
          <div
            className="w-full h-full bg-gradient-to-b from-rose-100 to-rose-50 rounded-t-xl border-b border-rose-200/40"
            style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
          />
        </div>

        <div
          ref={sealRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-10"
          style={{ background: `linear-gradient(135deg, ${accentColor}, #7f1d1d)`, boxShadow: `0 10px 20px -5px ${accentColor}66` }}
        >
          <div className="w-10 h-10 rounded-full border-2 border-rose-300/40 flex items-center justify-center">
            <span className="text-rose-100 text-xl font-serif">♡</span>
          </div>
        </div>

        <div
          ref={letterRef}
          className="absolute inset-x-4 top-4 h-1/2 bg-white rounded-t-md shadow-md opacity-0 pointer-events-none flex items-center justify-center"
        >
          <span className="text-rose-400 text-3xl">🎂</span>
        </div>
      </div>

      <p className="absolute bottom-16 text-center font-mono text-[10px] tracking-[0.2em] uppercase text-white/25 animate-pulse">
        tap to open
      </p>
    </div>
  );
}
