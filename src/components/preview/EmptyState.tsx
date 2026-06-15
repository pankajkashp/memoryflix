"use client";

export default function EmptyState() {
  return (
    <div className="px-6 md:px-12 py-16 relative z-20">
      <div className="flex flex-col items-center justify-center min-h-[40vh] border-2 border-dashed border-zinc-800 rounded-lg bg-black/50 backdrop-blur-sm">
        <svg className="w-16 h-16 text-zinc-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        <p className="text-zinc-500 text-lg md:text-xl font-medium tracking-wide">Upload photos to begin building your story</p>
      </div>
    </div>
  );
}
