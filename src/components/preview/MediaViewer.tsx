"use client";

import { useState, useEffect, useCallback } from "react";
import { MediaAsset } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";

interface MediaViewerProps {
  media: MediaAsset[];
  initialIndex: number;
  onClose: () => void;
}

export default function MediaViewer({
  media,
  initialIndex,
  onClose,
}: MediaViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  }, [media.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  }, [media.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [handleNext, handlePrev, onClose]);

  if (!media || media.length === 0) return null;

  const currentMedia = media[currentIndex];
  const hasCaption = Boolean(currentMedia.caption?.trim());

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm">
      {/* ── Close ─────────────────────────────────────────────────────────── */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-6 md:right-6 z-50 text-white/60 hover:text-white transition-colors p-2"
        aria-label="Close"
      >
        <svg
          className="w-6 h-6 md:w-7 md:h-7"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* ── Prev ──────────────────────────────────────────────────────────── */}
      {media.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          className="absolute left-1 md:left-6 z-50 text-white/40 hover:text-white transition-colors p-3"
          aria-label="Previous"
        >
          <svg
            className="w-7 h-7 md:w-9 md:h-9"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* ── Next ──────────────────────────────────────────────────────────── */}
      {media.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          className="absolute right-1 md:right-6 z-50 text-white/40 hover:text-white transition-colors p-3"
          aria-label="Next"
        >
          <svg
            className="w-7 h-7 md:w-9 md:h-9"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* ── Media + caption (animated transitions) ───────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMedia.id}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="flex flex-col items-center w-full h-full max-w-7xl px-4 md:px-16 lg:px-24"
        >
          {/* Media */}
          <div className="flex-1 flex items-center justify-center w-full min-h-0">
            {currentMedia.type === "VIDEO" ? (
              <video
                key={currentMedia.url}
                src={currentMedia.url}
                controls
                autoPlay
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                style={{ maxHeight: hasCaption ? "calc(100vh - 160px)" : "90vh" }}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={currentMedia.url}
                src={currentMedia.url}
                alt={currentMedia.caption || "Fullscreen media"}
                className="max-w-full object-contain rounded-lg shadow-2xl select-none"
                style={{ maxHeight: hasCaption ? "calc(100vh - 160px)" : "90vh" }}
                draggable={false}
              />
            )}
          </div>

          {/* Caption — glassmorphism pill */}
          <AnimatePresence>
            {hasCaption && (
              <motion.div
                key={`viewer-caption-${currentMedia.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.35, delay: 0.15 }}
                className="mt-4 mb-8 px-4 max-w-xl w-full"
              >
                <div
                  className="
                    bg-white/10 backdrop-blur-xl
                    border border-white/15
                    rounded-2xl
                    px-6 py-3
                    text-center
                    shadow-xl shadow-black/30
                  "
                >
                  <p className="text-white/90 text-sm md:text-base font-light leading-relaxed tracking-wide">
                    {currentMedia.caption}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* ── Counter ───────────────────────────────────────────────────────── */}
      {media.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-widest font-mono">
          {currentIndex + 1} / {media.length}
        </div>
      )}
    </div>
  );
}
