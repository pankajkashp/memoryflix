"use client";

import { ChevronRight } from "lucide-react";

interface TapToAdvanceCueProps {
  label?: string;
  accentColor?: string;
  className?: string;
}

export default function TapToAdvanceCue({
  label = "Tap anywhere to continue",
  accentColor = "#f43f5e",
  className = "",
}: TapToAdvanceCueProps) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 shadow-lg select-none pointer-events-none transition-all duration-300 animate-pulse ${className}`}
    >
      <span
        className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest font-mono"
        style={{ color: accentColor }}
      >
        {label}
      </span>
      <ChevronRight className="w-3.5 h-3.5" style={{ color: accentColor }} />
    </div>
  );
}
