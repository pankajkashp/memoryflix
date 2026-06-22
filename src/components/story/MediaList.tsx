"use client";

import { useState, useEffect, useTransition } from "react";
import { createPortal } from "react-dom";
import { MediaAsset, Chapter } from "@prisma/client";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import SortableMediaItem from "./SortableMediaItem";
import { reorderMedia, assignMediaToChapter, assignMultipleMediaToChapter } from "@/app/actions/media";
import { Loader2, CheckSquare, X, ChevronRight, MapPin, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

function DragPreviewCard({ asset, selectedCount }: { asset: MediaAsset, selectedCount: number }) {
  return (
    <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-rose-500 shadow-2xl shadow-rose-500/50 ring-2 ring-rose-400 ring-offset-2 ring-offset-black scale-105 rotate-2 opacity-95">
      {asset.type === "IMAGE" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={asset.url}
          alt="Dragging"
          className="object-cover w-full h-full"
        />
      ) : (
        <video src={asset.url} className="object-cover w-full h-full" />
      )}
      <div className="absolute inset-0 bg-rose-500/20" />
      
      {selectedCount > 1 && (
        <div className="absolute -top-3 -right-3 z-50 bg-rose-500 text-white font-black text-sm px-3 py-1.5 rounded-full shadow-lg border-2 border-[#111]">
          {selectedCount} Photos
        </div>
      )}
    </div>
  );
}

// ── Droppable Section ─────────────────────────────────────────────────────────
function DroppableSection({ 
  id, 
  title, 
  emoji, 
  items, 
  storyId, 
  coverMediaId, 
  chapters,
  activeAssetId,
  selectedMediaIds,
  onSelectToggle
}: { 
  id: string; 
  title: string; 
  emoji?: string | null; 
  items: MediaAsset[]; 
  storyId?: string;
  coverMediaId?: string | null;
  chapters?: Chapter[];
  activeAssetId: string | null;
  selectedMediaIds: string[];
  onSelectToggle: (id: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-4 px-2">
        {emoji && <span className="text-2xl">{emoji}</span>}
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <span className="bg-white/10 text-zinc-400 text-xs font-bold px-2 py-0.5 rounded-full">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div 
        ref={setNodeRef}
        className={`min-h-[160px] p-4 sm:p-6 rounded-3xl border-2 transition-all duration-300 ${
          isOver ? "bg-rose-500/10 border-rose-500 border-dashed" : "bg-black/20 border-white/5 border-solid"
        }`}
      >
        {items.length === 0 ? (
          <div className="w-full h-32 flex items-center justify-center">
            <p className="text-zinc-500 font-medium">Drop photos here</p>
          </div>
        ) : (
          <SortableContext
            id={id}
            items={items.map((item) => item.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {items.map((asset, index) => (
                <SortableMediaItem
                  key={asset.id}
                  asset={asset}
                  storyId={storyId}
                  coverMediaId={coverMediaId}
                  chapters={chapters}
                  position={index + 1}
                  isBeingDragged={activeAssetId === asset.id}
                  isSelected={selectedMediaIds.includes(asset.id)}
                  onSelectToggle={onSelectToggle}
                />
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  );
}

// ── MediaList ─────────────────────────────────────────────────────────────────

export default function MediaList({
  media,
  storyId,
  coverMediaId,
  chapters = [],
}: {
  media: MediaAsset[];
  storyId?: string;
  coverMediaId?: string | null;
  chapters?: Chapter[];
}) {
  const [items, setItems] = useState(media);
  const [activeAsset, setActiveAsset] = useState<MediaAsset | null>(null);
  const [isPending, startTransition] = useTransition();
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDestinationChapter, setSelectedDestinationChapter] = useState<string | null>(null);

  useEffect(() => {
    setItems(media);
  }, [media]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const dragged = items.find((item) => item.id === event.active.id);
    setActiveAsset(dragged ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveAsset(null);
    const { active, over } = event;

    if (!over) return;

    const activeItem = items.find(i => i.id === active.id);
    if (!activeItem) return;

    const overId = String(over.id);
    
    // Determine the target chapter ID
    let newChapterId: string | null = null;
    let overIndex = -1;

    if (overId === 'unassigned' || chapters.some(c => c.id === overId)) {
      newChapterId = overId === 'unassigned' ? null : overId;
      overIndex = items.filter(i => i.chapterId === newChapterId).length; 
    } else {
      const overItem = items.find(i => i.id === overId);
      if (overItem) {
        newChapterId = overItem.chapterId;
        const targetGroup = items.filter(i => i.chapterId === newChapterId);
        overIndex = targetGroup.findIndex(i => i.id === overId);
      }
    }

    if (newChapterId !== undefined) {
      let finalArrayToUpdate: MediaAsset[] | null = null;
      let shouldAssign = false;
      
      const activeIdStr = String(active.id);
      const isMovingSelection = selectedMediaIds.includes(activeIdStr) && selectedMediaIds.length > 1;
      const idsToMove = isMovingSelection ? selectedMediaIds : [activeIdStr];

      setItems(currentItems => {
        let newItems = [...currentItems];
        
        // Items being moved
        const movingItems = newItems
          .filter(i => idsToMove.includes(i.id))
          .map(i => ({ ...i, chapterId: newChapterId }));
          
        // Remove moving items from original list
        newItems = newItems.filter(i => !idsToMove.includes(i.id));
        
        // If sorting a SINGLE item within the SAME chapter
        if (!isMovingSelection && activeItem.chapterId === newChapterId) {
           const oldGroupIndex = currentItems.filter(i => i.chapterId === newChapterId).findIndex(i => i.id === active.id);
           const reorderedGroup = arrayMove(currentItems.filter(i => i.chapterId === newChapterId), oldGroupIndex, overIndex);
           
           const otherItems = currentItems.filter(i => i.chapterId !== newChapterId);
           finalArrayToUpdate = [...otherItems, ...reorderedGroup];
           return finalArrayToUpdate;
        }

        // For cross-chapter or multi-item moves, insert at overIndex
        const targetGroup = newItems.filter(i => i.chapterId === newChapterId);
        targetGroup.splice(overIndex, 0, ...movingItems);
        
        const otherItems = newItems.filter(i => i.chapterId !== newChapterId);
        finalArrayToUpdate = [...otherItems, ...targetGroup];
        
        shouldAssign = idsToMove.some(id => currentItems.find(i => i.id === id)?.chapterId !== newChapterId);
        return finalArrayToUpdate;
      });

      if (finalArrayToUpdate && storyId) {
        if (isMovingSelection && shouldAssign) {
           setSelectedMediaIds([]);
           const destName = newChapterId 
              ? chapters.find(c => c.id === newChapterId)?.title || "Chapter"
              : "Unassigned Media";
           toast.success(`${idsToMove.length} photos assigned to ${destName}`, {
             icon: '🎉',
             style: { borderRadius: '10px', background: '#333', color: '#fff' }
           });
        }

        const arrayToProcess = finalArrayToUpdate as MediaAsset[];
        startTransition(async () => {
          if (shouldAssign) {
            await assignMultipleMediaToChapter(storyId, idsToMove, newChapterId);
          }
          await reorderMedia(storyId, arrayToProcess.map(i => i.id));
        });
      }
    }
  };

  const handleDragCancel = () => {
    setActiveAsset(null);
  };

  const handleSelectToggle = (id: string) => {
    setSelectedMediaIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleBatchAssignSubmit = () => {
    if (!storyId || selectedMediaIds.length === 0) return;
    
    const count = selectedMediaIds.length;
    const destName = selectedDestinationChapter 
      ? chapters.find(c => c.id === selectedDestinationChapter)?.title || "Chapter"
      : "Unassigned Media";

    // Optimistic UI update
    setItems(currentItems => currentItems.map(item => 
      selectedMediaIds.includes(item.id) 
        ? { ...item, chapterId: selectedDestinationChapter } 
        : item
    ));
    
    setIsModalOpen(false);
    setSelectedMediaIds([]);
    
    // Show immediate success toast
    toast.success(`${count} photos assigned to ${destName}`, {
      icon: '🎉',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });

    startTransition(async () => {
       await assignMultipleMediaToChapter(storyId, selectedMediaIds, selectedDestinationChapter);
    });
  };

  if (items.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-white/5 bg-black/40 py-20 text-center backdrop-blur-md">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.02)]">
          <svg className="w-10 h-10 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-zinc-400 text-lg font-medium">Your canvas is empty.</p>
        <p className="text-zinc-600 text-sm mt-2">Upload some memories to get started.</p>
      </div>
    );
  }

  // Group items
  const unassignedItems = items.filter(i => !i.chapterId);
  const chapterGroups = chapters.map(chapter => ({
    chapter,
    items: items.filter(i => i.chapterId === chapter.id)
  }));

  return (
    <div className="mt-6 pb-24 relative">
      <div className="flex justify-end items-center mb-6 px-1">
        {isPending && (
          <span className="text-xs font-semibold text-rose-400 animate-pulse flex items-center gap-1.5">
            <Loader2 className="animate-spin h-3.5 w-3.5" />
            Saving...
          </span>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        {/* Render Chapters First */}
        {chapterGroups.map(group => (
          <DroppableSection
            key={group.chapter.id}
            id={group.chapter.id}
            title={group.chapter.title}
            emoji={group.chapter.emoji}
            items={group.items}
            storyId={storyId}
            coverMediaId={coverMediaId}
            chapters={chapters}
            activeAssetId={activeAsset?.id || null}
            selectedMediaIds={selectedMediaIds}
            onSelectToggle={handleSelectToggle}
          />
        ))}

        {/* Render Unassigned Section at the bottom */}
        {unassignedItems.length > 0 && (
          <DroppableSection
            id="unassigned"
            title="Unassigned Media"
            items={unassignedItems}
            storyId={storyId}
            coverMediaId={coverMediaId}
            chapters={chapters}
            activeAssetId={activeAsset?.id || null}
            selectedMediaIds={selectedMediaIds}
            onSelectToggle={handleSelectToggle}
          />
        )}

        <DragOverlay dropAnimation={{
          duration: 180,
          easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
        }}>
          {activeAsset ? (
            <DragPreviewCard 
              asset={activeAsset} 
              selectedCount={selectedMediaIds.includes(activeAsset.id) ? selectedMediaIds.length : 1} 
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* ── Batch Action Toolbar ────────────────────────────────────────────── */}
      {selectedMediaIds.length > 0 && !isModalOpen && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-4 bg-zinc-900/90 backdrop-blur-xl border border-white/10 p-3 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-2 px-3 border-r border-white/10">
            <CheckSquare className="w-5 h-5 text-rose-500" />
            <span className="font-bold text-white">{selectedMediaIds.length} Selected</span>
          </div>
          
          <button 
            type="button"
            onClick={() => {
              console.log("Assign button clicked");
              console.log("selectedMediaIds:", selectedMediaIds);
              console.log("isAssignModalOpen (before):", isModalOpen);
              setIsModalOpen(true);
            }}
            className="px-6 py-2 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors flex items-center gap-2"
          >
            Assign To Chapter <ChevronRight className="w-4 h-4" />
          </button>
          
          <button 
            type="button"
            onClick={() => setSelectedMediaIds([])}
            className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            title="Clear Selection"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* ── Assignment Modal ────────────────────────────────────────────── */}
      {typeof window !== 'undefined' && isModalOpen && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div
            onClick={() => setIsModalOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
          />
          
          <div className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col z-[100000]">
            <div className="p-8 pb-6 border-b border-white/5">
              <h3 className="text-2xl font-black text-white tracking-tight mb-2">
                Assign {selectedMediaIds.length} {selectedMediaIds.length === 1 ? 'Photo' : 'Photos'}
              </h3>
              <p className="text-zinc-400 text-sm">Select a destination chapter to move your selected media.</p>
            </div>

            <div className="p-6 overflow-y-auto max-h-[50vh] space-y-2 bg-black/20">
              {chapters.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedDestinationChapter(c.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                    selectedDestinationChapter === c.id
                      ? "bg-rose-500/10 border-rose-500 text-white"
                      : "bg-white/5 border-white/5 text-zinc-300 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {c.emoji && <span className="text-2xl">{c.emoji}</span>}
                    <span className="font-bold">{c.title}</span>
                  </div>
                  {selectedDestinationChapter === c.id && (
                    <div className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
              
              <div className="my-4 border-t border-white/5" />
              
              <button
                onClick={() => setSelectedDestinationChapter(null)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                  selectedDestinationChapter === null
                    ? "bg-zinc-800 border-zinc-500 text-white"
                    : "bg-transparent border-white/5 text-zinc-400 hover:bg-white/5 hover:border-white/20 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-zinc-400" />
                  </div>
                  <span className="font-medium">Unassigned Media</span>
                </div>
                {selectedDestinationChapter === null && (
                  <div className="w-6 h-6 rounded-full bg-zinc-600 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            </div>

            <div className="p-6 border-t border-white/5 bg-[#111] flex items-center gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-6 py-3 rounded-xl font-bold text-zinc-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBatchAssignSubmit}
                className="flex-1 px-6 py-3 rounded-xl font-bold bg-rose-500 text-white hover:bg-rose-400 shadow-lg shadow-rose-500/20 transition-all active:scale-95"
              >
                Assign {selectedMediaIds.length} {selectedMediaIds.length === 1 ? 'Item' : 'Items'}
              </button>
            </div>
          </div>
        </div>
      , document.body)}
    </div>
  );
}
