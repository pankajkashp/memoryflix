"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useSceneAnimation } from "@/lib/scene-engine/useSceneAnimation";
import FloatingEmojiField from "./FloatingEmojiField";
import CanvasTexture from "../CanvasTexture";
import { shade } from "../ScrapbookDecor";
import { getFontClassName } from "@/lib/fonts";
import { SceneProps } from "./types";

const EMOJI_BY_PRESET: Record<string, string[]> = {
  "ribboned-boxes": ["🎁", "🧸", "💝"],
  "glowing-orbs": ["🔮", "✨", "💫"],
};

export default function GiftPickerScene({ fixedConfig, fieldValues, onExit }: SceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const { animate } = useSceneAnimation(containerRef);

  const { backgroundColor = "#fdf4ff", animationPreset = "ribboned-boxes" } = fixedConfig;
  const accentColor = fieldValues.accentColor || fixedConfig.accentColor || "#d946ef";
  const itemCount = Math.min(Math.max(fixedConfig.itemCount || 3, 2), 4);
  const emojis = EMOJI_BY_PRESET[animationPreset] || EMOJI_BY_PRESET["ribboned-boxes"];
  const prompt = fieldValues.prompt || "Pick one to open 🎁";

  const items = Array.from({ length: itemCount }, (_, i) => ({
    emoji: emojis[i % emojis.length],
    label: fieldValues[`gift${i + 1}Label`] || `Surprise ${i + 1}`,
    rotation: (i % 2 === 0 ? -1 : 1) * (4 + i * 2),
  }));

  useEffect(() => {
    animate((tl) => {
      tl.fromTo(containerRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" })
        .fromTo(titleRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, "-=0.1")
        .fromTo(
          itemRefs.current,
          { y: 80, scale: 0.5, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 0.7, stagger: 0.12, ease: "back.out(1.7)" },
          "-=0.2"
        )
        .fromTo(hintRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, "-=0.1");

      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          y: -8,
          rotation: items[i].rotation,
          duration: 1.5 + i * 0.3,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: i * 0.2,
        });
      });
    });
  }, []);

  const handlePick = (idx: number) => {
    if (isSelecting) return;
    setIsSelecting(true);

    const selectedEl = itemRefs.current[idx];
    const otherEls = itemRefs.current.filter((_, i) => i !== idx);
    itemRefs.current.forEach((el) => el && gsap.killTweensOf(el));

    animate((tl) => {
      tl.to(otherEls, {
        x: (i: number) => (i % 2 === 0 ? -200 : 200),
        y: 50,
        scale: 0.5,
        opacity: 0,
        duration: 0.4,
        ease: "power3.in",
        stagger: 0.05,
      })
        .to(selectedEl, { scale: 1.4, rotation: 0, duration: 0.6, ease: "power2.out" }, "-=0.3")
        .to(selectedEl, { rotation: -10, duration: 0.1 })
        .to(selectedEl, { rotation: 10, duration: 0.1 })
        .to(selectedEl, { rotation: 0, duration: 0.1 })
        .to(selectedEl, { scale: 3, opacity: 0, duration: 0.4, ease: "power3.in" })
        .to(containerRef.current, { opacity: 0, duration: 0.2, onComplete: () => onExit(`gift${idx + 1}`) }, "-=0.2");
    });
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex flex-col items-center justify-center gap-8 sm:gap-12 px-6 py-6 select-none overflow-y-auto"
      style={{ backgroundColor }}
    >
      <CanvasTexture texture={fixedConfig.backgroundTexture || "canvas"} mode="dark" />
      <FloatingEmojiField emojis={fixedConfig.emojiDecor || []} />

      <div ref={titleRef} className="text-center space-y-1">
        <h1 className={`text-2xl sm:text-3xl font-black uppercase tracking-tight ${getFontClassName(fixedConfig.fontId)}`} style={{ color: accentColor }}>
          {prompt}
        </h1>
      </div>

      <div className="flex items-center justify-center gap-6 sm:gap-10 md:gap-16 flex-wrap">
        {items.map((item, idx) => (
          <button
            key={idx}
            ref={(el) => {
              itemRefs.current[idx] = el;
            }}
            onClick={() => handlePick(idx)}
            disabled={isSelecting}
            className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col items-center justify-center gap-1 border-2 border-white/40 cursor-pointer hover:shadow-xl transition-shadow focus:outline-none focus:ring-4 focus:ring-white/50 disabled:cursor-default"
            style={{ background: `linear-gradient(135deg, ${accentColor}, ${shade(accentColor, -35)})`, transform: `rotate(${item.rotation}deg)` }}
            aria-label={`Open ${item.label}`}
          >
            {/* Ribbon cross + bow, for a wrapped-gift scrapbook feel */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-3 sm:w-3.5 bg-white/70 z-10 pointer-events-none" />
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-3 sm:h-3.5 bg-white/70 z-10 pointer-events-none" />
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 flex items-center z-20 pointer-events-none">
              <span className="block w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/85 -mr-1" />
              <span className="block w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white shadow" />
              <span className="block w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/85 -ml-1" />
            </div>
            <span className="text-3xl sm:text-4xl z-10">{item.emoji}</span>
            <span className="text-white/90 font-bold text-[10px] uppercase tracking-wider z-10 bg-black/15 px-2 py-0.5 rounded-full">{item.label}</span>
          </button>
        ))}
      </div>

      <p ref={hintRef} className="font-serif italic text-sm tracking-wide text-zinc-500 text-center">
        click any {animationPreset === "glowing-orbs" ? "orb" : "gift"} to reveal your surprise
      </p>
    </div>
  );
}
