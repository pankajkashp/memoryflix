"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import EmptyState from "@/components/preview/EmptyState";
import { useStoryTemplateData } from "@/hooks/useStoryTemplateData";
import { StoryWithFullPayload } from "../PreviewClientWrapper";
import { Play } from "lucide-react";
import Image from "next/image";
import LazyVideo from "@/components/common/LazyVideo";

const MediaViewer = dynamic(() => import("@/components/preview/MediaViewer"), { ssr: false });
const CinematicPlayer = dynamic(() => import("@/components/preview/CinematicPlayer"), { ssr: false });

export default function AppleTemplate({ 
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

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Placeholder for future scroll-based reveal animations
  }, [allMedia]);

  return (
    <div className="bg-[#F5F5F7] min-h-screen text-[#1D1D1F] font-sans">
      {/* Apple-style Hero */}
      <div className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden bg-white">
        {coverImage && (
          <div className="absolute inset-0 z-0">
            {coverImage.type === "VIDEO" ? (
              <LazyVideo src={coverImage.url} className="w-full h-full object-cover opacity-80" autoPlay muted loop playsInline />
            ) : (
              <Image src={coverImage.url} alt="Cover" fill sizes="100vw" className="object-cover opacity-80 scale-105" />
            )}
            <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#F5F5F7] via-transparent to-transparent" />
          </div>
        )}

        <div className="relative z-10 text-center px-6 flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#1D1D1F] mb-4 drop-shadow-sm">
            {story.title}
          </h1>
          {story.eventDate && (
            <p className="text-xl md:text-2xl font-medium text-[#86868B] mb-2 tracking-wide">
              {new Date(story.eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          )}
          {story.description && (
            <p className="text-lg text-[#1D1D1F]/80 max-w-2xl mx-auto mt-4 font-medium leading-relaxed">
              {story.description}
            </p>
          )}

          {hasMedia && (
            <button
              onClick={() => setIsCinematicPlaying(true)}
              className="mt-10 flex items-center gap-2 bg-[#1D1D1F] text-white px-8 py-3.5 rounded-full font-medium text-lg hover:scale-105 transition-transform shadow-xl"
            >
              <Play className="w-5 h-5 fill-current" />
              Play Memory
            </button>
          )}
        </div>
      </div>

      {/* Gallery Section */}
      {hasMedia ? (
        <div ref={containerRef} className="max-w-7xl mx-auto px-4 md:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
            {allMedia.map(({ item, index }) => (
              <div
                key={item.id}
                onClick={() => setGalleryActiveIndex(index)}
                className="relative aspect-square md:aspect-[4/3] bg-white rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-500"
              >
                {item.type === "VIDEO" ? (
                  <LazyVideo src={item.url} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                ) : (
                  <Image src={item.url} alt="Media" fill sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                )}
                
                {item.type === "VIDEO" && (
                  <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-md rounded-full p-1.5">
                    <Play className="w-4 h-4 text-[#1D1D1F] fill-current" />
                  </div>
                )}
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
