import type { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StoryCard from "@/components/story/StoryCard";

export const metadata: Metadata = {
  title: "Dashboard — MemoryFlix",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const stories = await prisma.story.findMany({
    where: { userId: session!.user.id },
    include: { template: true, coverMedia: true },
    orderBy: { createdAt: "desc" },
  });

  const publishedCount = stories.filter((s) => s.status === "PUBLISHED").length;

  return (
    <div className="relative pb-24">
      {/* ── Dashboard Hero ─────────────────────────────────────────────────── */}
      <div className="mb-12 md:mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-3">
          Your Stories ❤️
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl">
          A lifetime of memories, ready to watch.
        </p>

        {/* Stats Row */}
        {stories.length > 0 && (
          <div className="mt-8 flex items-center gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 backdrop-blur-md">
              <p className="text-sm text-zinc-400 font-medium mb-0.5">Total Stories</p>
              <p className="text-2xl font-bold text-white">{stories.length}</p>
            </div>
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl px-5 py-3 backdrop-blur-md">
              <p className="text-sm text-rose-300 font-medium mb-0.5">Published</p>
              <p className="text-2xl font-bold text-rose-100">{publishedCount}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Story Grid or Empty State ─────────────────────────────────────── */}
      {stories.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center rounded-[2.5rem] border border-white/5 bg-white/[0.02] py-24 px-6 text-center shadow-2xl relative overflow-hidden">
          {/* Ambient glow in empty state */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px]" />
          
          <div className="relative z-10">
            {/* Illustration substitute using emoji and styling */}
            <div className="w-24 h-24 mb-6 mx-auto bg-gradient-to-br from-rose-500/20 to-purple-500/20 border border-rose-500/30 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(244,63,94,0.2)]">
              <span className="text-4xl filter drop-shadow-md">🎬</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">
              Your first story starts here ❤️
            </h2>
            <p className="text-zinc-400 max-w-md mx-auto mb-8 leading-relaxed">
              Upload your photos and videos, choose a cinematic theme, and preserve your moments forever.
            </p>
            
            <Link
              href="/stories/new"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 px-8 py-4 text-sm font-bold text-white hover:from-rose-400 hover:to-purple-500 shadow-lg shadow-rose-600/25 transition-all hover:scale-105 active:scale-95"
            >
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z" />
              </svg>
              Create Story
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      )}

      {/* ── Floating Action Button (FAB) ──────────────────────────────────── */}
      {stories.length > 0 && (
        <div className="fixed bottom-8 right-8 z-50">
          <Link
            href="/stories/new"
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 px-6 py-4 text-sm font-bold text-white shadow-[0_8px_30px_rgb(225,29,72,0.3)] hover:shadow-[0_8px_40px_rgb(225,29,72,0.5)] transition-all hover:-translate-y-1 active:translate-y-0"
          >
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
              <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z" />
            </svg>
            <span className="hidden sm:inline">Create New Story</span>
            <span className="sm:hidden">New</span>
          </Link>
        </div>
      )}
    </div>
  );
}
