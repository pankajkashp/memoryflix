"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MediaAsset } from "@prisma/client";
import { GripVertical } from "lucide-react";
import SetCoverButton from "./SetCoverButton";
import CaptionEditor from "./CaptionEditor";

interface SortableMediaItemProps {
  asset: MediaAsset;
  storyId?: string;
  coverMediaId?: string | null;
  /** 1-based position label shown on the card */
  position?: number;
  /** True when this item is the active drag source (overlay is floating above it) */
  isBeingDragged?: boolean;
}

export default function SortableMediaItem({
  asset,
  storyId,
  coverMediaId,
  position,
  isBeingDragged = false,
}: SortableMediaItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: asset.id });

  // When `isDragging` is true the DragOverlay takes over rendering the visual;
  // the original slot shows a faded placeholder so the grid gap is preserved.
  const baseTransform = CSS.Transform.toString(transform);
  const style: React.CSSProperties = {
    transform: baseTransform ?? undefined,
    transition,
    zIndex: isDragging ? 50 : 1,
    willChange: "transform",
  };

  return (
    // Outer wrapper — owns the sortable ref & transform; not clipped so caption shows below
    <div ref={setNodeRef} style={style} className="flex flex-col">
      {/* ── Media card ──────────────────────────────────────────────────────── */}
      <div
        className={`group relative aspect-square rounded-lg overflow-hidden bg-gray-100 border transition-all duration-150 ${
          isBeingDragged
            ? "opacity-40 border-indigo-300 scale-95"
            : isDragging
            ? "border-indigo-500 shadow-2xl ring-2 ring-indigo-500"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        {/* ── Drag Handle ─────────────────────────────────────────────────── */}
        <div
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          className={`absolute top-2 right-2 z-20 p-1.5 rounded bg-black/50 text-white transition-all duration-150 hover:bg-black/70 cursor-grab active:cursor-grabbing backdrop-blur-sm touch-none ${
            isBeingDragged
              ? "opacity-0"
              : isDragging
              ? "opacity-100 !bg-indigo-600 scale-110"
              : "opacity-0 group-hover:opacity-100"
          }`}
          title="Drag to reorder"
          aria-label="Drag to reorder media"
        >
          <GripVertical className="w-4 h-4" />
        </div>

        {/* ── Position badge ──────────────────────────────────────────────── */}
        {position !== undefined && (
          <div className="absolute bottom-2 left-2 z-10 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white/80 pointer-events-none select-none tabular-nums">
            #{position}
          </div>
        )}

        {/* ── Cover badge / set-cover button ──────────────────────────────── */}
        {storyId && asset.type === "IMAGE" && asset.id !== coverMediaId && (
          <SetCoverButton storyId={storyId} mediaId={asset.id} />
        )}
        {asset.id === coverMediaId && (
          <div className="absolute top-2 left-2 z-10 rounded bg-indigo-500 px-2 py-1 text-[10px] sm:text-xs font-bold text-white shadow-sm pointer-events-none">
            COVER
          </div>
        )}

        {/* ── Video badge ─────────────────────────────────────────────────── */}
        {asset.type === "VIDEO" && (
          <div className="absolute bottom-2 right-2 z-10 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white pointer-events-none">
            VIDEO
          </div>
        )}

        {/* ── Media ───────────────────────────────────────────────────────── */}
        {asset.type === "IMAGE" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={asset.url}
            alt={asset.caption || "Uploaded media"}
            className="object-cover w-full h-full pointer-events-none"
            draggable={false}
          />
        ) : (
          <video
            src={asset.url}
            className="object-cover w-full h-full pointer-events-none"
            draggable={false}
          />
        )}
      </div>

      {/* ── Caption editor (below the card, only when storyId is known) ─────── */}
      {storyId && (
        <CaptionEditor
          storyId={storyId}
          mediaId={asset.id}
          initialCaption={asset.caption}
        />
      )}
    </div>
  );
}
