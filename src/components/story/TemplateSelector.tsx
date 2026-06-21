"use client";

import { useState, useTransition } from "react";
import { StoryTemplate } from "@prisma/client";
import { updateStoryTemplate } from "@/app/actions/story";
import { Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function TemplateSelector({
  storyId,
  currentTemplateId,
  templates,
}: {
  storyId: string;
  currentTemplateId: string;
  templates: StoryTemplate[];
}) {
  const [selectedId, setSelectedId] = useState(currentTemplateId);
  const [isPending, startTransition] = useTransition();

  const handleSelect = (templateId: string) => {
    if (templateId === selectedId) return;
    setSelectedId(templateId);
    startTransition(async () => {
      await updateStoryTemplate(storyId, templateId);
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {templates.map((template) => {
        const isSelected = selectedId === template.id;
        
        return (
          <motion.div
            key={template.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(template.id)}
            className={`
              group relative flex flex-col text-left p-1 rounded-2xl cursor-pointer overflow-hidden
            `}
          >
            {/* Animated border glow */}
            <div className={`absolute inset-0 transition-opacity duration-500 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              <div className={`absolute inset-0 bg-gradient-to-r ${isSelected ? 'from-rose-500 to-purple-600' : 'from-white/20 to-white/10'} rounded-2xl`} />
            </div>

            <div className={`relative h-full bg-[#0a0a0a] rounded-[14px] p-6 flex flex-col z-10 transition-colors ${isSelected ? 'bg-[#110508]' : ''}`}>
              {isSelected && (
                <div className="absolute top-4 right-4 text-rose-500 z-20 bg-black/50 rounded-full p-1 backdrop-blur-md">
                  {isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                </div>
              )}
              
              <h3 className={`text-2xl font-black mb-2 pr-8 tracking-tight ${isSelected ? 'text-white' : 'text-zinc-300 group-hover:text-white transition-colors'}`}>{template.name}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed max-w-[90%]">
                {template.description}
              </p>
            
            {/* Visual preview placeholder based on slug */}
            <div className="mt-6 w-full h-24 rounded-lg overflow-hidden relative border border-white/10 bg-black/50">
              {template.slug === "netflix-memories" && (
                <div className="absolute inset-0 bg-gradient-to-br from-black to-zinc-900 flex items-end p-3">
                  <div className="w-16 h-2 bg-red-600 rounded-full" />
                </div>
              )}
              {template.slug === "apple-memories" && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/70 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-lg bg-black/5 backdrop-blur-sm" />
                </div>
              )}
              {template.slug === "travel-journal" && (
                <div className="absolute inset-0 bg-[#E8E1D5] flex items-center p-3 opacity-90">
                  <div className="w-full border-t-2 border-dashed border-amber-900/30" />
                  <div className="absolute left-1/4 w-3 h-3 rounded-full bg-amber-600" />
                  <div className="absolute right-1/4 w-3 h-3 rounded-full bg-amber-600" />
                </div>
              )}
              {template.slug === "wedding-film" && (
                <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
                  <div className="border border-[#D4AF37] w-20 h-12 flex items-center justify-center">
                    <div className="w-12 h-0.5 bg-[#D4AF37]" />
                  </div>
                </div>
              )}
              {template.slug === "timeline-story" && (
                <div className="absolute inset-0 bg-zinc-900 flex items-center px-4">
                  <div className="w-1 h-full bg-white/10 absolute left-8" />
                  <div className="w-4 h-4 rounded-full bg-white absolute left-6.5" />
                </div>
              )}
            </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
