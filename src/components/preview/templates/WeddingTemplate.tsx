"use client";

import dynamic from "next/dynamic";
import EmptyState from "@/components/preview/EmptyState";
import { useStoryTemplateData } from "@/hooks/useStoryTemplateData";
import { StoryWithFullPayload } from "../PreviewClientWrapper";
import { Play } from "lucide-react";
import Image from "next/image";
import LazyVideo from "@/components/common/LazyVideo";

const MediaViewer = dynamic(() => import("@/components/preview/MediaViewer"), { ssr: false });
const CinematicPlayer = dynamic(() => import("@/components/preview/CinematicPlayer"), { ssr: false });

export default function WeddingTemplate({ 
  story, 
  isEditable: _isEditable = false,
}: { 
  story: StoryWithFullPayload, 
  isEditable?: boolean,
}) {
  const {
    galleryActiveIndex,
    setGalleryActiveIndex,
    isCinematicPlaying,
    setIsCinematicPlaying,
    hasMedia,
    coverImage,
    allMedia,
  } = useStoryTemplateData(story);

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-[#FDFBF7] font-serif selection:bg-[#D4AF37]/30">
      {/* Wedding Hero */}
      <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
        {coverImage && (
          <div className="absolute inset-0 z-0 opacity-40">
            {coverImage.type === "VIDEO" ? (
              <LazyVideo src={coverImage.url} className="w-full h-full object-cover scale-105" autoPlay muted loop playsInline />
            ) : (
              <Image src={coverImage.url} alt="Cover" fill sizes="100vw" className="object-cover scale-105" priority />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f]/30 via-transparent to-[#0f0f0f]" />
          </div>
        )}

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
          <div className="mb-8 w-px h-24 bg-gradient-to-b from-transparent to-[#D4AF37] mx-auto" />
          
          <p className="uppercase tracking-[0.3em] text-[#D4AF37] text-sm md:text-base font-light mb-6">
            {story.occasion || "A Love Story"}
          </p>

          <h1 className="text-6xl md:text-8xl font-light tracking-tight text-[#FDFBF7] mb-8 leading-tight">
            {story.title}
          </h1>
          
          {story.eventDate && (
            <p className="text-xl md:text-2xl italic text-white/70 mb-12 font-light">
              {new Date(story.eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          )}

          {hasMedia && (
            <button
              onClick={() => setIsCinematicPlaying(true)}
              className="group flex items-center justify-center w-20 h-20 rounded-full border border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 transition-all duration-500 backdrop-blur-sm"
            >
              <Play className="w-6 h-6 text-[#D4AF37] fill-current ml-1 group-hover:scale-110 transition-transform duration-500" />
            </button>
          )}
          
          <div className="mt-24 w-px h-24 bg-gradient-to-t from-transparent to-[#D4AF37] mx-auto" />
        </div>
      </div>

      {/* Masonry Gallery */}
      {hasMedia ? (
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-24">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 text-[#D4AF37] mb-4">
              <div className="h-px w-12 bg-[#D4AF37]/30" />
              <span className="text-2xl">✧</span>
              <div className="h-px w-12 bg-[#D4AF37]/30" />
            </div>
            <h2 className="text-4xl md:text-5xl font-light tracking-wide text-[#FDFBF7]">
              The Collection
            </h2>
          </div>

          {/* Elegant Masonry/Staggered Grid */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {allMedia.map(({ item, index }) => (
              <div
                key={item.id}
                onClick={() => setGalleryActiveIndex(index)}
                className="relative break-inside-avoid cursor-pointer group rounded-sm overflow-hidden border border-white/5"
              >
                {item.type === "VIDEO" ? (
                  <LazyVideo src={item.url} className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-all duration-700" autoPlay muted loop playsInline />
                ) : (
                  <img src={item.url} alt="Media" className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-all duration-700 scale-100 group-hover:scale-105" />
                )}
                
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  {item.type === "VIDEO" && (
                    <div className="w-12 h-12 rounded-full border border-white/50 flex items-center justify-center backdrop-blur-sm">
                      <Play className="w-4 h-4 text-white fill-current ml-0.5" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState />
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
