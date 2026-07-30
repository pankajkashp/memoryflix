import { Play, MapPin } from "lucide-react";
import { Chapter, MediaAsset } from "@prisma/client";
import Image from "next/image";

export default function ChapterPosterCard({
  chapter,
  mediaItems,
  coverMedia,
  chapterIndex,
  accentColor,
  onClick,
}: {
  chapter: Chapter;
  mediaItems: { item: MediaAsset; index: number }[];
  coverMedia?: MediaAsset;
  chapterIndex: number;
  accentColor?: string;
  onClick?: () => void;
}) {
  const hasMedia = mediaItems.length > 0;
  const isDisabled = !hasMedia;

  return (
    <div
      onClick={onClick}
      className={`group relative rounded-2xl overflow-hidden bg-zinc-900 border transition-all duration-500 ${
        isDisabled
          ? "border-white/5 opacity-60 cursor-default"
          : "border-white/10 cursor-pointer hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(244,63,94,0.25)] hover:border-rose-500/30"
      }`}
    >
      {/* Cover Image */}
      <div className="aspect-[3/4] relative overflow-hidden">
        {coverMedia ? (
          coverMedia.type === "VIDEO" ? (
            <video src={coverMedia.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
          ) : (
            <Image src={coverMedia.url} alt={chapter.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
          )
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex flex-col items-center justify-center gap-3">
            <span className="text-6xl opacity-30">{chapter.emoji || "📖"}</span>
            {isDisabled && (
              <span className="text-[10px] text-zinc-600 font-medium text-center px-4">No photos assigned yet</span>
            )}
          </div>
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/10" />
        {!isDisabled && <div className="absolute inset-0 bg-gradient-to-t from-rose-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />}

        {/* Episode pill */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-zinc-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/10 uppercase tracking-widest">
          Ep {chapterIndex + 1}
        </div>

        {/* Play / Lock icon */}
        <div className={`absolute top-3 right-3 w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center border transition-all duration-300 ${
          isDisabled
            ? "bg-zinc-700/40 border-white/10"
            : "bg-white/20 border-white/20 group-hover:scale-110 group-hover:bg-rose-500 group-hover:border-rose-400"
        }`}>
          {isDisabled ? (
            <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          ) : (
            <Play className="w-4 h-4 text-white fill-current translate-x-0.5" />
          )}
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2 mb-2">
            {chapter.emoji && <span className="text-2xl drop-shadow-lg">{chapter.emoji}</span>}
            <h3 className={`text-xl font-black drop-shadow-lg leading-tight ${accentColor}`}>{chapter.title}</h3>
          </div>
          {chapter.subtitle && (
            <p className="text-xs text-zinc-400 italic mb-2 line-clamp-1">&quot;{chapter.subtitle}&quot;</p>
          )}
          <div className="flex items-center gap-3 text-xs font-medium text-zinc-500">
            {chapter.date && <span>{new Date(chapter.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>}
            {chapter.date && mediaItems.length > 0 && <span>•</span>}
            {chapter.location && <><span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{chapter.location}</span><span>•</span></>}
            {hasMedia ? (
              <span className="text-rose-400/80">{mediaItems.length} Memories</span>
            ) : (
              <span className="text-zinc-600 italic">Empty</span>
            )}
          </div>
        </div>
      </div>

      {/* Hover CTA — only when chapter has media */}
      {!isDisabled && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          <div className="bg-rose-500 text-white font-bold px-6 py-2.5 rounded-full text-sm shadow-2xl shadow-rose-500/50 flex items-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <Play className="w-4 h-4 fill-current" /> Open Chapter
          </div>
        </div>
      )}
    </div>
  );
}
