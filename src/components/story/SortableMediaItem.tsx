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

  const baseTransform = CSS.Transform.toString(transform);
  const style: React.CSSProperties = {
    transform: baseTransform ?? undefined,
    transition,
    zIndex: isDragging ? 50 : 1,
    willChange: "transform",
  };

  return (
    <div ref={setNodeRef} style={style} className="flex flex-col">
      {/* ── Media card ──────────────────────────────────────────────────────── */}
      <div
        className={`group relative aspect-square rounded-2xl overflow-hidden bg-black/50 border transition-all duration-300 shadow-lg ${
          isBeingDragged
            ? "opacity-30 border-rose-500/50 scale-95"
            : isDragging
            ? "border-rose-500 shadow-rose-500/30 ring-2 ring-rose-500 shadow-2xl scale-105"
            : "border-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-black/50"
        }`}
      >
        {/* ── Drag Handle ─────────────────────────────────────────────────── */}
        <div
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          className={`absolute top-2 right-2 z-20 p-2 rounded-full bg-black/60 text-white transition-all duration-300 hover:bg-rose-500 cursor-grab active:cursor-grabbing backdrop-blur-md touch-none border border-white/10 ${
            isBeingDragged
              ? "opacity-0"
              : isDragging
              ? "opacity-100 !bg-rose-600 scale-110"
              : "opacity-0 group-hover:opacity-100"
          }`}
          title="Drag to reorder"
          aria-label="Drag to reorder media"
        >
          <GripVertical className="w-4 h-4" />
        </div>

        {/* ── Position badge ──────────────────────────────────────────────── */}
        {position !== undefined && (
          <div className="absolute bottom-2 left-2 z-10 rounded-full bg-black/60 backdrop-blur-md px-2 py-1 text-[10px] font-bold text-white/90 border border-white/10 pointer-events-none select-none tabular-nums">
            #{position}
          </div>
        )}

        {/* ── Cover badge / set-cover button ──────────────────────────────── */}
        {storyId && asset.type === "IMAGE" && asset.id !== coverMediaId && (
          <SetCoverButton storyId={storyId} mediaId={asset.id} />
        )}
        {asset.id === coverMediaId && (
          <div className="absolute top-2 left-2 z-10 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 px-3 py-1 text-[10px] font-bold text-white shadow-lg pointer-events-none tracking-wider">
            COVER
          </div>
        )}

        {/* ── Video badge ─────────────────────────────────────────────────── */}
        {asset.type === "VIDEO" && (
          <div className="absolute bottom-2 right-2 z-10 rounded-full bg-black/60 backdrop-blur-md px-2 py-1 text-[10px] font-semibold text-white pointer-events-none border border-white/10 flex items-center gap-1">
            <svg className="w-3 h-3 text-rose-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
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
        
        {/* Subtle overlay to enhance contrast for badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
      </div>

      {/* ── Caption editor ────────────────────────────────────────────────── */}
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
