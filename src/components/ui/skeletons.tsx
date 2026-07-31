"use client";

import React from "react";

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="w-full h-full flex flex-col space-y-12">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="h-10 w-48 bg-white/5 rounded-lg animate-pulse" />
          <div className="h-5 w-64 bg-white/5 rounded-lg animate-pulse" />
        </div>
        <div className="h-12 w-32 bg-white/5 rounded-xl animate-pulse" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col rounded-2xl bg-zinc-900 border border-white/5 overflow-hidden animate-pulse"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {/* Cover image area */}
            <div className="aspect-[16/10] bg-white/5" />
            
            {/* Body */}
            <div className="p-4 flex flex-col gap-3">
              <div className="h-3 w-16 bg-white/5 rounded-full" />
              <div className="h-5 w-3/4 bg-white/10 rounded-full" />
              <div className="flex items-center gap-3 mt-1">
                <div className="h-3 w-8 bg-white/5 rounded-full" />
                <div className="h-3 w-8 bg-white/5 rounded-full" />
                <div className="h-3 w-12 bg-white/5 rounded-full" />
              </div>

              {/* Actions row */}
              <div className="mt-4 flex gap-2">
                <div className="flex-1 h-10 bg-white/5 rounded-xl" />
                <div className="flex-1 h-10 bg-white/5 rounded-xl" />
                <div className="w-10 h-10 bg-white/5 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="mx-auto pt-4 pb-24 px-3 sm:px-4 max-w-4xl w-full h-full">
      {/* Header & Navigation */}
      <div className="mb-8 flex items-center justify-between">
        <div className="h-4 w-32 bg-white/5 rounded-md animate-pulse" />
        <div className="h-4 w-24 bg-white/5 rounded-md animate-pulse" />
      </div>

      {/* Progress Timeline Skeleton */}
      <div className="flex justify-between items-center mb-8 px-2 overflow-x-hidden">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
            <div className="h-3 w-12 bg-white/5 rounded-md animate-pulse hidden sm:block" />
          </div>
        ))}
      </div>

      {/* Wizard Content Card Skeleton */}
      <div className="w-full rounded-[2rem] border border-white/5 bg-black/20 p-6 sm:p-10 min-h-[500px] flex flex-col">
        <div className="h-10 w-64 bg-white/10 rounded-xl animate-pulse mb-4" />
        <div className="h-6 w-3/4 max-w-xl bg-white/5 rounded-lg animate-pulse mb-12" />

        {/* Content area */}
        <div className="space-y-6 flex-grow">
          <div className="h-14 w-full bg-white/5 rounded-xl animate-pulse" />
          <div className="h-14 w-full bg-white/5 rounded-xl animate-pulse" />
          <div className="h-14 w-full bg-white/5 rounded-xl animate-pulse" />
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 pt-6 border-t border-white/10 flex items-center justify-between gap-3">
          <div className="h-10 w-24 bg-white/5 rounded-full animate-pulse" />
          <div className="h-10 w-32 bg-white/10 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
