"use client";

import { useState, useTransition, useEffect } from "react";
import { createPortal } from "react-dom";
import { Chapter, MediaAsset } from "@prisma/client";
import { Check, X, Loader2, Music, Edit2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MusicSelector from "./MusicSelector";
import ChapterMediaManager from "./ChapterMediaManager";

interface EditChapterModalProps {
  chapter: Chapter;
  storyId: string;
  mediaCount: number;
  allMedia: MediaAsset[];
  isOpen: boolean;
  onClose: () => void;
  onDraftChange: (draft: Partial<Chapter> | null) => void;
}

export default function EditChapterModal({
  chapter,
  storyId,
  mediaCount,
  allMedia,
  isOpen,
  onClose,
  onDraftChange,
}: EditChapterModalProps) {
  const [title, setTitle] = useState(chapter.title);
  const [emoji, setEmoji] = useState(chapter.emoji || "");
  const [layout, setLayout] = useState(chapter.layout || "MASONRY");
  const [subtitle, setSubtitle] = useState(chapter.subtitle || "");
  const [location, setLocation] = useState(chapter.location || "");
  const [date, setDate] = useState(chapter.date ? new Date(chapter.date).toISOString().split('T')[0] : "");
  const [isMounted, setIsMounted] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update draft on every change
  useEffect(() => {
    if (isOpen) {
      onDraftChange({
        id: chapter.id,
        title,
        emoji,
        layout,
        subtitle,
        location,
        date: date ? new Date(date) : null,
      } as any);

      // Debounced save
      if (title.trim() && (title !== chapter.title || emoji !== (chapter.emoji || "") || layout !== (chapter.layout || "MASONRY") || subtitle !== (chapter.subtitle || "") || location !== (chapter.location || "") || date !== (chapter.date ? new Date(chapter.date).toISOString().split('T')[0] : ""))) {
        const timeoutId = setTimeout(() => {
          startTransition(async () => {
            const { updateChapter, updateChapterLayout } = await import("@/app/actions/chapter");
            await updateChapter(storyId, chapter.id, title, emoji || null, subtitle || null, date || null, location || null);
            if (layout !== chapter.layout) {
              await updateChapterLayout(storyId, chapter.id, layout);
            }
          });
        }, 1000);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [isOpen, title, emoji, layout, subtitle, location, date, chapter, storyId, onDraftChange]);

  const handleSave = () => {
    if (!title.trim()) return;
    startTransition(async () => {
      const { updateChapter, updateChapterLayout } = await import("@/app/actions/chapter");
      await updateChapter(storyId, chapter.id, title, emoji || null, subtitle || null, date || null, location || null);
      if (layout !== chapter.layout) {
        await updateChapterLayout(storyId, chapter.id, layout);
      }
      onDraftChange(null);
      onClose();
    });
  };

  if (!isMounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center pointer-events-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { onDraftChange(null); onClose(); }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-3xl max-h-[90vh] bg-[#111] sm:rounded-[2rem] rounded-t-[2rem] border-t sm:border border-white/10 shadow-2xl flex flex-col z-[101] overflow-hidden"
          >
            {/* Header Sticky */}
            <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#111]/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-rose-500" /> Edit Chapter
              </h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => { onDraftChange(null); onClose(); }} 
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-bold text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave} 
                  disabled={isPending} 
                  className="px-4 py-1.5 sm:px-6 sm:py-2 flex items-center gap-2 text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-colors disabled:opacity-50"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Save
                </button>
              </div>
            </div>

            {/* Scrollable Form Content */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 custom-scrollbar">
              <div className="flex flex-col gap-4">
                
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="text"
                    value={emoji}
                    onChange={(e) => setEmoji(e.target.value)}
                    placeholder="😀"
                    maxLength={2}
                    className="w-16 text-center min-h-[48px] rounded-xl border border-white/10 bg-black/50 px-2 py-2 text-xl text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                  />
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Chapter Title"
                    className="flex-1 min-h-[48px] rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-base text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  />
                </div>
                
                <select
                  value={layout}
                  onChange={(e) => setLayout(e.target.value)}
                  className="w-full min-h-[48px] rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-base text-white focus:outline-none focus:border-rose-500 appearance-none"
                >
                  <option value="MASONRY">🏷 Masonry Grid</option>
                  <option value="FILM_STRIP">🏷 Film Strip</option>
                  <option value="POLAROID">🏷 Polaroid Memories</option>
                  <option value="TIMELINE">🏷 Timeline Story</option>
                  <option value="HEART" disabled={mediaCount < 12}>
                    🏷 Heart Layout {mediaCount < 12 ? "(12+ Photos)" : "❤️"}
                  </option>
                </select>

                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Subtitle (e.g. Our first adventure)"
                  className="w-full min-h-[48px] rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-base text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                />
                
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location (e.g. Paris, France)"
                  className="w-full min-h-[48px] rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-base text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                />
                
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full min-h-[48px] rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-base text-white focus:outline-none focus:border-rose-500 [color-scheme:dark]"
                />

                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-sm font-bold text-rose-500 mb-4 flex items-center gap-2">
                    <Music className="w-4 h-4" /> Chapter Soundtrack
                  </p>
                  <MusicSelector 
                    storyId={storyId}
                    chapterId={chapter.id}
                    currentTrackId={chapter.musicTrack}
                    currentMusicType={chapter.musicType}
                    currentMusicUrl={chapter.musicUrl}
                  />
                </div>

                <ChapterMediaManager 
                  storyId={storyId} 
                  chapter={chapter as any} 
                  allMedia={allMedia} 
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
