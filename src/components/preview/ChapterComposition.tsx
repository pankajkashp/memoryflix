"use client";

import React, { useEffect, useRef } from "react";
import { MediaAsset } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";
import { GSAP_CONFIG } from "@/lib/gsapConfig";
import { gsap } from "@/lib/gsap-utils";
import Image from "next/image";

interface ChapterCompositionProps {
  media: MediaAsset[];
  isActive: boolean;
  onFinished: () => void;
  isPaused: boolean;
}

export default function ChapterComposition({
  media,
  isActive,
  onFinished,
  isPaused,
}: ChapterCompositionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Grouping logic
  const isSingleVideo = media.length === 1 && media[0].type === "VIDEO";
  const isSinglePhoto = media.length === 1 && media[0].type === "IMAGE";
  const isGrid = media.length >= 2 && media.length <= 3 && !media.some((m) => m.type === "VIDEO");
  const isHeroSatellite = media.length >= 4 || (media.length > 1 && media.some((m) => m.type === "VIDEO"));

  // Default duration for non-video chapters
  const CHAPTER_DURATION = 6000;

  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (videoRef.current) videoRef.current.pause();
      return;
    }

    if (isPaused) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (videoRef.current) videoRef.current.pause();
      return;
    }

    if (isSingleVideo && videoRef.current) {
      videoRef.current.play().catch(() => {});
      // Video ending is handled by onEnded
    } else {
      timerRef.current = setTimeout(() => {
        onFinished();
      }, CHAPTER_DURATION);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isActive, isPaused, isSingleVideo, onFinished]);

  // GSAP Entrance Animation
  useEffect(() => {
    if (isActive && containerRef.current) {
      const items = containerRef.current.querySelectorAll("[data-composition-item]");
      if (items.length > 0) {
        gsap.fromTo(
          items,
          { opacity: 0, scale: 0.9, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: GSAP_CONFIG.duration.enter,
            stagger: GSAP_CONFIG.duration.stagger,
            ease: GSAP_CONFIG.ease,
          }
        );
      }
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden"
    >
      <AnimatePresence>
        {isSingleVideo && (
          <motion.div
            key="single-video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: GSAP_CONFIG.duration.exit }}
            className="w-full h-full"
            data-composition-item
          >
            <video
              ref={videoRef}
              src={media[0].url}
              className="w-full h-full object-cover"
              onEnded={onFinished}
              preload="metadata"
              playsInline
              muted={false}
            />
          </motion.div>
        )}

        {isSinglePhoto && (
          <motion.div
            key="single-photo"
            initial={{ opacity: 0, scale: 1.0 }}
            animate={{ opacity: 1, scale: isPaused ? 1.0 : 1.15 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{
              opacity: { duration: GSAP_CONFIG.duration.exit },
              scale: { duration: CHAPTER_DURATION / 1000, ease: "linear" },
            }}
            className="w-full h-full"
            data-composition-item
          >
            <Image
              src={media[0].url}
              alt={media[0].caption || "Story media"}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </motion.div>
        )}

        {isGrid && (
          <motion.div
            key="grid"
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: GSAP_CONFIG.duration.exit }}
            className="w-full h-full p-4 sm:p-8 flex items-center justify-center"
          >
            <div className={`grid gap-4 w-full h-full max-w-5xl mx-auto ${media.length === 2 ? "grid-cols-2" : "grid-cols-2 grid-rows-2"}`}>
              {media.map((m, i) => (
                <div
                  key={m.id}
                  className={`relative rounded-3xl overflow-hidden shadow-2xl ${media.length === 3 && i === 0 ? "row-span-2 col-span-1" : ""}`}
                  data-composition-item
                >
                  <Image
                    src={m.url}
                    alt={m.caption || "Story media"}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {isHeroSatellite && (
          <motion.div
            key="hero-satellite"
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: GSAP_CONFIG.duration.exit }}
            className="w-full h-full p-4 sm:p-8 flex items-center justify-center"
          >
            <div className="relative w-full h-full max-w-6xl mx-auto flex items-center justify-center">
              {/* Main Hero */}
              <div className="absolute inset-4 sm:inset-12 rounded-3xl overflow-hidden shadow-2xl z-10" data-composition-item>
                {media[0].type === "VIDEO" ? (
                  <video src={media[0].url} className="w-full h-full object-cover" autoPlay loop muted playsInline preload="metadata" />
                ) : (
                  <Image src={media[0].url} alt={media[0].caption || ""} fill sizes="100vw" className="object-cover" />
                )}
              </div>
              
              {/* Satellite 1 */}
              <div className="absolute top-8 left-8 sm:top-16 sm:left-16 w-1/3 sm:w-1/4 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl z-20 -rotate-6 border-4 border-white" data-composition-item>
                {media[1].type === "VIDEO" ? (
                  <video src={media[1].url} className="w-full h-full object-cover" autoPlay loop muted playsInline preload="metadata" />
                ) : (
                  <Image src={media[1].url} alt={media[1].caption || ""} fill sizes="33vw" className="object-cover" />
                )}
              </div>

              {/* Satellite 2 */}
              {media.length > 2 && (
                <div className="absolute bottom-12 right-4 sm:bottom-24 sm:right-24 w-2/5 sm:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl z-20 rotate-3 border-4 border-white" data-composition-item>
                  {media[2].type === "VIDEO" ? (
                    <video src={media[2].url} className="w-full h-full object-cover" autoPlay loop muted playsInline preload="metadata" />
                  ) : (
                    <Image src={media[2].url} alt={media[2].caption || ""} fill sizes="33vw" className="object-cover" />
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
