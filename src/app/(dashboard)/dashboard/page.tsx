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
    include: { template: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Stories</h1>
          <p className="mt-1 text-sm text-gray-500">
            {stories.length === 0
              ? "Create your first memory story."
              : `${stories.length} ${stories.length === 1 ? "story" : "stories"}`}
          </p>
        </div>
        <Link
          href="/stories/new"
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
        >
          + New Story
        </Link>
      </div>

      {/* Story grid */}
      {stories.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
          <p className="text-4xl">🎬</p>
          <p className="mt-4 text-lg font-semibold text-gray-700">
            No stories yet
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Create your first story and bring your memories to life.
          </p>
          <Link
            href="/stories/new"
            className="mt-6 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-700"
          >
            Create a Story
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      )}
    </div>
  );
}
