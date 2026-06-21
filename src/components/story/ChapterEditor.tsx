"use client";

import { useState, useTransition, useEffect } from "react";
import { Chapter } from "@prisma/client";
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
import MusicSelector from "./MusicSelector";

function SortableChapterItem({ chapter, storyId }: { chapter: Chapter; storyId: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(chapter.title);
  const [emoji, setEmoji] = useState(chapter.emoji || "");
  const [isPending, startTransition] = useTransition();

  const [layout, setLayout] = useState(chapter.layout || "MASONRY");
  const [subtitle, setSubtitle] = useState(chapter.subtitle || "");
  const [location, setLocation] = useState(chapter.location || "");
  const [date, setDate] = useState(chapter.date ? new Date(chapter.date).toISOString().split('T')[0] : "");

  useEffect(() => {
    setTitle(chapter.title);
    setEmoji(chapter.emoji || "");
    setLayout(chapter.layout || "MASONRY");
    setSubtitle(chapter.subtitle || "");
    setLocation(chapter.location || "");
    setDate(chapter.date ? new Date(chapter.date).toISOString().split('T')[0] : "");
  }, [chapter]);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: chapter.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  const handleSave = () => {
    if (!title.trim()) return;
    startTransition(async () => {
      await updateChapter(
        storyId, 
        chapter.id, 
        title, 
        emoji || null,
        subtitle || null,
        date || null,
        location || null
      );
      if (layout !== chapter.layout) {
        // Assume updateChapterLayout is imported
        const { updateChapterLayout } = await import("@/app/actions/chapter");
        await updateChapterLayout(storyId, chapter.id, layout);
      }
      setIsEditing(false);
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this chapter? Media assigned to this chapter will be unassigned.")) {
      startTransition(async () => {
        await deleteChapter(storyId, chapter.id);
      });
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex items-center gap-4 p-4 rounded-2xl border transition-all ${
        isDragging 
          ? "bg-black/90 border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.3)] scale-[1.02]" 
          : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
      } backdrop-blur-xl`}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-2 text-zinc-500 hover:text-white transition-colors bg-black/50 rounded-lg">
        <GripVertical className="w-5 h-5" />
      </div>

      {isEditing ? (
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                placeholder="😀"
                maxLength={2}
                className="w-12 text-center rounded-lg border border-white/10 bg-black/50 px-2 py-1.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
              />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Chapter Title"
                className="flex-1 sm:w-48 rounded-lg border border-white/10 bg-black/50 px-3 py-1.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={layout}
                onChange={(e) => setLayout(e.target.value)}
                className="flex-1 sm:flex-none sm:w-40 rounded-lg border border-white/10 bg-black/50 px-2 py-1.5 text-sm text-white focus:outline-none focus:border-rose-500 appearance-none"
              >
                <option value="MASONRY">Masonry Grid</option>
                <option value="FILM_STRIP">Film Strip</option>
                <option value="POLAROID">Polaroid Memories</option>
                <option value="TIMELINE">Timeline Story</option>
              </select>
              <button onClick={handleSave} disabled={isPending} className="p-1.5 text-green-400 hover:bg-green-400/10 rounded-lg shrink-0">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              </button>
              <button onClick={() => setIsEditing(false)} disabled={isPending} className="p-1.5 text-zinc-400 hover:bg-white/10 rounded-lg shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Subtitle (e.g. Our first adventure)"
              className="w-full sm:flex-1 rounded-lg border border-white/10 bg-black/50 px-3 py-1.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
            />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location (e.g. Paris, France)"
              className="w-full sm:w-48 rounded-lg border border-white/10 bg-black/50 px-3 py-1.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full sm:w-40 rounded-lg border border-white/10 bg-black/50 px-3 py-1.5 text-sm text-white focus:outline-none focus:border-rose-500"
            />
          </div>
          
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
        </div>
      ) : (
        <>
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex items-center gap-3">
              {chapter.emoji && (
                <span className="text-3xl filter drop-shadow-md bg-black/50 w-12 h-12 flex items-center justify-center rounded-xl border border-white/5">
                  {chapter.emoji}
                </span>
              )}
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">{chapter.title}</h3>
                <div className="flex items-center gap-3 text-sm font-medium text-zinc-500 mt-1">
                  {chapter.date && <span>{new Date(chapter.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>}
                  {chapter.date && chapter.location && <span>•</span>}
                  {chapter.location && <span>📍 {chapter.location}</span>}
                  {(chapter.date || chapter.location) && chapter.layout && <span>•</span>}
                  {chapter.layout && <span className="text-rose-500/80">{chapter.layout.replace('_', ' ')}</span>}
                  {chapter.musicType && chapter.musicType !== "NONE" && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-purple-400">
                        <Music className="w-3 h-3" /> Soundtrack
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            {chapter.subtitle && (
              <p className="text-zinc-400 text-sm mt-2 ml-[3.75rem] italic">&quot;{chapter.subtitle}&quot;</p>
            )}
          </div>
          
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md p-2 rounded-xl border border-white/10">
            <button onClick={() => setIsEditing(true)} className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-4 bg-white/10" />
            <button onClick={handleDelete} className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          {/* Mobile fallback */}
          <div className="flex items-center gap-2 sm:hidden">
            <button onClick={() => setIsEditing(true)} className="p-2 text-zinc-400 hover:text-white bg-white/5 rounded-lg">
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function ChapterEditor({ storyId, chapters }: { storyId: string; chapters: Chapter[] }) {
  const [items, setItems] = useState(chapters);
  const [isPending, startTransition] = useTransition();
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newEmoji, setNewEmoji] = useState("");
  
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

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    startTransition(async () => {
      await createChapter(storyId, newTitle, newEmoji || null);
      setIsCreating(false);
      setNewTitle("");
      setNewEmoji("");
    });
  };

  return (
    <div className="space-y-6">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map(c => c.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {items.map((chapter) => (
              <SortableChapterItem key={chapter.id} chapter={chapter} storyId={storyId} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {isCreating ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center gap-3 p-4 rounded-2xl border border-white/20 bg-black/60 backdrop-blur-xl shadow-[0_0_30px_rgba(255,255,255,0.05)]"
        >
          <div className="flex w-full sm:w-auto gap-3">
            <input
              type="text"
              value={newEmoji}
              onChange={(e) => setNewEmoji(e.target.value)}
              placeholder="😀"
              maxLength={2}
              className="w-14 text-2xl text-center rounded-xl border border-white/10 bg-black/50 px-2 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
            />
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Chapter Title (e.g. How We Met)"
              className="flex-1 sm:w-64 rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-lg font-bold text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
          </div>
          <div className="flex w-full sm:w-auto justify-end gap-2 mt-2 sm:mt-0">
            <button onClick={handleCreate} disabled={isPending} className="flex-1 sm:flex-none px-6 py-3 text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 flex items-center justify-center">
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Chapter"}
            </button>
            <button onClick={() => setIsCreating(false)} disabled={isPending} className="px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors flex items-center justify-center">
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setIsCreating(true)}
          className="w-full flex flex-col items-center justify-center gap-3 py-8 rounded-2xl border-2 border-dashed border-white/20 text-zinc-400 hover:text-white hover:border-white/40 hover:bg-white/5 transition-colors group"
        >
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-bold tracking-wide">Create New Chapter</span>
        </motion.button>
      )}
    </div>
  );
}
