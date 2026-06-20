"use client";

import { useTransition } from "react";
import { Chapter } from "@prisma/client";
import { assignMediaToChapter } from "@/app/actions/media";
import { Loader2, ChevronDown } from "lucide-react";

interface ChapterAssignerProps {
  storyId: string;
  mediaId: string;
  currentChapterId: string | null;
  chapters: Chapter[];
}

export default function ChapterAssigner({
  storyId,
  mediaId,
  currentChapterId,
  chapters,
}: ChapterAssignerProps) {
  const [isPending, startTransition] = useTransition();

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    startTransition(async () => {
      await assignMediaToChapter(storyId, mediaId, val === "unassigned" ? null : val);
    });
  };

  return (
    <div className="relative group/assigner">
      <select
        value={currentChapterId || "unassigned"}
        onChange={handleSelect}
        disabled={isPending}
        className="w-full appearance-none rounded-lg border border-transparent bg-white/5 px-3 py-1.5 text-xs text-zinc-300 shadow-inner focus:outline-none focus:ring-1 focus:ring-rose-500 hover:bg-white/10 hover:border-white/10 transition-colors cursor-pointer"
      >
        <option value="unassigned" className="bg-zinc-900 text-zinc-400">
          Unassigned
        </option>
        {chapters.map((chapter) => (
          <option key={chapter.id} value={chapter.id} className="bg-zinc-900 text-white">
            {chapter.emoji ? `${chapter.emoji} ` : ""}
            {chapter.title}
          </option>
        ))}
      </select>
      
      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 group-hover/assigner:text-zinc-300 transition-colors">
        {isPending ? (
          <Loader2 className="w-3 h-3 animate-spin text-rose-400" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
      </div>
    </div>
  );
}
