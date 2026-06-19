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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import SortableMediaItem from "./SortableMediaItem";
import { reorderMedia } from "@/app/actions/media";
import { Loader2 } from "lucide-react";

// ── DragOverlay preview card ──────────────────────────────────────────────────
function DragPreviewCard({ asset }: { asset: MediaAsset }) {
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
    </div>
  );
}

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

    if (over && active.id !== over.id) {
      setItems((currentItems) => {
        const oldIndex = currentItems.findIndex((item) => item.id === active.id);
        const newIndex = currentItems.findIndex((item) => item.id === over.id);
        const newOrder = arrayMove(currentItems, oldIndex, newIndex);

        if (storyId) {
          startTransition(async () => {
            await reorderMedia(storyId, newOrder.map((item) => item.id));
          });
        }

        return newOrder;
      });
    }
  };

  const handleDragCancel = () => {
    setActiveAsset(null);
  };

  if (items.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-black/20 py-12 text-center backdrop-blur-sm">
        <svg className="w-12 h-12 text-zinc-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-zinc-400">No media uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {/* Header row */}
      <div className="flex justify-between items-center mb-6 px-1">
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          <span className="flex items-center justify-center bg-white/10 rounded-full px-2 py-0.5 text-zinc-300">
            {items.length} {items.length === 1 ? "Item" : "Items"}
          </span>
          {items.length > 1 && (
            <span className="font-normal normal-case text-zinc-500 hidden sm:inline">
              · drag to reorder
            </span>
          )}
        </span>

        {isPending && (
          <span className="text-xs font-semibold text-rose-400 animate-pulse flex items-center gap-1.5">
            <Loader2 className="animate-spin h-3.5 w-3.5" />
            Saving order…
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
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {items.map((asset, index) => (
              <SortableMediaItem
                key={asset.id}
                asset={asset}
                storyId={storyId}
                coverMediaId={coverMediaId}
                position={index + 1}
                isBeingDragged={activeAsset?.id === asset.id}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay dropAnimation={{
          duration: 180,
          easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
        }}>
          {activeAsset ? <DragPreviewCard asset={activeAsset} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
