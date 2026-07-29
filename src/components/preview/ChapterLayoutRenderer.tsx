"use client";

import { Chapter, MediaAsset } from "@prisma/client";
import { useState, useTransition, useRef } from "react";
import { deleteMedia, assignMediaToChapter, setCoverMedia, replaceMedia } from "@/app/actions/media";
import { updateChapterLayout } from "@/app/actions/chapter";
import { Play, MoreVertical, Trash2, MapPin, Image as ImageIcon, LayoutGrid, Heart, Film, Image as PolaroidIcon, List, Replace } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import HeartLayout from "./templates/layouts/HeartLayout";
import { ConfirmModal } from "../ui/ConfirmModal";
import MasonryLayout from "./templates/layouts/MasonryLayout";
import FilmStripLayout from "./templates/layouts/FilmStripLayout";
import PolaroidLayout from "./templates/layouts/PolaroidLayout";
import TimelineLayout from "./templates/layouts/TimelineLayout";

type EditableMediaItemProps = {
  item: MediaAsset;
  storyId: string;
  chapters: Chapter[];
  isEditable: boolean;
  coverMediaId?: string | null;
  onSelect: () => void;
};

type CloudinaryUploadResult = {
  info: {
    resource_type: string;
    secure_url: string;
    public_id: string;
    bytes: number;
    duration?: number;
  };
};

export type LayoutItem = { item: MediaAsset; type: "IMAGE" | "VIDEO" };

function EditableMediaCard({ item, storyId, chapters, isEditable, coverMediaId, onSelect }: EditableMediaItemProps) {
  const [isPending, startTransition] = useTransition();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    await deleteMedia(storyId, item.id);
    setShowDeleteModal(false);
  };

  const handleSetCover = () => {
    startTransition(async () => {
      await setCoverMedia(storyId, item.id);
    });
  };

  const handleMove = (chapterId: string | null) => {
    startTransition(async () => {
      await assignMediaToChapter(storyId, item.id, chapterId);
      setShowMenu(false);
    });
  };

  const handleReplace = async (result: unknown) => {
    const uploadResult = result as CloudinaryUploadResult;
    startTransition(async () => {
      const info = uploadResult.info;
      const type = info.resource_type === "video" ? "VIDEO" : "IMAGE";
      await replaceMedia(storyId, item.id, {
        url: info.secure_url,
        publicId: info.public_id,
        type,
        bytes: info.bytes,
        duration: info.duration,
      });
      setShowMenu(false);
    });
  };

  return (
    <div 
      className="relative group w-full h-full flex flex-col cursor-pointer"
      onMouseLeave={() => setShowMenu(false)}
    >
      <div 
        onClick={onSelect}
        className="w-full relative flex-1 min-h-[200px]"
      >
        {item.type === "VIDEO" ? (
          <video src={item.url} className="w-full h-full object-cover rounded-xl" autoPlay muted loop playsInline />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.url} alt={item.title || "Memory"} className="w-full h-full object-cover rounded-xl" loading="lazy" decoding="async" />
        )}
        
        {item.type === "VIDEO" && (
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md rounded-full p-1.5">
            <Play className="w-3 h-3 text-white fill-current" />
          </div>
        )}

        {item.id === coverMediaId && (
          <div className="absolute top-3 left-3 bg-rose-500 rounded-md px-2 py-0.5 text-[10px] font-bold text-white shadow-lg tracking-wider">
            COVER
          </div>
        )}
      </div>

      {/* Memory Notes Metadata */}
      {(item.title || item.memoryNote || item.location || item.memoryDate) && (
        <div className="pt-4 pb-2 px-1 flex flex-col gap-2">
          {item.title && (
            <h4 className="text-lg font-bold text-white leading-tight">{item.title}</h4>
          )}
          {item.memoryNote && (
            <p
              className="text-base md:text-lg text-zinc-300 font-serif italic leading-relaxed"
              data-memory-note
              style={{ willChange: "transform, opacity, filter" }}
            >
              {item.memoryNote}
            </p>
          )}
          {(item.location || item.memoryDate) && (
            <div
              className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-widest mt-1"
              data-memory-meta
              style={{ willChange: "transform, opacity" }}
            >
              {item.location && <span>{item.location}</span>}
              {item.location && item.memoryDate && <span>•</span>}
              {item.memoryDate && <span>{new Date(item.memoryDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>}
            </div>
          )}
        </div>
      )}

      {isEditable && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
              className="bg-black/60 backdrop-blur-md hover:bg-rose-500 p-2 rounded-full text-white transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {showMenu && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl py-1 z-50">
                <button
                  onClick={(e) => { e.stopPropagation(); handleSetCover(); }}
                  disabled={isPending || item.id === coverMediaId || item.type !== "IMAGE"}
                  className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white disabled:opacity-50 flex items-center gap-2"
                >
                  <ImageIcon className="w-4 h-4" /> Set as Cover
                </button>
                <CldUploadWidget
                  signatureEndpoint="/api/cloudinary/sign"
                  onSuccess={handleReplace}
                  options={{ folder: "memoryflix", resourceType: "auto", theme: "minimal" }}
                >
                  {({ open }) => (
                    <button
                      onClick={(e) => { e.stopPropagation(); open(); }}
                      disabled={isPending}
                      className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white disabled:opacity-50 flex items-center gap-2"
                    >
                      <Replace className="w-4 h-4" /> Replace Media
                    </button>
                  )}
                </CldUploadWidget>
                <div className="border-t border-white/5 my-1" />
                <div className="px-4 py-1 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Move to Chapter</div>
                {chapters.map(c => (
                  <button
                    key={c.id}
                    onClick={(e) => { e.stopPropagation(); handleMove(c.id); }}
                    disabled={isPending || item.chapterId === c.id}
                    className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white disabled:opacity-50 flex items-center gap-2"
                  >
                    <MapPin className="w-4 h-4" /> {c.title}
                  </button>
                ))}
                <button
                  onClick={(e) => { e.stopPropagation(); handleMove(null); }}
                  disabled={isPending || !item.chapterId}
                  className="w-full text-left px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 disabled:opacity-50 flex items-center gap-2"
                >
                  Remove from Chapter
                </button>
                <div className="border-t border-white/5 my-1" />
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                  disabled={isPending}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Delete Media
                </button>
              </div>
            )}
          </div>
        </div>
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

// ── ChapterLayoutRenderer ──────────────────────────────────────────────────

export default function ChapterLayoutRenderer({
  chapter,
  mediaItems,
  storyId,
  chapters,
  coverMediaId,
  isEditable,
  onMediaSelect,
  nextChapter,
  onNextChapter,
  chapterIndex,
  totalChapters,
  videoCount,
}: {
  chapter?: Chapter;
  mediaItems: { item: MediaAsset, index: number }[];
  storyId: string;
  chapters: Chapter[];
  coverMediaId?: string | null;
  isEditable: boolean;
  onMediaSelect: (index: number) => void;
  nextChapter?: Chapter | null;
  onNextChapter?: () => void;
  chapterIndex?: number;
  totalChapters?: number;
  videoCount?: number;
}) {
  const [isPending, startTransition] = useTransition();

  const layout = chapter?.layout || "MASONRY";

  const changeLayout = (newLayout: string) => {
    if (!chapter || newLayout === layout) return;
    startTransition(async () => {
      await updateChapterLayout(storyId, chapter.id, newLayout);
    });
  };

  const renderItem = ({ item, index }: { item: MediaAsset, index: number }) => (
    <EditableMediaCard
      item={item}
      storyId={storyId}
      chapters={chapters}
      isEditable={isEditable}
      coverMediaId={coverMediaId}
      onSelect={() => onMediaSelect(index)}
    />
  );

  const count = mediaItems.length;

  const getButtonProps = (req: number, type: string, icon: React.ReactNode, label: string) => {
    const isLocked = count < req;
    const isSelected = layout === type;
    const missing = req - count;
    
    return {
      onClick: () => !isLocked && changeLayout(type),
      className: `relative p-1.5 rounded-md transition-colors group/btn ${
        isSelected ? "bg-rose-500 text-white" : 
        isLocked ? "text-zinc-600 cursor-not-allowed bg-black/20" : 
        "text-zinc-400 hover:text-white"
      }`,
      title: isLocked ? `Add ${missing} more ${missing === 1 ? "photo" : "photos"} to unlock ${label}` : label,
      children: (
        <>
          {icon}
          {isLocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-md">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500/80 shadow-[0_0_5px_red]" />
            </div>
          )}
        </>
      )
    };
  };

  return (
    <div className="relative">
      {/* Chapter Layout Controls */}
      {isEditable && chapter && (
        <div className="absolute -top-16 right-0 flex items-center gap-1 bg-black/40 backdrop-blur-md rounded-lg p-1 border border-white/10 opacity-100 md:opacity-0 md:group-hover/chapter:opacity-100 transition-opacity duration-200">
          <button {...getButtonProps(4, "MASONRY", <LayoutGrid className="w-4 h-4" />, "Masonry Grid")} />
          <button {...getButtonProps(12, "HEART", <Heart className="w-4 h-4" />, "Heart Layout ❤️")} />
          <button {...getButtonProps(5, "FILM_STRIP", <Film className="w-4 h-4" />, "Film Strip")} />
          <button {...getButtonProps(6, "POLAROID", <PolaroidIcon className="w-4 h-4" />, "Polaroid Layout")} />
          <button {...getButtonProps(3, "TIMELINE", <List className="w-4 h-4" />, "Timeline Layout")} />
        </div>
      )}

      {/* Render selected layout */}
      <div className={isPending ? "opacity-50 pointer-events-none transition-opacity" : ""}>
        {(() => {
          const layoutItems: LayoutItem[] = mediaItems.map(({ item }) => ({
            item,
            type: item.type,
          }));
          const renderLayoutItem = (i: LayoutItem) => {
            const index = mediaItems.findIndex(m => m.item.id === i.item.id);
            return renderItem({ item: i.item, index });
          };

          return (
            <>
              {layout === "MASONRY" && <MasonryLayout items={layoutItems} renderItem={renderLayoutItem} />}
              {layout === "HEART" && <HeartLayout items={layoutItems} renderItem={renderLayoutItem} />}
              {layout === "FILM_STRIP" && <FilmStripLayout items={layoutItems} renderItem={renderLayoutItem} />}
              {layout === "POLAROID" && <PolaroidLayout items={layoutItems} renderItem={renderLayoutItem} />}
              {layout === "TIMELINE" && <TimelineLayout items={layoutItems} renderItem={renderLayoutItem} />}
            </>
          );
        })()}
      </div>

      {/* ── End of Chapter Card ── */}
      {chapter && onNextChapter !== undefined && typeof chapterIndex === "number" && typeof totalChapters === "number" && (
        <div className="mt-24 py-24 border-t border-white/10 text-center">
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-rose-500/50 to-transparent mx-auto mb-10" />
          <p className="text-rose-500 font-bold tracking-[0.4em] uppercase text-xs mb-4">
            End of Chapter {chapterIndex + 1}
          </p>
          <h3 className="text-4xl md:text-6xl font-black text-white mb-3">
            {chapter.emoji && <span className="mr-4">{chapter.emoji}</span>}
            {chapter.title}
          </h3>
          <div className="flex items-center justify-center gap-4 text-zinc-500 font-medium text-sm mt-4 mb-12">
            <span>{mediaItems.length} Memories</span>
            {(videoCount ?? 0) > 0 && <><span>•</span><span>{videoCount} Videos</span></>}
            {chapter.date && <><span>•</span><span>{new Date(chapter.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span></>}
          </div>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-rose-500/50 to-transparent mx-auto mb-12" />

          {nextChapter ? (
            <div>
              <p className="text-zinc-500 text-sm font-medium mb-6 uppercase tracking-widest">Next Chapter</p>
              <button
                onClick={onNextChapter}
                className="group inline-flex flex-col items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-rose-500/40 rounded-2xl px-12 py-8 transition-all hover:shadow-[0_0_40px_rgba(244,63,94,0.15)] hover:-translate-y-1"
              >
                {nextChapter.emoji && <span className="text-4xl">{nextChapter.emoji}</span>}
                <span className="text-2xl font-black text-white group-hover:text-rose-200 transition-colors">
                  {nextChapter.title}
                </span>
                {nextChapter.subtitle && (
                  <span className="text-zinc-500 italic text-sm">&quot;{nextChapter.subtitle}&quot;</span>
                )}
                <span className="mt-3 flex items-center gap-2 bg-rose-500 text-white font-bold px-6 py-2.5 rounded-full text-sm group-hover:bg-rose-400 transition-colors">
                  Continue Story →
                </span>
              </button>
            </div>
          ) : (
            <div>
              <p className="text-zinc-500 text-sm font-medium mb-4">You&apos;ve reached the end of the story.</p>
              <div className="text-4xl mb-4">❤️</div>
              <p className="text-zinc-600 text-sm italic">&quot;Every memory deserves a premiere.&quot;</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
