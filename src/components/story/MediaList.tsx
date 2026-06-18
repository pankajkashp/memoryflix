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

// ── DragOverlay preview card ──────────────────────────────────────────────────
// A lightweight clone rendered in the DragOverlay portal (above all z-indexes).
function DragPreviewCard({ asset }: { asset: MediaAsset }) {
  return (
    <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-indigo-500 shadow-2xl ring-2 ring-indigo-400 ring-offset-2 scale-105 rotate-1 opacity-95">
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
      {/* Glassy tint so it looks like it's "lifted" */}
      <div className="absolute inset-0 bg-indigo-500/10" />
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

  // Sync state when props change (e.g. after a fresh upload)
  useEffect(() => {
    setItems(media);
  }, [media]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // Require 8px of movement to distinguish click vs drag
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

        // Persist ordering to the server (background, non-blocking)
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
      <div className="mt-6 text-sm text-gray-500 italic">
        No media uploaded yet.
      </div>
    );
  }

  return (
    <div className="mt-6">
      {/* Header row */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          {items.length} {items.length === 1 ? "Item" : "Items"}
          {items.length > 1 && (
            <span className="ml-2 font-normal normal-case text-gray-400">
              · drag handle to reorder
            </span>
          )}
        </span>

        {isPending && (
          <span className="text-xs font-semibold text-indigo-500 animate-pulse flex items-center gap-1.5">
            <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
              <circle
                className="opacity-25"
                cx="12" cy="12" r="10"
                stroke="currentColor" strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
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

        {/* DragOverlay: renders a floating clone outside the grid's stacking context */}
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
