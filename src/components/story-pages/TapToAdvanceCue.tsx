"use client";

import { ChevronRight } from "lucide-react";

interface TapToAdvanceCueProps {
  label?: string;
  accentColor?: string;
  className?: string;
  isLight?: boolean;
}

export default function TapToAdvanceCue({
  label = "Tap anywhere to continue",
  accentColor = "#f43f5e",
  className = "",
  isLight = false,
}: TapToAdvanceCueProps) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full backdrop-blur-md shadow-lg select-none pointer-events-none transition-all duration-300 animate-pulse ${
        isLight
          ? "bg-white/85 border border-pink-300/60 shadow-pink-500/10"
          : "bg-white/10 border border-white/15"
      } ${className}`}
    >
      <span
        className="text-[11px] sm:text-xs font-bold uppercase tracking-widest font-mono"
        style={{ color: accentColor }}
      >
        {label}
      </span>
      <ChevronRight className="w-3.5 h-3.5" style={{ color: accentColor }} />
    </div>
  );
}
