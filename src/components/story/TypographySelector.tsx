"use client";

import { useState, useTransition } from "react";
import { getFontClassName } from "@/lib/fonts";
import { TYPOGRAPHY_PRESETS, ACCENT_COLORS } from "@/lib/typography-presets";
import { updateStoryTypography } from "@/app/actions/story";
import { Check, Loader2, Palette } from "lucide-react";
import { motion } from "framer-motion";

export default function TypographySelector({ 
  storyId, 
  currentPresetId,
  currentAccentId
}: { 
  storyId: string;
  currentPresetId: string | null;
  currentAccentId: string | null;
}) {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(currentPresetId || "blockbuster");
  const [selectedAccentId, setSelectedAccentId] = useState<string>(currentAccentId || "red");
  const [isPending, startTransition] = useTransition();

  const handleSelectPreset = (id: string) => {
    setSelectedPresetId(id);
    startTransition(async () => {
      await updateStoryTypography(storyId, id, selectedAccentId);
    });
  };

  const handleSelectAccent = (id: string) => {
    setSelectedAccentId(id);
    startTransition(async () => {
      await updateStoryTypography(storyId, selectedPresetId, id);
    });
  };

  const currentAccent = ACCENT_COLORS.find(a => a.id === selectedAccentId) || ACCENT_COLORS[3];

  return (
    <div className="space-y-12">
      {/* Accent Color Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-zinc-400" />
          <h3 className="text-lg font-bold text-white">Accent Color</h3>
        </div>
        <div className="flex flex-wrap gap-4">
          {ACCENT_COLORS.map(accent => (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              key={accent.id}
              onClick={() => handleSelectAccent(accent.id)}
              className={`flex items-center gap-3 px-5 py-3 rounded-full border transition-all ${
                selectedAccentId === accent.id 
                  ? `border-white bg-white/10 shadow-lg` 
                  : `border-white/10 hover:border-white/30 bg-[#0a0a0a]`
              }`}
            >
              <div className={`w-5 h-5 rounded-full ${accent.color} ${selectedAccentId === accent.id ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''}`} />
              <span className={`text-sm font-bold ${selectedAccentId === accent.id ? 'text-white' : 'text-zinc-400'}`}>{accent.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Typography Presets */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Typography Preset</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {TYPOGRAPHY_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            const fontClass = getFontClassName(preset.fontId);
            
            return (
              <motion.div
                key={preset.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectPreset(preset.id)}
                className={`relative flex flex-col p-6 rounded-3xl border cursor-pointer transition-all overflow-hidden group ${
                  isSelected 
                    ? `${currentAccent.border} bg-[#110508] shadow-[0_0_40px_rgba(255,255,255,0.05)]` 
                    : `border-white/10 hover:border-white/20 bg-[#0a0a0a]`
                }`}
              >
                {/* Background gradient hint */}
                {isSelected && (
                  <div className={`absolute top-0 right-0 w-48 h-48 ${currentAccent.color} opacity-20 blur-[60px] rounded-full pointer-events-none`} />
                )}

                <div className="flex items-center justify-between mb-8 relative z-10">
                  <span className={`text-lg font-bold flex items-center gap-3 ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                    <span className="text-2xl bg-white/5 p-2 rounded-xl">{preset.emoji}</span>
                    {preset.name}
                  </span>
                  {isPending && isSelected ? (
                    <Loader2 className={`w-6 h-6 ${currentAccent.text} animate-spin`} />
                  ) : isSelected ? (
                    <div className={`w-8 h-8 rounded-full ${currentAccent.color} flex items-center justify-center shadow-lg`}>
                      <Check className="w-5 h-5 text-white" strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full border-2 border-white/10 bg-black/50 group-hover:border-white/30 transition-colors" />
                  )}
                </div>
                
                <div className={`relative z-10 w-full bg-[#050505] rounded-2xl p-8 border border-white/5 flex flex-col items-center justify-center min-h-[160px] shadow-inner`}>
                  <div className={`${fontClass} ${preset.heroStyle} !text-4xl md:!text-5xl text-center leading-none mb-4 ${isSelected ? currentAccent.text : 'text-zinc-400'}`}>
                    MemoryFlix
                  </div>
                  <div className={`${fontClass} ${preset.chapterStyle} !text-xl md:!text-2xl text-center text-zinc-500`}>
                    Chapter Title
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
