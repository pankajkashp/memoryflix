"use client";

import { MediaAsset } from "@prisma/client";

export default function MediaList({ media }: { media: MediaAsset[] }) {
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
        <div key={asset.id} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
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
