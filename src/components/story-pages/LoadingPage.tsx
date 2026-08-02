"use client";

import { useEffect, useRef, useState } from "react";
import { Award, Trophy, Sparkles, CheckCircle2 } from "lucide-react";
import { gsap } from "gsap";
import {
  ENTRANCE_DURATION,
  EXIT_DURATION,
  FixedPageConfig,
  REWARD_EASE,
  prefersReducedMotion,
} from "@/lib/pageAnimations";
import CanvasTexture from "./CanvasTexture";
import TapToAdvanceCue from "./TapToAdvanceCue";

export interface LoadingPageData {
  loadingLabel?: string;
  awardTitle?: string;
  rewardText: string;
  subtitle?: string;
}

export interface LoadingPageProps {
  fixedConfig?: FixedPageConfig;
  data: LoadingPageData;
  isActive?: boolean;
  isExiting?: boolean;
}

export default function LoadingPage({
  fixedConfig = {},
  data,
  isActive = true,
  isExiting = false,
}: LoadingPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadingPhaseRef = useRef<HTMLDivElement>(null);
  const rewardPhaseRef = useRef<HTMLDivElement>(null);
  const trophyRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const {
    backgroundColor = "#09090b",
    textColor = "#fafafa",
    accentColor = "#eab308",
    cardBg = "rgba(24, 24, 27, 0.9)",
  } = fixedConfig;

  // Loading bar animation
  useEffect(() => {
    if (!isActive) return;
    const reduced = prefersReducedMotion();

    setProgress(0);
    setIsCompleted(false);

    if (reduced) {
      setProgress(100);
      setIsCompleted(true);
      return;
    }

    const duration = 1600;
    const interval = 25;
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          setIsCompleted(true);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isActive]);

  // Entrance & transition animation
  useEffect(() => {
    if (!isActive) return;
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      // If completed, trigger big reward entrance
      if (isCompleted) {
        const tl = gsap.timeline();

        gsap.set(rewardPhaseRef.current, {
          opacity: 0,
          scale: reduced ? 1 : 0.85,
          y: reduced ? 0 : 25,
        });

        gsap.set(trophyRef.current, {
          scale: 0,
          rotation: reduced ? 0 : -20,
        });

        // Hide loading phase
        if (loadingPhaseRef.current) {
          gsap.to(loadingPhaseRef.current, {
            opacity: 0,
            duration: 0.3,
            display: "none",
          });
        }

        // Reveal reward
        tl.to(rewardPhaseRef.current, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: ENTRANCE_DURATION,
          ease: REWARD_EASE,
        });

        tl.to(
          trophyRef.current,
          {
            scale: 1,
            rotation: 0,
            duration: 0.7,
            ease: "elastic.out(1, 0.6)",
          },
          "-=0.4"
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isActive, isCompleted]);

  // Exit animation
  useEffect(() => {
    if (!isExiting || !containerRef.current) return;
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      gsap.to(rewardPhaseRef.current, {
        opacity: 0,
        scale: 0.95,
        y: reduced ? 0 : -20,
        duration: EXIT_DURATION,
        ease: "power2.in",
      });

      gsap.to(loadingPhaseRef.current, {
        opacity: 0,
        duration: 0.2,
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isExiting]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[100dvh] flex flex-col items-center justify-between p-6 sm:p-12 overflow-hidden select-none cursor-pointer"
      style={{ backgroundColor }}
    >
      {/* Textured Canvas Background */}
      <CanvasTexture texture={fixedConfig.backgroundTexture || "subtle-noise"} />

      {/* Background ambient lighting */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none opacity-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ backgroundColor: accentColor }}
      />

      <div className="w-full max-w-xl flex flex-col items-center z-10 my-auto">
        {/* PHASE 1: Loading bar directly on Canvas */}
        {!isCompleted && (
          <div
            ref={loadingPhaseRef}
            className="w-full flex flex-col items-center space-y-6 text-center"
          >
            {/* Spinning indicator */}
            <div className="relative w-16 h-16">
              <div
                className="absolute inset-0 rounded-full border-4 border-white/10 animate-spin"
                style={{ borderTopColor: accentColor }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-6 h-6" style={{ color: accentColor }} />
              </div>
            </div>

            {/* Loading Label */}
            <div className="space-y-1">
              <h3
                className="text-sm sm:text-base font-mono uppercase tracking-widest text-zinc-300 font-bold"
                style={{ color: textColor }}
              >
                {data.loadingLabel || "CALCULATING COMPATIBILITY..."}
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                Processing moments, laughs & memories...
              </p>
            </div>

            {/* Glowing Progress Bar */}
            <div className="w-full space-y-2">
              <div className="w-full h-3.5 rounded-full bg-white/10 overflow-hidden p-0.5 border border-white/15">
                <div
                  ref={progressBarRef}
                  className="h-full rounded-full transition-all duration-75 shadow-lg"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: accentColor,
                    boxShadow: `0 0 15px ${accentColor}`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs font-mono text-zinc-400 px-1">
                <span>0%</span>
                <span className="font-bold text-white">{Math.round(progress)}%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        )}

        {/* PHASE 2: Reward / Trophy Unlock directly on Canvas */}
        {isCompleted && (
          <div
            ref={rewardPhaseRef}
            className="w-full flex flex-col items-center text-center space-y-6 animate-fadeIn"
          >
            {/* Trophy Icon */}
            <div
              ref={trophyRef}
              className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl flex items-center justify-center shadow-2xl border border-white/20 backdrop-blur-2xl"
              style={{
                backgroundColor: cardBg,
                boxShadow: `0 20px 50px -10px ${accentColor}50, 0 0 40px ${accentColor}30`,
              }}
            >
              <Trophy
                className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-md"
                style={{ color: accentColor }}
              />
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Badge pill */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-mono tracking-widest uppercase text-zinc-300">
              <Award className="w-3.5 h-3.5" style={{ color: accentColor }} />
              <span>Official Achievement Unlocked</span>
            </div>

            {/* Award Title */}
            <h2
              className="text-2xl sm:text-4xl font-extrabold font-serif tracking-tight drop-shadow-sm"
              style={{ color: textColor }}
            >
              {data.awardTitle || "THE UNBREAKABLE BOND AWARD"}
            </h2>

            {/* Subtitle / Description */}
            <p className="text-base sm:text-lg text-zinc-200 leading-relaxed font-sans max-w-lg">
              {data.rewardText}
            </p>

            {data.subtitle && (
              <p
                className="text-xs sm:text-sm font-mono tracking-wide italic text-zinc-400"
                style={{ color: `${textColor}80` }}
              >
                &mdash; {data.subtitle} &mdash;
              </p>
            )}
          </div>
        )}
      </div>

      {/* Subtle in-context Tap to Continue visual cue */}
      <div className="pt-6 relative z-20">
        <TapToAdvanceCue accentColor={accentColor} />
      </div>
    </div>
  );
}
