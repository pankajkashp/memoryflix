"use client";

import { useTransition } from "react";
import { setCoverMedia } from "@/app/actions/media";

export default function SetCoverButton({ storyId, mediaId }: { storyId: string; mediaId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(async () => {
        await setCoverMedia(storyId, mediaId);
      })}
      disabled={isPending}
      className="absolute top-2 left-2 z-10 rounded bg-black/70 px-2 py-1 text-[10px] sm:text-xs font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 hover:bg-black/90 shadow-sm"
    >
      {isPending ? "Setting..." : "Set as Cover"}
    </button>
  );
}
