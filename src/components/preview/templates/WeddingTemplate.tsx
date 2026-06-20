"use client";

import { useState } from "react";
import MediaViewer from "@/components/preview/MediaViewer";
import CinematicPlayer from "@/components/preview/CinematicPlayer";
import EmptyState from "@/components/preview/EmptyState";
import { StoryWithFullPayload } from "../PreviewClientWrapper";
import { Play } from "lucide-react";

export default function WeddingTemplate({ story, isEditable = false }: { story: StoryWithFullPayload, isEditable?: boolean }) {
  const [galleryActiveIndex, setGalleryActiveIndex] = useState<number | null>(null);
  const [isCinematicPlaying, setIsCinematicPlaying] = useState<boolean>(false);

  const hasMedia = story.media && story.media.length > 0;
  const firstImage = story.media?.find((m) => m.type === "IMAGE");
  const coverImage = story.media?.find((m) => m.id === story.coverMediaId) || firstImage;

  const chaptersWithMedia = story.chapters
    ?.map((chapter) => ({
      chapter,
      mediaItems: story.media
        .map((item, index) => ({ item, index }))
        .filter((m) => m.item.chapterId === chapter.id),
    }))
    .filter((c) => c.mediaItems.length > 0) || [];

  const unassignedMedia = story.media
    .map((item, index) => ({ item, index }))
    .filter((m) => !m.item.chapterId);

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-[#FDFBF7] font-serif selection:bg-[#D4AF37]/30">
      {/* Wedding Hero */}
      <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
        {coverImage && (
          <div className="absolute inset-0 z-0 opacity-40">
            {coverImage.type === "VIDEO" ? (
              <video src={coverImage.url} className="w-full h-full object-cover scale-105" autoPlay muted loop playsInline />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverImage.url} alt="Cover" className="w-full h-full object-cover scale-105" />
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

      {/* Gallery Section */}
      {hasMedia ? (
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-24 space-y-32">
          {chaptersWithMedia.map(({ chapter, mediaItems }) => (
            <div key={chapter.id} className="space-y-16">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-4 text-[#D4AF37]">
                  <div className="h-px w-12 bg-[#D4AF37]/30" />
                  <span className="text-2xl">{chapter.emoji || "✧"}</span>
                  <div className="h-px w-12 bg-[#D4AF37]/30" />
                </div>
                <h2 className="text-4xl md:text-5xl font-light tracking-wide text-[#FDFBF7]">
                  {chapter.title}
                </h2>
              </div>
              
              {/* Elegant Masonry/Staggered Grid */}
              <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                {mediaItems.map(({ item, index }) => (
                  <div
                    key={item.id}
                    onClick={() => setGalleryActiveIndex(index)}
                    className="relative break-inside-avoid cursor-pointer group rounded-sm overflow-hidden border border-white/5"
                  >
                    {item.type === "VIDEO" ? (
                      <video src={item.url} className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-all duration-700" autoPlay muted loop playsInline />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
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
          ))}

          {unassignedMedia.length > 0 && (
            <div className="space-y-16 pt-16 border-t border-white/5">
              {chaptersWithMedia.length > 0 && (
                <div className="text-center">
                  <h2 className="text-3xl md:text-4xl font-light tracking-wide text-[#FDFBF7] italic">
                    The Collection
                  </h2>
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {unassignedMedia.map(({ item, index }) => (
                  <div
                    key={item.id}
                    onClick={() => setGalleryActiveIndex(index)}
                    className="relative aspect-[3/4] cursor-pointer group overflow-hidden border border-white/5"
                  >
                    {item.type === "VIDEO" ? (
                      <video src={item.url} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700" autoPlay muted loop playsInline />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.url} alt="Media" className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
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
          chapters={story.chapters}
          initialIndex={0}
          onClose={() => setIsCinematicPlaying(false)}
        />
      )}
    </div>
  );
}
