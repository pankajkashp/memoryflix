"use client";

import React, { useState, useTransition, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MediaAsset, Chapter } from "@prisma/client";
import { GripVertical, MoreVertical, Trash2, MapPin, Image as ImageIcon, Type } from "lucide-react";
import { deleteMedia, setCoverMedia } from "@/app/actions/media";
import MediaDetailsDrawer from "./MediaDetailsDrawer";
import { ConfirmModal } from "../ui/ConfirmModal";

interface SortableMediaItemProps {
  asset: MediaAsset;
  storyId?: string;
  coverMediaId?: string | null;
  chapters?: Chapter[];
  /** 1-based position label shown on the card */
  position?: number;
  /** True when this item is the active drag source (overlay is floating above it) */
  isBeingDragged?: boolean;
  /** True when this item is selected via multi-select */
  isSelected?: boolean;
  /** Callback to toggle selection */
  onSelectToggle?: (id: string) => void;
}

export default function SortableMediaItem({
  asset,
  storyId,
  coverMediaId,
  chapters,
  position: _position,
  isBeingDragged = false,
  isSelected = false,
  onSelectToggle,
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

  const [isPending, startTransition] = useTransition();
  const [showMenu, setShowMenu] = useState(false);
  const [menuRect, setMenuRect] = useState<DOMRect | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Close menu on scroll or resize
  useEffect(() => {
    if (!showMenu) return;
    const handleScroll = () => setShowMenu(false);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [showMenu]);

  // Close menu when clicking outside
  useEffect(() => {
    if (!showMenu) return;
    const handleClick = () => setShowMenu(false);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [showMenu]);
  
  // For caption editing within the hover menu

  const baseTransform = CSS.Transform.toString(transform);
  const style: React.CSSProperties = {
    transform: baseTransform ?? undefined,
    transition,
    zIndex: isDragging ? 50 : 1,
    willChange: "transform",
  };

  const currentChapter = chapters?.find(c => c.id === asset.chapterId);

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (storyId) await deleteMedia(storyId, asset.id);
    setShowDeleteModal(false);
  };

  const handleSetCover = () => {
    startTransition(async () => {
      if (storyId) await setCoverMedia(storyId, asset.id);
      setShowMenu(false);
    });
  };


  return (
    <div ref={setNodeRef} style={style} className="flex flex-col relative w-full h-full" onMouseLeave={() => setShowMenu(false)}>
      <div
        className={`group relative aspect-[4/5] sm:aspect-square w-full rounded-2xl overflow-hidden bg-black/50 border transition-all duration-300 shadow-lg ${
          isBeingDragged
            ? "opacity-30 border-rose-500/50 scale-95"
            : isDragging
            ? "border-rose-500 shadow-rose-500/30 ring-2 ring-rose-500 shadow-2xl scale-105"
            : isSelected
            ? "border-rose-500 ring-2 ring-rose-500 ring-offset-2 ring-offset-black scale-[0.98] opacity-90"
            : "border-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-black/50"
        }`}
        onClick={(e) => {
          if (onSelectToggle) {
             e.stopPropagation();
             onSelectToggle(asset.id);
          }
        }}
      >
        {/* ── Selection Overlay ────────────────────────────────────────────── */}
        {onSelectToggle && (
          <div className="absolute inset-0 z-30 cursor-pointer pointer-events-none">
            <div className={`absolute top-2 left-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              isSelected 
                ? "bg-rose-500 border-rose-500 text-white" 
                : "bg-black/40 border-white/40 text-transparent opacity-0 group-hover:opacity-100 backdrop-blur-md"
            }`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            {isSelected && <div className="absolute inset-0 bg-rose-500/10 pointer-events-none mix-blend-overlay" />}
          </div>
        )}

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

        {/* ── Menu Button ─────────────────────────────────────────────────── */}
        <div className={`absolute top-2 right-12 z-40 transition-opacity duration-300 ${isBeingDragged || isDragging ? "opacity-0" : "opacity-0 group-hover:opacity-100"}`}>
          <div className="relative">
            <button 
              ref={buttonRef}
              onClick={(e) => { 
                e.stopPropagation(); 
                if (!showMenu && buttonRef.current) {
                  setMenuRect(buttonRef.current.getBoundingClientRect());
                }
                setShowMenu(!showMenu); 
              }}
              className="bg-black/60 backdrop-blur-md hover:bg-rose-500 p-2 rounded-full text-white transition-colors border border-white/10"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {showMenu && menuRect && createPortal(
              <div 
                className="fixed w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl py-1 z-[9999]"
                style={{
                  top: menuRect.bottom + 8,
                  left: menuRect.right - 192, // align right (192px = w-48)
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {asset.type === "IMAGE" && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleSetCover(); }}
                    disabled={isPending || asset.id === coverMediaId}
                    className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white disabled:opacity-50 flex items-center gap-2"
                  >
                    <ImageIcon className="w-4 h-4" /> Set as Cover
                  </button>
                )}
                
                <button
                  onClick={(e) => { e.stopPropagation(); setShowMenu(false); setShowDetailsModal(true); }}
                  className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white flex items-center gap-2"
                >
                  <Type className="w-4 h-4" /> Edit Memory
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); setShowMenu(false); setShowDetailsModal(true); }}
                  className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" /> Add Location
                </button>
                
                <div className="border-t border-white/5 my-1" />
                <button
                  onClick={(e) => { e.stopPropagation(); setShowMenu(false); handleDelete(); }}
                  disabled={isPending}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Remove Photo
                </button>
              </div>,
              document.body
            )}
          </div>
        </div>

        {/* ── Badges ──────────────────────────────────────────────── */}
        <div className="absolute bottom-2 left-2 right-2 z-10 flex flex-col gap-1 items-start pointer-events-none">
          {asset.id === coverMediaId && (
            <div className="rounded-full bg-gradient-to-r from-rose-500 to-purple-600 px-3 py-1 text-[10px] font-bold text-white shadow-lg tracking-wider shrink-0 max-w-full truncate">
              COVER
            </div>
          )}
          
          {currentChapter && (
            <div className="rounded-full bg-black/60 backdrop-blur-md px-2 py-1 text-[8px] sm:text-[10px] font-bold text-white/90 border border-white/10 flex items-center gap-1 shadow-lg max-w-full min-w-0">
              <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-rose-400 shrink-0" />
              <span className="truncate min-w-0">{currentChapter.title}</span>
            </div>
          )}
        </div>

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

      {showDetailsModal && storyId && (
        <MediaDetailsDrawer
          storyId={storyId}
          mediaId={asset.id}
          initialData={{
            title: asset.title,
            memoryNote: asset.memoryNote,
            location: asset.location,
            memoryDate: asset.memoryDate,
          }}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Media?"
        description="Are you sure you want to delete this media?"
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
