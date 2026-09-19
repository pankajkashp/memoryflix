"use client";

import { useEffect, useRef } from "react";
import { useSceneAnimation } from "@/lib/scene-engine/useSceneAnimation";
import { SceneProps } from "./types";

function Character({ excited }: { excited: boolean }) {
  return (
    <div className="relative w-32 h-40 sm:w-40 sm:h-48 mx-auto">
      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-24 sm:w-24 sm:h-28 rounded-t-3xl transition-all duration-300 ${excited ? "bg-amber-400" : "bg-amber-300"}`} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-amber-200 border-4 border-amber-300 shadow-lg flex items-center justify-center">
        <div className="flex gap-4 mb-3">
          <div className={`w-3 h-3 rounded-full transition-all duration-300 ${excited ? "bg-amber-800 scale-125" : "bg-amber-700"}`} />
          <div className={`w-3 h-3 rounded-full transition-all duration-300 ${excited ? "bg-amber-800 scale-125" : "bg-amber-700"}`} />
        </div>
      </div>
      <div className={`absolute top-[4.5rem] sm:top-[5.5rem] left-1/2 -translate-x-1/2 transition-all duration-300 ${excited ? "w-8 h-4 rounded-b-full bg-rose-500" : "w-6 h-3 rounded-b-full bg-rose-400"}`} />
    </div>
  );
}

export default function YesNoQuestionScene({ fixedConfig, fieldValues, onExit }: SceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const { animate } = useSceneAnimation(containerRef);

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
      {recipientName && (
        <p className="absolute top-8 font-mono text-[10px] tracking-[0.25em] uppercase" style={{ color: `${accentColor}99` }}>
          for {recipientName}
        </p>
      )}

      <div ref={characterRef}>
        <Character excited={false} />
      </div>

      <div ref={textRef} className="text-center space-y-2 max-w-xs sm:max-w-sm">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight uppercase" style={{ color: textColor }}>
          {questionText}
        </h1>
      </div>

      <div ref={buttonsRef} className="flex gap-4 sm:gap-6">
        {choices.map((choice, idx) => (
          <button
            key={choice.key}
            onClick={() => handleChoice(choice.key)}
            className="min-w-[120px] sm:min-w-[140px] min-h-[52px] px-8 py-3.5 rounded-2xl text-white font-black text-lg sm:text-xl tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-transform focus:outline-none focus:ring-4"
            style={
              idx === 0
                ? { background: `linear-gradient(135deg, ${accentColor}, #be123c)`, boxShadow: `0 10px 20px -6px ${accentColor}66` }
                : { background: "#e4e4e7", color: "#52525b" }
            }
            aria-label={choice.label}
          >
            {choice.label}
          </button>
        ))}
      </div>
    </div>
  );
}
