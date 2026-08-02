"use client";

import { useEffect, useRef, useState } from "react";
import { Heart, Bell, MessageCircle, Sparkles } from "lucide-react";
import { gsap } from "gsap";
import {
  DEFAULT_EASE,
  ENTRANCE_DURATION,
  EXIT_DURATION,
  FixedPageConfig,
  REWARD_EASE,
  prefersReducedMotion,
} from "@/lib/pageAnimations";
import CanvasTexture from "./CanvasTexture";
import TapToAdvanceCue from "./TapToAdvanceCue";

export interface NotificationPageData {
  notificationTitle?: string;
  notificationText: string;
  sender?: string;
  time?: string;
  avatarUrl?: string;
  replyText?: string;
}

export interface NotificationPageProps {
  fixedConfig?: FixedPageConfig;
  data: NotificationPageData;
  isActive?: boolean;
  isExiting?: boolean;
}

export default function NotificationPage({
  fixedConfig = {},
  data,
  isActive = true,
  isExiting = false,
}: NotificationPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const heartsRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const {
    backgroundColor = "#09090b",
    textColor = "#fafafa",
    accentColor = "#f43f5e",
    cardBg = "rgba(24, 24, 27, 0.9)",
  } = fixedConfig;

  // Entrance animation
  useEffect(() => {
    if (!isActive) return;
    const reduced = prefersReducedMotion();
    setIsOpen(false);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Reset positions
      gsap.set(headerRef.current, {
        opacity: 0,
        y: reduced ? 0 : -30,
        scale: reduced ? 1 : 0.92,
      });

      gsap.set(bannerRef.current, {
        opacity: 0,
        y: reduced ? 0 : 40,
        scale: reduced ? 1 : 0.9,
      });

      const hearts = heartsRef.current?.querySelectorAll(".floating-heart") || [];
      gsap.set(hearts, {
        opacity: 0,
        scale: 0,
      });

      // 1. Header Clock & Time scale in
      tl.to(headerRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: ENTRANCE_DURATION,
        ease: DEFAULT_EASE,
      });

      // 2. Notification capsule bounces into view
      tl.to(
        bannerRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: ENTRANCE_DURATION * 1.1,
          ease: REWARD_EASE,
        },
        "-=0.25"
      );

      // 3. Floating ambient hearts pop in
      tl.to(
        hearts,
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: REWARD_EASE,
        },
        "-=0.2"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isActive, data]);

  // Exit animation
  useEffect(() => {
    if (!isExiting || !containerRef.current) return;
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const hearts = heartsRef.current?.querySelectorAll(".floating-heart") || [];
      gsap.to(hearts, {
        opacity: 0,
        scale: 0,
        duration: 0.2,
        stagger: 0.05,
      });

      gsap.to(bannerRef.current, {
        opacity: 0,
        y: reduced ? 0 : -25,
        scale: 0.95,
        duration: EXIT_DURATION,
        ease: "power2.in",
      });

      gsap.to(headerRef.current, {
        opacity: 0,
        y: reduced ? 0 : -15,
        duration: EXIT_DURATION * 0.8,
        ease: "power2.in",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isExiting]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[100dvh] flex flex-col items-center justify-center p-6 sm:p-12 overflow-hidden select-none cursor-pointer"
      style={{ backgroundColor }}
    >
      {/* Textured Canvas Background */}
      <CanvasTexture texture={fixedConfig.backgroundTexture || "soft-stripes"} />

      {/* Background ambient radial glow */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none opacity-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ backgroundColor: accentColor }}
      />

      {/* Floating decorative elements across full canvas */}
      <div ref={heartsRef} className="absolute inset-0 pointer-events-none z-20">
        <div className="floating-heart absolute top-[18%] left-[10%] sm:left-[18%] text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]">
          <Heart className="w-8 h-8 fill-rose-500 animate-bounce" />
        </div>
        <div className="floating-heart absolute top-[28%] right-[10%] sm:right-[18%] text-pink-400 drop-shadow-[0_0_12px_rgba(244,114,182,0.5)]">
          <Heart className="w-6 h-6 fill-pink-400" />
        </div>
        <div className="floating-heart absolute bottom-[20%] left-[12%] sm:left-[22%] text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]">
          <Sparkles className="w-7 h-7 fill-amber-400" />
        </div>
        <div className="floating-heart absolute bottom-[25%] right-[12%] sm:right-[20%] text-rose-400 opacity-80">
          <Heart className="w-5 h-5 fill-rose-400" />
        </div>
      </div>

      {/* Main Content (Directly on Full-Bleed Canvas) */}
      <div className="relative z-10 w-full max-w-xl flex flex-col items-center text-center space-y-6">
        {/* Lockscreen / Clock Header */}
        <div ref={headerRef} className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-mono tracking-widest uppercase text-zinc-300">
            <Bell className="w-3.5 h-3.5" style={{ color: accentColor }} />
            <span>{data.time || "Special Delivery"}</span>
          </div>
          <h2
            className="text-5xl sm:text-7xl font-light tracking-tight font-sans drop-shadow-sm pt-1"
            style={{ color: textColor }}
          >
            11:11
          </h2>
        </div>

        {/* Floating Notification Capsule */}
        <div
          ref={bannerRef}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="w-full rounded-2xl p-5 sm:p-6 backdrop-blur-2xl border border-white/15 shadow-2xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] text-left"
          style={{
            backgroundColor: cardBg,
            boxShadow: `0 20px 40px -10px rgba(0, 0, 0, 0.6), 0 0 30px -5px ${accentColor}30`,
          }}
        >
          {/* Notification Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md shrink-0"
                style={{ backgroundColor: accentColor }}
              >
                <Bell className="w-4 h-4 text-white fill-white" />
              </div>
              <div>
                <span
                  className="text-xs sm:text-sm font-bold tracking-tight block"
                  style={{ color: textColor }}
                >
                  {data.sender || "MemoryFlix"}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">Priority Message</span>
              </div>
            </div>
            <span className="text-[11px] font-mono text-zinc-400">now</span>
          </div>

          {/* Notification Title */}
          <h4
            className="text-base sm:text-lg font-bold tracking-tight mb-1.5"
            style={{ color: textColor }}
          >
            {data.notificationTitle || "You have 1 new unforgettable memory"}
          </h4>

          {/* Notification Body */}
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
            {data.notificationText}
          </p>

          {/* Revealed Secret / Reply on Tap */}
          {isOpen && data.replyText && (
            <div className="mt-4 pt-3.5 border-t border-white/10 text-xs sm:text-sm flex items-center gap-2 text-rose-300 animate-fadeIn">
              <MessageCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{data.replyText}</span>
            </div>
          )}
        </div>

        {/* Subtle in-context Tap to Continue visual cue */}
        <div className="pt-2">
          <TapToAdvanceCue accentColor={accentColor} />
        </div>
      </div>
    </div>
  );
}
