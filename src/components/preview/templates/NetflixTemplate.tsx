"use client";

import { useState, useEffect, useRef } from "react";
import MediaViewer from "@/components/preview/MediaViewer";
import CinematicPlayer from "@/components/preview/CinematicPlayer";
import EmptyState from "@/components/preview/EmptyState";
import { StoryWithFullPayload } from "../PreviewClientWrapper";
import ChapterLayoutRenderer from "./../ChapterLayoutRenderer";
import { Play, Share2 } from "lucide-react";

export default function NetflixTemplate({ story, isEditable = false }: { story: StoryWithFullPayload, isEditable?: boolean }) {
  const [galleryActiveIndex, setGalleryActiveIndex] = useState<number | null>(null);
  const [isCinematicPlaying, setIsCinematicPlaying] = useState<boolean>(false);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);

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
            setActiveChapterId(entry.target.id);
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
          <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white mb-6 drop-shadow-xl leading-none">
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
        <div className="px-4 md:px-16 py-12 space-y-32">
          {chaptersWithMedia.map(({ chapter, mediaItems }) => (
            <div 
              key={chapter.id} 
              id={`chapter-${chapter.id}`}
              ref={(el) => { sectionRefs.current[`chapter-${chapter.id}`] = el; }}
              className="group/chapter relative"
            >
              {/* 3. Cinematic Chapter Introduction */}
              <div className="mb-12 max-w-3xl">
                <p className="text-rose-500 font-bold tracking-widest uppercase mb-2 text-sm opacity-80">
                  Chapter {chapter.position + 1}
                </p>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white flex items-center gap-4">
                  {chapter.emoji && <span>{chapter.emoji}</span>}
                  {chapter.title}
                </h2>
              </div>
              
              {/* 4 & 5. Layout System & Editable Preview */}
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
          ))}

          {unassignedMedia.length > 0 && (
            <div className="pt-12 border-t border-white/10">
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-white">More Memories</h2>
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
