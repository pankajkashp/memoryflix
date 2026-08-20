"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Wand2, Heart, Star } from "lucide-react";
import { FixedPageConfig } from "@/lib/pageAnimations";
import CanvasTexture from "./CanvasTexture";
import TapToAdvanceCue from "./TapToAdvanceCue";

export interface ScratchRevealPageData {
  title?: string;
  subtitle?: string;
  secretMessage?: string;
  sender?: string;
  tagline?: string;
  photoUrl?: string;
  // Fallbacks from generic fields
  notificationTitle?: string;
  notificationText?: string;
}

export interface ScratchRevealPageProps {
  fixedConfig?: FixedPageConfig;
  data: ScratchRevealPageData;
  isActive?: boolean;
  isExiting?: boolean;
}

export default function ScratchRevealPage({
  fixedConfig = {},
  data,
  isActive = true,
  isExiting = false,
}: ScratchRevealPageProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const [isScratching, setIsScratching] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isRevealedRef = useRef(false);

  const {
    backgroundColor = "#FFD6E8",
    textColor = "#2A0E1C",
    accentColor = "#f43f5e",
    accentTextColor = "#e11d48",
    cardBg = "rgba(255, 255, 255, 0.96)",
  } = fixedConfig;

  const isLightBg =
    fixedConfig.mode === "light" ||
    (backgroundColor.startsWith("#") &&
      ["#f", "#e"].some((prefix) => backgroundColor.toLowerCase().startsWith(prefix)));

  const titleText =
    data.title || data.notificationTitle || "A Secret Story For You 💖";
  const subtitleText =
    data.subtitle || data.tagline || "Someone created a mystery just for you";
  const messageText =
    data.secretMessage ||
    data.notificationText ||
    "Every great memory begins with a spark.\nUnfold the surprises waiting for you inside!";
  const senderText = data.sender || "MemoryFlix Surprise 🎁";

  // Trigger full reveal with celebratory particle burst
  const triggerReveal = useCallback(() => {
    if (isRevealedRef.current) return;
    isRevealedRef.current = true;
    setIsRevealed(true);
  }, []);

  // Initialize and draw metallic rose-gold foil canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    if (width === 0 || height === 0) return;

    canvas.width = width;
    canvas.height = height;

    // Draw luxury metallic rose-gold / silver gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#FCE7F3"); // Soft rose
    grad.addColorStop(0.2, "#F472B6"); // Rose gold mid
    grad.addColorStop(0.4, "#FDE047"); // Gold shimmer highlight
    grad.addColorStop(0.6, "#FB7185"); // Coral rose
    grad.addColorStop(0.85, "#E879F9"); // Lilac glow
    grad.addColorStop(1, "#FDA4AF"); // Soft blush

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Add metallic foil glitter pattern
    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    for (let i = 0; i < 400; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const r = Math.random() * 2.2 + 0.6;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add decorative diagonal holographic shimmer lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 1.5;
    for (let x = -height; x < width + height; x += 36) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + height, height);
      ctx.stroke();
    }
  }, [isRevealed]);

  // Scratch handler on canvas
  const handleScratch = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas || isRevealedRef.current) return;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Erase circle where user touched/dragged
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 32, 0, Math.PI * 2);
      ctx.fill();

      // Check scratched percentage approximately every few scratches
      if (Math.random() > 0.4) {
        try {
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imgData.data;
          let transparentCount = 0;
          const sampleStep = 32; // Sample every 32nd pixel for instant performance
          const totalSampled = pixels.length / (4 * sampleStep);

          for (let i = 3; i < pixels.length; i += 4 * sampleStep) {
            if (pixels[i] < 128) transparentCount++;
          }

          const percent = Math.round((transparentCount / totalSampled) * 100);
          setScratchPercent(percent);

          // Once 24% is scratched off, burst the remaining foil away!
          if (percent > 24) {
            triggerReveal();
          }
        } catch {
          // Fallback if image data sampling is blocked
          triggerReveal();
        }
      }
    },
    [triggerReveal]
  );

  // Mouse & Touch events
  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsScratching(true);
    handleScratch(e.clientX, e.clientY);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isScratching) return;
    handleScratch(e.clientX, e.clientY);
  };

  const onMouseUp = () => setIsScratching(false);

  const onTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length > 0) {
      setIsScratching(true);
      handleScratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const onTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length > 0) {
      handleScratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const onTouchEnd = () => setIsScratching(false);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[100dvh] flex flex-col items-center justify-between p-4 sm:p-8 md:p-12 overflow-hidden select-none"
      style={{ backgroundColor }}
    >
      {/* ── 1. Atmospheric Texture & Lighting ── */}
      <CanvasTexture
        texture={fixedConfig.backgroundTexture || "paper-grain"}
        mode={isLightBg ? "light" : "dark"}
      />

      {/* Radiant Background Ambient Glows */}
      <div
        className="absolute w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] rounded-full blur-[140px] pointer-events-none opacity-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          background: `radial-gradient(circle, ${accentColor} 0%, #f472b6 40%, transparent 70%)`,
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none opacity-30 top-10 right-10"
        style={{ backgroundColor: "#FDE047" }}
      />

      {/* ── 2. Top Header / Prompt Badge ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="pt-4 sm:pt-8 text-center space-y-2 z-10 max-w-lg mx-auto px-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-pink-300/70 shadow-sm text-xs font-bold uppercase tracking-wider text-rose-600">
          <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-spin" style={{ animationDuration: "6s" }} />
          <span>Secret Opener</span>
        </div>

        <h1
          className="text-2xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight leading-tight select-none"
          style={{
            color: isLightBg ? "#e11d48" : "#f472b6",
            background: isLightBg
              ? "linear-gradient(135deg, #be123c 0%, #ec4899 50%, #f43f5e 100%)"
              : "linear-gradient(135deg, #f472b6 0%, #fb7185 50%, #fda4af 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: isLightBg
              ? "drop-shadow(0 0 16px rgba(236, 72, 153, 0.45)) drop-shadow(0 0 35px rgba(244, 63, 94, 0.25))"
              : "drop-shadow(0 0 20px rgba(244, 63, 94, 0.6)) drop-shadow(0 0 40px rgba(236, 72, 153, 0.35))",
          }}
        >
          {subtitleText}
        </h1>
      </motion.div>

      {/* ── 3. Interactive Scratch / Foil Card ── */}
      <div className="w-full max-w-md sm:max-w-lg mx-auto my-auto py-4 z-10 px-2 flex flex-col items-center">
        <div
          className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-3xl sm:rounded-[2rem] overflow-hidden shadow-2xl transition-transform duration-300"
          style={{
            boxShadow:
              "0 25px 50px -12px rgba(244, 63, 94, 0.25), 0 12px 24px -6px rgba(0, 0, 0, 0.15)",
          }}
        >
          {/* Revealed Secret Card Layer (Base) */}
          <div
            className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between items-center text-center rounded-3xl sm:rounded-[2rem] border-2 border-pink-200/90"
            style={{
              backgroundColor: cardBg,
            }}
          >
            {/* Subtle paper grain on card */}
            <CanvasTexture texture="paper-grain" mode="light" className="opacity-20 rounded-3xl" />

            {/* Header / Stamp */}
            <div className="w-full flex items-center justify-between border-b border-pink-100 pb-3">
              <div className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-rose-600">
                  {senderText}
                </span>
              </div>
              <span className="text-xs font-serif italic text-stone-500">
                Chapter 1
              </span>
            </div>

            {/* Main Revealed Content */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={isRevealed ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0.8 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="my-auto py-2 space-y-3"
            >
              <h2
                className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-stone-900 drop-shadow-sm"
                style={{
                  color: isLightBg ? "#e11d48" : "#f472b6",
                  background: isLightBg
                    ? "linear-gradient(135deg, #be123c 0%, #ec4899 50%, #f43f5e 100%)"
                    : "linear-gradient(135deg, #f472b6 0%, #fb7185 50%, #fda4af 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 12px rgba(236, 72, 153, 0.35))",
                }}
              >
                {titleText}
              </h2>

              <p
                className="text-sm sm:text-base md:text-lg font-medium leading-relaxed text-stone-700 whitespace-pre-line max-w-sm mx-auto"
                style={{ color: isLightBg ? "#4A1528" : "#d4d4d8" }}
              >
                {messageText}
              </p>
            </motion.div>

            {/* Optional Photo or celebratory badge */}
            {data.photoUrl ? (
              <div className="relative w-full h-24 sm:h-28 rounded-xl overflow-hidden shadow-inner border border-pink-100">
                <Image
                  src={data.photoUrl}
                  alt="Secret memory preview"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-full flex items-center justify-center gap-2 pt-2 border-t border-pink-100/80">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold text-stone-600 font-sans tracking-wide">
                  Your special story begins now
                </span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
            )}
          </div>

          {/* Foil Layer (Canvas + Overlay that animates/shatters away) */}
          <AnimatePresence>
            {!isRevealed && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{
                  opacity: 0,
                  scale: 1.08,
                  filter: "blur(8px)",
                  transition: { duration: 0.55, ease: [0.34, 1.56, 0.64, 1] },
                }}
                className="absolute inset-0 cursor-pointer touch-none z-20 flex flex-col items-center justify-center select-none"
                onClick={triggerReveal}
              >
                {/* The Scratchable HTML5 Canvas */}
                <canvas
                  ref={canvasRef}
                  onMouseDown={onMouseDown}
                  onMouseMove={onMouseMove}
                  onMouseUp={onMouseUp}
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                  className="absolute inset-0 w-full h-full"
                />

                {/* Floating Foil Guidance Overlay */}
                <motion.div
                  animate={{ y: [0, -5, 0], scale: [1, 1.02, 1] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                  className="relative z-10 pointer-events-none flex flex-col items-center gap-3 px-6 py-4 rounded-2xl bg-black/25 backdrop-blur-md border border-white/40 shadow-xl text-white"
                >
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shadow-inner border border-white/40">
                    <Wand2 className="w-6 h-6 text-amber-300 animate-pulse" />
                  </div>

                  <div className="text-center space-y-1">
                    <p className="text-base sm:text-lg font-bold font-serif tracking-wide text-white drop-shadow-md">
                      Scratch to Reveal ✨
                    </p>
                    <p className="text-xs text-white/90 font-medium">
                      Drag or tap anywhere to uncover
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Celebratory Sparkle Burst on Reveal */}
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0], scale: [0.8, 1.3, 1.5] }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute pointer-events-none z-30"
          >
            <div className="flex gap-4">
              <Star className="w-8 h-8 text-amber-400 fill-amber-400 drop-shadow-lg" />
              <Heart className="w-10 h-10 text-rose-500 fill-rose-500 drop-shadow-lg" />
              <Sparkles className="w-8 h-8 text-pink-400 fill-pink-400 drop-shadow-lg" />
            </div>
          </motion.div>
        )}
      </div>

      {/* ── 4. Bottom Advance Cue ── */}
      <div className="pb-4 relative z-20 min-h-[44px] flex items-center justify-center">
        {isRevealed ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <TapToAdvanceCue
              label="Tap anywhere to start story"
              accentColor={accentTextColor}
              isLight={isLightBg}
            />
          </motion.div>
        ) : (
          <p className="text-xs sm:text-sm font-medium tracking-wide text-rose-950/70">
            {scratchPercent > 0 ? `Scratched ${scratchPercent}%` : "Tap or scratch the card above"}
          </p>
        )}
      </div>
    </div>
  );
}
