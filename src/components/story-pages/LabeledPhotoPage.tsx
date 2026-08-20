"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Tag, Sparkles } from "lucide-react";
import { gsap } from "gsap";
import {
  DEFAULT_EASE,
  ENTRANCE_DURATION,
  EXIT_DURATION,
  FixedPageConfig,
  STAGGER_GAP,
  prefersReducedMotion,
} from "@/lib/pageAnimations";
import CanvasTexture from "./CanvasTexture";
import TapToAdvanceCue from "./TapToAdvanceCue";

export interface PhotoLabel {
  text: string;
  target: { x: number; y: number }; // Percentage 0-100 on the photo
  labelPos: { x: number; y: number }; // Percentage 0-100 for the pill tag
  badge?: string;
  arrowPath?: string; // Optional custom SVG path
}

export interface LabeledPhotoPageData {
  title?: string;
  subtitle?: string;
  photoUrl: string;
  labels: PhotoLabel[];
}

export interface LabeledPhotoPageProps {
  fixedConfig?: FixedPageConfig;
  data: LabeledPhotoPageData;
  isActive?: boolean;
  isExiting?: boolean;
}

export default function LabeledPhotoPage({
  fixedConfig = {},
  data,
  isActive = true,
  isExiting = false,
}: LabeledPhotoPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const photoContainerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);

  const {
    backgroundColor = "#09090b",
    textColor = "#fafafa",
    accentColor = "#ec4899",
    cardBg = "rgba(24, 24, 27, 0.9)",
  } = fixedConfig;

  // Detect light background (e.g. Baby Pink #FFD6E8 or Cream #FAF7F2)
  const isLightBg =
    fixedConfig.mode === "light" ||
    (backgroundColor.startsWith("#") &&
      ["#f", "#e"].some((prefix) => backgroundColor.toLowerCase().startsWith(prefix)));

  const titleColor = isLightBg ? (textColor === "#fafafa" ? "#1F0B14" : textColor) : textColor;
  const subtitleColor = isLightBg ? "#4A1528" : "#d4d4d8";
  const pillTextColor = isLightBg ? "#1F0B14" : (textColor === "#1F0B14" ? "#fafafa" : textColor);
  const pillBg = isLightBg ? (cardBg.startsWith("rgba(24") ? "rgba(255, 255, 255, 0.95)" : cardBg) : cardBg;

  // Entrance animation
  useEffect(() => {
    if (!isActive) return;
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Reset
      gsap.set(photoContainerRef.current, {
        opacity: 0,
        scale: reduced ? 1 : 0.93,
        y: reduced ? 0 : 25,
      });

      const paths = svgRef.current?.querySelectorAll(".callout-path") || [];
      paths.forEach((p) => {
        const pathEl = p as SVGPathElement;
        const length = pathEl.getTotalLength ? pathEl.getTotalLength() : 200;
        gsap.set(pathEl, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 0,
        });
      });

      const dots = svgRef.current?.querySelectorAll(".target-dot") || [];
      gsap.set(dots, {
        scale: 0,
        opacity: 0,
        transformOrigin: "center center",
      });

      const labelPills = labelsRef.current?.querySelectorAll(".label-box") || [];
      gsap.set(labelPills, {
        opacity: 0,
        scale: reduced ? 1 : 0.8,
        y: reduced ? 0 : 12,
      });

      // 1. Photo scales in gently
      tl.to(photoContainerRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: ENTRANCE_DURATION * 1.1,
        ease: DEFAULT_EASE,
      });

      // 2. Target dots pop into place
      tl.to(
        dots,
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: STAGGER_GAP,
          ease: "back.out(2)",
        },
        "-=0.3"
      );

      // 3. SVG arrows draw out along curves
      paths.forEach((p) => {
        tl.to(
          p,
          {
            strokeDashoffset: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.35"
        );
      });

      // 4. Label pills pop in staggered
      tl.to(
        labelPills,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "back.out(1.7)",
        },
        "-=0.4"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isActive, data]);

  // Exit animation
  useEffect(() => {
    if (!isExiting || !containerRef.current) return;
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const labelPills = labelsRef.current?.querySelectorAll(".label-box") || [];
      gsap.to(labelPills, {
        opacity: 0,
        scale: 0.8,
        y: reduced ? 0 : -10,
        duration: 0.2,
        stagger: -0.04,
      });

      gsap.to(photoContainerRef.current, {
        opacity: 0,
        scale: 0.95,
        y: reduced ? 0 : -20,
        duration: EXIT_DURATION,
        ease: "power2.in",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isExiting]);

  const defaultLabels: PhotoLabel[] = [
    {
      text: "The smile that made my year",
      target: { x: 50, y: 35 },
      labelPos: { x: 25, y: 18 },
      badge: "Favorite",
    },
    {
      text: "Golden hour sunset",
      target: { x: 75, y: 25 },
      labelPos: { x: 78, y: 15 },
    },
    {
      text: "Holding hands in the rain",
      target: { x: 52, y: 70 },
      labelPos: { x: 26, y: 76 },
    },
  ];

  const labels = data.labels && data.labels.length > 0 ? data.labels : defaultLabels;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[100dvh] flex flex-col items-center justify-between p-4 sm:p-8 md:p-12 lg:p-16 overflow-hidden select-none cursor-pointer"
      style={{ backgroundColor }}
    >
      {/* Textured Canvas Background */}
      <CanvasTexture
        texture={fixedConfig.backgroundTexture || "canvas"}
        mode={isLightBg ? "light" : "dark"}
      />

      {/* Background glow */}
      <div
        className={`absolute w-[800px] h-[800px] rounded-full blur-[180px] pointer-events-none ${
          isLightBg ? "opacity-35" : "opacity-25"
        } top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
        style={{ backgroundColor: accentColor }}
      />

      <div className="w-full flex flex-col items-center z-10 my-auto justify-center">
        {/* Header info directly on canvas */}
        {(data.title || data.subtitle) && (
          <div className="text-center mb-6 sm:mb-8 z-10 space-y-2.5 max-w-3xl mx-auto px-4">
            {data.title && (
              <h2
                className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-black tracking-tight leading-tight select-none"
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
                {data.title}
              </h2>
            )}
            {data.subtitle && (
              <p
                className="text-sm sm:text-lg md:text-xl font-medium tracking-wide font-sans"
                style={{ color: subtitleColor }}
              >
                {data.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Photo with SVG overlay directly on canvas */}
        <div
          ref={photoContainerRef}
          className={`relative w-full max-w-[min(95vw,1200px)] lg:max-w-[min(85vw,1400px)] aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/9] rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl z-10 ${
            isLightBg ? "border-2 border-pink-200/60" : "border-2 border-white/15"
          }`}
          style={{
            boxShadow: isLightBg
              ? `0 25px 60px -15px rgba(244, 63, 94, 0.18), 0 10px 30px rgba(0, 0, 0, 0.1)`
              : `0 30px 70px -15px rgba(0, 0, 0, 0.85), 0 0 45px -10px ${accentColor}30`,
          }}
        >
          {/* The Base Photo */}
          <Image
            src={data.photoUrl}
            alt={data.title || "Annotated memory"}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1400px"
          />
          <div
            className={`absolute inset-0 pointer-events-none ${
              isLightBg
                ? "bg-gradient-to-t from-black/40 via-transparent to-black/5"
                : "bg-gradient-to-t from-black/50 via-transparent to-black/10"
            }`}
          />

          {/* SVG Callout Lines Layer */}
          <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-20"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="line-glow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={accentColor} stopOpacity="1" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
              </linearGradient>
              <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="1" floodColor={accentColor} floodOpacity="0.8" />
              </filter>
            </defs>

            {labels.map((item, idx) => {
              const startX = item.labelPos.x;
              const startY = item.labelPos.y;
              const endX = item.target.x;
              const endY = item.target.y;
              const midX = (startX + endX) / 2;
              const customPath =
                item.arrowPath ||
                `M ${startX} ${startY} Q ${midX} ${startY} ${endX} ${endY}`;

              return (
                <g key={idx}>
                  {/* Connecting Curved Line */}
                  <path
                    d={customPath}
                    fill="none"
                    stroke="url(#line-glow-grad)"
                    strokeWidth="0.9"
                    strokeLinecap="round"
                    filter="url(#glow-filter)"
                    className="callout-path"
                  />

                  {/* Target Point Pulsing Dot */}
                  <circle
                    cx={endX}
                    cy={endY}
                    r="1.8"
                    fill="#ffffff"
                    stroke={accentColor}
                    strokeWidth="0.9"
                    className="target-dot"
                  />
                </g>
              );
            })}
          </svg>

          {/* HTML Labels Overlay */}
          <div ref={labelsRef} className="absolute inset-0 pointer-events-none z-30">
            {labels.map((item, idx) => (
              <div
                key={idx}
                className="label-box absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                style={{
                  left: `${item.labelPos.x}%`,
                  top: `${item.labelPos.y}%`,
                }}
              >
                <div
                  className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full backdrop-blur-2xl transition-transform duration-300 hover:scale-105 ${
                    isLightBg
                      ? "border border-pink-200/80 shadow-lg"
                      : "border-2 border-white/25 shadow-2xl"
                  }`}
                  style={{
                    backgroundColor: pillBg,
                    boxShadow: isLightBg
                      ? "0 10px 25px -3px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(244, 63, 94, 0.1)"
                      : `0 12px 30px -3px rgba(0, 0, 0, 0.8), 0 0 20px -3px ${accentColor}50`,
                  }}
                >
                  {item.badge ? (
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                  ) : (
                    <Tag className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: accentColor }} />
                  )}
                  <span
                    className="text-xs sm:text-base md:text-lg font-bold whitespace-nowrap tracking-wide"
                    style={{ color: pillTextColor }}
                  >
                    {item.text}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subtle in-context Tap to Continue visual cue */}
      <div className="pt-4 relative z-20">
        <TapToAdvanceCue accentColor={accentColor} isLight={isLightBg} />
      </div>
    </div>
  );
}
