"use client";

import { useState, useEffect, useCallback } from "react";
import { MediaAsset } from "@prisma/client";

interface MediaViewerProps {
  media: MediaAsset[];
  initialIndex: number;
  onClose: () => void;
}

export default function MediaViewer({ media, initialIndex, onClose }: MediaViewerProps) {
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
    // Prevent scrolling behind modal
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [handleNext, handlePrev, onClose]);

  if (!media || media.length === 0) return null;

  const currentMedia = media[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-6 md:right-6 z-50 text-white/70 hover:text-white transition-colors"
        aria-label="Close"
      >
        <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Prev Button */}
      {media.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          className="absolute left-1 md:left-8 z-50 text-white/50 hover:text-white transition-colors p-2"
          aria-label="Previous"
        >
          <svg className="w-6 h-6 md:w-10 md:h-10" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Next Button */}
      {media.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          className="absolute right-1 md:right-8 z-50 text-white/50 hover:text-white transition-colors p-2"
          aria-label="Next"
        >
          <svg className="w-6 h-6 md:w-10 md:h-10" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Media Content */}
      <div className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center px-4 md:px-16 lg:px-24">
        {currentMedia.type === "VIDEO" ? (
          <video
            key={currentMedia.url} // Force remount on source change to autoPlay
            src={currentMedia.url}
            controls
            autoPlay
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={currentMedia.url}
            src={currentMedia.url}
            alt="Fullscreen media"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl select-none"
          />
        )}
      </div>

      {/* Counter */}
      {media.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm tracking-widest font-mono">
          {currentIndex + 1} / {media.length}
        </div>
      )}
    </div>
  );
}
