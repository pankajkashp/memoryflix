"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useSceneAnimation } from "@/lib/scene-engine/useSceneAnimation";
import FloatingEmojiField from "./FloatingEmojiField";
import { SceneProps } from "./types";

export default function MessageBeatScene({ fixedConfig, fieldValues, onExit }: SceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const messageRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const { animate } = useSceneAnimation(containerRef);

  const { backgroundColor = "#0d0d0d", textColor = "#fafafa", accentColor = "#f43f5e" } = fixedConfig;
  const title = fieldValues.title;
  const message = fieldValues.message || "";
  const photoUrl = fieldValues.photoUrl as string | undefined;
  const ctaLabel = fieldValues.ctaLabel || "Continue";

  useEffect(() => {
    animate((tl) => {
      tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out" });
      if (photoRef.current) {
        tl.fromTo(photoRef.current, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: "power3.out" }, "-=0.3");
      }
      if (titleRef.current) {
        tl.fromTo(titleRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, "-=0.2");
      }
      tl.fromTo(messageRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, "-=0.2")
        .fromTo(btnRef.current, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "back.out(1.5)" }, "-=0.1");
    });
  }, []);

  const handleContinue = () => {
    animate((tl) => {
      tl.to(containerRef.current, { opacity: 0, y: -16, duration: 0.35, ease: "power3.in", onComplete: () => onExit("default") });
    });
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 sm:px-10 py-6 text-center select-none overflow-y-auto"
      style={{ backgroundColor }}
    >
      <FloatingEmojiField emojis={fixedConfig.emojiDecor || []} />

      {photoUrl && (
        <div ref={photoRef} className="relative w-40 h-40 sm:w-52 sm:h-52 rounded-2xl overflow-hidden shadow-2xl border-2" style={{ borderColor: `${accentColor}55` }}>
          <Image src={photoUrl} alt="" fill className="object-cover" />
        </div>
      )}

      {title && (
        <h1 ref={titleRef} className="text-2xl sm:text-3xl font-serif font-bold" style={{ color: textColor }}>
          {title}
        </h1>
      )}

      <p ref={messageRef} className="text-sm sm:text-base leading-relaxed max-w-sm whitespace-pre-line" style={{ color: textColor, opacity: 0.85 }}>
        {message}
      </p>

      <button
        ref={btnRef}
        onClick={handleContinue}
        className="mt-2 min-h-[48px] px-8 py-3 rounded-2xl text-white font-bold text-sm tracking-wide shadow-lg active:scale-95 transition-all focus:outline-none focus:ring-4"
        style={{ background: `linear-gradient(135deg, ${accentColor}, #be123c)` }}
      >
        {ctaLabel}
      </button>
    </div>
  );
}
