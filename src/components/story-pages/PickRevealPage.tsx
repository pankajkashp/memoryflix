"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";
import { FixedPageConfig } from "@/lib/pageAnimations";
import CanvasTexture from "./CanvasTexture";
import TapToAdvanceCue from "./TapToAdvanceCue";

export interface PickRevealOption {
  characterKey?: string;
  label?: string;
  revealText: string;
  revealPhotoUrl?: string;
}

export interface PickRevealPageData {
  prompt?: string;
  options?: PickRevealOption[];
  // Support flattened fields from template blueprints
  option1Text?: string;
  option1Photo?: string;
  option2Text?: string;
  option2Photo?: string;
  option3Text?: string;
  option3Photo?: string;
}

export interface PickRevealPageProps {
  fixedConfig?: FixedPageConfig;
  data: PickRevealPageData;
  isActive?: boolean;
  isExiting?: boolean;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Illustration Components: 3 Bears (Flat, Cute, Vector SVG)
───────────────────────────────────────────────────────────────────────────── */
function HoneyBearSvg({ isSelected, isRevealed }: { isSelected: boolean; isRevealed: boolean }) {
  return (
    <svg viewBox="0 0 160 180" className="w-full h-full drop-shadow-md select-none transition-transform duration-300">
      {/* Ears */}
      <circle cx="45" cy="50" r="22" fill="#E0A96D" />
      <circle cx="45" cy="50" r="13" fill="#FCEADE" />
      <circle cx="115" cy="50" r="22" fill="#E0A96D" />
      <circle cx="115" cy="50" r="13" fill="#FCEADE" />

      {/* Body */}
      <ellipse cx="80" cy="125" rx="46" ry="42" fill="#D49B5A" />
      <ellipse cx="80" cy="130" rx="30" ry="26" fill="#FBF3E8" />

      {/* Head */}
      <circle cx="80" cy="82" r="46" fill="#E0A96D" />

      {/* Cheeks Blush */}
      <ellipse cx="50" cy="94" rx="9" ry="6" fill="#FFAAA6" opacity="0.65" />
      <ellipse cx="110" cy="94" rx="9" ry="6" fill="#FFAAA6" opacity="0.65" />

      {/* Snout */}
      <ellipse cx="80" cy="95" rx="20" ry="14" fill="#FCEADE" />
      <path d="M74 90 Q80 94 86 90 Q80 98 74 90 Z" fill="#5C3D2E" />
      <path d="M80 95 L80 101" stroke="#5C3D2E" strokeWidth="2" strokeLinecap="round" />
      <path d="M75 101 Q80 105 85 101" stroke="#5C3D2E" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Eyes */}
      <circle cx="62" cy="78" r="4.5" fill="#382218" />
      <circle cx="63.5" cy="76.5" r="1.5" fill="#FFFFFF" />
      <circle cx="98" cy="78" r="4.5" fill="#382218" />
      <circle cx="99.5" cy="76.5" r="1.5" fill="#FFFFFF" />

      {/* Holding Envelope / Note */}
      {!isRevealed && (
        <g className="transition-all duration-300">
          <rect x="48" y="115" width="64" height="42" rx="6" fill="#FFF5EB" stroke="#E5BA8F" strokeWidth="2" />
          <path d="M48 116 L80 136 L112 116" stroke="#E5BA8F" strokeWidth="2" fill="none" />
          <circle cx="80" cy="134" r="5.5" fill="#F43F5E" />
          {/* Paws */}
          <circle cx="48" cy="134" r="10" fill="#E0A96D" />
          <circle cx="112" cy="134" r="10" fill="#E0A96D" />
        </g>
      )}
    </svg>
  );
}

function BrownBearSvg({ isSelected, isRevealed }: { isSelected: boolean; isRevealed: boolean }) {
  return (
    <svg viewBox="0 0 160 180" className="w-full h-full drop-shadow-md select-none transition-transform duration-300">
      {/* Ears */}
      <circle cx="44" cy="48" r="22" fill="#8B5A2B" />
      <circle cx="44" cy="48" r="13" fill="#D2B48C" />
      <circle cx="116" cy="48" r="22" fill="#8B5A2B" />
      <circle cx="116" cy="48" r="13" fill="#D2B48C" />

      {/* Body */}
      <ellipse cx="80" cy="125" rx="46" ry="42" fill="#7A4D23" />
      <ellipse cx="80" cy="130" rx="28" ry="25" fill="#D2B48C" opacity="0.6" />

      {/* Head */}
      <circle cx="80" cy="82" r="46" fill="#8B5A2B" />

      {/* Cheeks Blush */}
      <ellipse cx="48" cy="94" rx="9" ry="6" fill="#FF8A80" opacity="0.6" />
      <ellipse cx="112" cy="94" rx="9" ry="6" fill="#FF8A80" opacity="0.6" />

      {/* Snout */}
      <ellipse cx="80" cy="95" rx="20" ry="14" fill="#E8D8C8" />
      <ellipse cx="80" cy="91" rx="6" ry="4" fill="#3D2314" />
      <path d="M80 94 L80 100" stroke="#3D2314" strokeWidth="2" strokeLinecap="round" />
      <path d="M74 100 Q80 104 86 100" stroke="#3D2314" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Cute Winking/Happy Eyes */}
      <path d="M57 79 Q62 73 67 79" stroke="#3D2314" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="97" cy="77" r="4.5" fill="#3D2314" />
      <circle cx="98.5" cy="75.5" r="1.5" fill="#FFFFFF" />

      {/* Holding Envelope / Note */}
      {!isRevealed && (
        <g className="transition-all duration-300">
          <rect x="48" y="115" width="64" height="42" rx="6" fill="#FFF0F5" stroke="#E8B4B8" strokeWidth="2" />
          <path d="M48 116 L80 136 L112 116" stroke="#E8B4B8" strokeWidth="2" fill="none" />
          <circle cx="80" cy="134" r="5.5" fill="#EC4899" />
          {/* Paws */}
          <circle cx="48" cy="134" r="10" fill="#8B5A2B" />
          <circle cx="112" cy="134" r="10" fill="#8B5A2B" />
        </g>
      )}
    </svg>
  );
}

function PandaPolarBearSvg({ isSelected, isRevealed }: { isSelected: boolean; isRevealed: boolean }) {
  return (
    <svg viewBox="0 0 160 180" className="w-full h-full drop-shadow-md select-none transition-transform duration-300">
      {/* Ears */}
      <circle cx="44" cy="48" r="22" fill="#F4EDE4" stroke="#E2D6C5" strokeWidth="2" />
      <circle cx="44" cy="48" r="13" fill="#FFCCD5" />
      <circle cx="116" cy="48" r="22" fill="#F4EDE4" stroke="#E2D6C5" strokeWidth="2" />
      <circle cx="116" cy="48" r="13" fill="#FFCCD5" />

      {/* Body */}
      <ellipse cx="80" cy="125" rx="46" ry="42" fill="#EDE4D8" />
      <ellipse cx="80" cy="130" rx="30" ry="26" fill="#FFFFFF" />

      {/* Head */}
      <circle cx="80" cy="82" r="46" fill="#FDF8F2" stroke="#E8DED1" strokeWidth="1.5" />

      {/* Cheeks Blush */}
      <ellipse cx="49" cy="94" rx="9" ry="6" fill="#FF9EAA" opacity="0.7" />
      <ellipse cx="111" cy="94" rx="9" ry="6" fill="#FF9EAA" opacity="0.7" />

      {/* Snout */}
      <ellipse cx="80" cy="95" rx="19" ry="13" fill="#FFFFFF" />
      <ellipse cx="80" cy="91" rx="5.5" ry="3.5" fill="#4A3E3D" />
      <path d="M80 94 L80 100" stroke="#4A3E3D" strokeWidth="2" strokeLinecap="round" />
      <path d="M75 100 Q80 103 85 100" stroke="#4A3E3D" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Eyes */}
      <circle cx="61" cy="78" r="4.5" fill="#3D2E2B" />
      <circle cx="62.5" cy="76.5" r="1.5" fill="#FFFFFF" />
      <circle cx="99" cy="78" r="4.5" fill="#3D2E2B" />
      <circle cx="100.5" cy="76.5" r="1.5" fill="#FFFFFF" />

      {/* Holding Envelope / Note */}
      {!isRevealed && (
        <g className="transition-all duration-300">
          <rect x="48" y="115" width="64" height="42" rx="6" fill="#FFF9E6" stroke="#E6D29E" strokeWidth="2" />
          <path d="M48 116 L80 136 L112 116" stroke="#E6D29E" strokeWidth="2" fill="none" />
          <circle cx="80" cy="134" r="5.5" fill="#F59E0B" />
          {/* Paws */}
          <circle cx="48" cy="134" r="10" fill="#F4EDE4" stroke="#E2D6C5" strokeWidth="1" />
          <circle cx="112" cy="134" r="10" fill="#F4EDE4" stroke="#E2D6C5" strokeWidth="1" />
        </g>
      )}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Illustration Components: 3 Message Bottles (Flat, Elegant Vector SVG)
───────────────────────────────────────────────────────────────────────────── */
function RoseBottleSvg({ isSelected, isRevealed }: { isSelected: boolean; isRevealed: boolean }) {
  return (
    <svg viewBox="0 0 140 200" className="w-full h-full drop-shadow-md select-none transition-transform duration-300">
      {/* Cork Stopper */}
      <path d="M60 25 L80 25 L78 40 L62 40 Z" fill="#C89666" />
      <path d="M58 24 L82 24 L80 28 L60 28 Z" fill="#DFB186" />

      {/* Bottle Neck & Lip */}
      <rect x="56" y="38" width="28" height="6" rx="2" fill="#E8829C" />
      <path d="M62 44 L78 44 L84 75 L56 75 Z" fill="#F8B4C4" fillOpacity="0.85" />

      {/* Bottle Body */}
      <path
        d="M56 75 C40 85 30 105 30 135 C30 170 45 185 70 185 C95 185 110 170 110 135 C110 105 100 85 84 75 Z"
        fill="url(#roseBottleGrad)"
      />

      {/* Twine / Ribbon around neck */}
      <rect x="58" y="52" width="24" height="4" rx="1" fill="#FFCCD5" />
      <circle cx="70" cy="58" r="3" fill="#F43F5E" />

      {/* Rolled Message Scroll Inside (Visible before reveal) */}
      {!isRevealed && (
        <g>
          <rect x="55" y="105" width="30" height="55" rx="4" fill="#FFF8E7" stroke="#E6D3A3" strokeWidth="1.5" />
          <line x1="60" y1="120" x2="80" y2="120" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="2 2" />
          <line x1="60" y1="132" x2="80" y2="132" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="2 2" />
          <line x1="60" y1="144" x2="75" y2="144" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="2 2" />
          <circle cx="70" cy="132" r="4" fill="#F43F5E" />
        </g>
      )}

      {/* Glass Highlights */}
      <path
        d="M42 110 C38 125 38 145 42 165"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      <circle cx="95" cy="155" r="3" fill="#FFFFFF" opacity="0.5" />

      <defs>
        <linearGradient id="roseBottleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFAEC0" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#F472B6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FB7185" stopOpacity="0.85" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function AmberBottleSvg({ isSelected, isRevealed }: { isSelected: boolean; isRevealed: boolean }) {
  return (
    <svg viewBox="0 0 140 200" className="w-full h-full drop-shadow-md select-none transition-transform duration-300">
      {/* Cork Stopper */}
      <path d="M59 23 L81 23 L79 38 L61 38 Z" fill="#B57B48" />

      {/* Bottle Neck & Lip */}
      <rect x="55" y="36" width="30" height="6" rx="2" fill="#D97706" />
      <path d="M62 42 L78 42 L85 70 L55 70 Z" fill="#FBBF24" fillOpacity="0.8" />

      {/* Bottle Body */}
      <path
        d="M55 70 C38 82 28 100 28 135 C28 172 45 186 70 186 C95 186 112 172 112 135 C112 100 102 82 85 70 Z"
        fill="url(#amberBottleGrad)"
      />

      {/* Twine */}
      <rect x="58" y="50" width="24" height="3.5" rx="1" fill="#78350F" opacity="0.6" />

      {/* Rolled Scroll inside */}
      {!isRevealed && (
        <g>
          <rect x="55" y="102" width="30" height="56" rx="4" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
          <line x1="60" y1="118" x2="80" y2="118" stroke="#D97706" strokeWidth="1.5" strokeDasharray="2 2" />
          <line x1="60" y1="130" x2="80" y2="130" stroke="#D97706" strokeWidth="1.5" strokeDasharray="2 2" />
          <circle cx="70" cy="130" r="4" fill="#D97706" />
        </g>
      )}

      {/* Highlights */}
      <path
        d="M40 108 C36 125 36 148 40 166"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.65"
      />

      <defs>
        <linearGradient id="amberBottleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#D97706" stopOpacity="0.9" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function TealBottleSvg({ isSelected, isRevealed }: { isSelected: boolean; isRevealed: boolean }) {
  return (
    <svg viewBox="0 0 140 200" className="w-full h-full drop-shadow-md select-none transition-transform duration-300">
      {/* Cork Stopper */}
      <path d="M59 23 L81 23 L79 38 L61 38 Z" fill="#A16207" />

      {/* Bottle Neck & Lip */}
      <rect x="55" y="36" width="30" height="6" rx="2" fill="#0D9488" />
      <path d="M62 42 L78 42 L84 72 L56 72 Z" fill="#5EEAD4" fillOpacity="0.8" />

      {/* Bottle Body */}
      <path
        d="M56 72 C38 84 28 102 28 135 C28 172 45 186 70 186 C95 186 112 172 112 135 C112 102 102 84 84 72 Z"
        fill="url(#tealBottleGrad)"
      />

      {/* Rolled Scroll inside */}
      {!isRevealed && (
        <g>
          <rect x="55" y="102" width="30" height="56" rx="4" fill="#F0FDFA" stroke="#2DD4BF" strokeWidth="1.5" />
          <line x1="60" y1="118" x2="80" y2="118" stroke="#0D9488" strokeWidth="1.5" strokeDasharray="2 2" />
          <line x1="60" y1="130" x2="80" y2="130" stroke="#0D9488" strokeWidth="1.5" strokeDasharray="2 2" />
          <circle cx="70" cy="130" r="4" fill="#0D9488" />
        </g>
      )}

      {/* Highlights */}
      <path
        d="M40 108 C36 125 36 148 40 166"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.65"
      />

      <defs>
        <linearGradient id="tealBottleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#99F6E4" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#2DD4BF" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#0D9488" stopOpacity="0.9" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main PickRevealPage Component
───────────────────────────────────────────────────────────────────────────── */
export default function PickRevealPage({
  fixedConfig = {},
  data,
  isActive = true,
  isExiting = false,
}: PickRevealPageProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const characterSet = fixedConfig.characterSet || "bears"; // "bears" | "bottles"
  const isBottles = characterSet === "bottles";

  const {
    backgroundColor = "#FAF7F2", // Cream/Beige light base
    textColor = "#292524", // Warm stone dark text
    accentColor = isBottles ? "#0d9488" : "#f43f5e", // Soft rose or teal
    accentTextColor = isBottles ? "#0f766e" : "#e11d48",
    cardBg = "rgba(255, 255, 255, 0.95)",
    backgroundTexture = "paper-grain",
  } = fixedConfig;

  // Format options array from raw data or explicit options
  const options: PickRevealOption[] = data.options || [
    {
      characterKey: isBottles ? "bottle1" : "bear1",
      label: isBottles ? "Rose Bottle" : "Honey Bear",
      revealText: data.option1Text || "You bring so much warmth into my everyday life ✨",
      revealPhotoUrl: data.option1Photo || "/1.png",
    },
    {
      characterKey: isBottles ? "bottle2" : "bear2",
      label: isBottles ? "Amber Flask" : "Teddy Bear",
      revealText: data.option2Text || "Remember that spontaneous road trip? Best day ever 🚙",
      revealPhotoUrl: data.option2Photo || "/2.png",
    },
    {
      characterKey: isBottles ? "bottle3" : "bear3",
      label: isBottles ? "Teal Decanter" : "Polar Bear",
      revealText: data.option3Text || "No matter what happens, I've always got your back ❤️",
      revealPhotoUrl: data.option3Photo || "/3.png",
    },
  ];

  const defaultPrompt = isBottles
    ? "Pick a bottle to uncork its secret 🍾"
    : "Pick one to open 🐻";
  const promptText = data.prompt || defaultPrompt;

  // Reset selection on inactive or data reset
  useEffect(() => {
    if (!isActive) {
      setSelectedIndex(null);
      setIsRevealed(false);
    }
  }, [isActive]);

  const handleSelect = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid accidental immediate advance
    setSelectedIndex(idx);
    setIsRevealed(true);
  };

  const selectedOption = selectedIndex !== null ? options[selectedIndex] : null;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[100dvh] flex flex-col items-center justify-between p-4 sm:p-8 md:p-12 overflow-hidden select-none cursor-pointer"
      style={{ backgroundColor }}
    >
      {/* ── 1. Textured Canvas Background (Light Mode Paper Grain) ── */}
      <CanvasTexture texture={backgroundTexture} mode="light" />

      {/* ── 2. Ambient Lighting Glow ── */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-20 -top-24 -left-20"
        style={{ backgroundColor: accentColor }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-15 -bottom-24 -right-20"
        style={{ backgroundColor: isBottles ? "#38bdf8" : "#fbbf24" }}
      />

      {/* ── 3. Header / Prompt Area ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="pt-8 sm:pt-12 text-center space-y-2 z-10 max-w-xl mx-auto px-4"
      >
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-semibold uppercase tracking-wider text-rose-700">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Choice</span>
        </div>

        <h1
          className="text-2xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight leading-tight select-none"
          style={{
            color: "#e11d48",
            background: "linear-gradient(135deg, #be123c 0%, #ec4899 50%, #f43f5e 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 16px rgba(236, 72, 153, 0.45)) drop-shadow(0 0 35px rgba(244, 63, 94, 0.25))",
          }}
        >
          {promptText}
        </h1>

        <p className="text-xs sm:text-sm font-sans font-medium text-stone-700">
          {isRevealed
            ? "Your secret note has been revealed below!"
            : "Tap any character to unfold what's inside"}
        </p>
      </motion.div>

      {/* ── 4. Main Character Selection & Reveal Stage ── */}
      <div className="w-full max-w-4xl mx-auto my-auto py-4 flex flex-col items-center justify-center z-10">
        {/* Row of 3 Characters */}
        <div className="flex items-end justify-center gap-3 sm:gap-6 md:gap-10 w-full px-2 sm:px-4">
          {options.slice(0, 3).map((opt, idx) => {
            const isSelected = selectedIndex === idx;
            const isOther = selectedIndex !== null && !isSelected;

            return (
              <motion.div
                key={idx}
                onClick={(e) => handleSelect(idx, e)}
                whileHover={!isRevealed ? { scale: 1.08, y: -6 } : { scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                animate={{
                  opacity: isOther ? 0.35 : 1,
                  scale: isOther ? 0.9 : isSelected ? 1.06 : 1,
                  y: isSelected ? -8 : isOther ? 8 : 0,
                }}
                transition={{
                  duration: 0.45,
                  ease: [0.34, 1.56, 0.64, 1], // Gentle spring bounce
                }}
                className={`relative flex flex-col items-center cursor-pointer transition-all duration-300 ${
                  isSelected ? "z-30 drop-shadow-xl" : "z-10"
                }`}
                style={{ width: "min(28vw, 150px)" }}
              >
                {/* Character SVG Rendering */}
                <div className="relative w-full aspect-[4/5] flex items-center justify-center">
                  {characterSet === "bears" ? (
                    idx === 0 ? (
                      <HoneyBearSvg isSelected={isSelected} isRevealed={isSelected && isRevealed} />
                    ) : idx === 1 ? (
                      <BrownBearSvg isSelected={isSelected} isRevealed={isSelected && isRevealed} />
                    ) : (
                      <PandaPolarBearSvg isSelected={isSelected} isRevealed={isSelected && isRevealed} />
                    )
                  ) : (
                    idx === 0 ? (
                      <RoseBottleSvg isSelected={isSelected} isRevealed={isSelected && isRevealed} />
                    ) : idx === 1 ? (
                      <AmberBottleSvg isSelected={isSelected} isRevealed={isSelected && isRevealed} />
                    ) : (
                      <TealBottleSvg isSelected={isSelected} isRevealed={isSelected && isRevealed} />
                    )
                  )}
                </div>

                {/* Subtle pulse indicator on hover if not yet selected */}
                {!isRevealed && (
                  <motion.span
                    animate={{ y: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut", delay: idx * 0.2 }}
                    className="mt-1 text-[11px] font-mono font-medium text-stone-500 bg-white/80 border border-stone-200/80 px-2 py-0.5 rounded-full shadow-sm"
                  >
                    Tap me ✨
                  </motion.span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* ── 5. Revealed Content Card (Unfolds for Bear / Unrolls for Bottle) ── */}
        <AnimatePresence mode="wait">
          {isRevealed && selectedOption && (
            <motion.div
              key={`reveal-${selectedIndex}`}
              // Bear: Unfold bounce (scale + rotateX) | Bottle: Glide up + spin unroll
              initial={
                isBottles
                  ? { opacity: 0, y: 35, scale: 0.88, rotate: -4 }
                  : { opacity: 0, y: 25, scale: 0.85, rotateX: -25 }
              }
              animate={
                isBottles
                  ? { opacity: 1, y: 0, scale: 1, rotate: 0 }
                  : { opacity: 1, y: 0, scale: 1, rotateX: 0 }
              }
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{
                duration: 0.65,
                ease: [0.34, 1.56, 0.64, 1], // back.out bounce
              }}
              className="mt-6 w-full max-w-lg mx-auto p-5 sm:p-7 rounded-3xl backdrop-blur-xl border-2 border-stone-200/80 shadow-2xl relative overflow-hidden"
              style={{
                backgroundColor: cardBg,
                boxShadow: `0 20px 40px -10px rgba(120, 90, 70, 0.15), 0 0 25px -5px ${accentColor}25`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Paper Texture Overlay */}
              <CanvasTexture texture="paper-grain" mode="light" className="opacity-25 rounded-3xl" />

              {/* Decorative Stamp / Crest */}
              <div className="flex items-center justify-between border-b border-stone-200/80 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span className="text-xs uppercase tracking-widest font-mono font-bold text-stone-500">
                    {isBottles ? "Message From The Sea" : "Secret Note"}
                  </span>
                </div>
                <span className="text-xs font-serif italic text-rose-600 font-medium">
                  {selectedOption.label || "Unlocked"}
                </span>
              </div>

              {/* Revealed Message (Handwritten / Script Feel) */}
              <div
                className="text-lg sm:text-xl md:text-2xl font-serif italic leading-relaxed text-stone-800 whitespace-pre-line text-center py-2"
                style={{ color: textColor }}
              >
                &ldquo;{selectedOption.revealText}&rdquo;
              </div>

              {/* Optional Photo Attachment */}
              {selectedOption.revealPhotoUrl && (
                <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden shadow-md border border-stone-200 mt-4 group">
                  <Image
                    src={selectedOption.revealPhotoUrl}
                    alt="Memory photo"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 500px"
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── 6. Bottom Tap to Advance Cue (Appears once revealed) ── */}
      <div className="pb-4 relative z-20 min-h-[44px] flex items-center justify-center">
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <TapToAdvanceCue
              label="Tap anywhere to continue"
              accentColor={accentTextColor}
              className="bg-stone-900/5 hover:bg-stone-900/10 border-stone-300/80 text-stone-800"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
