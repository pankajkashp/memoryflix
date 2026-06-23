"use client";

import { useState, useEffect, useRef } from "react";
import { MediaAsset, Chapter } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Pause, Play } from "lucide-react";

interface CinematicPlayerProps {
  media: MediaAsset[];
  chapters?: Chapter[];
  initialIndex?: number;
  onClose: () => void;
}

const IMAGE_DURATION_MS = 5000;
// Caption fades in after this delay (ms) and starts fading out before transition
const CAPTION_FADE_IN_DELAY = 0.6; // seconds after slide enters

export default function CinematicPlayer({
  media,
  chapters,
  initialIndex = 0,
  onClose,
}: CinematicPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showCaption, setShowCaption] = useState(false);
  
  // Chapter transition state
  const currentMedia = media[currentIndex];
  const currentChapter = chapters?.find(c => c.id === currentMedia?.chapterId);
  
  const [showChapterTitle, setShowChapterTitle] = useState(() => {
    // Show chapter title initially if the first item has a chapter
    return !!currentChapter;
  });
  
  const [lastSeenChapterId, setLastSeenChapterId] = useState<string | null>(
    currentChapter?.id || null
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const captionTimer = useRef<NodeJS.Timeout | null>(null);
  const startTime = useRef<number>(Date.now());
  const elapsedPausedTime = useRef<number>(0);
  const lastPauseTime = useRef<number | null>(null);

  const isVideo = currentMedia?.type === "VIDEO";
  const hasCaption = Boolean(currentMedia?.caption?.trim());

  // ── Navigation ──────────────────────────────────────────────────────────────

  const goToNext = () => {
    if (currentIndex < media.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextMedia = media[nextIndex];
      const nextChapterId = nextMedia.chapterId || null;
      
      if (nextChapterId !== lastSeenChapterId && nextChapterId !== null) {
        setLastSeenChapterId(nextChapterId);
        setShowChapterTitle(true);
      }
      
      setCurrentIndex(nextIndex);
      resetProgress();
    } else {
      setIsFinished(true);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      const prevMedia = media[prevIndex];
      const prevChapterId = prevMedia.chapterId || null;
      
      if (prevChapterId !== lastSeenChapterId && prevChapterId !== null) {
        setLastSeenChapterId(prevChapterId);
        setShowChapterTitle(true);
      } else if (prevChapterId === null) {
        setLastSeenChapterId(null);
      }
      
      setCurrentIndex(prevIndex);
      resetProgress();
    }
  };

  const resetProgress = () => {
    setProgress(0);
    setShowCaption(false);
    startTime.current = Date.now();
    elapsedPausedTime.current = 0;
    lastPauseTime.current = null;
    setIsPaused(false);
  };

  const replayStory = () => {
    setCurrentIndex(0);
    setIsFinished(false);
    resetProgress();
  };

  // ── Caption timing ───────────────────────────────────────────────────────────
  // Show caption after CAPTION_FADE_IN_DELAY once the slide enters.
  // Hide it again just before the slide exits (at ~85% progress for images).
  useEffect(() => {
    if (isFinished || !hasCaption) {
      setShowCaption(false);
      return;
    }
    if (isPaused) return;

    // Schedule the show
    captionTimer.current = setTimeout(
      () => setShowCaption(true),
      CAPTION_FADE_IN_DELAY * 1000
    );

    return () => {
      if (captionTimer.current) clearTimeout(captionTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, isPaused, isFinished]);

  // Hide caption when approaching slide end (images only)
  useEffect(() => {
    if (!hasCaption || isVideo) return;
    if (progress >= 82) setShowCaption(false);
  }, [progress, hasCaption, isVideo]);

  // ── Keyboard ─────────────────────────────────────────────────────────────────
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, isFinished, isPaused]);

  // ── Chapter Transition Timer ────────────────────────────────────────────────
  useEffect(() => {
    if (showChapterTitle) {
      const timer = setTimeout(() => {
        setShowChapterTitle(false);
        // Reset start time so the media gets its full duration after title fades
        startTime.current = Date.now();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showChapterTitle]);

  // ── Progress engine ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (isFinished || showChapterTitle) {
      if (progressInterval.current) clearInterval(progressInterval.current);
      if (videoRef.current) videoRef.current.pause();
      return;
    }

    if (isPaused) {
      if (!lastPauseTime.current) lastPauseTime.current = Date.now();
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
        if (videoRef.current?.duration) {
          setProgress(
            (videoRef.current.currentTime / videoRef.current.duration) * 100
          );
        }
      }, 50);
    } else if (!isVideo) {
      progressInterval.current = setInterval(() => {
        const elapsed =
          Date.now() - startTime.current - elapsedPausedTime.current;
        const pct = (elapsed / IMAGE_DURATION_MS) * 100;
        if (pct >= 100) {
          setProgress(100);
          clearInterval(progressInterval.current!);
          goToNext();
        } else {
          setProgress(pct);
        }
      }, 50);
    }

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, isPaused, isVideo]);

  // ── Swipe (mobile) ────────────────────────────────────────────────────────────
  const handleDragEnd = (_e: unknown, { offset }: { offset: { x: number } }) => {
    if (offset.x < -50) goToNext();
    else if (offset.x > 50) goToPrev();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-0 bg-zinc-950" />

      {/* ── Progress bars ────────────────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 w-full z-50 p-4 pt-safe-top pt-6 flex gap-1 bg-gradient-to-b from-black/80 to-transparent">
        {media.map((_, idx) => (
          <div
            key={idx}
            className="h-[3px] flex-1 bg-white/25 rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-white rounded-full transition-all duration-75 ease-linear"
              style={{
                width:
                  idx < currentIndex
                    ? "100%"
                    : idx === currentIndex && !showChapterTitle
                    ? `${progress}%`
                    : "0%",
              }}
            />
          </div>
        ))}
      </div>

      {/* ── Top controls ─────────────────────────────────────────────────────── */}
      <div className="absolute top-10 right-4 z-50 flex items-center gap-3">
        <span className="text-white text-xs sm:text-sm font-semibold bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">
          {currentIndex + 1} / {media.length}
        </span>
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="text-white hover:text-zinc-300 p-2 transition-colors"
          aria-label={isPaused ? "Play" : "Pause"}
        >
          {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
        </button>
        <button
          onClick={onClose}
          className="text-white hover:text-zinc-300 p-2 transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* ── Click zones for navigation ────────────────────────────────────────── */}
      <div className="absolute inset-0 z-40 flex">
        <div
          className="w-1/3 h-full cursor-pointer"
          onClick={goToPrev}
          onDoubleClick={() => setIsPaused((p) => !p)}
        />
        <div
          className="w-1/3 h-full cursor-pointer"
          onClick={() => setIsPaused((p) => !p)}
        />
        <div
          className="w-1/3 h-full cursor-pointer"
          onClick={goToNext}
          onDoubleClick={() => setIsPaused((p) => !p)}
        />
      </div>

      {/* ── Media display ─────────────────────────────────────────────────────── */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center z-20 pointer-events-none"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
      >
        <AnimatePresence mode="wait">
          {/* ── Finished screen ─────────────────────────────────────────────── */}
          {isFinished ? (
            <motion.div
              key="finished"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto bg-zinc-950"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg text-center px-4">
                Thanks for Watching ❤️
              </h2>
              <p className="text-zinc-400 text-lg mb-8 text-center px-4">
                Every memory deserves a premiere.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={replayStory}
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
          ) : showChapterTitle && currentChapter ? (
            /* ── Chapter Title Transition ─────────────────────────────────── */
            <motion.div
              key={`chapter-${currentChapter.id}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-zinc-950 z-30"
            >
              <h2 className="text-4xl md:text-6xl font-bold drop-shadow-2xl text-center px-4 flex items-center gap-4">
                {currentChapter.emoji && <span>{currentChapter.emoji}</span>}
                {currentChapter.title}
              </h2>
            </motion.div>
          ) : (
            /* ── Active slide ─────────────────────────────────────────────── */
            <motion.div
              key={currentMedia.id}
              initial={{ opacity: 0, scale: 1.0 }}
              animate={{ opacity: 1, scale: isVideo ? 1 : 1.06 }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 0.45 },
                scale: { duration: isVideo ? 0.3 : 5.5, ease: "linear" },
              }}
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
                  controls
                  muted={false}
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentMedia.url}
                  alt={currentMedia.caption || "Story media"}
                  className="max-w-full max-h-full object-contain select-none"
                  draggable={false}
                />
              )}

              {/* ── Cinematic caption overlay ─────────────────────────────── */}
              <AnimatePresence>
                {hasCaption && showCaption && (
                  <motion.div
                    key={`caption-${currentMedia.id}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                    // Sits above the click zones (z-40) and below controls (z-50)
                    className="absolute bottom-0 left-0 right-0 z-[45] pb-safe-bottom"
                  >
                    {/* Bottom gradient vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                    <div className="relative px-6 pb-10 pt-8 flex justify-center">
                      <div
                        className="
                          max-w-lg sm:max-w-xl md:max-w-2xl
                          bg-white/10 backdrop-blur-xl
                          border border-white/20
                          rounded-2xl
                          px-6 py-4
                          shadow-2xl shadow-black/40
                          pointer-events-none
                        "
                      >
                        <p
                          className="
                            text-center opacity-90
                            text-sm sm:text-base md:text-lg
                            font-medium leading-relaxed
                            drop-shadow-md
                            tracking-wide
                          "
                          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}
                        >
                          {currentMedia.caption}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
