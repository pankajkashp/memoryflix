"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Search, Sparkles, Heart } from "lucide-react";
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

export interface SearchPhotoItem {
  url: string;
  title?: string;
  caption?: string;
}

export interface SearchResultsPageData {
  searchQuery: string;
  resultsCount?: string;
  photos: SearchPhotoItem[];
}

export interface SearchResultsPageProps {
  fixedConfig?: FixedPageConfig;
  data: SearchResultsPageData;
  isActive?: boolean;
  isExiting?: boolean;
}

export default function SearchResultsPage({
  fixedConfig = {},
  data,
  isActive = true,
  isExiting = false,
}: SearchResultsPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [typedText, setTypedText] = useState("");

  const {
    backgroundColor = "#09090b",
    textColor = "#fafafa",
    accentColor = "#3b82f6",
    cardBg = "rgba(24, 24, 27, 0.9)",
  } = fixedConfig;

  // Typewriter effect on search query
  useEffect(() => {
    if (!isActive) return;
    const reduced = prefersReducedMotion();
    const query = data.searchQuery || "unforgettable moments with you";

    if (reduced) {
      setTypedText(query);
      return;
    }

    setTypedText("");
    let charIdx = 0;
    const interval = setInterval(() => {
      if (charIdx <= query.length) {
        setTypedText(query.slice(0, charIdx));
        charIdx++;
      } else {
        clearInterval(interval);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [isActive, data.searchQuery]);

  // Entrance animations for Search bar and Photo cards
  useEffect(() => {
    if (!isActive) return;
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Reset
      gsap.set(searchBarRef.current, {
        opacity: 0,
        y: reduced ? 0 : -25,
        scale: reduced ? 1 : 0.95,
      });

      const cards = gridRef.current?.querySelectorAll(".search-card-item") || [];
      gsap.set(cards, {
        opacity: 0,
        y: reduced ? 0 : 35,
        scale: reduced ? 1 : 0.92,
      });

      // 1. Search bar drops in
      tl.to(searchBarRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: ENTRANCE_DURATION,
        ease: DEFAULT_EASE,
      });

      // 2. Photo cards stagger upwards
      tl.to(
        cards,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: ENTRANCE_DURATION,
          stagger: STAGGER_GAP * 1.5,
          ease: DEFAULT_EASE,
        },
        "-=0.2"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isActive, data]);

  // Exit animations
  useEffect(() => {
    if (!isExiting || !containerRef.current) return;
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll(".search-card-item") || [];
      gsap.to(cards, {
        opacity: 0,
        y: reduced ? 0 : -20,
        scale: 0.95,
        duration: 0.25,
        stagger: -0.05,
      });

      gsap.to(searchBarRef.current, {
        opacity: 0,
        y: reduced ? 0 : -15,
        duration: EXIT_DURATION,
        ease: "power2.in",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isExiting]);

  const defaultPhotos: SearchPhotoItem[] = [
    { url: "/1.png", title: "Golden Hour Glow", caption: "Where time stopped." },
    { url: "/2.png", title: "Stargazing Nights", caption: "Whispering secrets." },
    { url: "/3.png", title: "Sunset Waves", caption: "Pure joy & laughter." },
  ];

  const photoItems =
    data.photos && data.photos.length > 0 ? data.photos : defaultPhotos;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[100dvh] flex flex-col items-center justify-between p-4 sm:p-8 md:p-12 lg:p-16 overflow-hidden select-none cursor-pointer"
      style={{ backgroundColor }}
    >
      {/* Textured Canvas Background */}
      <CanvasTexture texture={fixedConfig.backgroundTexture || "subtle-noise"} />

      {/* Ambient background glow */}
      <div
        className="absolute w-[900px] h-[500px] rounded-full blur-[180px] pointer-events-none opacity-25 -top-10 left-1/2 -translate-x-1/2"
        style={{ backgroundColor: accentColor }}
      />

      <div className="w-full max-w-[min(95vw,1350px)] lg:max-w-[min(88vw,1550px)] flex flex-col items-center z-10 my-auto">
        {/* Search Bar Container directly on Canvas */}
        <div
          ref={searchBarRef}
          className="w-full max-w-3xl sm:max-w-4xl rounded-full p-2.5 sm:p-3.5 backdrop-blur-2xl border-2 border-white/20 shadow-2xl flex items-center gap-4 px-6 sm:px-8 mb-6 sm:mb-8"
          style={{
            backgroundColor: cardBg,
            boxShadow: `0 20px 50px -10px rgba(0, 0, 0, 0.7), 0 0 35px -5px ${accentColor}30`,
          }}
        >
          <Search className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 text-zinc-400" />
          <div className="flex-1 text-base sm:text-2xl md:text-3xl font-medium truncate py-1 sm:py-2 flex items-center">
            <span style={{ color: textColor }}>{typedText}</span>
            <span className="w-0.5 sm:w-1 h-5 sm:h-7 ml-1 bg-rose-500 animate-pulse inline-block" />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-base font-semibold px-4 py-1.5 rounded-full bg-white/10 text-zinc-200">
              <Sparkles className="w-4 h-4 text-amber-400" /> Best Matches
            </span>
          </div>
        </div>

        {/* Results Metadata directly on Canvas */}
        <div className="w-full flex items-center justify-between text-xs sm:text-base md:text-lg text-zinc-400 px-3 mb-6 font-mono">
          <span>{data.resultsCount || "Showing top curated moments"}</span>
          <span className="flex items-center gap-2 text-zinc-200">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 fill-rose-500" /> Saved forever
          </span>
        </div>

        {/* Photo Grid directly on Canvas */}
        <div
          ref={gridRef}
          className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10"
        >
          {photoItems.map((item, idx) => (
            <div
              key={idx}
              className="search-card-item group relative rounded-3xl sm:rounded-[2rem] overflow-hidden border-2 border-white/15 backdrop-blur-md shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-white/30"
              style={{ backgroundColor: cardBg }}
            >
              {/* Photo */}
              <div className="relative w-full h-56 sm:h-72 md:h-80 lg:h-96 overflow-hidden">
                <Image
                  src={item.url}
                  alt={item.title || `Search result ${idx + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Badge on photo */}
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-mono text-zinc-200 shadow-md">
                  #{idx + 1}
                </div>
              </div>

              {/* Card Caption */}
              {(item.title || item.caption) && (
                <div className="p-5 sm:p-6 space-y-1.5">
                  {item.title && (
                    <h4
                      className="text-base sm:text-xl md:text-2xl font-bold truncate"
                      style={{ color: textColor }}
                    >
                      {item.title}
                    </h4>
                  )}
                  {item.caption && (
                    <p className="text-xs sm:text-base text-zinc-300 line-clamp-2">
                      {item.caption}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Subtle in-context Tap to Continue visual cue */}
      <div className="pt-4 relative z-20">
        <TapToAdvanceCue accentColor={accentColor} />
      </div>
    </div>
  );
}
