"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Story, StoryTemplate, MediaAsset } from "@prisma/client";
import { deleteStory } from "@/app/actions/story";
import { Play, Edit2, Share2, Trash2, BookOpen, Image as ImageIcon, Clock, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

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
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return "just now";
}

export default function StoryCard({ story }: { story: StoryWithRelations }) {
  const isPublished = story.status === "PUBLISHED";
  const mediaCount = story._count?.media || 0;
  const chapterCount = story._count?.chapters || 0;
  const lastEdited = timeAgo(new Date(story.updatedAt));
  const [isPending, startTransition] = useTransition();
  const [isHovered, setIsHovered] = useState(false);

  const coverImageUrl =
    story.coverMedia?.url ||
    "https://images.unsplash.com/photo-1516483638261-f40af5ff13f0?q=80&w=600&auto=format&fit=crop";

  const handleCopyLink = () => {
    if (!story.slug) return;
    const shareUrl = `${window.location.origin}/s/${story.slug}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success("Share link copied!", {
        icon: "🔗",
        style: { borderRadius: "10px", background: "#333", color: "#fff" },
      });
    });
  };

  const handleDelete = () => {
    if (!confirm("Delete this story? This cannot be undone.")) return;
    startTransition(async () => {
      await deleteStory(story.id);
    });
  };

  return (
    <div
      className="group relative flex flex-col rounded-2xl bg-zinc-900 overflow-hidden shadow-xl border border-white/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(244,63,94,0.15)] hover:border-rose-500/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Cover Image ── */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
          style={{ backgroundImage: `url(${coverImageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${
              isPublished
                ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                : "bg-white/10 text-zinc-300 border-white/20"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? "bg-rose-400" : "bg-zinc-400"}`} />
            {isPublished ? "Published" : "Draft"}
          </span>
        </div>

        {/* Hover Action Overlay */}
        <div className={`absolute inset-0 flex items-center justify-center gap-3 transition-all duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}>
          {/* Preview */}
          <Link
            href={`/stories/${story.id}/preview`}
            className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full font-bold text-sm hover:bg-zinc-100 transition-colors shadow-2xl"
          >
            <Play className="w-4 h-4" /> Preview
          </Link>

          {/* Edit */}
          <Link
            href={`/stories/${story.id}`}
            className="flex items-center gap-2 bg-white/20 text-white backdrop-blur-md border border-white/30 px-5 py-2.5 rounded-full font-bold text-sm hover:bg-white/30 transition-colors"
          >
            <Edit2 className="w-4 h-4" /> Edit
          </Link>
        </div>
      </div>

      {/* ── Card Body ── */}
      <div className="flex flex-col flex-1 p-4">
        {/* Occasion */}
        {story.occasion && (
          <p className="text-[10px] font-bold text-rose-400/80 uppercase tracking-widest mb-1">
            {story.occasion}
          </p>
        )}

        {/* Title */}
        <h2 className="text-lg font-bold text-white leading-snug line-clamp-2 mb-3 group-hover:text-rose-100 transition-colors">
          {story.title}
        </h2>

        {/* Meta */}
        <div className="flex items-center gap-3 text-[11px] font-medium text-zinc-500 mb-4">
          <span className="flex items-center gap-1">
            <ImageIcon className="w-3.5 h-3.5" /> {mediaCount}
          </span>
          <span className="w-1 h-1 bg-zinc-600 rounded-full" />
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" /> {chapterCount} ch
          </span>
          <span className="w-1 h-1 bg-zinc-600 rounded-full" />
          <span className="flex items-center gap-1 text-rose-400/70">
            <Clock className="w-3.5 h-3.5" /> {lastEdited}
          </span>
        </div>

        {/* ── Action Row ── */}
        <div className="mt-auto flex items-center gap-2">
          {/* Preview */}
          <Link
            href={`/stories/${story.id}/preview`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-rose-500 text-white hover:bg-rose-400 transition-colors shadow-lg shadow-rose-500/20"
          >
            <Play className="w-3.5 h-3.5" /> Preview
          </Link>

          {/* Edit */}
          <Link
            href={`/stories/${story.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-white/10 text-white border border-white/10 hover:bg-white/20 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </Link>

          {/* Share link — published only */}
          {isPublished && story.slug && (
            <button
              onClick={handleCopyLink}
              title="Copy Share Link"
              className="p-2.5 rounded-xl text-zinc-400 border border-white/10 bg-white/5 hover:bg-white/15 hover:text-white transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Delete — draft only */}
          {!isPublished && (
            <button
              onClick={handleDelete}
              disabled={isPending}
              title="Delete Story"
              className="p-2.5 rounded-xl text-zinc-500 border border-white/10 bg-white/5 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* ── Share URL (published) ── */}
        {isPublished && story.slug && (
          <Link
            href={`/s/${story.slug}`}
            target="_blank"
            className="mt-3 flex items-center gap-1.5 text-[11px] text-zinc-600 hover:text-rose-400 transition-colors group/link"
          >
            <ExternalLink className="w-3 h-3 group-hover/link:scale-110 transition-transform" />
            <span className="truncate">/s/{story.slug}</span>
          </Link>
        )}
      </div>
    </div>
  );
}
