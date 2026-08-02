"use client";

import dynamic from "next/dynamic";
import EmptyState from "@/components/preview/EmptyState";
import { useStoryTemplateData } from "@/hooks/useStoryTemplateData";
import { StoryWithFullPayload } from "../PreviewClientWrapper";
import { Play, BookOpen } from "lucide-react";
import Image from "next/image";
import LazyVideo from "@/components/common/LazyVideo";

const MediaViewer = dynamic(() => import("@/components/preview/MediaViewer"), { ssr: false });
const CinematicPlayer = dynamic(() => import("@/components/preview/CinematicPlayer"), { ssr: false });

export default function TimelineTemplate({ 
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
    allMedia,
  } = useStoryTemplateData(story);

  return (
    <div className="bg-[#f8f9fa] min-h-screen text-[#343a40] font-sans">
      {/* Timeline Hero */}
      <div className="relative w-full h-[60vh] flex flex-col items-center justify-center bg-white border-b border-zinc-200">
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, #f8f9fa 25%, #f8f9fa 75%, #000 75%, #000)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }} />
        
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto mt-12">
          <div className="w-16 h-16 bg-[#e9ecef] rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner shadow-black/5 rotate-3">
            <BookOpen className="w-8 h-8 text-[#6c757d]" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#212529] mb-4">
            {story.title}
          </h1>
          
          <p className="text-lg md:text-xl text-[#6c757d] mb-8 font-medium">
            A chronological journey of moments and memories.
          </p>

          {hasMedia && (
            <button
              onClick={() => setIsCinematicPlaying(true)}
              className="inline-flex items-center gap-2 bg-[#212529] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#343a40] transition-colors shadow-md"
            >
              <Play className="w-4 h-4 fill-current" />
              Watch Story
            </button>
          )}
        </div>
      </div>

      {/* Media Grid */}
      {hasMedia ? (
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-24">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {allMedia.map(({ item, index }) => (
              <div
                key={item.id}
                onClick={() => setGalleryActiveIndex(index)}
                className="relative bg-white p-4 rounded-2xl shadow-sm border border-zinc-100 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative aspect-video md:aspect-[4/3] rounded-xl overflow-hidden bg-zinc-50">
                  {item.type === "VIDEO" ? (
                    <LazyVideo src={item.url} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                  ) : (
                    <Image src={item.url} alt="Media" fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover" />
                  )}
                  
                  {item.type === "VIDEO" && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md rounded-full p-2 shadow-sm">
                      <Play className="w-4 h-4 text-[#212529] fill-current" />
                    </div>
                  )}
                </div>
                
                {item.caption && (
                  <p className="mt-4 text-[#6c757d] font-medium text-sm text-center">
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
