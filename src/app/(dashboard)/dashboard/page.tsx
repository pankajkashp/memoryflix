import type { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StoryCard from "@/components/story/StoryCard";
import RotatingQuote from "@/components/dashboard/RotatingQuote";
import nextDynamic from "next/dynamic";

const DashboardAnimations = nextDynamic(() => import("@/components/dashboard/DashboardAnimations"));
import { Clock, Play, Plus, Film, Image as ImageIcon, BookOpen, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard — MemoryFlix",
};

export const dynamic = "force-dynamic";

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

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const stories = await prisma.story.findMany({
    where: { userId: session!.user.id },
    include: { template: true, coverMedia: true, _count: { select: { media: true } } },
    orderBy: { updatedAt: "desc" },
  });

  const userName = session?.user?.name?.split(" ")[0] || "there";
  const lastEditedStory = stories[0];

  const totalStories = stories.length;
  const publishedStories = stories.filter(s => s.status === "PUBLISHED").length;
  const totalPhotos = stories.reduce((sum, s) => sum + (s._count?.media || 0), 0);
  const totalDrafts = stories.filter(s => s.status === "DRAFT").length;

  return (
    <div className="relative min-h-screen bg-transparent overflow-hidden pb-32" data-dash-root>
      {/* GSAP animation controller */}
      <DashboardAnimations />

      <div className="relative z-10 px-4 sm:px-8 lg:px-12 max-w-[1400px] mx-auto pt-16">
        
        {/* ── Compact Top Section ───────────────────────────────────────────── */}
        <div className="mb-12">
          <h1
            className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-8"
            data-dash-heading
            style={{ willChange: "transform, opacity" }}
          >
            Welcome Back, {userName} ❤️
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div
              className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 backdrop-blur-md hover:bg-white/10 transition-colors"
              data-dash-stat
              style={{ willChange: "transform, opacity" }}
            >
              <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white leading-none" data-dash-stat-num data-count={totalStories}>{totalStories}</p>
                <p className="text-xs text-zinc-400 font-medium mt-1 uppercase tracking-wider">Stories</p>
              </div>
            </div>
            
            <div
              className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 backdrop-blur-md hover:bg-white/10 transition-colors"
              data-dash-stat
              style={{ willChange: "transform, opacity" }}
            >
              <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white leading-none" data-dash-stat-num data-count={publishedStories}>{publishedStories}</p>
                <p className="text-xs text-zinc-400 font-medium mt-1 uppercase tracking-wider">Published</p>
              </div>
            </div>

            <div
              className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 backdrop-blur-md hover:bg-white/10 transition-colors"
              data-dash-stat
              style={{ willChange: "transform, opacity" }}
            >
              <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white leading-none" data-dash-stat-num data-count={totalPhotos}>{totalPhotos}</p>
                <p className="text-xs text-zinc-400 font-medium mt-1 uppercase tracking-wider">Photos</p>
              </div>
            </div>

            <div
              className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 backdrop-blur-md hover:bg-white/10 transition-colors"
              data-dash-stat
              style={{ willChange: "transform, opacity" }}
            >
              <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white leading-none" data-dash-stat-num data-count={totalDrafts}>{totalDrafts}</p>
                <p className="text-xs text-zinc-400 font-medium mt-1 uppercase tracking-wider">Drafts</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Continue Editing (Horizontal Card) ───────────────────────────── */}
        {lastEditedStory && (
          <div className="mb-16" data-dash-continue style={{ willChange: "transform, opacity" }}>
            <h2 className="text-sm font-bold text-zinc-500 tracking-widest uppercase mb-4">Continue Creating</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl hover:bg-white/[0.07] transition-all group">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 w-full">
                <div 
                  className="w-full h-40 sm:w-24 sm:h-24 rounded-2xl bg-cover bg-center shrink-0 border border-white/10 shadow-inner group-hover:scale-105 transition-transform"
                  style={{ backgroundImage: `url(${lastEditedStory.coverMedia?.url || 'https://images.unsplash.com/photo-1516483638261-f40af5ff13f0?q=80&w=600&auto=format&fit=crop'})` }}
                />
                <div className="flex-1 w-full mt-2 sm:mt-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 line-clamp-1 group-hover:text-rose-200 transition-colors">
                    {lastEditedStory.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-zinc-400">
                    <span className="flex items-center gap-1"><ImageIcon className="w-4 h-4" /> {lastEditedStory._count?.media || 0} Photos</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="flex items-center gap-1 text-rose-400/80"><Clock className="w-4 h-4" /> Last edited {timeAgo(new Date(lastEditedStory.updatedAt))}</span>
                  </div>
                </div>
              </div>
              <Link
                href={`/stories/${lastEditedStory.id}`}
                data-gsap-magnetic
                className="mt-4 sm:mt-0 w-full sm:w-auto shrink-0 px-8 py-3.5 bg-rose-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-rose-400 transition-colors shadow-[0_0_20px_rgba(244,63,94,0.3)] active:scale-95"
              >
                Continue Editing <Play className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        )}

        {/* ── Main Section: Your Stories ───────────────────────────────────── */}
        <div>
          <div data-dash-quote>
            <RotatingQuote />
          </div>
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-2xl font-bold text-white tracking-tight"
              data-dash-stories-heading
              style={{ willChange: "transform, opacity" }}
            >
              Your Stories
            </h2>
          </div>

          {stories.length === 0 ? (
            <div className="relative flex flex-col items-center justify-center py-24 rounded-3xl overflow-hidden border border-white/[0.06] bg-black/30 backdrop-blur-md">
              {/* Shimmer gradient */}
              <div className="absolute inset-0 animate-shimmer pointer-events-none" />
              {/* Ambient glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-rose-500/8 blur-[80px] pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center text-center px-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-500/20 to-purple-600/20 border border-rose-500/20 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(244,63,94,0.15)]">
                  <Film className="w-9 h-9 text-rose-400/70" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Your first story starts here</h3>
                <p className="text-zinc-500 text-sm max-w-xs mb-8 leading-relaxed">
                  Transform your memories into a cinematic experience — beautiful, private, and entirely yours.
                </p>
                <Link
                  href="/stories/new"
                  data-gsap-magnetic
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-sm hover:from-rose-400 hover:to-purple-500 transition-all shadow-[0_0_30px_rgba(244,63,94,0.3)] hover:shadow-[0_0_50px_rgba(244,63,94,0.4)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Story
                </Link>
              </div>
            </div>
          ) : (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              data-story-grid
            >
              {stories.map((story) => (
                <div key={story.id} data-gsap-card style={{ willChange: "transform, opacity" }}>
                  <StoryCard story={story} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Floating Action Button (FAB) ──────────────────────────────────── */}
      <div className="fixed bottom-8 right-8 z-50">
        <Link
          href="/stories/new"
          data-gsap-magnetic
          className="group relative flex items-center justify-center w-14 h-14 sm:w-auto sm:px-6 sm:py-4 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 font-bold text-white shadow-[0_0_30px_rgba(225,29,72,0.4)] hover:shadow-[0_0_50px_rgba(225,29,72,0.6)] transition-all hover:-translate-y-1 active:translate-y-0"
        >
          <div className="absolute inset-0 rounded-full border border-white/20" />
          <Plus className="w-6 h-6 sm:w-5 sm:h-5 sm:mr-2 shrink-0 group-hover:rotate-90 transition-transform duration-300" />
          <span className="hidden sm:inline">Create Story</span>
        </Link>
      </div>
    </div>
  );
}
