"use client";

import React from "react";
import BirthdayOpeningSection from "./sections/BirthdayOpeningSection";
import BirthdayRevealSection from "./sections/BirthdayRevealSection";
import BirthdayMemoriesSection from "./sections/BirthdayMemoriesSection";
import BirthdaySurpriseEndingSection from "./sections/BirthdaySurpriseEndingSection";

interface BirthdayRendererProps {
  pages: Array<{
    id: string;
    componentKey: string;
    fieldValues: Record<string, any>;
  }>;
}

export default function BirthdayRenderer({ pages }: BirthdayRendererProps) {
  return (
    <div className="w-full bg-white text-zinc-900 selection:bg-pink-500/30 font-sans">
      {pages.map((page) => {
        switch (page.componentKey) {
          case "BIRTHDAY_OPENING":
            return (
              <BirthdayOpeningSection
                key={page.id}
                data={page.fieldValues as any}
                isActive={true}
              />
            );
          case "BIRTHDAY_REVEAL":
            return (
              <BirthdayRevealSection
                key={page.id}
                data={page.fieldValues as any}
                isActive={true}
              />
            );
          case "BIRTHDAY_MEMORIES":
            return (
              <BirthdayMemoriesSection
                key={page.id}
                data={page.fieldValues as any}
                isActive={true}
              />
            );
          case "BIRTHDAY_SURPRISE_ENDING":
            return (
              <BirthdaySurpriseEndingSection
                key={page.id}
                data={page.fieldValues as any}
                isActive={true}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
