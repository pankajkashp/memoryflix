"use client";

import dynamic from "next/dynamic";
import EmptyState from "@/components/preview/EmptyState";
import { useStoryTemplateData } from "@/hooks/useStoryTemplateData";
import { StoryWithFullPayload } from "../PreviewClientWrapper";
import { MapPin, Play, Compass } from "lucide-react";
import Image from "next/image";
import LazyVideo from "@/components/common/LazyVideo";

const MediaViewer = dynamic(() => import("@/components/preview/MediaViewer"), { ssr: false });
const CinematicPlayer = dynamic(() => import("@/components/preview/CinematicPlayer"), { ssr: false });

export default function TravelTemplate({ 
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
    <div className="bg-[#FAF7F2] min-h-screen text-[#2C363F] font-serif relative overflow-hidden">
      {/* Background texture pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#2C363F 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      {/* Travel Hero */}
      <div className="relative max-w-5xl mx-auto pt-24 pb-16 px-6 text-center z-10">
        <Compass className="w-12 h-12 mx-auto mb-6 text-[#D4A373] opacity-80" />
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#2C363F] mb-6 uppercase">
          {story.title}
        </h1>
        
        <div className="flex items-center justify-center gap-4 text-[#8C7A6B] uppercase tracking-widest text-sm mb-8 font-sans font-semibold">
          {story.occasion && <span>{story.occasion}</span>}
          {story.occasion && story.eventDate && <span>•</span>}
          {story.eventDate && <span>{new Date(story.eventDate).getFullYear()}</span>}
        </div>

        {coverImage && (
          <div className="relative w-full aspect-[21/9] rounded-sm overflow-hidden shadow-2xl p-2 bg-white rotate-1 hover:rotate-0 transition-transform duration-500 max-w-4xl mx-auto">
            <div className="w-full h-full relative overflow-hidden">
              {coverImage.type === "VIDEO" ? (
                <LazyVideo src={coverImage.url} className="w-full h-full object-cover grayscale-[20%] sepia-[20%]" autoPlay muted loop playsInline />
              ) : (
                <Image src={coverImage.url} alt="Cover" fill sizes="100vw" className="object-cover grayscale-[20%] sepia-[20%]" priority />
              )}
            </div>
            {/* Vintage tape effect corners */}
            <div className="absolute -top-2 -left-2 w-8 h-4 bg-white/50 backdrop-blur-sm -rotate-45 shadow-sm" />
            <div className="absolute -bottom-2 -right-2 w-8 h-4 bg-white/50 backdrop-blur-sm -rotate-45 shadow-sm" />
          </div>
        )}

        {hasMedia && (
          <button
            onClick={() => setIsCinematicPlaying(true)}
            className="mt-12 flex items-center gap-3 bg-[#D4A373] text-white px-8 py-4 font-sans font-bold uppercase tracking-wider hover:bg-[#C28E5B] transition-colors mx-auto shadow-lg"
          >
            <Play className="w-5 h-5 fill-current" />
            Start Journey
          </button>
        )}
      </div>

      {/* Polaroid Grid */}
      {hasMedia ? (
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-16 relative z-10">
          <div className="flex items-center justify-center mb-12">
            <div className="bg-[#FAF7F2] p-2 border-2 border-[#D4A373] rounded-full">
              <MapPin className="w-6 h-6 text-[#D4A373]" />
            </div>
            <div className="ml-4 font-sans font-bold uppercase tracking-widest text-[#2C363F]">
              The Journey
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {allMedia.map(({ item, index }, i) => (
              <div
                key={item.id}
                onClick={() => setGalleryActiveIndex(index)}
                className={`bg-white p-3 pb-10 shadow-xl cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative group
                  ${i % 2 === 0 ? '-rotate-2 hover:rotate-0' : 'rotate-3 hover:rotate-0'}
                `}
              >
                <div className="relative aspect-square overflow-hidden bg-zinc-100">
                  {item.type === "VIDEO" ? (
                    <LazyVideo src={item.url} className="w-full h-full object-cover filter contrast-110 sepia-[15%]" autoPlay muted loop playsInline />
                  ) : (
                    <Image src={item.url} alt="Media" fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover filter contrast-110 sepia-[15%]" />
                  )}
                  
                  {item.type === "VIDEO" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors">
                      <Play className="w-8 h-8 text-white fill-current opacity-80" />
                    </div>
                  )}
                </div>
                {item.caption && (
                  <p className="absolute bottom-3 left-0 right-0 text-center font-handwriting text-[#2C363F] text-sm px-4 truncate font-medium">
                    {item.caption}
                  </p>
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
