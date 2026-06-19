"use client";

import { MediaAsset } from "@prisma/client";

export default function MediaGallery({
  media,
  onMediaClick,
}: {
  media: MediaAsset[];
  onMediaClick?: (index: number) => void;
}) {
  return (
    <div className="px-6 md:px-12 py-8 -mt-8 relative z-20">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-6 tracking-wide drop-shadow-md">
        Gallery
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
        {media.map((item, index) => (
          <div
            key={item.id}
            onClick={() => onMediaClick?.(index)}
            className="group flex flex-col cursor-pointer"
          >
            {/* ── Media card ────────────────────────────────────────────── */}
            <div className="relative aspect-video bg-zinc-800 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:z-30 shadow-lg hover:shadow-2xl">
              {item.url ? (
                item.type === "VIDEO" ? (
                  <video
                    src={item.url}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.url}
                    alt={item.caption || "Media item"}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    draggable={false}
                  />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />

              {/* Type badge */}
              {item.type === "VIDEO" && (
                <div className="absolute top-2 right-2 bg-black/60 rounded px-1.5 py-0.5 text-[10px] text-white font-semibold tracking-wider">
                  VIDEO
                </div>
              )}

              {/* Play hint on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* ── Caption (below card) ──────────────────────────────────── */}
            {item.caption && (
              <p
                className="
                  mt-2 px-0.5
                  text-xs sm:text-[13px] text-white/70
                  leading-snug
                  line-clamp-2
                  font-light tracking-wide
                  transition-colors group-hover:text-white/90
                "
                title={item.caption}
              >
                {item.caption}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
