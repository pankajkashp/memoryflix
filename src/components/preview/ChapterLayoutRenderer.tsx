"use client";

import { Chapter, MediaAsset } from "@prisma/client";
import { useState, useTransition, useRef } from "react";
import { deleteMedia, assignMediaToChapter, setCoverMedia, replaceMedia } from "@/app/actions/media";
import { updateChapterLayout } from "@/app/actions/chapter";
import { Play, MoreVertical, Trash2, MapPin, Image as ImageIcon, LayoutGrid, Heart, Film, Image as PolaroidIcon, List, Replace } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import HeartLayout from "./templates/layouts/HeartLayout";
import { ConfirmModal } from "../ui/ConfirmModal";
import {
  useMasonryAnimation,
  useTimelineAnimation,
  usePolaroidAnimation,
  useFilmStripAnimation,
} from "./LayoutAnimations";

type EditableMediaItemProps = {
  item: MediaAsset;
  storyId: string;
  chapters: Chapter[];
  isEditable: boolean;
  coverMediaId?: string | null;
  onSelect: () => void;
};

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

  const handleReplace = async (result: any) => {
    startTransition(async () => {
      const info = result.info;
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

// ── Layout Components ────────────────────────────────────────────────────────

const MasonryLayout = ({ items, renderItem }: { items: any[], renderItem: (i: any) => React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useMasonryAnimation(containerRef);
  const count = items.length;

  if (count === 4) {
    // 2x2 Collage
    return (
      <div ref={containerRef} className="grid grid-cols-2 gap-4">
        {items.map(item => (
          <div key={item.item.id} className="aspect-square w-full h-full" data-masonry-item style={{ willChange: "transform, opacity" }}>
            {renderItem(item)}
          </div>
        ))}
      </div>
    );
  }

  if (count === 6) {
    // Masonry Collage
    return (
      <div ref={containerRef} className="columns-2 md:columns-3 gap-4 space-y-4">
        {items.map(item => (
          <div key={item.item.id} className="break-inside-avoid" data-masonry-item style={{ willChange: "transform, opacity" }}>
            {renderItem(item)}
          </div>
        ))}
      </div>
    );
  }

  if (count === 9) {
    // Premium memory collage (1 hero, 8 smaller)
    return (
      <div ref={containerRef} className="grid grid-cols-3 md:grid-cols-4 gap-4">
        <div className="col-span-3 md:col-span-2 row-span-2 md:row-span-2 aspect-square md:aspect-auto" data-masonry-item style={{ willChange: "transform, opacity" }}>
          {renderItem(items[0])}
        </div>
        {items.slice(1).map(item => (
          <div key={item.item.id} className="aspect-square w-full h-full" data-masonry-item style={{ willChange: "transform, opacity" }}>
            {renderItem(item)}
          </div>
        ))}
      </div>
    );
  }

  if (count >= 15) {
    // Large cinematic collage
    return (
      <div ref={containerRef} className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        {items.map((item, idx) => {
          // Make every 5th item large
          const isLarge = idx % 5 === 0;
          return (
            <div key={item.item.id} className={`${isLarge ? "col-span-2 row-span-2" : "col-span-1 row-span-1"} aspect-square w-full h-full`} data-masonry-item style={{ willChange: "transform, opacity" }}>
              {renderItem(item)}
            </div>
          );
        })}
      </div>
    );
  }

  // Fallback simple staggered masonry
  return (
    <div ref={containerRef} className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
      {items.map(item => (
        <div key={item.item.id} className="break-inside-avoid" data-masonry-item style={{ willChange: "transform, opacity" }}>
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
};



const FilmStripLayout = ({ items, renderItem }: { items: any[], renderItem: (i: any) => React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useFilmStripAnimation(containerRef);
  return (
    <div ref={containerRef} className="flex overflow-x-auto gap-4 pb-8 snap-x snap-mandatory hide-scrollbar">
      {items.map(item => (
        <div key={item.item.id} className="snap-center shrink-0 w-72 md:w-96 aspect-video" data-filmstrip-item style={{ willChange: "transform, opacity" }}>
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
};

const PolaroidLayout = ({ items, renderItem }: { items: any[], renderItem: (i: any) => React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  usePolaroidAnimation(containerRef);
  return (
    <div ref={containerRef} className="flex flex-wrap justify-center gap-6 md:gap-12 py-12">
      {items.map((item, idx) => (
        <div 
          key={item.item.id}
          data-polaroid-item
          style={{ willChange: "transform, opacity" }}
          className={`w-48 md:w-64 aspect-square bg-white p-3 pb-12 shadow-2xl transition-transform hover:z-20 hover:scale-110 
            ${idx % 3 === 0 ? '-rotate-6' : idx % 3 === 1 ? 'rotate-3' : '-rotate-2'}
          `}
        >
          <div className="w-full h-full bg-zinc-100 overflow-hidden">
            {renderItem(item)}
          </div>
        </div>
      ))}
    </div>
  );
};

const TimelineLayout = ({ items, renderItem }: { items: any[], renderItem: (i: any) => React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useTimelineAnimation(containerRef);
  return (
    <div
      ref={containerRef}
      className="relative max-w-3xl mx-auto space-y-12 before:absolute before:inset-0 before:ml-5 md:before:mx-auto md:before:w-0.5 before:w-0.5 before:bg-white/10"
      data-timeline-line
    >
      {items.map((item, idx) => {
        const isEven = idx % 2 === 0;
        return (
          <div
            key={item.item.id}
            className="relative flex items-center justify-between md:justify-normal w-full group"
            data-timeline-item
            style={{ willChange: "transform, opacity" }}
          >
            <div className="absolute left-5 md:left-1/2 w-4 h-4 rounded-full bg-rose-500 border-4 border-black -translate-x-[7px] md:-translate-x-1/2 z-10 shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
            <div className={`ml-12 md:ml-0 md:w-[45%] ${isEven ? 'md:pr-8' : 'md:pl-8 md:ml-auto'}`}>
              <div className="aspect-[4/3] w-full">
                {renderItem(item)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

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
        {layout === "MASONRY" && <MasonryLayout items={mediaItems} renderItem={renderItem} />}
        {layout === "HEART" && <HeartLayout items={mediaItems} renderItem={renderItem} />}
        {layout === "FILM_STRIP" && <FilmStripLayout items={mediaItems} renderItem={renderItem} />}
        {layout === "POLAROID" && <PolaroidLayout items={mediaItems} renderItem={renderItem} />}
        {layout === "TIMELINE" && <TimelineLayout items={mediaItems} renderItem={renderItem} />}
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
