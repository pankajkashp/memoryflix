"use client";

import { Story, MediaAsset, Chapter } from "@prisma/client";
import ChapterLayoutRenderer from "./ChapterLayoutRenderer";
import { getPresetConfig, getAccentConfig } from "@/lib/typography-presets";
import { getFontClassName } from "@/lib/fonts";
import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";

type StoryWithFullPayload = Story & {
  media: MediaAsset[];
  chapters: Chapter[];
};

export default function ChapterLivePreview({ 
  story, 
  activeChapterId,
  chapterDraft
}: { 
  story: StoryWithFullPayload;
  activeChapterId: string | null;
  chapterDraft: Partial<Chapter> | null;
}) {
  if (!activeChapterId) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 p-8 text-center bg-[#0f0f0f]">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <p className="font-medium text-white/70 text-lg">No Chapter Selected</p>
        <p className="text-sm mt-1">Select a chapter to see its live preview.</p>
      </div>
    );
  }

  const baseChapter = story.chapters.find(c => c.id === activeChapterId) || null;
  if (!baseChapter && !chapterDraft) return null;

  // Merge base chapter with any live drafts
  const chapter = { ...baseChapter, ...chapterDraft } as Chapter & { coverMediaId?: string | null };

  const presetConfig = getPresetConfig(story.typographyPreset || "MODERN_MINIMAL");
  const accentConfig = getAccentConfig(story.accentColor || "WHITE");
  const fontClassName = getFontClassName(presetConfig.fontId);

  // Get media for this chapter
  const allMedia = story.media || [];
  const chapterMediaItems = allMedia
    .filter(m => m.chapterId === chapter.id)
    .sort((a, b) => a.position - b.position)
    .map((item, index) => ({ item, index }));

  const chapterCoverId = chapter.coverMediaId || null;
  const chapterCover = chapterCoverId 
    ? chapterMediaItems.find(m => m.item.id === chapterCoverId)?.item || chapterMediaItems[0]?.item
    : chapterMediaItems[0]?.item;

  const videoCount = chapterMediaItems.filter(m => m.item.type === "VIDEO").length;

  return (
    <div className={`${fontClassName} w-full h-full bg-[#0f0f0f] text-white flex flex-col relative`}>
      {/* ── COVER HERO ── */}
      <div className="relative w-full h-[60vh] shrink-0 overflow-hidden flex flex-col items-center justify-center">
        {chapterCover ? (
          <div className="absolute inset-0 z-0 overflow-hidden bg-[#0f0f0f]">
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
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/60 to-[#0f0f0f]/40" />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 bg-black/50" />
        )}

        <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-rose-500/60 to-transparent mx-auto mb-8" />
          
          <p className={`${accentConfig.text} font-bold tracking-[0.4em] uppercase text-xs mb-4`}>
            Chapter Preview
          </p>

          {chapter.emoji && (
            <div className="text-5xl md:text-7xl mb-6 drop-shadow-2xl">
              {chapter.emoji}
            </div>
          )}

          <h1 className={`${presetConfig.heroStyle} ${accentConfig.text} mb-3`}>
            {chapter.title || "Untitled Chapter"}
          </h1>

          {chapter.subtitle && (
            <p className="text-lg md:text-xl text-zinc-300 italic mb-6 font-medium">
              &quot;{chapter.subtitle}&quot;
            </p>
          )}

          <div className="flex items-center justify-center gap-4 text-zinc-400 font-medium text-sm flex-wrap">
            {chapter.date && (
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rose-500" />
                {new Date(chapter.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
            )}
            {chapter.location && (
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500" />
                {chapter.location}
              </span>
            )}
            <span className="flex items-center gap-2">
               {chapterMediaItems.length} Memories
            </span>
          </div>
        </div>
      </div>

      {/* ── CHAPTER LAYOUT ── */}
      <div className="relative z-20 w-full px-6 py-12">
        <ChapterLayoutRenderer
          chapter={chapter}
          mediaItems={chapterMediaItems}
          storyId={story.id}
          chapters={story.chapters}
          coverMediaId={chapterCoverId}
          isEditable={false} // Readonly for preview
          onMediaSelect={() => {}}
          videoCount={videoCount}
        />
      </div>
    </div>
  );
}
