"use client";

import { Story } from "@prisma/client";

export default function NetflixHero({ story, heroImageUrl, onPlay }: { story: Story; heroImageUrl?: string; onPlay?: () => void }) {
  return (
    <div className="relative h-[60vh] md:h-[70vh] w-full bg-zinc-900 flex items-end">
      {/* Background Image */}
      {heroImageUrl && (
        <img
          src={heroImageUrl}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      
      {/* Cinematic Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 w-full px-6 pb-12 md:px-12 md:pb-16 max-w-4xl">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="px-2 py-0.5 border border-white/30 text-white/80 text-xs font-medium rounded uppercase tracking-wider">
            {story.status}
          </span>
          <span className="text-white/60 text-sm font-medium tracking-wide">
            MemoryFlix Original
          </span>
          {story.occasion && (
            <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded uppercase tracking-wider">
              {story.occasion}
            </span>
          )}
          {story.eventDate && (
            <span className="text-white/80 text-sm font-medium">
              &bull; {new Date(story.eventDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          )}
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
          {story.title}
        </h1>
        {story.description && (
          <p className="text-white/90 text-sm md:text-base lg:text-lg max-w-2xl mb-6 drop-shadow-md line-clamp-3">
            {story.description}
          </p>
        )}
        {/* Play button */}
        <div className="flex flex-wrap gap-3 sm:gap-4 mt-6">
          <button 
            onClick={onPlay}
            className="bg-white text-black px-6 py-2 md:px-8 md:py-3 rounded flex items-center gap-2 font-semibold hover:bg-white/90 transition"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            Play
          </button>
          <button className="bg-zinc-500/50 text-white px-6 py-2 md:px-8 md:py-3 rounded flex items-center gap-2 font-semibold hover:bg-zinc-500/70 transition backdrop-blur-sm">
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            More Info
          </button>
        </div>
      </div>
    </div>
  );
}
