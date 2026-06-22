"use client";

import { useState, useEffect, useRef } from "react";
import MediaViewer from "@/components/preview/MediaViewer";
import CinematicPlayer from "@/components/preview/CinematicPlayer";
import EmptyState from "@/components/preview/EmptyState";
import { StoryWithFullPayload } from "../PreviewClientWrapper";
import ChapterLayoutRenderer from "./../ChapterLayoutRenderer";
import { Play, Share2 } from "lucide-react";
import { getPresetConfig } from "@/lib/typography-presets";

export default function NetflixTemplate({ 
  story, 
  isEditable = false,
  onChapterChange
}: { 
  story: StoryWithFullPayload, 
  isEditable?: boolean,
  onChapterChange?: (chapterId: string | null) => void 
}) {
  const presetConfig = getPresetConfig(story.typographyPreset);
  const [galleryActiveIndex, setGalleryActiveIndex] = useState<number | null>(null);
  const [isCinematicPlaying, setIsCinematicPlaying] = useState<boolean>(false);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [selectedChapterView, setSelectedChapterView] = useState<string | null>(null);

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

  // Intersection Observer for sticky nav highlighting
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const chapId = entry.target.id.replace("chapter-", "");
            setActiveChapterId(`chapter-${chapId}`);
            if (onChapterChange) onChapterChange(chapId);
          }
        });
      },
      { rootMargin: "-20% 0px -80% 0px" }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [chaptersWithMedia]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: story.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white font-sans selection:bg-rose-500/30">
      {/* 1. Cover Hero */}
      <div className="relative w-full h-[90vh] flex items-end pb-24 overflow-hidden">
        {coverImage && (
          <div className="absolute inset-0 z-0">
            {coverImage.type === "VIDEO" ? (
              <video src={coverImage.url} className="w-full h-full object-cover opacity-60 scale-105" autoPlay muted loop playsInline />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverImage.url} alt="Cover" className="w-full h-full object-cover opacity-60 scale-105" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f]/80 via-transparent to-transparent" />
          </div>
        )}

        <div className="relative z-10 px-8 md:px-16 max-w-5xl">
          {story.occasion && (
            <p className="text-rose-500 font-bold tracking-widest uppercase mb-4 text-sm drop-shadow-md">
              {story.occasion}
            </p>
          )}
          <h1 className={`${presetConfig.heroStyle} mb-6 leading-none`}>
            {story.title}
          </h1>
          <div className="flex items-center gap-4 text-zinc-300 font-medium mb-8 text-lg drop-shadow-md">
            {story.eventDate && (
              <span>{new Date(story.eventDate).getFullYear()}</span>
            )}
            {story.eventDate && story.chapters && story.chapters.length > 0 && <span>•</span>}
            {story.chapters && story.chapters.length > 0 && (
              <span>{story.chapters.length} Chapters</span>
            )}
          </div>

          <div className="flex items-center gap-4">
            {hasMedia && (
              <button
                onClick={() => setIsCinematicPlaying(true)}
                className="flex items-center gap-2 bg-white text-black px-8 py-3.5 rounded-md font-bold text-lg hover:bg-zinc-200 transition-colors"
              >
                <Play className="w-6 h-6 fill-current" />
                Play
              </button>
            )}
            <button
              onClick={handleShare}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-8 py-3.5 rounded-md font-bold text-lg backdrop-blur-md transition-colors"
            >
              <Share2 className="w-6 h-6" />
              Share
            </button>
          </div>
          {story.description && (
            <p className="mt-8 text-zinc-300 max-w-2xl text-lg leading-relaxed drop-shadow-md">
              {story.description}
            </p>
          )}
        </div>
      </div>

      {/* 2. Sticky Navigation */}
      {chaptersWithMedia.length > 0 && (
        <div className="sticky top-0 z-40 bg-[#0f0f0f]/90 backdrop-blur-xl border-b border-white/10 hidden md:block">
          <div className="px-8 md:px-16 flex items-center gap-8 overflow-x-auto hide-scrollbar py-4">
            {chaptersWithMedia.map(({ chapter }) => (
              <a
                key={chapter.id}
                href={`#chapter-${chapter.id}`}
                className={`whitespace-nowrap font-medium transition-colors ${
                  activeChapterId === `chapter-${chapter.id}`
                    ? "text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {chapter.emoji && <span className="mr-2">{chapter.emoji}</span>}
                {chapter.title}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Chapters Content */}
      {hasMedia ? (
        selectedChapterView ? (() => {
          const chapterData = chaptersWithMedia.find(c => c.chapter.id === selectedChapterView);
          if (!chapterData) return null;
          const { chapter, mediaItems } = chapterData;
          return (
            <div className="px-4 md:px-16 py-12 min-h-screen bg-[#0f0f0f] animate-in fade-in duration-500">
              <button 
                onClick={() => setSelectedChapterView(null)}
                className="sticky top-24 z-50 mb-12 flex items-center gap-2 text-zinc-400 hover:text-white bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 transition-colors w-fit"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back to Story
              </button>
              
              <div className="flex flex-col items-center justify-center text-center py-24 max-w-4xl mx-auto">
                <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mb-12"></div>
                <div className="flex items-center gap-4 text-rose-500/80 font-bold tracking-[0.4em] uppercase mb-6 text-sm md:text-base">
                  <span>Chapter {chapter.position + 1}</span>
                  {chapter.date && (
                    <>
                      <span>•</span>
                      <span>{new Date(chapter.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    </>
                  )}
                  {chapter.location && (
                    <>
                      <span>•</span>
                      <span>{chapter.location}</span>
                    </>
                  )}
                </div>
                <h2 className={`${presetConfig.chapterStyle} mb-8 drop-shadow-2xl flex flex-col items-center gap-8`}>
                  {chapter.emoji && <span className="text-6xl md:text-8xl drop-shadow-xl block">{chapter.emoji}</span>}
                  {chapter.title}
                </h2>
                {chapter.subtitle && (
                  <p className="text-xl md:text-2xl text-zinc-300 italic font-medium max-w-2xl drop-shadow-md">
                    &quot;{chapter.subtitle}&quot;
                  </p>
                )}
                <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mt-12"></div>
              </div>

              <ChapterLayoutRenderer
                chapter={chapter}
                mediaItems={mediaItems}
                storyId={story.id}
                chapters={story.chapters!}
                coverMediaId={story.coverMediaId}
                isEditable={isEditable}
                onMediaSelect={(index) => setGalleryActiveIndex(index)}
              />
            </div>
          );
        })() : (
          <div className="px-4 md:px-16 py-12 space-y-24">
            {/* Episodes / Chapter Cards */}
            {chaptersWithMedia.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                  <span className="w-2 h-8 bg-rose-500 rounded-full"></span>
                  Chapters
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {chaptersWithMedia.map(({ chapter, mediaItems }) => {
                    const firstMedia = mediaItems[0]?.item;
                    return (
                      <div 
                        key={chapter.id}
                        className="group relative rounded-xl overflow-hidden bg-zinc-900 border border-white/10 cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:border-white/30 hover:shadow-2xl hover:shadow-rose-500/20"
                        onClick={() => setSelectedChapterView(chapter.id)}
                      >
                        <div className="aspect-video relative overflow-hidden">
                          {firstMedia?.type === "VIDEO" ? (
                            <video src={firstMedia.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                          ) : (
                            <img src={firstMedia?.url || "/placeholder.jpg"} alt={chapter.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
                          
                          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                {chapter.emoji && <span className="text-xl drop-shadow-md">{chapter.emoji}</span>}
                                <h3 className="text-xl font-bold text-white drop-shadow-md truncate">{chapter.title}</h3>
                              </div>
                              <p className="text-sm font-medium text-zinc-300">{mediaItems.length} Memories</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-rose-500 transition-colors">
                              <Play className="w-5 h-5 text-white fill-current translate-x-0.5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {unassignedMedia.length > 0 && (
              <div className="pt-12 border-t border-white/5">
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">More From This Story</h2>
                </div>
                <ChapterLayoutRenderer
                  mediaItems={unassignedMedia}
                  storyId={story.id}
                  chapters={story.chapters || []}
                  coverMediaId={story.coverMediaId}
                  isEditable={isEditable}
                  onMediaSelect={(index) => setGalleryActiveIndex(index)}
                />
              </div>
            )}

            {/* Netflix Feel - Recommended Memories & Continue The Story */}
            <div className="pt-12 border-t border-white/5 space-y-16">
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Recommended Memories</h3>
                <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar snap-x snap-mandatory">
                  {story.media.slice(0, Math.min(5, story.media.length)).map((item, idx) => (
                    <div 
                      key={`rec-${item.id}`}
                      onClick={() => setGalleryActiveIndex(idx)}
                      className="snap-start shrink-0 w-64 md:w-80 aspect-video rounded-xl bg-zinc-900 overflow-hidden relative group cursor-pointer border border-white/10"
                    >
                      {item.type === "VIDEO" ? (
                        <video src={item.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                      ) : (
                        <img src={item.url} alt="Rec" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                        <Play className="w-8 h-8 text-white fill-current mb-2 drop-shadow-md" />
                        <p className="text-white font-bold drop-shadow-md">Play Highlight</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Continue The Story</h3>
                <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar snap-x snap-mandatory">
                  {[...story.media].reverse().slice(0, Math.min(4, story.media.length)).map((item, idx) => (
                    <div 
                      key={`cont-${item.id}`}
                      onClick={() => setGalleryActiveIndex(story.media.length - 1 - idx)}
                      className="snap-start shrink-0 w-72 md:w-96 aspect-[4/3] rounded-xl bg-zinc-900 overflow-hidden relative group cursor-pointer border border-white/10"
                    >
                      {item.type === "VIDEO" ? (
                        <video src={item.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                      ) : (
                        <img src={item.url} alt="Cont" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                      )}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500" />
                      <div className="absolute top-4 left-4">
                        <div className="bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Recently Added</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
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
