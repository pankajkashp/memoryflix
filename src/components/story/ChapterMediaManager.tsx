"use client";

import { useState, useTransition } from "react";
import { MediaAsset, Chapter } from "@prisma/client";
import { createPortal } from "react-dom";

import { Plus, Image as ImageIcon, Check, X, Loader2, GripVertical, Trash2 } from "lucide-react";
import MediaUploader from "./MediaUploader";
import { assignMultipleMediaToChapter, reorderMedia } from "@/app/actions/media";
import { setChapterCover } from "@/app/actions/chapter";
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
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import toast from "react-hot-toast";

function SortableGridItem({ asset, onRemove }: { asset: MediaAsset, onRemove: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: asset.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative aspect-square rounded-xl overflow-hidden border border-white/10 ${isDragging ? "opacity-50 ring-2 ring-rose-500" : ""}`}
    >
      {asset.type === "IMAGE" ? (
         
        <img src={asset.url} alt="Media" className="w-full h-full object-cover" />
      ) : (
        <video src={asset.url} className="w-full h-full object-cover" />
      )}
      
      {/* Overlay Actions */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove(asset.id); }}
            className="p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <div 
          {...attributes} 
          {...listeners} 
          className="self-center p-2 bg-black/60 rounded-lg cursor-grab active:cursor-grabbing hover:bg-black/80 transition-colors"
        >
          <GripVertical className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}

export default function ChapterMediaManager({
  storyId,
  chapter,
  allMedia,
}: {
  storyId: string;
  chapter: Chapter & { coverMediaId?: string | null };
  allMedia: MediaAsset[];
}) {
  const chapterMedia = allMedia.filter(m => m.chapterId === chapter.id).sort((a, b) => a.position - b.position);
  const unassignedMedia = allMedia.filter(m => !m.chapterId);

  const [isPending, startTransition] = useTransition();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);
  
  // Modal states
  const [selectedForAdd, setSelectedForAdd] = useState<string[]>([]);
  
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = chapterMedia.findIndex((item) => item.id === active.id);
      const newIndex = chapterMedia.findIndex((item) => item.id === over.id);
      const newOrder = arrayMove(chapterMedia, oldIndex, newIndex);

      startTransition(async () => {
        // Reorder media within the chapter context
        // Find positions of other media so we don't mess up global order
        // Actually, reorderMedia updates position for given IDs globally.
        await reorderMedia(storyId, newOrder.map(m => m.id));
      });
    }
  };

  const handleRemoveFromChapter = (mediaId: string) => {
    startTransition(async () => {
      await assignMultipleMediaToChapter(storyId, [mediaId], null);
      toast.success("Removed from chapter");
    });
  };

  const handleAddExisting = () => {
    if (selectedForAdd.length === 0) return;
    startTransition(async () => {
      await assignMultipleMediaToChapter(storyId, selectedForAdd, chapter.id);
      setShowAddModal(false);
      setSelectedForAdd([]);
      toast.success(`Added ${selectedForAdd.length} photos`);
    });
  };

  const handleSetCover = (mediaId: string) => {
    startTransition(async () => {
      await setChapterCover(storyId, chapter.id, mediaId);
      setShowCoverModal(false);
      toast.success("Cover photo updated");
    });
  };

  return (
    <div className="mt-6 border-t border-white/10 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h4 className="text-lg font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-rose-500" />
            Chapter Media
          </h4>
          <p className="text-sm text-zinc-400 mt-1">{chapterMedia.length} memories assigned</p>
        </div>
        
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <MediaUploader storyId={storyId} chapterId={chapter.id} />
          
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="min-h-[44px] w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-white transition-all"
          >
            <Plus className="w-4 h-4" /> Add Existing
          </button>
          
          <button
            type="button"
            onClick={() => setShowCoverModal(true)}
            disabled={chapterMedia.length === 0}
            className="min-h-[44px] w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ImageIcon className="w-4 h-4" /> Choose Cover
          </button>
        </div>
      </div>

      {chapterMedia.length === 0 ? (
        <div className="border border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-black/20">
          <ImageIcon className="w-8 h-8 text-zinc-600 mb-3" />
          <p className="text-zinc-400 font-medium">No media in this chapter yet.</p>
          <p className="text-sm text-zinc-500 mt-1">Upload or add existing photos to get started.</p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={chapterMedia.map(m => m.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {chapterMedia.map(asset => (
                <SortableGridItem key={asset.id} asset={asset} onRemove={handleRemoveFromChapter} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* ADD EXISTING MODAL */}
      {typeof window !== "undefined" && showAddModal && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative w-full max-w-3xl bg-[#111] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col z-[100000] max-h-[80vh]">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-white">Add Existing Media</h3>
                <p className="text-zinc-400 text-sm mt-1">Select unassigned photos to add to {chapter.title}</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="min-h-[44px] min-w-[44px] flex items-center justify-center text-zinc-400 hover:text-white bg-white/5 rounded-xl"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {unassignedMedia.length === 0 ? (
                <p className="text-zinc-500 text-center py-8">No unassigned media available. Upload some new photos instead.</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {unassignedMedia.map(asset => {
                    const isSelected = selectedForAdd.includes(asset.id);
                    return (
                      <div 
                        key={asset.id} 
                        onClick={() => setSelectedForAdd(prev => isSelected ? prev.filter(id => id !== asset.id) : [...prev, asset.id])}
                        className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${isSelected ? "border-rose-500 scale-[0.95]" : "border-transparent hover:border-white/20"}`}
                      >
                        {asset.type === "IMAGE" ? (
                          <img src={asset.url} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <video src={asset.url} className="w-full h-full object-cover" />
                        )}
                        <div className={`absolute inset-0 transition-opacity ${isSelected ? "bg-rose-500/20" : "bg-black/0"}`} />
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center shadow-lg">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-white/5 bg-[#0f0f0f] flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-400">{selectedForAdd.length} selected</span>
              <button
                onClick={handleAddExisting}
                disabled={selectedForAdd.length === 0 || isPending}
                className="min-h-[44px] w-full sm:w-auto px-6 py-2.5 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Add to Chapter
              </button>
            </div>
          </div>
        </div>
      , document.body)}

      {/* SET COVER MODAL */}
      {typeof window !== "undefined" && showCoverModal && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div onClick={() => setShowCoverModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative w-full max-w-3xl bg-[#111] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col z-[100000] max-h-[80vh]">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-white">Choose Chapter Cover</h3>
                <p className="text-zinc-400 text-sm mt-1">Select a cover photo from {chapter.title}'s media</p>
              </div>
              <button onClick={() => setShowCoverModal(false)} className="min-h-[44px] min-w-[44px] flex items-center justify-center text-zinc-400 hover:text-white bg-white/5 rounded-xl"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {chapterMedia.map(asset => {
                  const isCover = chapter.coverMediaId === asset.id;
                  return (
                    <div 
                      key={asset.id} 
                      onClick={() => handleSetCover(asset.id)}
                      className={`relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${isCover ? "border-rose-500 scale-[0.98] ring-4 ring-rose-500/20" : "border-transparent hover:border-white/20 hover:scale-[1.02]"}`}
                    >
                      {asset.type === "IMAGE" ? (
                        <img src={asset.url} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <video src={asset.url} className="w-full h-full object-cover" />
                      )}
                      <div className={`absolute inset-0 transition-opacity ${isCover ? "bg-black/10" : "bg-black/30 hover:bg-black/10"}`} />
                      {isCover && (
                        <div className="absolute top-2 right-2 px-3 py-1 bg-rose-500 text-white text-xs font-bold rounded-full shadow-lg">
                          Cover
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      , document.body)}
    </div>
  );
}
