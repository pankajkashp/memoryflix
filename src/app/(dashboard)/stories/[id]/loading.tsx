import React from "react";

export default function StoryEditorLoading() {
  return (
    <div className="min-h-[calc(100vh-80px)] w-full">
      <div className="mx-auto pt-4 pb-24 px-3 sm:px-4 max-w-4xl">
        
        {/* Header Skeleton */}
        <div className="mb-8 flex items-center justify-between">
          <div className="h-4 w-32 bg-white/5 rounded animate-[shimmer_2s_infinite]" />
          <div className="h-4 w-24 bg-white/5 rounded animate-[shimmer_2s_infinite]" />
        </div>

        {/* Timeline Skeleton */}
        <div className="mb-8 flex justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/5 -translate-y-1/2" />
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 animate-[shimmer_2s_infinite]" />
              <div className="hidden sm:block h-3 w-16 bg-white/5 rounded animate-[shimmer_2s_infinite]" />
            </div>
          ))}
        </div>

        {/* Card Skeleton */}
        <div className="w-full rounded-[2rem] border border-white/10 bg-black/40 p-6 sm:p-10 min-h-[500px] flex flex-col animate-[shimmer_2s_infinite]">
          <div className="h-8 w-64 bg-white/10 rounded mb-4" />
          <div className="h-4 w-full max-w-xl bg-white/5 rounded mb-2" />
          <div className="h-4 w-3/4 max-w-lg bg-white/5 rounded mb-8" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            <div className="aspect-video bg-white/5 rounded-xl border border-white/10" />
            <div className="aspect-video bg-white/5 rounded-xl border border-white/10" />
            <div className="aspect-video bg-white/5 rounded-xl border border-white/10" />
          </div>

          <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between gap-3">
            <div className="h-10 w-24 bg-white/5 rounded-full" />
            <div className="h-10 w-32 bg-white/10 rounded-full" />
          </div>
        </div>

      </div>
    </div>
  );
}
