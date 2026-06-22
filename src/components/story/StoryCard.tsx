import Link from "next/link";
import { Story, StoryTemplate, MediaAsset } from "@prisma/client";
import { deleteStory } from "@/app/actions/story";

type StoryWithRelations = Story & {
  template: StoryTemplate;
  coverMedia: MediaAsset | null;
  _count?: {
    media: number;
    chapters: number;
  };
};

function timeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}

export default function StoryCard({ story }: { story: StoryWithRelations }) {
  const isPublished = story.status === "PUBLISHED";
  const mediaCount = story._count?.media || 0;
  const chapterCount = story._count?.chapters || 0;
  
  const lastEdited = timeAgo(new Date(story.updatedAt));

  // Determine cover image
  const coverImageUrl =
    story.coverMedia?.url ||
    "https://images.unsplash.com/photo-1516483638261-f40af5ff13f0?q=80&w=600&auto=format&fit=crop";

  return (
    <div className="group relative aspect-[3/4] flex flex-col rounded-2xl bg-zinc-900 overflow-hidden shadow-lg border border-white/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-rose-900/20">
      
      {/* ── Cover Image Background ─────────────────────────────────────────── */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
        style={{ backgroundImage: `url(${coverImageUrl})` }}
      />
      
      {/* ── Overlays ───────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10" />

      {/* ── Top Bar ────────────────────────────────────────────────────────── */}
      <div className="absolute top-4 inset-x-4 z-10 flex justify-between items-start">
        {/* Badges */}
        <div className="flex flex-col gap-2 items-start">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${
              isPublished
                ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                : "bg-white/10 text-zinc-300 border-white/20"
            }`}
          >
            {isPublished ? "Published" : "Draft"}
          </span>
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-black/40 text-white/70 backdrop-blur-md border border-white/10">
            {story.template.name}
          </span>
        </div>
        
        {/* Media & Chapter counts */}
        <div className="flex items-center gap-2">
          {chapterCount > 0 && (
            <div className="bg-black/40 backdrop-blur-md rounded-full px-2 py-1 flex items-center gap-1.5 border border-white/10">
              <svg className="w-3 h-3 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
              </svg>
              <span className="text-[10px] font-bold text-white">{chapterCount}</span>
            </div>
          )}
          <div className="bg-black/40 backdrop-blur-md rounded-full px-2 py-1 flex items-center gap-1.5 border border-white/10">
            <svg className="w-3 h-3 text-zinc-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 2v12h16V6H4zm2 2h3v8H6V8zm5 0h7v2h-7V8zm0 3h7v2h-7v-2zm0 3h7v2h-7v-2z"/>
            </svg>
            <span className="text-[10px] font-bold text-white">{mediaCount}</span>
          </div>
        </div>
      </div>

      {/* ── Content (Bottom) ──────────────────────────────────────────────── */}
      <div className="absolute inset-x-0 bottom-0 p-5 z-10 flex flex-col justify-end">
        
        {/* Occasion / Last Edited */}
        <p className="text-xs text-rose-300/80 font-medium tracking-widest uppercase mb-1.5 drop-shadow-md">
          {story.occasion ? `${story.occasion} • ` : ""}Edited {lastEdited}
        </p>
        
        <h2 className="line-clamp-2 text-xl font-bold text-white leading-tight drop-shadow-lg mb-4">
          {story.title}
        </h2>

        {/* ── Hover Actions ───────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 opacity-0 translate-y-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          
          {/* Watch Button */}
          {isPublished && (
            <Link
              href={`/stories/${story.id}/preview`}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-rose-500 text-white hover:bg-rose-400 transition-colors shadow-lg shadow-rose-500/30"
              title="Watch Story"
            >
              <svg className="w-4 h-4 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </Link>
          )}

          {/* Edit Button */}
          <Link
            href={`/stories/${story.id}`}
            className="flex-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-3 py-2 text-center text-xs font-semibold text-white hover:bg-white/20 transition-colors flex items-center justify-center h-10"
          >
            Edit Story
          </Link>
          
          {/* Share Button (Only if published) */}
          {isPublished && (
            <Link
              href={`/s/${story.slug}`}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors"
              title="Share Story"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </Link>
          )}

          {/* Delete Button (Only if draft) */}
          {!isPublished && (
            <form
              action={async () => {
                "use server";
                await deleteStory(story.id);
              }}
            >
              <button
                type="submit"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                title="Delete Story"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
