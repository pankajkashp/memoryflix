"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useSceneAnimation } from "@/lib/scene-engine/useSceneAnimation";
import { useFloatingObject } from "@/lib/scene-engine/useFloatingObject";
import FloatingEmojiField from "./FloatingEmojiField";
import CanvasTexture from "../CanvasTexture";
import TapToAdvanceCue from "../TapToAdvanceCue";
import { WashiTape, Stamp, DoodleHeart, DoodleStar, shade } from "../ScrapbookDecor";
import { getFontClassName } from "@/lib/fonts";
import { SceneProps } from "./types";

/**
 * Full-viewport envelope: starts closed with a wax seal, unfolds on tap,
 * and the letter growing out of it takes over the whole screen as a
 * cream/vintage scrapbook page (not a small centered card) before handing
 * off to the next scene.
 */
export default function EnvelopeScene({ fixedConfig, fieldValues, onExit }: SceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const envelopeGroupRef = useRef<HTMLDivElement>(null);
  const envelopeRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const letterPanelRef = useRef<HTMLDivElement>(null);
  const letterContentRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);
  const [opened, setOpened] = useState(false);

  const { animate } = useSceneAnimation(containerRef);
  useFloatingObject(envelopeRef, { y: 8, duration: 2.5, delay: 1.2 });

  const { backgroundColor = "#1b0a12" } = fixedConfig;
  const accentColor = fieldValues.accentColor || fixedConfig.accentColor || "#f43f5e";
  const paperColor = "#f6ecd9";

  const recipientName = fieldValues.recipientName || "You";
  const openingNote = fieldValues.openingNote || "A little surprise, just for you...";

  useEffect(() => {
    animate((tl) => {
      tl.fromTo(envelopeGroupRef.current, { scale: 0.88, y: 30, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 1, ease: "back.out(1.4)" })
        .fromTo(hintRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.3")
        .to(sealRef.current, { scale: 1.06, duration: 1.2, ease: "sine.inOut", repeat: -1, yoyo: true }, "-=0.5");
    });
  }, []);

  const handleOpen = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    animate((tl) => {
      gsap.killTweensOf(envelopeRef.current);
      gsap.killTweensOf(sealRef.current);

      tl.to(sealRef.current, { scale: 1.2, duration: 0.15, ease: "power2.out" })
        .to(sealRef.current, { scale: 0, opacity: 0, duration: 0.3, ease: "power3.in" })
        .to(flapRef.current, { rotateX: -180, duration: 0.65, ease: "power2.out", transformOrigin: "top center" }, "-=0.1")
        .to(hintRef.current, { opacity: 0, duration: 0.2 }, "-=0.5")
        .to(envelopeGroupRef.current, {
          scale: 1.08,
          opacity: 0,
          duration: 0.55,
          ease: "power2.in",
          onComplete: () => setOpened(true),
        }, "-=0.15");
    });
  };

  // The letter panel only exists in the DOM once `opened` is true, so its
  // entrance must be animated from a separate effect (after React mounts
  // it) rather than chained onto handleOpen's timeline, which runs while
  // the panel's refs are still null.
  useEffect(() => {
    if (!opened) return;
    isAnimatingRef.current = true;
    animate((tl) => {
      tl.fromTo(
        letterPanelRef.current,
        { scale: 0.22, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.5)" }
      ).fromTo(
        letterContentRef.current?.children ? Array.from(letterContentRef.current.children) : [],
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.12,
          ease: "power2.out",
          onComplete: () => {
            isAnimatingRef.current = false;
          },
        },
        "-=0.35"
      );
    });
  }, [opened]);

  const handleContinue = () => {
    if (!opened || isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    animate((tl) => {
      tl.to(letterPanelRef.current, { scale: 1.05, opacity: 0, duration: 0.45, ease: "power3.in", onComplete: () => onExit("default") });
    });
  };

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden select-none" style={{ backgroundColor }}>
      <CanvasTexture texture={fixedConfig.backgroundTexture || "canvas"} mode="dark" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(circle at center, ${accentColor}22 0%, transparent 70%)` }}
      />
      <FloatingEmojiField emojis={fixedConfig.emojiDecor || []} />

      {/* ── Phase 1: closed envelope, filling most of the viewport ── */}
      {!opened && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
          onClick={handleOpen}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleOpen()}
          aria-label="Tap to open the envelope"
        >
          <p
            ref={hintRef}
            className="absolute top-[12%] text-center font-mono text-xs sm:text-sm tracking-[0.25em] uppercase px-4"
            style={{ color: `${accentColor}99` }}
          >
            something is waiting for {recipientName}
          </p>

          <div ref={envelopeGroupRef} className="relative w-[86vw] max-w-[620px] aspect-[3/2] sm:aspect-[16/10]">
            <div ref={envelopeRef} className="relative w-full h-full">
              {/* Envelope body — vintage kraft paper */}
              <div
                className="absolute inset-0 rounded-2xl shadow-2xl shadow-black/60 border overflow-hidden"
                style={{ background: `linear-gradient(160deg, ${paperColor}, #e6d3ac)`, borderColor: "rgba(120,90,50,0.35)" }}
              >
                <CanvasTexture texture="paper-grain" mode="light" />
              </div>
              <div className="absolute inset-x-6 bottom-5 h-10 bg-black/10 rounded-b-xl blur-md" />

              {/* Postage stamp corner + doodle, for scrapbook flavor */}
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 opacity-90">
                <Stamp color={shade(accentColor, -10)} size={52} rotate={8} label="♥" />
              </div>
              <DoodleHeart color={accentColor} size={20} rotate={-12} className="absolute bottom-8 left-6 opacity-70" />

              {/* Flap */}
              <div
                ref={flapRef}
                className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden pointer-events-none"
                style={{ transformOrigin: "top center", transformStyle: "preserve-3d" }}
              >
                <div
                  className="w-full h-full border-b"
                  style={{
                    background: `linear-gradient(180deg, #ede0c0, ${paperColor})`,
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                    borderColor: "rgba(120,90,50,0.3)",
                  }}
                />
              </div>

              {/* Wax seal */}
              <div
                ref={sealRef}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-lg flex items-center justify-center z-10"
                style={{ background: `linear-gradient(135deg, ${accentColor}, #7f1d1d)`, boxShadow: `0 10px 20px -5px ${accentColor}66` }}
              >
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full border-2 border-rose-100/40 flex items-center justify-center">
                  <span className="text-rose-50 text-2xl sm:text-3xl font-serif">♡</span>
                </div>
              </div>
            </div>
          </div>

          <p className="absolute bottom-16 text-center font-mono text-[10px] tracking-[0.2em] uppercase text-white/25 animate-pulse">
            tap to open
          </p>
        </div>
      )}

      {/* ── Phase 2: the letter grows out of the envelope to fill the whole screen ── */}
      {opened && (
        <div
          ref={letterPanelRef}
          className="absolute inset-0 flex items-center justify-center cursor-pointer overflow-hidden"
          style={{ background: `linear-gradient(160deg, ${paperColor}, #ecdcb8)` }}
          onClick={handleContinue}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleContinue()}
          aria-label="Tap to continue"
        >
          <CanvasTexture texture="paper-grain" mode="light" />

          <WashiTape color={accentColor} rotate={-6} width={110} className="absolute top-6 left-8 sm:top-10 sm:left-14" />
          <WashiTape color="#fde68a" rotate={8} width={90} className="absolute bottom-10 right-10 sm:bottom-16 sm:right-20" />
          <Stamp color={shade(accentColor, -15)} size={64} rotate={-10} label="♥" className="absolute top-8 right-8 sm:top-12 sm:right-14" />
          <DoodleStar color={accentColor} size={26} rotate={12} className="absolute bottom-24 left-10 opacity-80" />
          <DoodleHeart color={accentColor} size={22} rotate={-14} className="absolute top-1/3 left-6 opacity-60 hidden sm:block" />

          <div ref={letterContentRef} className="relative z-10 text-center max-w-xl px-8 space-y-5">
            <p className="text-xs sm:text-sm font-mono tracking-[0.3em] uppercase" style={{ color: `${shade(accentColor, -20)}cc` }}>
              for {recipientName}
            </p>
            <h1
              className={`text-4xl sm:text-6xl md:text-7xl leading-tight ${getFontClassName(fixedConfig.fontId || "dancing-script")}`}
              style={{ color: shade(accentColor, -30) }}
            >
              Open with love
            </h1>
            <p className="text-base sm:text-xl text-stone-700 leading-relaxed font-serif italic max-w-md mx-auto">
              {openingNote}
            </p>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
            <TapToAdvanceCue accentColor={shade(accentColor, -20)} isLight />
          </div>
        </div>
      )}
    </div>
  );
}
