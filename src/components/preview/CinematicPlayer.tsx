"use client";

import { useState, useEffect } from "react";
import { MediaAsset } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Pause, Play } from "lucide-react";
import Image from "next/image";

interface CinematicPlayerProps {
  media: MediaAsset[];
  initialIndex?: number;
  onClose: () => void;
}

const SLIDE_DURATION = 5000; // ms per photo slide

export default function CinematicPlayer({
  media,
  initialIndex = 0,
  onClose,
}: CinematicPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const current = media[currentIndex];

  const goToNext = () => {
    if (currentIndex < media.length - 1) {
      setCurrentIndex((c) => c + 1);
    } else {
      setIsFinished(true);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((c) => c - 1);
    }
  };

  // Auto-advance timer for photos
  useEffect(() => {
    if (isPaused || isFinished || !current || current.type === "VIDEO") return;
    const timer = setTimeout(goToNext, SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [currentIndex, isPaused, isFinished, current]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFinished) return;
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === " " || e.key === "Spacebar") setIsPaused((p) => !p);
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, isFinished]);

  // Swipe
  const handleDragEnd = (_e: unknown, { offset }: { offset: { x: number } }) => {
    if (offset.x < -50) goToNext();
    else if (offset.x > 50) goToPrev();
  };

  if (!media || media.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-0 bg-zinc-950" />

      {/* Progress Bars */}
      <div className="absolute top-0 left-0 w-full z-50 p-4 pt-[calc(env(safe-area-inset-top)+1.5rem)] flex gap-1 bg-gradient-to-b from-black/80 to-transparent">
        {media.map((_, idx) => (
          <div key={idx} className="h-[3px] flex-1 bg-white/25 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{ width: idx < currentIndex ? "100%" : idx === currentIndex ? "50%" : "0%" }}
            />
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="absolute top-14 right-4 z-50 flex items-center gap-3">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="text-white hover:text-zinc-300 p-2 transition-colors"
          aria-label={isPaused ? "Play" : "Pause"}
        >
          {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
        </button>
        <button onClick={onClose} className="text-white hover:text-zinc-300 p-2 transition-colors" aria-label="Close">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Swipe zone */}
      <motion.div
        className="absolute inset-0 z-30"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        onPointerDown={() => setIsPaused(true)}
        onPointerUp={() => setIsPaused(false)}
        onPointerLeave={() => setIsPaused(false)}
      />

      {/* Click zones (desktop) */}
      <div className="absolute inset-0 z-40 hidden md:flex pointer-events-none">
        <div className="w-1/3 h-full pointer-events-auto cursor-pointer" onClick={goToPrev} />
        <div className="w-1/3 h-full pointer-events-auto cursor-pointer" onClick={() => setIsPaused((p) => !p)} />
        <div className="w-1/3 h-full pointer-events-auto cursor-pointer" onClick={goToNext} />
      </div>

      {/* Media */}
      <AnimatePresence mode="wait">
        {isFinished ? (
          <motion.div
            key="finished"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto bg-zinc-950 z-50"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg text-center px-4">
              Thanks for Watching ❤️
            </h2>
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => { setIsFinished(false); setCurrentIndex(0); }}
                className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-zinc-200 transition"
              >
                Replay Story
              </button>
              <button
                onClick={onClose}
                className="bg-zinc-800 text-white px-8 py-3 rounded-full font-bold border border-zinc-700 hover:bg-zinc-700 transition"
              >
                Close
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={currentIndex}
            className="absolute inset-0 z-20 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {current?.type === "VIDEO" ? (
              <video
                src={current.url}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                preload="metadata"
                onEnded={goToNext}
                muted={false}
              />
            ) : (
              <motion.div
                className="w-full h-full"
                animate={{ scale: isPaused ? 1.0 : 1.08 }}
                transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
              >
                <Image
                  src={current?.url || ""}
                  alt={current?.caption || "Story media"}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority
                />
              </motion.div>
            )}

            {/* Caption overlay */}
            {current?.caption && (
              <div className="absolute bottom-16 left-0 right-0 text-center px-6 pointer-events-none">
                <p className="text-white/90 text-lg font-medium drop-shadow-lg bg-black/30 backdrop-blur-sm rounded-xl px-4 py-2 inline-block">
                  {current.caption}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
