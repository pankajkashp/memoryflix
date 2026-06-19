import Link from "next/link";
import { Story, StoryTemplate, MediaAsset } from "@prisma/client";
import { deleteStory } from "@/app/actions/story";

type StoryWithRelations = Story & {
  template: StoryTemplate;
  coverMedia: MediaAsset | null;
};

export default function StoryCard({ story }: { story: StoryWithRelations }) {
  const isPublished = story.status === "PUBLISHED";
  
  // Format date elegantly
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(story.createdAt));

  // Determine cover image
  // If there's a coverMedia relation, use its URL. Otherwise use a fallback image.
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

      {/* ── Status Badge ───────────────────────────────────────────────────── */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${
            isPublished
              ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
              : "bg-white/10 text-zinc-300 border-white/20"
          }`}
        >
          {isPublished ? "Published" : "Draft"}
        </span>
        
        {/* Template Badge */}
        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-black/40 text-white/70 backdrop-blur-md border border-white/10">
          {story.template.name}
        </span>
      </div>

      {/* ── Content (Bottom) ──────────────────────────────────────────────── */}
      <div className="absolute inset-x-0 bottom-0 p-5 z-10 flex flex-col justify-end">
        
        <p className="text-xs text-rose-300/80 font-medium tracking-widest uppercase mb-1.5 drop-shadow-md">
          {formattedDate}
        </p>
        
        <h2 className="line-clamp-2 text-xl font-bold text-white leading-tight drop-shadow-lg mb-4">
          {story.title}
        </h2>

        {/* ── Actions (Reveals on hover) ──────────────────────────────────── */}
        <div className="flex items-center gap-2 opacity-0 translate-y-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          <Link
            href={`/stories/${story.id}`}
            className="flex-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-3 py-2 text-center text-xs font-semibold text-white hover:bg-white/20 transition-colors"
          >
            Edit Story
          </Link>
          
          <form
            action={async () => {
              "use server";
              await deleteStory(story.id);
            }}
          >
            <button
              type="submit"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
              title="Delete Story"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
