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
      className="relative w-full h-full min-h-[100dvh] flex flex-col items-center justify-between p-4 sm:p-8 md:p-12 lg:p-16 overflow-hidden select-none cursor-pointer"
      style={{ backgroundColor }}
    >
      {/* Textured Canvas Background */}
      <CanvasTexture texture={fixedConfig.backgroundTexture || "subtle-noise"} />

      {/* Background ambient lighting */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full blur-[180px] pointer-events-none opacity-25 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ backgroundColor: accentColor }}
      />

      <div className="w-full max-w-[min(94vw,1000px)] lg:max-w-[min(68vw,1150px)] flex flex-col items-center z-10 my-auto">
        {/* PHASE 1: Loading bar directly on Canvas */}
        {!isCompleted && (
          <div
            ref={loadingPhaseRef}
            className="w-full flex flex-col items-center space-y-6 sm:space-y-8 text-center"
          >
            {/* Spinning indicator */}
            <div className="relative w-20 h-20 sm:w-28 sm:h-28">
              <div
                className="absolute inset-0 rounded-full border-4 sm:border-6 border-white/10 animate-spin"
                style={{ borderTopColor: accentColor }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-8 h-8 sm:w-12 sm:h-12" style={{ color: accentColor }} />
              </div>
            </div>

            {/* Loading Label */}
            <div className="space-y-2">
              <h3
                className="text-base sm:text-2xl md:text-3xl font-mono uppercase tracking-widest text-zinc-200 font-bold"
                style={{ color: textColor }}
              >
                {data.loadingLabel || "CALCULATING COMPATIBILITY..."}
              </h3>
              <p className="text-xs sm:text-base md:text-lg text-zinc-400 font-mono">
                Processing moments, laughs & memories...
              </p>
            </div>

            {/* Glowing Progress Bar */}
            <div className="w-full space-y-3">
              <div className="w-full h-4 sm:h-6 rounded-full bg-white/10 overflow-hidden p-1 border-2 border-white/20">
                <div
                  ref={progressBarRef}
                  className="h-full rounded-full transition-all duration-75 shadow-lg"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: accentColor,
                    boxShadow: `0 0 20px ${accentColor}`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs sm:text-base font-mono text-zinc-400 px-2">
                <span>0%</span>
                <span className="font-bold text-white text-sm sm:text-lg">{Math.round(progress)}%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        )}

        {/* PHASE 2: Reward / Trophy Unlock directly on Canvas */}
        {isCompleted && (
          <div
            ref={rewardPhaseRef}
            className="w-full flex flex-col items-center text-center space-y-6 sm:space-y-8 animate-fadeIn"
          >
            {/* Trophy Icon */}
            <div
              ref={trophyRef}
              className="relative w-32 h-32 sm:w-44 sm:h-44 md:w-56 md:h-56 rounded-3xl sm:rounded-[2.5rem] flex items-center justify-center shadow-2xl border-2 border-white/25 backdrop-blur-2xl"
              style={{
                backgroundColor: cardBg,
                boxShadow: `0 30px 70px -15px ${accentColor}50, 0 0 50px ${accentColor}35`,
              }}
            >
              <Trophy
                className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 drop-shadow-md"
                style={{ color: accentColor }}
              />
              <div className="absolute -top-3 -right-3 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-emerald-500 flex items-center justify-center shadow-xl border-2 border-white/40">
                <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>

            {/* Badge pill */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs sm:text-sm md:text-base font-mono tracking-widest uppercase text-zinc-200 shadow-md">
              <Award className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: accentColor }} />
              <span>Official Achievement Unlocked</span>
            </div>

            {/* Award Title */}
            <h2
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-serif tracking-tight drop-shadow-md leading-tight"
              style={{ color: textColor }}
            >
              {data.awardTitle || "THE UNBREAKABLE BOND AWARD"}
            </h2>

            {/* Subtitle / Description */}
            <p className="text-lg sm:text-2xl md:text-3xl lg:text-4xl text-zinc-100 leading-relaxed font-sans max-w-4xl">
              {data.rewardText}
            </p>

            {data.subtitle && (
              <p
                className="text-xs sm:text-base md:text-xl font-mono tracking-wide italic text-zinc-400 pt-2"
                style={{ color: `${textColor}90` }}
              >
                &mdash; {data.subtitle} &mdash;
              </p>
            )}
          </div>
        )}
      </div>

      {/* Subtle in-context Tap to Continue visual cue */}
      <div className="pt-4 relative z-20">
        <TapToAdvanceCue accentColor={accentColor} />
      </div>
    </div>
  );
}
