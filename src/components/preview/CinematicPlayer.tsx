"use client";

import { useState, useEffect, useRef } from "react";
import { MediaAsset, Chapter } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Pause, Play } from "lucide-react";
import ChapterComposition from "./ChapterComposition";

interface CinematicPlayerProps {
  media: MediaAsset[];
  chapters?: Chapter[];
  initialIndex?: number;
  onClose: () => void;
}

export default function CinematicPlayer({
  media,
  chapters,
  initialIndex = 0,
  onClose,
}: CinematicPlayerProps) {
  // 1. Group Media by Chapter to create "Scenes"
  const [scenes, setScenes] = useState<{ chapter: Chapter | null, mediaItems: MediaAsset[] }[]>([]);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isLandscapeMobile, setIsLandscapeMobile] = useState(false);

  // Initialize Scenes
  useEffect(() => {
    if (!media || media.length === 0) return;
    
    let groupedScenes: { chapter: Chapter | null, mediaItems: MediaAsset[] }[] = [];
    
    if (chapters && chapters.length > 0) {
      groupedScenes = chapters.map(ch => ({
        chapter: ch,
        mediaItems: media.filter(m => m.chapterId === ch.id)
      })).filter(c => c.mediaItems.length > 0);
      
      const unassigned = media.filter(m => !m.chapterId);
      if (unassigned.length > 0) {
        groupedScenes.push({ chapter: null, mediaItems: unassigned });
      }
    } else {
      groupedScenes = [{ chapter: null, mediaItems: media }];
    }
    
    setScenes(groupedScenes);

    // If initialIndex is provided, find which scene contains that media
    if (initialIndex > 0 && initialIndex < media.length) {
      const targetMedia = media[initialIndex];
      const sIndex = groupedScenes.findIndex(s => s.mediaItems.some(m => m.id === targetMedia.id));
      if (sIndex >= 0) setCurrentSceneIndex(sIndex);
    }
  }, [media, chapters, initialIndex]);

  // Handle Orientation
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      const isLandscape = window.matchMedia("(orientation: landscape)").matches;
      setIsLandscapeMobile(isMobile && isLandscape);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const goToNext = () => {
    if (currentSceneIndex < scenes.length - 1) {
      setCurrentSceneIndex(c => c + 1);
    } else {
      setIsFinished(true);
    }
  };

  const goToPrev = () => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex(c => c - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFinished) return;
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === " " || e.key === "Spacebar") setIsPaused(p => !p);
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSceneIndex, isFinished]);

  // Swipe gestures
  const handleDragEnd = (_e: unknown, { offset }: { offset: { x: number } }) => {
    if (offset.x < -50) goToNext();
    else if (offset.x > 50) goToPrev();
  };

  if (scenes.length === 0) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black flex flex-col justify-center overflow-hidden touch-pan-y"
      style={{ touchAction: 'pan-y' }} // Prevent pinch zoom, allow vertical scrolling only if needed
    >
      <div className="absolute inset-0 bg-zinc-950" />

      {/* Progress Bars (Safe Area support) */}
      <div className="absolute top-0 left-0 w-full z-50 p-4 pt-[calc(env(safe-area-inset-top)+1.5rem)] flex gap-1 bg-gradient-to-b from-black/80 to-transparent">
        {scenes.map((_, idx) => (
          <div key={idx} className="h-[3px] flex-1 bg-white/25 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-300 ease-linear"
              style={{
                width: idx < currentSceneIndex ? "100%" : idx === currentSceneIndex ? "50%" : "0%", 
                // A true progress bar per scene would require hooking into the ChapterComposition's internal timer, 
                // but 50% for active scene works well for discrete chapter navigation.
              }}
            />
          </div>
        ))}
      </div>

      {/* Controls (Safe Area support) */}
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

      {/* Title overlay */}
      {!isFinished && scenes[currentSceneIndex]?.chapter && (
        <div className="absolute top-20 left-6 z-40">
          <h2 className="text-white/80 font-bold text-lg md:text-2xl drop-shadow-md">
            {scenes[currentSceneIndex].chapter?.title}
          </h2>
        </div>
      )}

      {/* Swipe zone for mobile & Click zone for desktop */}
      <motion.div
        className="absolute inset-0 z-30"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        // Tap and hold to pause
        onPointerDown={() => setIsPaused(true)}
        onPointerUp={() => setIsPaused(false)}
        onPointerLeave={() => setIsPaused(false)}
      />

      <div className="absolute inset-0 z-40 flex pointer-events-none hidden md:flex">
         <div className="w-1/3 h-full pointer-events-auto cursor-pointer" onClick={goToPrev} />
         <div className="w-1/3 h-full pointer-events-auto cursor-pointer" onClick={() => setIsPaused(p=>!p)} />
         <div className="w-1/3 h-full pointer-events-auto cursor-pointer" onClick={goToNext} />
      </div>

      {/* Render Current Scene */}
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
                onClick={() => { setIsFinished(false); setCurrentSceneIndex(0); }}
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
            key={currentSceneIndex}
            className="w-full h-full relative z-20 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ChapterComposition
              media={
                // If on landscape mobile, force single-hero fallback for multi-item compositions to save space
                isLandscapeMobile && scenes[currentSceneIndex].mediaItems.length > 1
                  ? [scenes[currentSceneIndex].mediaItems[0]] // Force first item full screen
                  : scenes[currentSceneIndex].mediaItems
              }
              isActive={!isFinished}
              onFinished={goToNext}
              isPaused={isPaused}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
