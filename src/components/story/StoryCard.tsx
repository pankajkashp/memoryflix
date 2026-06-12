import Link from "next/link";
import { Story, StoryTemplate } from "@prisma/client";
import { deleteStory } from "@/app/actions/story";

type StoryWithTemplate = Story & { template: StoryTemplate };

export default function StoryCard({ story }: { story: StoryWithTemplate }) {
  const isPublished = story.status === "PUBLISHED";
  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(story.createdAt));

  return (
    <div className="group relative flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      {/* Status badge */}
      <span
        className={`mb-3 inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          isPublished
            ? "bg-green-50 text-green-700"
            : "bg-amber-50 text-amber-700"
        }`}
      >
        {isPublished ? "Published" : "Draft"}
      </span>

      {/* Title */}
      <h2 className="line-clamp-2 text-base font-semibold text-gray-900">
        {story.title}
      </h2>

      {/* Template */}
      <p className="mt-1 text-xs text-gray-400">
        {story.template.name} Template
      </p>

      {/* Date */}
      <p className="mt-auto pt-4 text-xs text-gray-400">{formattedDate}</p>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2">
        <Link
          href={`/stories/${story.id}`}
          className="flex-1 rounded-lg bg-gray-900 px-3 py-1.5 text-center text-sm font-medium text-white hover:bg-gray-700"
        >
          Edit
        </Link>
        <form
          action={async () => {
            "use server";
            await deleteStory(story.id);
          }}
        >
          <button
            type="submit"
            className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}
