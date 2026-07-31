import React from "react";

export default function DashboardLoading() {
  return (
    <div className="relative min-h-screen bg-transparent overflow-hidden pb-32 pt-16">
      <div className="relative z-10 px-4 sm:px-8 lg:px-12 max-w-[1400px] mx-auto">
        
        {/* Welcome Section Skeleton */}
        <div className="mb-12">
          <div className="h-10 w-64 bg-white/5 rounded-lg mb-8 animate-[shimmer_2s_infinite]" />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 h-[74px]">
                <div className="w-10 h-10 rounded-full bg-white/5 animate-[shimmer_2s_infinite] shrink-0" />
                <div className="flex-1">
                  <div className="h-6 w-12 bg-white/5 rounded mb-2 animate-[shimmer_2s_infinite]" />
                  <div className="h-3 w-16 bg-white/5 rounded animate-[shimmer_2s_infinite]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Continue Editing Skeleton */}
        <div className="mb-16 hidden sm:block">
          <div className="h-4 w-32 bg-white/5 rounded mb-4 animate-[shimmer_2s_infinite]" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/5 border border-white/10 rounded-3xl h-[104px]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 w-full">
              <div className="w-24 h-24 rounded-2xl bg-white/5 shrink-0 animate-[shimmer_2s_infinite]" />
              <div className="flex-1 w-full mt-2 sm:mt-0">
                <div className="h-6 w-48 bg-white/5 rounded mb-3 animate-[shimmer_2s_infinite]" />
                <div className="h-4 w-64 bg-white/5 rounded animate-[shimmer_2s_infinite]" />
              </div>
            </div>
            <div className="w-40 h-12 rounded-xl bg-white/5 animate-[shimmer_2s_infinite] shrink-0" />
          </div>
        </div>

        {/* Stories Grid Skeleton */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 w-32 bg-white/5 rounded animate-[shimmer_2s_infinite]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="relative w-full aspect-[4/5] rounded-[2rem] bg-white/5 border border-white/10 overflow-hidden animate-[shimmer_2s_infinite]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="h-6 w-3/4 bg-white/10 rounded mb-3" />
                  <div className="h-4 w-1/2 bg-white/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
