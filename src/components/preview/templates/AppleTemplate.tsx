"use client";

import { useState, useRef, useEffect } from "react";
import MediaViewer from "@/components/preview/MediaViewer";
import CinematicPlayer from "@/components/preview/CinematicPlayer";
import EmptyState from "@/components/preview/EmptyState";
import { StoryWithFullPayload } from "../PreviewClientWrapper";
import { Play } from "lucide-react";

export default function AppleTemplate({ 
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
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

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

  useEffect(() => {
    if (!onChapterChange) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const chapId = entry.target.id.replace("chapter-", "");
            onChapterChange(chapId);
          }
        });
      },
      { rootMargin: "-20% 0px -80% 0px" }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [chaptersWithMedia, onChapterChange]);

  const unassignedMedia = story.media
    .map((item, index) => ({ item, index }))
    .filter((m) => !m.item.chapterId);

  return (
    <div className="bg-[#F5F5F7] min-h-screen text-[#1D1D1F] font-sans">
      {/* Apple-style Hero */}
      <div className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden bg-white">
        {coverImage && (
          <div className="absolute inset-0 z-0">
            {coverImage.type === "VIDEO" ? (
              <video src={coverImage.url} className="w-full h-full object-cover opacity-80" autoPlay muted loop playsInline />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverImage.url} alt="Cover" className="w-full h-full object-cover opacity-80 scale-105" />
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
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 space-y-24">
          {chaptersWithMedia.map(({ chapter, mediaItems }) => (
            <div 
              key={chapter.id} 
              id={`chapter-${chapter.id}`}
              ref={(el) => { sectionRefs.current[`chapter-${chapter.id}`] = el; }}
              className="space-y-6"
            >
              <div className="border-b border-[#D2D2D7] pb-4">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1D1D1F] flex items-center gap-3">
                  {chapter.emoji && <span>{chapter.emoji}</span>}
                  {chapter.title}
                </h2>
              </div>
              
              {/* Clean Apple-style Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                {mediaItems.map(({ item, index }) => (
                  <div
                    key={item.id}
                    onClick={() => setGalleryActiveIndex(index)}
                    className="relative aspect-square md:aspect-[4/3] bg-white rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-500"
                  >
                    {item.type === "VIDEO" ? (
                      <video src={item.url} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.url} alt="Media" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
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
          ))}

          {unassignedMedia.length > 0 && (
            <div className="space-y-6">
              {chaptersWithMedia.length > 0 && (
                <div className="border-b border-[#D2D2D7] pb-4">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1D1D1F]">
                    All Photos
                  </h2>
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                {unassignedMedia.map(({ item, index }) => (
                  <div
                    key={item.id}
                    onClick={() => setGalleryActiveIndex(index)}
                    className="relative aspect-square md:aspect-[4/3] bg-white rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-500"
                  >
                    {item.type === "VIDEO" ? (
                      <video src={item.url} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.url} alt="Media" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
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
