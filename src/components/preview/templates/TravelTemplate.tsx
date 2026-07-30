"use client";


import MediaViewer from "@/components/preview/MediaViewer";
import CinematicPlayer from "@/components/preview/CinematicPlayer";
import EmptyState from "@/components/preview/EmptyState";
import { useStoryTemplateData } from "@/hooks/useStoryTemplateData";
import { StoryWithFullPayload } from "../PreviewClientWrapper";
import { MapPin, Play, Compass } from "lucide-react";

export default function TravelTemplate({ 
  story, 
  isEditable: _isEditable = false,
  onChapterChange: _onChapterChange
}: { 
  story: StoryWithFullPayload, 
  isEditable?: boolean,
  onChapterChange?: (chapterId: string | null) => void
}) {
  const {
    galleryActiveIndex,
    setGalleryActiveIndex,
    isCinematicPlaying,
    setIsCinematicPlaying,
    hasMedia,
    coverImage,
    chaptersWithMedia,
    unassignedMedia
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
                <video src={coverImage.url} className="w-full h-full object-cover grayscale-[20%] sepia-[20%]" autoPlay muted loop playsInline />
              ) : (
                 
                <img src={coverImage.url} alt="Cover" className="w-full h-full object-cover grayscale-[20%] sepia-[20%]" />
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

      {/* Travel Journey Timeline */}
      {hasMedia ? (
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-16 relative z-10">
          {/* Vertical line connecting everything */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#D4A373]/0 via-[#D4A373] to-[#D4A373]/0 hidden md:block" />

          <div className="space-y-32">
            {chaptersWithMedia.map(({ chapter, mediaItems }, chapterIdx) => {
              const isEven = chapterIdx % 2 === 0;
              return (
                <div key={chapter.id} className="relative">
                  {/* Location Marker */}
                  <div className="flex items-center justify-center mb-12 relative z-10">
                    <div className="bg-[#FAF7F2] p-2 border-2 border-[#D4A373] rounded-full">
                      {chapter.emoji ? (
                        <span className="text-2xl w-6 h-6 flex items-center justify-center">{chapter.emoji}</span>
                      ) : (
                        <MapPin className="w-6 h-6 text-[#D4A373]" />
                      )}
                    </div>
                    <div className="absolute bg-[#FAF7F2] px-6 py-2 border-y-2 border-[#D4A373] font-sans font-bold uppercase tracking-widest text-[#2C363F] shadow-sm">
                      {chapter.title}
                    </div>
                  </div>

                  {/* Polaroids Grid */}
                  <div className={`grid grid-cols-2 md:grid-cols-2 gap-8 ${isEven ? 'md:pr-12' : 'md:pl-12'} md:w-[85%] ${isEven ? 'mr-auto' : 'ml-auto'}`}>
                    {mediaItems.map(({ item, index }, i) => (
                      <div
                        key={item.id}
                        onClick={() => setGalleryActiveIndex(index)}
                        className={`bg-white p-3 pb-10 shadow-xl cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative group
                          ${i % 2 === 0 ? '-rotate-2 hover:rotate-0' : 'rotate-3 hover:rotate-0'}
                        `}
                      >
                        <div className="relative aspect-square overflow-hidden bg-zinc-100">
                          {item.type === "VIDEO" ? (
                            <video src={item.url} className="w-full h-full object-cover filter contrast-110 sepia-[15%]" autoPlay muted loop playsInline />
                          ) : (
                             
                            <img src={item.url} alt="Media" className="w-full h-full object-cover filter contrast-110 sepia-[15%]" />
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
              );
            })}

            {unassignedMedia.length > 0 && (
              <div className="relative pt-16">
                 <div className="flex items-center justify-center mb-12 relative z-10">
                    <div className="bg-[#FAF7F2] p-2 border-2 border-[#D4A373] rounded-full text-[#D4A373]">
                      <Compass className="w-6 h-6" />
                    </div>
                    <div className="absolute bg-[#FAF7F2] px-6 py-2 border-y-2 border-[#D4A373] font-sans font-bold uppercase tracking-widest text-[#2C363F] shadow-sm">
                      More Discoveries
                    </div>
                  </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {unassignedMedia.map(({ item, index }, i) => (
                    <div
                      key={item.id}
                      onClick={() => setGalleryActiveIndex(index)}
                      className={`bg-white p-2 pb-8 shadow-md cursor-pointer hover:shadow-xl hover:z-20 transition-all duration-300 relative group
                        ${i % 3 === 0 ? '-rotate-3' : i % 3 === 1 ? 'rotate-2' : '-rotate-1'}
                      `}
                    >
                      <div className="relative aspect-square overflow-hidden bg-zinc-100">
                        {item.type === "VIDEO" ? (
                          <video src={item.url} className="w-full h-full object-cover sepia-[10%]" autoPlay muted loop playsInline />
                        ) : (
                           
                          <img src={item.url} alt="Media" className="w-full h-full object-cover sepia-[10%]" />
                        )}
                      </div>
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
