"use client";

import { useState, useEffect, useRef } from "react";
import MediaViewer from "@/components/preview/MediaViewer";
import CinematicPlayer from "@/components/preview/CinematicPlayer";
import EmptyState from "@/components/preview/EmptyState";
import { StoryWithFullPayload } from "../PreviewClientWrapper";
import ChapterLayoutRenderer from "./../ChapterLayoutRenderer";
import { Play, Share2, ArrowLeft, ArrowRight, ChevronLeft, MapPin, Calendar, Image as ImageIcon, ChevronRight } from "lucide-react";
import { getPresetConfig, getAccentConfig } from "@/lib/typography-presets";
import { getFontClassName } from "@/lib/fonts";
import { motion } from "framer-motion";

type ChapterWithMedia = {
  chapter: import("@prisma/client").Chapter;
  mediaItems: { item: import("@prisma/client").MediaAsset; index: number }[];
};

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
  const accentConfig = getAccentConfig(story.accentColor);
  const fontClassName = getFontClassName(presetConfig.fontId);
  const [galleryActiveIndex, setGalleryActiveIndex] = useState<number | null>(null);
  const [isCinematicPlaying, setIsCinematicPlaying] = useState<boolean>(false);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [showChapterIntro, setShowChapterIntro] = useState<boolean>(false);

  const hasMedia = story.media && story.media.length > 0;
  const firstImage = story.media?.find((m) => m.type === "IMAGE");
  const coverImage = story.media?.find((m) => m.id === story.coverMediaId) || firstImage;

  // Show ALL chapters (even those without media assigned yet)
  const allChapters: ChapterWithMedia[] = (story.chapters ?? [])
    .map((chapter) => ({
      chapter,
      mediaItems: story.media
        .map((item, index) => ({ item, index }))
        .filter((m) => m.item.chapterId === chapter.id),
    }));

  // Only use chapters with media for the chapter experience
  const chaptersWithMedia: ChapterWithMedia[] = allChapters.filter((c) => c.mediaItems.length > 0);

  const unassignedMedia = story.media
    .map((item, index) => ({ item, index }))
    .filter((m) => !m.item.chapterId);

  const currentChapterIndex = chaptersWithMedia.findIndex(c => c.chapter.id === selectedChapterId);
  const currentChapterData = currentChapterIndex >= 0 ? chaptersWithMedia[currentChapterIndex] : null;
  const nextChapterData = currentChapterIndex >= 0 && currentChapterIndex < chaptersWithMedia.length - 1 
    ? chaptersWithMedia[currentChapterIndex + 1] : null;
  const prevChapterData = currentChapterIndex > 0 
    ? chaptersWithMedia[currentChapterIndex - 1] : null;

  const openChapter = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    setShowChapterIntro(true);
    if (onChapterChange) onChapterChange(chapterId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToChapter = (chapterId: string | null) => {
    setSelectedChapterId(chapterId);
    setShowChapterIntro(chapterId !== null);
    if (onChapterChange) onChapterChange(chapterId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const backToStory = () => {
    setSelectedChapterId(null);
    setShowChapterIntro(false);
    if (onChapterChange) onChapterChange(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: story.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // ─── CHAPTER INTRO SCREEN ───────────────────────────────────────────────────
  if (showChapterIntro && currentChapterData) {
    const { chapter, mediaItems } = currentChapterData;
    const chapterCover = chapter.coverMediaId 
      ? mediaItems.find(m => m.item.id === chapter.coverMediaId)?.item || mediaItems[0]?.item
      : mediaItems[0]?.item;
    const chapterNum = currentChapterIndex + 1;
    const totalChapters = chaptersWithMedia.length;

    return (
      <div className={`${fontClassName} bg-black min-h-screen text-white flex flex-col items-center justify-center relative overflow-hidden`}>
        {/* Cinematic full-screen background */}
        {chapterCover && (
          <div className="absolute inset-0 z-0 overflow-hidden bg-black">
            {chapterCover.type === "IMAGE" ? (
              <motion.img
                initial={{ scale: 1 }}
                animate={{ scale: 1.1 }}
                transition={{ duration: 20, ease: "linear" }}
                src={chapterCover.url}
                alt=""
                className="w-full h-full object-cover opacity-60"
              />
            ) : (
              <video
                src={chapterCover.url}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-60"
              />
            )}
            <div className="absolute inset-0 bg-black/80" />
          </div>
        )}

        {/* Back to story */}
        <button
          onClick={backToStory}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 text-zinc-400 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 transition-all"
        >
          <ChevronLeft className="w-5 h-5" /> All Chapters
        </button>

        {/* Chapter progress */}
        <div className="absolute top-6 right-6 z-20 text-zinc-500 text-sm font-medium bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          Chapter {chapterNum} of {totalChapters}
        </div>

        {/* Cinematic Intro Content */}
        <div className="relative z-10 text-center max-w-3xl mx-auto px-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-rose-500/60 to-transparent mx-auto mb-12" />
          
          <p className={`${accentConfig.text} font-bold tracking-[0.4em] uppercase text-sm mb-6`}>
            Chapter {chapterNum} • {chaptersWithMedia.length} Episodes
          </p>

          {chapter.emoji && (
            <div className="text-7xl md:text-9xl mb-8 drop-shadow-2xl animate-in zoom-in duration-500 delay-200">
              {chapter.emoji}
            </div>
          )}

          <h1 className={`${presetConfig.heroStyle} ${accentConfig.text} mb-4`}>
            {chapter.title}
          </h1>

          {chapter.subtitle && (
            <p className="text-xl md:text-2xl text-zinc-300 italic mb-8 font-medium">
              &quot;{chapter.subtitle}&quot;
            </p>
          )}

          <div className="flex items-center justify-center gap-6 text-zinc-400 font-medium mb-12 flex-wrap">
            {chapter.date && (
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rose-500" />
                {new Date(chapter.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
            )}
            {chapter.location && (
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500" /> {chapter.location}
              </span>
            )}
            <span className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-rose-500" /> {mediaItems.length} Memories
            </span>
          </div>

          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-rose-500/60 to-transparent mx-auto mb-12" />

          <button
            onClick={() => setShowChapterIntro(false)}
            className="inline-flex items-center gap-3 bg-white text-black px-10 py-4 rounded-full font-black text-lg hover:bg-rose-50 transition-all hover:scale-105 active:scale-95 shadow-2xl"
          >
            <Play className="w-5 h-5 fill-current" />
            Begin Chapter
          </button>

          {/* Prev / Next */}
          <div className="flex items-center justify-center gap-4 mt-8">
            {prevChapterData && (
              <button
                onClick={() => goToChapter(prevChapterData.chapter.id)}
                className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" /> {prevChapterData.chapter.emoji} {prevChapterData.chapter.title}
              </button>
            )}
            {nextChapterData && (
              <button
                onClick={() => goToChapter(nextChapterData.chapter.id)}
                className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm ml-auto"
              >
                {nextChapterData.chapter.emoji} {nextChapterData.chapter.title} <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── CHAPTER MEMORY EXPERIENCE ──────────────────────────────────────────────
  if (selectedChapterId && currentChapterData) {
    const { chapter, mediaItems } = currentChapterData;
    const chapterNum = currentChapterIndex + 1;
    const totalChapters = chaptersWithMedia.length;
    const videoCount = mediaItems.filter(m => m.item.type === "VIDEO").length;

    return (
      <div className={`${fontClassName} bg-[#0f0f0f] min-h-screen text-white font-sans selection:bg-rose-500/30`}>
        {/* ── Chapter Navigation Bar ── */}
        <div className="sticky top-0 z-40 bg-[#0f0f0f]/95 backdrop-blur-xl border-b border-white/10">
          <div className="px-6 md:px-12 flex items-center gap-4 py-4">
            <button
              onClick={backToStory}
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">All Chapters</span>
            </button>

            <div className="flex-1 flex items-center justify-center gap-3 overflow-x-auto hide-scrollbar">
              {chaptersWithMedia.map(({ chapter: ch }, i) => (
                <button
                  key={ch.id}
                  onClick={() => openChapter(ch.id)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    ch.id === selectedChapterId
                      ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                      : "text-zinc-500 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {ch.emoji && <span>{ch.emoji}</span>}
                  <span className="hidden sm:inline">{ch.title}</span>
                  <span className="sm:hidden">{i + 1}</span>
                </button>
              ))}
            </div>

            <div className="shrink-0 flex items-center gap-2">
              {prevChapterData && (
                <button
                  onClick={() => goToChapter(prevChapterData.chapter.id)}
                  title={prevChapterData.chapter.title}
                  className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <span className="text-xs font-medium text-zinc-600 hidden sm:inline">{chapterNum}/{totalChapters}</span>
              {nextChapterData && (
                <button
                  onClick={() => goToChapter(nextChapterData.chapter.id)}
                  title={nextChapterData.chapter.title}
                  className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Chapter Title Header ── */}
        <div className="px-6 md:px-16 pt-12 pb-8">
          <div className={`flex items-center gap-3 ${accentConfig.text} font-bold tracking-[0.3em] uppercase text-xs mb-4 opacity-80`}>
            <span>Chapter {chapterNum} of {totalChapters}</span>
            {chapter.date && <><span>•</span><span>{new Date(chapter.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span></>}
            {chapter.location && <><span>•</span><span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{chapter.location}</span></>}
          </div>
          <h2 className={`${presetConfig.chapterStyle} ${accentConfig.text} mb-3 flex items-center gap-4`}>
            {chapter.emoji && <span className="text-5xl md:text-7xl">{chapter.emoji}</span>}
            {chapter.title}
          </h2>
          {chapter.subtitle && (
            <p className="text-xl text-zinc-400 italic">&quot;{chapter.subtitle}&quot;</p>
          )}
        </div>

        {/* ── Media Layout ── */}
        <div className="px-4 md:px-16 pb-8 group/chapter">
          <ChapterLayoutRenderer
            chapter={chapter}
            mediaItems={mediaItems}
            storyId={story.id}
            chapters={story.chapters ?? []}
            coverMediaId={story.coverMediaId}
            isEditable={isEditable}
            onMediaSelect={(index) => setGalleryActiveIndex(index)}
            nextChapter={nextChapterData?.chapter ?? null}
            onNextChapter={nextChapterData ? () => goToChapter(nextChapterData.chapter.id) : undefined}
            chapterIndex={currentChapterIndex}
            totalChapters={chaptersWithMedia.length}
            videoCount={videoCount}
          />
        </div>

        {/* ── Lightbox ── */}
        {galleryActiveIndex !== null && story.media && (
          <MediaViewer
            media={story.media}
            initialIndex={galleryActiveIndex}
            onClose={() => setGalleryActiveIndex(null)}
          />
        )}
      </div>
    );
  }

  // ─── HOMEPAGE (Story Overview) ──────────────────────────────────────────────
  return (
    <div className={`${fontClassName} bg-[#0f0f0f] min-h-screen text-white font-sans selection:bg-rose-500/30`}>
      {/* 1. Cover Hero */}
      <div className="relative w-full h-[100svh] sm:h-[90vh] flex items-end pb-4 sm:pb-24 overflow-hidden">
        {coverImage && (
          <div className="absolute inset-0 z-0">
            {coverImage.type === "VIDEO" ? (
              <video src={coverImage.url} className="w-full h-full object-cover opacity-80 sm:opacity-60 scale-105" autoPlay muted loop playsInline />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverImage.url} alt="Cover" className="w-full h-full object-cover opacity-80 sm:opacity-60 scale-105" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/30 sm:via-[#0f0f0f]/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f]/50 sm:from-[#0f0f0f]/80 via-transparent to-transparent" />
          </div>
        )}

        <div className="relative z-10 px-5 md:px-16 max-w-5xl w-full">
          {story.occasion && (
            <p className={`${accentConfig.text} font-bold tracking-widest uppercase mb-2 sm:mb-4 text-[10px] sm:text-sm drop-shadow-md`}>
              {story.occasion}
            </p>
          )}
          <h1 className={`${presetConfig.heroStyle} ${accentConfig.text} mb-3 sm:mb-6 leading-tight break-words max-w-full !text-4xl sm:!text-6xl md:!text-7xl`}>{story.title}</h1>
          <div className="flex items-center flex-wrap gap-2 sm:gap-4 text-zinc-300 font-medium mb-5 sm:mb-8 text-xs sm:text-lg drop-shadow-md">
            {story.eventDate && <span>{new Date(story.eventDate).getFullYear()}</span>}
            {story.eventDate && chaptersWithMedia.length > 0 && <span>•</span>}
            {chaptersWithMedia.length > 0 && <span>{chaptersWithMedia.length} Chapters</span>}
            {chaptersWithMedia.length > 0 && <span>•</span>}
            <span>{story.media.length} Memories</span>
          </div>

          <div className="flex flex-row flex-wrap items-center gap-2 sm:gap-4 w-full">
            {hasMedia && (
              <button
                onClick={() => setIsCinematicPlaying(true)}
                className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 sm:gap-2 bg-white text-black px-3 sm:px-8 py-2.5 sm:py-3.5 rounded-md font-bold text-sm sm:text-lg hover:bg-zinc-200 transition-colors whitespace-nowrap"
              >
                <Play className="w-4 h-4 sm:w-6 sm:h-6 fill-current shrink-0" /> Play Story
              </button>
            )}
            {chaptersWithMedia.length > 0 && (
              <button
                onClick={() => openChapter(chaptersWithMedia[0].chapter.id)}
                className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 sm:gap-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 px-3 sm:px-8 py-2.5 sm:py-3.5 rounded-md font-bold text-sm sm:text-lg backdrop-blur-md transition-colors border border-rose-500/30 whitespace-nowrap"
              >
                Start Chapter 1 <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 shrink-0" />
              </button>
            )}
            <button
              onClick={handleShare}
              className="flex-1 min-w-[100px] flex items-center justify-center gap-1.5 sm:gap-2 bg-white/20 hover:bg-white/30 text-white px-3 sm:px-8 py-2.5 sm:py-3.5 rounded-md font-bold text-sm sm:text-lg backdrop-blur-md transition-colors whitespace-nowrap"
            >
              <Share2 className="w-4 h-4 sm:w-6 sm:h-6 shrink-0" /> Share
            </button>
          </div>
          {story.description && (
            <p className="mt-4 sm:mt-8 text-zinc-300 max-w-2xl text-xs sm:text-lg leading-relaxed drop-shadow-md break-words">
              {story.description}
            </p>
          )}
        </div>
      </div>

      {/* 2. Memory Chapters — show ALL chapters, even empty ones */}
      {allChapters.length > 0 ? (
        <div className="px-6 md:px-16 py-16">
          <div className="flex items-center gap-4 mb-10">
            <span className={`w-1.5 h-10 ${accentConfig.color} rounded-full`} />
            <div>
              <h2 className="text-3xl font-black text-white">Memory Chapters</h2>
              <p className="text-zinc-500 text-sm mt-1">{allChapters.length} episodes • {story.media.length} memories</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allChapters.map(({ chapter, mediaItems }, idx) => {
              const coverMedia = chapter.coverMediaId 
                ? mediaItems.find(m => m.item.id === chapter.coverMediaId)?.item || mediaItems[0]?.item
                : mediaItems[0]?.item;
              const hasChapterMedia = mediaItems.length > 0;
              return (
                <ChapterPosterCard
                  key={chapter.id}
                  chapter={chapter}
                  mediaItems={mediaItems}
                  coverMedia={coverMedia}
                  chapterIndex={idx}
                  accentColor={accentConfig.color}
                  onClick={hasChapterMedia ? () => openChapter(chapter.id) : undefined}
                />
              );
            })}
          </div>

          {/* Unassigned media at bottom, minimal */}
          {unassignedMedia.length > 0 && (
            <div className="mt-20 pt-12 border-t border-white/5">
              <h3 className="text-lg font-bold text-zinc-500 mb-6">More From This Story</h3>
              <ChapterLayoutRenderer
                mediaItems={unassignedMedia}
                storyId={story.id}
                chapters={story.chapters ?? []}
                coverMediaId={story.coverMediaId}
                isEditable={isEditable}
                onMediaSelect={(index) => setGalleryActiveIndex(index)}
              />
            </div>
          )}
        </div>
      ) : hasMedia ? (
        // No chapters — fall back to full gallery
        <div className="px-4 md:px-16 py-12">
          <ChapterLayoutRenderer
            mediaItems={unassignedMedia}
            storyId={story.id}
            chapters={[]}
            coverMediaId={story.coverMediaId}
            isEditable={isEditable}
            onMediaSelect={(index) => setGalleryActiveIndex(index)}
          />
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

// ─── Chapter Poster Card ─────────────────────────────────────────────────────

function ChapterPosterCard({
  chapter,
  mediaItems,
  coverMedia,
  chapterIndex,
  accentColor,
  onClick,
}: {
  chapter: import("@prisma/client").Chapter;
  mediaItems: { item: import("@prisma/client").MediaAsset; index: number }[];
  coverMedia?: import("@prisma/client").MediaAsset;
  chapterIndex: number;
  accentColor?: string;
  onClick?: () => void;
}) {
  const hasMedia = mediaItems.length > 0;
  const isDisabled = !hasMedia;

  return (
    <div
      onClick={onClick}
      className={`group relative rounded-2xl overflow-hidden bg-zinc-900 border transition-all duration-500 ${
        isDisabled
          ? "border-white/5 opacity-60 cursor-default"
          : "border-white/10 cursor-pointer hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(244,63,94,0.25)] hover:border-rose-500/30"
      }`}
    >
      {/* Cover Image */}
      <div className="aspect-[3/4] relative overflow-hidden">
        {coverMedia ? (
          coverMedia.type === "VIDEO" ? (
            <video src={coverMedia.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverMedia.url} alt={chapter.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
          )
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex flex-col items-center justify-center gap-3">
            <span className="text-6xl opacity-30">{chapter.emoji || "📖"}</span>
            {isDisabled && (
              <span className="text-[10px] text-zinc-600 font-medium text-center px-4">No photos assigned yet</span>
            )}
          </div>
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/10" />
        {!isDisabled && <div className="absolute inset-0 bg-gradient-to-t from-rose-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />}

        {/* Episode pill */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-zinc-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/10 uppercase tracking-widest">
          Ep {chapterIndex + 1}
        </div>

        {/* Play / Lock icon */}
        <div className={`absolute top-3 right-3 w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center border transition-all duration-300 ${
          isDisabled
            ? "bg-zinc-700/40 border-white/10"
            : "bg-white/20 border-white/20 group-hover:scale-110 group-hover:bg-rose-500 group-hover:border-rose-400"
        }`}>
          {isDisabled ? (
            <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          ) : (
            <Play className="w-4 h-4 text-white fill-current translate-x-0.5" />
          )}
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2 mb-2">
            {chapter.emoji && <span className="text-2xl drop-shadow-lg">{chapter.emoji}</span>}
            <h3 className={`text-xl font-black drop-shadow-lg leading-tight ${accentColor}`}>{chapter.title}</h3>
          </div>
          {chapter.subtitle && (
            <p className="text-xs text-zinc-400 italic mb-2 line-clamp-1">&quot;{chapter.subtitle}&quot;</p>
          )}
          <div className="flex items-center gap-3 text-xs font-medium text-zinc-500">
            {chapter.date && <span>{new Date(chapter.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>}
            {chapter.date && mediaItems.length > 0 && <span>•</span>}
            {chapter.location && <><span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{chapter.location}</span><span>•</span></>}
            {hasMedia ? (
              <span className="text-rose-400/80">{mediaItems.length} Memories</span>
            ) : (
              <span className="text-zinc-600 italic">Empty</span>
            )}
          </div>
        </div>
      </div>

      {/* Hover CTA — only when chapter has media */}
      {!isDisabled && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          <div className="bg-rose-500 text-white font-bold px-6 py-2.5 rounded-full text-sm shadow-2xl shadow-rose-500/50 flex items-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <Play className="w-4 h-4 fill-current" /> Open Chapter
          </div>
        </div>
      )}
    </div>
  );
}

