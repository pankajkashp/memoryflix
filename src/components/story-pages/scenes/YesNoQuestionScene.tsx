"use client";

import { useEffect, useRef } from "react";
import { useSceneAnimation } from "@/lib/scene-engine/useSceneAnimation";
import FloatingEmojiField, { usePrefersReducedMotion } from "./FloatingEmojiField";
import CharacterSticker from "./CharacterSticker";
import CanvasTexture from "../CanvasTexture";
import { ScrapbookButton } from "../ScrapbookDecor";
import { getFontClassName } from "@/lib/fonts";
import { SceneProps } from "./types";

export default function YesNoQuestionScene({ fixedConfig, fieldValues, onExit }: SceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const { animate } = useSceneAnimation(containerRef);
  const reducedMotion = usePrefersReducedMotion();

  const { backgroundColor = "#FFF7ED", textColor = "#27272a" } = fixedConfig;
  const accentColor = fieldValues.accentColor || fixedConfig.accentColor || "#f43f5e";
  const choices = fixedConfig.choices?.length
    ? fixedConfig.choices
    : [
        { key: "yes", label: "YES", targetSceneId: "" },
        { key: "no", label: "NO", targetSceneId: "" },
      ];

  const questionText = fieldValues.questionText || "Wanna see what I made?";
  const recipientName = fieldValues.recipientName;

  useEffect(() => {
    animate((tl) => {
      tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 })
        .fromTo(characterRef.current, { scale: 0.5, opacity: 0, y: 20 }, { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: "back.out(2)" })
        .fromTo(textRef.current, { clipPath: "inset(0 100% 0 0)", opacity: 0 }, { clipPath: "inset(0 0% 0 0)", opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.2")
        .fromTo(
          buttonsRef.current?.children || [],
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.5)" },
          "-=0.1"
        );
    });
  }, []);

  const handleChoice = (choiceKey: string) => {
    const isYes = choiceKey === "yes";
    animate((tl) => {
      if (isYes) {
        tl.to(characterRef.current, { scale: 1.1, duration: 0.15, ease: "power2.out" })
          .to(characterRef.current, { scale: 0.9, duration: 0.1 })
          .to(containerRef.current, { scale: 1.05, opacity: 0, duration: 0.4, ease: "power3.in", onComplete: () => onExit(choiceKey) });
      } else {
        tl.to(buttonsRef.current, { x: -10, duration: 0.05, ease: "power2.out" })
          .to(buttonsRef.current, { x: 10, duration: 0.05 })
          .to(buttonsRef.current, { x: -5, duration: 0.05 })
          .to(buttonsRef.current, { x: 0, duration: 0.05 })
          .to(containerRef.current, { x: -60, opacity: 0, duration: 0.35, ease: "power3.in", onComplete: () => onExit(choiceKey) });
      }
    });
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex flex-col items-center justify-center gap-8 sm:gap-10 px-6 py-6 select-none overflow-y-auto"
      style={{ backgroundColor }}
    >
      <CanvasTexture texture={fixedConfig.backgroundTexture || "canvas"} mode="dark" />
      <FloatingEmojiField emojis={fixedConfig.emojiDecor || []} />

      {recipientName && (
        <p className="absolute top-8 font-mono text-[10px] tracking-[0.25em] uppercase" style={{ color: `${accentColor}99` }}>
          for {recipientName}
        </p>
      )}

      <div ref={characterRef} className="w-40 h-40 sm:w-52 sm:h-52 drop-shadow-xl">
        <CharacterSticker
          name={fixedConfig.characterSticker || "panda-popcorn"}
          reducedMotion={reducedMotion}
          className="w-full h-full"
        />
      </div>

      <div ref={textRef} className="text-center space-y-2 max-w-xs sm:max-w-sm">
        <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight uppercase ${getFontClassName(fixedConfig.fontId)}`} style={{ color: textColor }}>
          {questionText}
        </h1>
      </div>

      <div ref={buttonsRef} className="flex gap-4 sm:gap-6">
        {choices.map((choice, idx) => (
          <ScrapbookButton
            key={choice.key}
            onClick={() => handleChoice(choice.key)}
            variant={idx === 0 ? "sticker" : "paper"}
            color={idx === 0 ? accentColor : "#78716c"}
            tape={idx === 0}
            className="min-w-[120px] sm:min-w-[140px] min-h-[52px] text-lg sm:text-xl"
            aria-label={choice.label}
          >
            {choice.label}
          </ScrapbookButton>
        ))}
      </div>
    </div>
  );
}
