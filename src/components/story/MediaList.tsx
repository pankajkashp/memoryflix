"use client";

import { useState, useEffect, useTransition } from "react";
import { MediaAsset } from "@prisma/client";
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
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { reorderMedia } from "@/app/actions/media";
import { Loader2 } from "lucide-react";
import SortableMediaItem from "./SortableMediaItem";

// ── MediaList ─────────────────────────────────────────────────────────────────

export default function MediaList({
  media,
  storyId,
  coverMediaId,
}: {
  media: MediaAsset[];
  storyId?: string;
  coverMediaId?: string | null;
}) {
  const [items, setItems] = useState(media);
  const [activeAsset, setActiveAsset] = useState<MediaAsset | null>(null);
  const [isPending, startTransition] = useTransition();

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
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);

    if (storyId) {
      startTransition(async () => {
        await reorderMedia(storyId, newItems.map((i) => i.id));
      });
    }
  };

  const handleDragCancel = () => {
    setActiveAsset(null);
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
        <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {items.map((asset, idx) => (
              <SortableMediaItem
                key={asset.id}
                asset={asset}
                storyId={storyId}
                coverMediaId={coverMediaId}
                position={idx + 1}
                isBeingDragged={activeAsset?.id === asset.id}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay dropAnimation={{
          duration: 180,
          easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
        }}>
          {activeAsset ? (
            <div className="opacity-80 shadow-2xl scale-105 rotate-1 rounded-2xl overflow-hidden">
              <SortableMediaItem
                asset={activeAsset}
                storyId={storyId}
                coverMediaId={coverMediaId}
                isBeingDragged={true}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
