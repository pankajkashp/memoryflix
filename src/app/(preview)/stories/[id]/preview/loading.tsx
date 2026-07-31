import React from "react";

export default function PreviewLoading() {
  return (
    <div className="fixed inset-0 bg-[#09090B] z-50 flex items-center justify-center overflow-hidden">
      <div className="relative flex flex-col items-center">
        {/* Shimmering logo box */}
        <div className="w-24 h-24 rounded-2xl bg-white/5 animate-[shimmer_2s_infinite] mb-6 shadow-[0_0_40px_rgba(244,63,94,0.1)] border border-white/5" />
        
        {/* Loading text skeleton */}
        <div className="h-4 w-40 bg-white/5 rounded-full animate-[shimmer_2s_infinite]" />
      </div>
      
      {/* Cinematic Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#09090B_100%)] opacity-90 pointer-events-none" />
    </div>
  );
}
