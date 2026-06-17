"use client";

import { useState, useEffect, useRef } from "react";
import { MediaAsset } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Pause, Play } from "lucide-react";

interface CinematicPlayerProps {
  media: MediaAsset[];
  initialIndex?: number;
  onClose: () => void;
}

const IMAGE_DURATION_MS = 5000;

export default function CinematicPlayer({ media, initialIndex = 0, onClose }: CinematicPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const startTime = useRef<number>(Date.now());
  const elapsedPausedTime = useRef<number>(0);
  const lastPauseTime = useRef<number | null>(null);

  const currentMedia = media[currentIndex];
  const isVideo = currentMedia.type === "VIDEO";

  const goToNext = () => {
    if (currentIndex < media.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      resetProgress();
    } else {
      onClose(); // End of story
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      resetProgress();
    }
  };

  const resetProgress = () => {
    setProgress(0);
    startTime.current = Date.now();
    elapsedPausedTime.current = 0;
    lastPauseTime.current = null;
    setIsPaused(false);
  };

  // Progress logic
  useEffect(() => {
    if (isPaused) {
      if (!lastPauseTime.current) {
        lastPauseTime.current = Date.now();
      }
      if (progressInterval.current) clearInterval(progressInterval.current);
      if (videoRef.current) videoRef.current.pause();
      return;
    }

    if (lastPauseTime.current) {
      elapsedPausedTime.current += Date.now() - lastPauseTime.current;
      lastPauseTime.current = null;
    }

    if (isVideo && videoRef.current) {
      videoRef.current.play().catch(() => {});
      progressInterval.current = setInterval(() => {
        if (videoRef.current && videoRef.current.duration) {
          const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
          setProgress(currentProgress);
        }
      }, 50);
    } else if (!isVideo) {
      progressInterval.current = setInterval(() => {
        const elapsed = Date.now() - startTime.current - elapsedPausedTime.current;
        const currentProgress = (elapsed / IMAGE_DURATION_MS) * 100;
        
        if (currentProgress >= 100) {
          setProgress(100);
          clearInterval(progressInterval.current!);
          goToNext();
        } else {
          setProgress(currentProgress);
        }
      }, 50);
    }

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [currentIndex, isPaused, isVideo]);

  // Touch and click handling
  const handleTouchStart = () => setIsPaused(true);
  const handleTouchEnd = () => setIsPaused(false);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col justify-center overflow-hidden">
      {/* Background ambient color (optional based on media) */}
      <div className="absolute inset-0 bg-zinc-950"></div>

      {/* Progress Bars (Instagram style) */}
      <div className="absolute top-0 left-0 w-full z-50 p-4 pt-6 flex gap-1 bg-gradient-to-b from-black/80 to-transparent">
        {media.map((_, idx) => (
          <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-75 ease-linear"
              style={{ 
                width: idx < currentIndex ? "100%" : idx === currentIndex ? `${progress}%` : "0%" 
              }}
            ></div>
          </div>
        ))}
      </div>

      {/* Top Controls */}
      <div className="absolute top-10 right-4 z-50 flex gap-4">
        <button 
          onClick={() => setIsPaused(!isPaused)} 
          className="text-white hover:text-zinc-300 drop-shadow-md p-2"
        >
          {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
        </button>
        <button 
          onClick={onClose} 
          className="text-white hover:text-zinc-300 drop-shadow-md p-2"
        >
          <X className="w-7 h-7" />
        </button>
      </div>

      {/* Click zones for navigation */}
      <div className="absolute inset-0 z-40 flex">
        <div 
          className="w-1/3 h-full cursor-pointer" 
          onClick={goToPrev}
          onMouseDown={handleTouchStart}
          onMouseUp={handleTouchEnd}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        ></div>
        <div 
          className="w-2/3 h-full cursor-pointer" 
          onClick={goToNext}
          onMouseDown={handleTouchStart}
          onMouseUp={handleTouchEnd}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        ></div>
      </div>

      {/* Media Display */}
      <div className="relative w-full h-full flex items-center justify-center z-20 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMedia.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute w-full h-full flex items-center justify-center"
          >
            {isVideo ? (
              <video
                ref={videoRef}
                src={currentMedia.url}
                className="max-w-full max-h-full object-contain pointer-events-auto"
                onEnded={goToNext}
                playsInline
                autoPlay
                muted={false}
              />
            ) : (
              <img
                src={currentMedia.url}
                alt={currentMedia.caption || "Story media"}
                className="max-w-full max-h-full object-contain"
              />
            )}

            {/* Optional Caption */}
            {currentMedia.caption && (
              <div className="absolute bottom-12 left-0 w-full text-center px-6">
                <span className="bg-black/60 backdrop-blur-md text-white px-6 py-3 rounded-xl text-lg font-medium drop-shadow-lg inline-block">
                  {currentMedia.caption}
                </span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
