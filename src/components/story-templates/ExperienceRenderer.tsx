"use client";

import { useMemo } from "react";
import CinematicBirthdayExperience from "@/components/story-templates/birthday-cinematic/CinematicBirthdayExperience";
import LittleMagicExperience from "@/components/story-templates/little-magic/LittleMagicExperience";
import { resolveTemplateSlug } from "@/lib/templateCatalog";

interface ExperienceRendererProps {
  templateSlug?: string | null;
  fieldValues?: Record<string, any>;
  className?: string;
}

export default function ExperienceRenderer({
  templateSlug,
  fieldValues = {},
  className,
}: ExperienceRendererProps) {
  const canonicalSlug = useMemo(() => resolveTemplateSlug(templateSlug), [templateSlug]);

  if (canonicalSlug === "a-little-surprise") {
    return (
      <div className={className ?? "h-full w-full"}>
        <CinematicBirthdayExperience fieldValues={fieldValues as Record<string, string>} />
      </div>
    );
  }

  if (canonicalSlug === "little-magic") {
    return (
      <div className={className ?? "h-full w-full"}>
        <LittleMagicExperience fieldValues={fieldValues as Record<string, unknown>} />
      </div>
    );
  }

  if (canonicalSlug === "our-little-story") {
    return (
      <div className={className ?? "h-full w-full bg-[#0d0d0d] text-white flex items-center justify-center"}>
        <div className="text-center px-6">
          <p className="mb-3 text-[11px] font-mono uppercase tracking-[0.3em] text-rose-300/70">Our Little Story</p>
          <h2 className="text-3xl md:text-5xl font-bold">The story experience is loading.</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={className ?? "h-full w-full bg-[#0d0d0d] text-white flex items-center justify-center"}>
      <div className="text-center px-6">
        <p className="mb-3 text-[11px] font-mono uppercase tracking-[0.3em] text-zinc-400">Template</p>
        <h2 className="text-2xl md:text-4xl font-bold">{canonicalSlug || "Interactive experience"}</h2>
      </div>
    </div>
  );
}
