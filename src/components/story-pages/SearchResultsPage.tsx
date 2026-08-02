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
      className="relative w-full h-full min-h-[100dvh] flex flex-col items-center justify-between p-6 sm:p-12 overflow-hidden select-none cursor-pointer"
      style={{ backgroundColor }}
    >
      {/* Textured Canvas Background */}
      <CanvasTexture texture={fixedConfig.backgroundTexture || "subtle-noise"} />

      {/* Ambient background glow */}
      <div
        className="absolute w-[600px] h-[350px] rounded-full blur-[150px] pointer-events-none opacity-20 -top-10 left-1/2 -translate-x-1/2"
        style={{ backgroundColor: accentColor }}
      />

      <div className="w-full max-w-4xl flex flex-col items-center z-10 flex-1">
        {/* Search Bar Container directly on Canvas */}
        <div
          ref={searchBarRef}
          className="w-full max-w-2xl rounded-full p-2 backdrop-blur-2xl border border-white/15 shadow-2xl flex items-center gap-3 px-5 mb-5"
          style={{
            backgroundColor: cardBg,
            boxShadow: `0 15px 35px -5px rgba(0, 0, 0, 0.6), 0 0 25px -5px ${accentColor}25`,
          }}
        >
          <Search className="w-5 h-5 shrink-0 text-zinc-400" />
          <div className="flex-1 text-sm sm:text-base font-medium truncate py-1.5 flex items-center">
            <span style={{ color: textColor }}>{typedText}</span>
            <span className="w-0.5 h-4 ml-0.5 bg-rose-500 animate-pulse inline-block" />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/10 text-zinc-300">
              <Sparkles className="w-3 h-3 text-amber-400" /> Best Matches
            </span>
          </div>
        </div>

        {/* Results Metadata directly on Canvas */}
        <div className="w-full flex items-center justify-between text-xs text-zinc-400 px-2 mb-4 font-mono">
          <span>{data.resultsCount || "Showing top curated moments"}</span>
          <span className="flex items-center gap-1.5 text-zinc-300">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> Saved forever
          </span>
        </div>

        {/* Photo Grid directly on Canvas */}
        <div
          ref={gridRef}
          className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {photoItems.map((item, idx) => (
            <div
              key={idx}
              className="search-card-item group relative rounded-2xl overflow-hidden border border-white/10 backdrop-blur-md shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
              style={{ backgroundColor: cardBg }}
            >
              {/* Photo */}
              <div className="relative w-full h-44 sm:h-52 overflow-hidden">
                <Image
                  src={item.url}
                  alt={item.title || `Search result ${idx + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Badge on photo */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-mono text-zinc-300">
                  #{idx + 1}
                </div>
              </div>

              {/* Card Caption */}
              {(item.title || item.caption) && (
                <div className="p-3.5">
                  {item.title && (
                    <h4
                      className="text-sm font-bold truncate"
                      style={{ color: textColor }}
                    >
                      {item.title}
                    </h4>
                  )}
                  {item.caption && (
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
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
      <div className="pt-6 relative z-20">
        <TapToAdvanceCue accentColor={accentColor} />
      </div>
    </div>
  );
}
