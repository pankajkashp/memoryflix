"use client";

import { useState, useTransition } from "react";
import { StoryTemplate } from "@prisma/client";
import { updateStoryTemplate } from "@/app/actions/story";
import { Loader2, CheckCircle2 } from "lucide-react";

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
          <button
            key={template.id}
            onClick={() => handleSelect(template.id)}
            disabled={isPending}
            className={`
              relative flex flex-col text-left p-6 rounded-2xl border-2 transition-all duration-300
              ${
                isSelected
                  ? "border-rose-500 bg-rose-500/10 shadow-[0_0_20px_rgba(244,63,94,0.2)]"
                  : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
              }
            `}
          >
            {isSelected && (
              <div className="absolute top-4 right-4 text-rose-500">
                {isPending ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-6 h-6" />
                )}
              </div>
            )}
            
            <h3 className="text-xl font-bold text-white mb-2 pr-8">{template.name}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
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
          </button>
        );
      })}
    </div>
  );
}
