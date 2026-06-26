"use client";

import { useState, useTransition, useEffect } from "react";
import { Chapter, MediaAsset } from "@prisma/client";
import { createChapter, updateChapter, deleteChapter, reorderChapters } from "@/app/actions/chapter";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2, Edit2, Check, X, Loader2, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ConfirmModal } from "../ui/ConfirmModal";
import MusicSelector from "./MusicSelector";
import EditChapterModal from "./EditChapterModal";
import ChapterMediaManager from "./ChapterMediaManager";

function SortableChapterItem({ 
  chapter, 
  storyId, 
  mediaCount, 
  allMedia,
  activeChapterId,
  setActiveChapterId,
  onDraftChange
}: { 
  chapter: Chapter; 
  storyId: string; 
  mediaCount: number; 
  allMedia: MediaAsset[];
  activeChapterId: string | null;
  setActiveChapterId: (id: string | null) => void;
  onDraftChange: (draft: Partial<Chapter> | null) => void;
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: chapter.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  const handleDelete = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    await deleteChapter(storyId, chapter.id);
    setShowDeleteModal(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex items-start md:items-center gap-3 md:gap-4 p-4 rounded-2xl border transition-all ${
        isDragging 
          ? "bg-black/90 border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.3)] scale-[1.02]" 
          : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
      } backdrop-blur-xl`}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-2 text-zinc-500 hover:text-white transition-colors bg-black/50 rounded-lg shrink-0 mt-1 md:mt-0">
        <GripVertical className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0 w-full">
        {/* ───────────────────────────────────────────────────────────── */}
        {/* DESKTOP LAYOUT (md and above) */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="hidden md:flex flex-col gap-1 w-full min-w-0">
          <div className="flex items-center gap-3">
            {chapter.emoji && (
              <span className="text-3xl filter drop-shadow-md bg-black/50 w-12 h-12 flex items-center justify-center rounded-xl border border-white/5 shrink-0">
                {chapter.emoji}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-bold text-white tracking-tight truncate">{chapter.title}</h3>
              <div className="flex items-center flex-wrap gap-3 text-sm font-medium text-zinc-500 mt-1">
                {chapter.date && <span className="whitespace-nowrap">{new Date(chapter.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>}
                {chapter.date && chapter.location && <span>•</span>}
                {chapter.location && <span className="whitespace-nowrap truncate max-w-[200px]">📍 {chapter.location}</span>}
                {(chapter.date || chapter.location) && chapter.layout && <span>•</span>}
                {chapter.layout && <span className="text-rose-500/80 whitespace-nowrap">{chapter.layout.replace('_', ' ')}</span>}
                {chapter.musicType && chapter.musicType !== "NONE" && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-purple-400 whitespace-nowrap">
                      <Music className="w-3 h-3" /> Soundtrack
                    </span>
                  </>
                )}
                <span>•</span>
                <span className="text-zinc-400 font-bold whitespace-nowrap">{mediaCount} {mediaCount === 1 ? 'Memory' : 'Memories'}</span>
              </div>
            </div>
          </div>
          {chapter.subtitle && (
            <p className="text-zinc-400 text-sm mt-2 ml-[3.75rem] italic truncate">&quot;{chapter.subtitle}&quot;</p>
          )}
        </div>
        
        {/* Desktop Hover Menu */}
        <div className="hidden md:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md p-2 rounded-xl border border-white/10 shadow-2xl">
          <button onClick={(e) => { e.stopPropagation(); setActiveChapterId(chapter.id); }} className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-4 bg-white/10" />
          <button onClick={handleDelete} className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* MOBILE LAYOUT (below md) */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="flex md:hidden flex-col gap-2 w-full min-w-0">
          <div className="flex flex-row items-start gap-3 w-full min-w-0">
            {chapter.emoji && (
              <span className="text-3xl sm:text-4xl filter drop-shadow-md bg-black/50 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl border border-white/5 shrink-0">
                {chapter.emoji}
              </span>
            )}
            <div className="flex flex-col min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight break-words leading-tight">{chapter.title}</h3>
              {chapter.location && (
                <span className="text-xs sm:text-sm text-zinc-400 mt-1 truncate">📍 {chapter.location}</span>
              )}
            </div>
          </div>

          {chapter.subtitle && (
            <p className="text-zinc-400 text-xs sm:text-sm italic break-words mt-1">&quot;{chapter.subtitle}&quot;</p>
          )}

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[10px] sm:text-xs font-medium text-zinc-500 mt-2">
            {chapter.layout && <span className="bg-white/5 px-2 py-1 rounded-md text-rose-400/90 whitespace-nowrap">🏷 {chapter.layout.replace('_', ' ')}</span>}
            <span className="bg-white/5 px-2 py-1 rounded-md whitespace-nowrap text-zinc-300">
              📸 {mediaCount} {mediaCount === 1 ? 'Memory' : 'Memories'}
            </span>
          </div>

          {/* Mobile Action Buttons */}
          <div className="flex flex-row gap-2 mt-3 pt-3 border-t border-white/10 w-full">
            <button onClick={(e) => { e.stopPropagation(); setActiveChapterId(chapter.id); }} className="flex-1 py-2 px-2 sm:px-4 min-h-[40px] flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-black bg-white hover:bg-zinc-200 transition-colors rounded-lg shadow-lg whitespace-nowrap">
              <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Edit
            </button>
            <button onClick={handleDelete} className="flex-1 py-2 px-2 sm:px-4 min-h-[40px] flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors rounded-lg whitespace-nowrap">
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChapterEditor({ 
  storyId, 
  chapters, 
  media = [],
  activeChapterId,
  setActiveChapterId,
  onDraftChange
}: { 
  storyId: string; 
  chapters: Chapter[]; 
  media?: MediaAsset[];
  activeChapterId: string | null;
  setActiveChapterId: (id: string | null) => void;
  onDraftChange: (draft: Partial<Chapter> | null) => void;
}) {
  const [items, setItems] = useState(chapters);
  const [isPending, startTransition] = useTransition();
  
  useEffect(() => {
    setItems(chapters);
  }, [chapters]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((currentItems) => {
        const oldIndex = currentItems.findIndex((item) => item.id === active.id);
        const newIndex = currentItems.findIndex((item) => item.id === over.id);
        const newOrder = arrayMove(currentItems, oldIndex, newIndex);

        startTransition(async () => {
          await reorderChapters(storyId, newOrder.map(c => c.id));
        });

        return newOrder;
      });
    }
  };

  const handleCreateEmpty = () => {
    startTransition(async () => {
      const newChapter = await createChapter(storyId, "Untitled Chapter", "✨");
      setActiveChapterId(newChapter.id);
    });
  };

  return (
    <div className="space-y-6">
      {items.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-rose-500/30 bg-black/60 p-8 overflow-hidden relative shadow-[0_0_40px_rgba(244,63,94,0.1)] backdrop-blur-md"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg className="w-48 h-48 text-rose-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-black text-white mb-4">How Chapters Work</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center font-bold text-lg mb-4 border border-rose-500/30">1</div>
                <h4 className="font-bold text-white">Create a Chapter</h4>
                <p className="text-sm text-zinc-400">Give it a title, date, and emoji. e.g. "Paris 2026"</p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center font-bold text-lg mb-4 border border-purple-500/30">2</div>
                <h4 className="font-bold text-white">Upload Photos</h4>
                <p className="text-sm text-zinc-400">Add your media and assign them to the chapter in the next step.</p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold text-lg mb-4 border border-blue-500/30">3</div>
                <h4 className="font-bold text-white">Cinematic Experience</h4>
                <p className="text-sm text-zinc-400">We automatically turn them into beautiful Netflix-style episodes.</p>
              </div>
            </div>
            <button 
              onClick={handleCreateEmpty}
              disabled={isPending}
              className="mt-6 md:mt-8 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 md:px-8 rounded-full transition-colors shadow-lg shadow-rose-500/20 flex items-center gap-2 disabled:opacity-50 text-sm md:text-base w-full md:w-auto justify-center"
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />} Start First Chapter
            </button>
          </div>
        </motion.div>
      )}

      {items.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map(c => c.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {items.map((chapter) => {
                const count = media.filter(m => m.chapterId === chapter.id && m.type === "IMAGE").length;
                return <SortableChapterItem key={chapter.id} chapter={chapter} storyId={storyId} mediaCount={count} allMedia={media} activeChapterId={activeChapterId} setActiveChapterId={setActiveChapterId} onDraftChange={onDraftChange} />;
              })}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {items.length > 0 && (
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleCreateEmpty}
          disabled={isPending}
          className="w-full flex flex-col items-center justify-center gap-3 py-6 md:py-8 rounded-2xl border-2 border-dashed border-white/20 text-zinc-400 hover:text-white hover:border-white/40 hover:bg-white/5 transition-colors group disabled:opacity-50"
        >
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-bold tracking-wide">Create New Chapter</span>
        </motion.button>
      )}

      {activeChapterId && chapters.find(c => c.id === activeChapterId) && (
        <EditChapterModal
          isOpen={true}
          onClose={() => setActiveChapterId(null)}
          chapter={chapters.find(c => c.id === activeChapterId)!}
          storyId={storyId}
          allMedia={media}
          mediaCount={media.filter(m => m.chapterId === activeChapterId).length}
          onDraftChange={onDraftChange}
        />
      )}
    </div>
  );
}
