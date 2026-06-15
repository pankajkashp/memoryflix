"use client";

import { MediaAsset } from "@prisma/client";

export default function MediaGallery({ media }: { media: MediaAsset[] }) {
  return (
    <div className="px-6 md:px-12 py-8 -mt-8 relative z-20">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-6 tracking-wide drop-shadow-md">
        Gallery
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {media.map((item) => (
          <div 
            key={item.id}
            className="group relative aspect-video bg-zinc-800 rounded-md overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-30 shadow-lg"
          >
            {item.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={item.url} 
                alt="Media item" 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              </div>
            )}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
}
