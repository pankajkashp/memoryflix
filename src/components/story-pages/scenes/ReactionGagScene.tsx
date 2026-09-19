"use client";

import { useEffect, useRef } from "react";
import { useSceneAnimation } from "@/lib/scene-engine/useSceneAnimation";
import FloatingEmojiField from "./FloatingEmojiField";
import { SceneProps } from "./types";

export default function ReactionGagScene({ fixedConfig, fieldValues, onExit }: SceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const subTextRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const { animate } = useSceneAnimation(containerRef);

  const { backgroundColor = "#FFF7ED", accentColor = "#f97316" } = fixedConfig;
  const title = fieldValues.reactionTitle || "HOW DARE YOU!";
  const subtitle =
    fieldValues.reactionSubtitle ||
    `That was the wrong answer${fieldValues.recipientName ? `, ${fieldValues.recipientName}` : ""}. Try again... please 🥺`;

  useEffect(() => {
    animate((tl) => {
      tl.fromTo(containerRef.current, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.35, ease: "power3.out" })
        .fromTo(characterRef.current, { scale: 0.7, rotation: -10, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 0.5, ease: "back.out(2)" })
        .to(characterRef.current, { rotation: 5, duration: 0.1, ease: "power2.out" })
        .to(characterRef.current, { rotation: -5, duration: 0.1 })
        .to(characterRef.current, { rotation: 3, duration: 0.08 })
        .to(characterRef.current, { rotation: 0, duration: 0.08 })
        .fromTo(textRef.current, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "elastic.out(1.2, 0.5)" }, "-=0.2")
        .fromTo(subTextRef.current, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 })
        .fromTo(btnRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "back.out(2)" });
    });
  }, []);

  const handleTryAgain = () => {
    animate((tl) => {
      tl.to(containerRef.current, { x: 60, opacity: 0, duration: 0.3, ease: "power3.in", onComplete: () => onExit("default") });
    });
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex flex-col items-center justify-center gap-6 sm:gap-8 px-6 py-6 select-none overflow-y-auto"
      style={{ backgroundColor }}
    >
      <FloatingEmojiField emojis={fixedConfig.emojiDecor || []} />

      <div ref={characterRef} className="relative w-36 h-44 sm:w-44 sm:h-52 mx-auto">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-28 rounded-t-3xl bg-orange-400" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-amber-200 border-4 border-amber-300 shadow-lg flex items-end justify-center pb-3">
          <div className="flex gap-4 mb-5">
            <div className="w-5 h-5 rounded-full bg-amber-800 ring-2 ring-amber-600" />
            <div className="w-5 h-5 rounded-full bg-amber-800 ring-2 ring-amber-600" />
          </div>
        </div>
        <div className="absolute top-[5.8rem] left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-rose-600 border-2 border-rose-700" />
        <div className="absolute top-[5.5rem] -left-5 w-10 h-3 bg-amber-300 rounded-full -rotate-45 origin-right" />
        <div className="absolute top-[5.5rem] -right-5 w-10 h-3 bg-amber-300 rounded-full rotate-45 origin-left" />
      </div>

      <div ref={textRef} className="text-center">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black leading-none tracking-tight uppercase" style={{ color: accentColor }}>
          {title}
        </h1>
      </div>

      <p ref={subTextRef} className="text-center text-zinc-600 font-medium text-base sm:text-lg max-w-xs">
        {subtitle}
      </p>

      <button
        ref={btnRef}
        onClick={handleTryAgain}
        className="min-h-[52px] px-10 py-3.5 rounded-2xl text-white font-black text-base sm:text-lg tracking-wider shadow-lg active:scale-95 transition-all focus:outline-none focus:ring-4"
        style={{ backgroundColor: accentColor }}
        aria-label="Try again"
      >
        TRY AGAIN →
      </button>
    </div>
  );
}
