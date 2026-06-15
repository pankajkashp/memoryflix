import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import EditStoryForm from "@/components/story/EditStoryForm";
import MediaUploader from "@/components/story/MediaUploader";
import MediaList from "@/components/story/MediaList";

// In Next.js 15+, dynamic route params are a Promise.
type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { title: "Story — MemoryFlix" };

  // Apply the same ownership filter as the page — prevents title leaking to other users.
  const story = await prisma.story.findUnique({
    where: { id, userId: session.user.id },
  });
  return { title: story ? `${story.title} — MemoryFlix` : "Story — MemoryFlix" };
}


export default async function StoryEditorPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  // Fetch the story and verify ownership in a single query
  const story = await prisma.story.findUnique({
    where: { id, userId: session!.user.id },
    include: { 
      template: true,
      media: { orderBy: { position: "asc" } }
    },
  });

  if (!story) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
      >
        ← Back to Dashboard
      </Link>

      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">{story.title}</h1>
          <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-semibold text-white">
            {story.template.name}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-400">
          Slug:{" "}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">
            {story.slug}
          </code>
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {/* Details section */}
        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-900">
            Story Details
          </h2>
          <EditStoryForm
            storyId={story.id}
            initialTitle={story.title}
            status={story.status}
          />
        </section>

        {/* Media section */}
        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4 mb-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Photos &amp; Videos
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Upload media to build your cinematic story.
              </p>
            </div>
            <MediaUploader storyId={story.id} />
          </div>
          <MediaList media={story.media} />
        </section>

        {/* Preview section */}
        <section className="rounded-xl border bg-white p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Preview
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              View your story in the cinematic Netflix-inspired layout.
            </p>
          </div>
          <Link
            href={`/stories/${story.id}/preview`}
            target="_blank"
            className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-red-700 transition-colors"
          >
            Open Preview
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </Link>
        </section>
      </div>
    </div>
  );
}
