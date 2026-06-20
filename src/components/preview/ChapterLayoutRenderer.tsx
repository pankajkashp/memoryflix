"use client";

import { Chapter, MediaAsset } from "@prisma/client";
import { useState, useTransition } from "react";
import { deleteMedia, assignMediaToChapter, setCoverMedia } from "@/app/actions/media";
import { updateChapterLayout } from "@/app/actions/chapter";
import { Play, MoreVertical, Trash2, MapPin, Image as ImageIcon, LayoutGrid, Heart, Film, Image as PolaroidIcon, List } from "lucide-react";

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

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this media?")) {
      startTransition(async () => {
        await deleteMedia(storyId, item.id);
      });
    }
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

  return (
    <div 
      className="relative group w-full h-full cursor-pointer"
      onMouseLeave={() => setShowMenu(false)}
    >
      <div 
        onClick={onSelect}
        className="w-full h-full"
      >
        {item.type === "VIDEO" ? (
          <video src={item.url} className="w-full h-full object-cover rounded-xl" autoPlay muted loop playsInline />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.url} alt="Media" className="w-full h-full object-cover rounded-xl" />
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
    </div>
  );
}

// ── Layout Components ────────────────────────────────────────────────────────

const MasonryLayout = ({ items, renderItem }: { items: any[], renderItem: (i: any) => React.ReactNode }) => (
  <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
    {items.map(item => (
      <div key={item.item.id} className="break-inside-avoid">
        {renderItem(item)}
      </div>
    ))}
  </div>
);

const HeartLayout = ({ items, renderItem }: { items: any[], renderItem: (i: any) => React.ReactNode }) => {
  // A simplified CSS grid approach that roughly mimics a heart shape for ~8 items
  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-5 gap-2 md:gap-4 max-w-3xl w-full">
        {items.map((item, idx) => {
          let colSpan = "col-span-1";
          let rowSpan = "row-span-1";
          // Basic manual positioning for a heart-like staggered look
          if (idx === 0) colSpan = "col-span-1 col-start-2 row-start-1";
          if (idx === 1) colSpan = "col-span-1 col-start-4 row-start-1";
          if (idx === 2) colSpan = "col-span-1 col-start-1 row-start-2";
          if (idx === 3) colSpan = "col-span-1 col-start-5 row-start-2";
          if (idx === 4) colSpan = "col-span-1 col-start-2 row-start-3";
          if (idx === 5) colSpan = "col-span-1 col-start-4 row-start-3";
          if (idx === 6) colSpan = "col-span-1 col-start-3 row-start-4";
          
          return (
            <div key={item.item.id} className={`aspect-square ${colSpan} ${rowSpan}`}>
              {renderItem(item)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const FilmStripLayout = ({ items, renderItem }: { items: any[], renderItem: (i: any) => React.ReactNode }) => (
  <div className="flex overflow-x-auto gap-4 pb-8 snap-x snap-mandatory hide-scrollbar">
    {items.map(item => (
      <div key={item.item.id} className="snap-center shrink-0 w-72 md:w-96 aspect-video">
        {renderItem(item)}
      </div>
    ))}
  </div>
);

const PolaroidLayout = ({ items, renderItem }: { items: any[], renderItem: (i: any) => React.ReactNode }) => (
  <div className="flex flex-wrap justify-center gap-6 md:gap-12 py-12">
    {items.map((item, idx) => (
      <div 
        key={item.item.id} 
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

const TimelineLayout = ({ items, renderItem }: { items: any[], renderItem: (i: any) => React.ReactNode }) => (
  <div className="relative max-w-3xl mx-auto space-y-12 before:absolute before:inset-0 before:ml-5 md:before:mx-auto md:before:w-0.5 before:w-0.5 before:bg-white/10">
    {items.map((item, idx) => {
      const isEven = idx % 2 === 0;
      return (
        <div key={item.item.id} className="relative flex items-center justify-between md:justify-normal w-full group">
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

// ── ChapterLayoutRenderer ──────────────────────────────────────────────────

export default function ChapterLayoutRenderer({
  chapter,
  mediaItems,
  storyId,
  chapters,
  coverMediaId,
  isEditable,
  onMediaSelect,
}: {
  chapter?: Chapter; // If undefined, it's the "Unassigned" section
  mediaItems: { item: MediaAsset, index: number }[];
  storyId: string;
  chapters: Chapter[];
  coverMediaId?: string | null;
  isEditable: boolean;
  onMediaSelect: (index: number) => void;
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

  return (
    <div className="relative">
      {/* Chapter Layout Controls */}
      {isEditable && chapter && (
        <div className="absolute -top-16 right-0 flex items-center gap-1 bg-black/40 backdrop-blur-md rounded-lg p-1 border border-white/10 opacity-0 group-hover/chapter:opacity-100 transition-opacity">
          <button onClick={() => changeLayout("MASONRY")} className={`p-1.5 rounded-md transition-colors ${layout === "MASONRY" ? "bg-rose-500 text-white" : "text-zinc-400 hover:text-white"}`} title="Masonry">
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button onClick={() => changeLayout("HEART")} className={`p-1.5 rounded-md transition-colors ${layout === "HEART" ? "bg-rose-500 text-white" : "text-zinc-400 hover:text-white"}`} title="Heart">
            <Heart className="w-4 h-4" />
          </button>
          <button onClick={() => changeLayout("FILM_STRIP")} className={`p-1.5 rounded-md transition-colors ${layout === "FILM_STRIP" ? "bg-rose-500 text-white" : "text-zinc-400 hover:text-white"}`} title="Film Strip">
            <Film className="w-4 h-4" />
          </button>
          <button onClick={() => changeLayout("POLAROID")} className={`p-1.5 rounded-md transition-colors ${layout === "POLAROID" ? "bg-rose-500 text-white" : "text-zinc-400 hover:text-white"}`} title="Polaroid">
            <PolaroidIcon className="w-4 h-4" />
          </button>
          <button onClick={() => changeLayout("TIMELINE")} className={`p-1.5 rounded-md transition-colors ${layout === "TIMELINE" ? "bg-rose-500 text-white" : "text-zinc-400 hover:text-white"}`} title="Timeline">
            <List className="w-4 h-4" />
          </button>
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
    </div>
  );
}
