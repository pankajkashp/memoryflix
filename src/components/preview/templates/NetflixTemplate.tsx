"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import EmptyState from "@/components/preview/EmptyState";
import { StoryWithFullPayload } from "../PreviewClientWrapper";
import { Play, Share2 } from "lucide-react";
import { getPresetConfig, getAccentConfig } from "@/lib/typography-presets";
import { getFontClassName } from "@/lib/fonts";
import { useStoryTemplateData } from "@/hooks/useStoryTemplateData";
import Image from "next/image";
import LazyVideo from "@/components/common/LazyVideo";

const MediaViewer = dynamic(() => import("@/components/preview/MediaViewer"), { ssr: false });
const CinematicPlayer = dynamic(() => import("@/components/preview/CinematicPlayer"), { ssr: false });

export default function NetflixTemplate({ 
  story, 
  isEditable: _isEditable = false,
}: { 
  story: StoryWithFullPayload, 
  isEditable?: boolean,
}) {
  const presetConfig = getPresetConfig(story.typographyPreset);
  const accentConfig = getAccentConfig(story.accentColor);
  const fontClassName = getFontClassName(presetConfig.fontId);

  const {
    galleryActiveIndex,
    setGalleryActiveIndex,
    isCinematicPlaying,
    setIsCinematicPlaying,
    hasMedia,
    coverImage,
    allMedia,
  } = useStoryTemplateData(story);

  const [showShareToast, setShowShareToast] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: story.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2500);
    }
  };

  return (
    <div className={`${fontClassName} bg-[#0f0f0f] min-h-screen text-white font-sans selection:bg-rose-500/30`}>
      {/* 1. Cover Hero */}
      <div className="relative w-full h-[100svh] sm:h-[90vh] flex items-end pb-4 sm:pb-24 overflow-hidden">
        {coverImage && (
          <div className="absolute inset-0 z-0">
            {coverImage.type === "VIDEO" ? (
              <LazyVideo src={coverImage.url} className="w-full h-full object-cover opacity-80 sm:opacity-60 scale-105" autoPlay muted loop playsInline />
            ) : (
              <Image src={coverImage.url} alt="Cover" fill sizes="100vw" className="object-cover opacity-80 sm:opacity-60 scale-105" priority />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/30 sm:via-[#0f0f0f]/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f]/50 sm:from-[#0f0f0f]/80 via-transparent to-transparent" />
          </div>
        )}

        <div className="relative z-10 px-5 md:px-16 max-w-5xl w-full">
          {story.occasion && (
            <p className={`${accentConfig.text} font-bold tracking-widest uppercase mb-2 sm:mb-4 text-[10px] sm:text-sm drop-shadow-md`}>
              {story.occasion}
            </p>
          )}
          <h1 className={`${presetConfig.heroStyle} ${accentConfig.text} mb-3 sm:mb-6 leading-tight break-words max-w-full !text-4xl sm:!text-6xl md:!text-7xl`}>{story.title}</h1>
          <div className="flex items-center flex-wrap gap-2 sm:gap-4 text-zinc-300 font-medium mb-5 sm:mb-8 text-xs sm:text-lg drop-shadow-md">
            {story.eventDate && <span>{new Date(story.eventDate).getFullYear()}</span>}
            {story.eventDate && story.media.length > 0 && <span>•</span>}
            <span>{story.media.length} Memories</span>
          </div>

          <div className="flex flex-row flex-wrap items-center gap-2 sm:gap-4 w-full">
            {hasMedia && (
              <button
                onClick={() => setIsCinematicPlaying(true)}
                className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 sm:gap-2 bg-white text-black px-3 sm:px-8 py-2.5 sm:py-3.5 rounded-md font-bold text-sm sm:text-lg hover:bg-zinc-200 transition-colors whitespace-nowrap"
              >
                <Play className="w-4 h-4 sm:w-6 sm:h-6 fill-current shrink-0" /> Play Story
              </button>
            )}
            <button
              onClick={handleShare}
              className="flex-1 min-w-[100px] flex items-center justify-center gap-1.5 sm:gap-2 bg-white/20 hover:bg-white/30 text-white px-3 sm:px-8 py-2.5 sm:py-3.5 rounded-md font-bold text-sm sm:text-lg backdrop-blur-md transition-colors whitespace-nowrap"
            >
              <Share2 className="w-4 h-4 sm:w-6 sm:h-6 shrink-0" /> Share
            </button>
          </div>
          {story.description && (
            <p className="mt-4 sm:mt-8 text-zinc-300 max-w-2xl text-xs sm:text-lg leading-relaxed drop-shadow-md break-words">
              {story.description}
            </p>
          )}
        </div>
      </div>

      {/* 2. Memories Gallery */}
      {hasMedia ? (
        <div className="px-4 md:px-16 py-12">
          <div className="flex items-center gap-4 mb-10">
            <span className={`w-1.5 h-10 ${accentConfig.color} rounded-full`} />
            <div>
              <h2 className="text-3xl font-black text-white">Memories</h2>
              <p className="text-zinc-500 text-sm mt-1">{story.media.length} moments captured</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {allMedia.map(({ item, index }) => (
              <div
                key={item.id}
                onClick={() => setGalleryActiveIndex(index)}
                className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group bg-zinc-900"
              >
                {item.type === "VIDEO" ? (
                  <LazyVideo src={item.url} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" autoPlay muted loop playsInline />
                ) : (
                  <Image src={item.url} alt={item.caption || "Memory"} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" />
                )}

                {/* Video badge */}
                {item.type === "VIDEO" && (
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full p-1.5">
                    <Play className="w-3 h-3 text-white fill-current" />
                  </div>
                )}

                {/* Caption overlay */}
                {item.caption && (
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-xs font-medium truncate">{item.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState />
      )}

      {/* Share toast */}
      {showShareToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-white text-black px-6 py-3 rounded-full font-semibold text-sm shadow-2xl animate-in fade-in slide-in-from-bottom-4">
          Link copied! ✓
        </div>
      )}

      {galleryActiveIndex !== null && story.media && (
        <MediaViewer
          media={story.media}
          initialIndex={galleryActiveIndex}
          onClose={() => setGalleryActiveIndex(null)}
        />
      )}

      {isCinematicPlaying && story.media && (
        <CinematicPlayer
          media={story.media}
          initialIndex={0}
          onClose={() => setIsCinematicPlaying(false)}
        />
      )}
    </div>
  );
}
