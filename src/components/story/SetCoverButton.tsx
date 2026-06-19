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
      className="absolute top-2 left-2 z-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 px-2.5 py-1 text-[10px] sm:text-xs font-semibold text-white opacity-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-50 hover:bg-black/80 hover:border-white/20 shadow-lg"
    >
      {isPending ? "Setting..." : "Set Cover"}
    </button>
  );
}
