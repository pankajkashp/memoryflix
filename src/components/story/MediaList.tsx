"use client";

import { MediaAsset } from "@prisma/client";
import SetCoverButton from "./SetCoverButton";

export default function MediaList({ 
  media, 
  storyId, 
  coverMediaId 
}: { 
  media: MediaAsset[];
  storyId?: string;
  coverMediaId?: string | null;
}) {
  if (media.length === 0) {
    return (
      <div className="mt-6 text-sm text-gray-500 italic">
        No media uploaded yet.
      </div>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {media.map((asset) => (
        <div key={asset.id} className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
          
          {/* Cover UI Actions */}
          {storyId && asset.type === "IMAGE" && asset.id !== coverMediaId && (
            <SetCoverButton storyId={storyId} mediaId={asset.id} />
          )}
          {asset.id === coverMediaId && (
            <div className="absolute top-2 left-2 z-10 rounded bg-indigo-500 px-2 py-1 text-[10px] sm:text-xs font-bold text-white shadow-sm">
              COVER
            </div>
          )}
          {asset.type === "VIDEO" && (
            <div className="absolute top-2 right-2 z-10 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white">
              VIDEO
            </div>
          )}

          {asset.type === "IMAGE" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={asset.url} alt="Uploaded media" className="object-cover w-full h-full" />
          ) : (
            <video src={asset.url} className="object-cover w-full h-full" />
          )}
        </div>
      ))}
    </div>
  );
}
