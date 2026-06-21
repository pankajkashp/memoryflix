"use client";

import { useState } from "react";
import MediaViewer from "@/components/preview/MediaViewer";
import CinematicPlayer from "@/components/preview/CinematicPlayer";
import EmptyState from "@/components/preview/EmptyState";
import { StoryWithFullPayload } from "../PreviewClientWrapper";
import { Play, BookOpen } from "lucide-react";

export default function TimelineTemplate({ 
  story, 
  isEditable = false,
  onChapterChange
}: { 
  story: StoryWithFullPayload, 
  isEditable?: boolean,
  onChapterChange?: (chapterId: string | null) => void
}) {
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

      {/* Timeline Gallery */}
      {hasMedia ? (
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-24 relative">
          {/* Main vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-zinc-200 rounded-full md:-translate-x-1/2" />

          <div className="space-y-24">
            {chaptersWithMedia.map(({ chapter, mediaItems }, chapterIdx) => {
              const isEven = chapterIdx % 2 === 0;
              return (
                <div key={chapter.id} className="relative">
                  {/* Timeline Node */}
                  <div className="absolute left-6 md:left-1/2 top-0 w-8 h-8 bg-white border-4 border-[#212529] rounded-full -translate-x-[14px] md:-translate-x-1/2 z-10 flex items-center justify-center shadow-md">
                    <div className="w-2 h-2 bg-[#212529] rounded-full" />
                  </div>

                  {/* Chapter Header */}
                  <div className={`ml-16 md:ml-0 md:w-1/2 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12 md:ml-auto md:text-left'} pt-1 mb-8`}>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#212529] flex items-center gap-3 md:justify-end">
                      {isEven ? (
                        <>
                          <span>{chapter.title}</span>
                          {chapter.emoji && <span className="text-3xl bg-zinc-100 p-2 rounded-xl">{chapter.emoji}</span>}
                        </>
                      ) : (
                        <>
                          {chapter.emoji && <span className="text-3xl bg-zinc-100 p-2 rounded-xl">{chapter.emoji}</span>}
                          <span>{chapter.title}</span>
                        </>
                      )}
                    </h2>
                  </div>
                  
                  {/* Chapter Media Timeline */}
                  <div className={`ml-16 md:ml-0 space-y-12`}>
                    {mediaItems.map(({ item, index }, mediaIdx) => {
                      // Alternate individual items side to side if on desktop
                      const isItemEven = (chapterIdx + mediaIdx) % 2 === 0;
                      return (
                        <div key={item.id} className={`md:w-1/2 relative ${isItemEven ? 'md:pr-12' : 'md:pl-12 md:ml-auto'}`}>
                          {/* Mini dot for media item */}
                          <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-zinc-300 rounded-full z-10 
                            ${isItemEven ? '-right-2' : '-left-2'}`} />
                          
                          {/* Connecting line */}
                          <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 h-0.5 bg-zinc-200 z-0
                            ${isItemEven ? 'right-0 w-12' : 'left-0 w-12'}`} />

                          <div
                            onClick={() => setGalleryActiveIndex(index)}
                            className="relative bg-white p-4 rounded-2xl shadow-sm border border-zinc-100 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 z-10"
                          >
                            <div className="relative aspect-video md:aspect-[4/3] rounded-xl overflow-hidden bg-zinc-50">
                              {item.type === "VIDEO" ? (
                                <video src={item.url} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                              ) : (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={item.url} alt="Media" className="w-full h-full object-cover" />
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
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {unassignedMedia.length > 0 && (
              <div className="relative pt-12">
                {/* Timeline End Node */}
                <div className="absolute left-6 md:left-1/2 top-12 w-6 h-6 bg-zinc-200 rounded-full -translate-x-[10px] md:-translate-x-1/2 z-10 border-4 border-white shadow-sm" />

                <div className="ml-16 md:ml-0 text-center mb-12">
                  <h2 className="text-2xl font-bold text-[#6c757d] inline-block bg-[#f8f9fa] px-4 relative z-20">
                    Additional Memories
                  </h2>
                </div>
                
                <div className="ml-16 md:ml-0 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {unassignedMedia.map(({ item, index }) => (
                    <div
                      key={item.id}
                      onClick={() => setGalleryActiveIndex(index)}
                      className="relative aspect-square bg-white rounded-xl overflow-hidden cursor-pointer shadow-sm border border-zinc-100 hover:shadow-md transition-shadow"
                    >
                      {item.type === "VIDEO" ? (
                        <video src={item.url} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.url} alt="Media" className="w-full h-full object-cover" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
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
          chapters={story.chapters}
          initialIndex={0}
          onClose={() => setIsCinematicPlaying(false)}
        />
      )}
    </div>
  );
}
