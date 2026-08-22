"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Sparkles, Heart, Share2 } from "lucide-react";
import PageRenderer from "@/components/story-pages/PageRenderer";
import OurStoryRenderer from "@/components/story-templates/our-story/OurStoryRenderer";
import BirthdayRenderer from "@/components/story-templates/birthday/BirthdayRenderer";
import TravelRenderer from "@/components/story-templates/travel/TravelRenderer";
import ExperienceRenderer from "@/components/story-templates/ExperienceRenderer";
import { resolveTemplateSlug } from "@/lib/templateCatalog";
import toast from "react-hot-toast";

interface PublicStoryPlayerProps {
  story: {
    id: string;
    slug: string;
    template: {
      name: string;
      slug?: string;
    };
  };
  pages: Array<{
    id: string;
    position: number;
    componentKey: string;
    fixedConfig: any;
    fieldValues: Record<string, any>;
    title: string;
  }>;
}

export default function PublicStoryPlayerClient({
  story,
  pages,
}: PublicStoryPlayerProps) {
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const isTransitioningRef = useRef(false);

  const activePage = pages[currentPageIdx];
  const canonicalTemplateSlug = resolveTemplateSlug(story.template.slug);

  // Advance to next page with smooth exit-then-entrance transition
  const handleAdvance = () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setIsExiting(true);

    setTimeout(() => {
      setCurrentPageIdx((p) => (p + 1) % pages.length);
      setIsExiting(false);
      setAnimKey((k) => k + 1);
      isTransitioningRef.current = false;
    }, 320); // 320ms reverse exit
  };

  // Hidden keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        handleAdvance();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (isTransitioningRef.current) return;
        isTransitioningRef.current = true;
        setIsExiting(true);
        setTimeout(() => {
          setCurrentPageIdx((p) => (p - 1 + pages.length) % pages.length);
          setIsExiting(false);
          setAnimKey((k) => k + 1);
          isTransitioningRef.current = false;
        }, 250);
      } else if (e.key === "r" || e.key === "R") {
        setAnimKey((k) => k + 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPageIdx, pages.length]);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard! 💌");
    }
  };

  return (
    <div
      onClick={handleAdvance}
      className="fixed inset-0 w-screen h-screen min-h-[100dvh] max-w-none overflow-hidden bg-black text-white selection:bg-rose-500/30 select-none cursor-pointer flex flex-col"
    >
      {/* Top Floating Cinematic Brand Overlay (Zero screen height reservation) */}
      <header className="fixed top-0 left-0 right-0 z-40 p-4 sm:p-6 flex items-center justify-between pointer-events-none">
        <Link
          href="/"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-2 pointer-events-auto drop-shadow-md"
        >
          <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent">
            MemoryFlix
          </span>
          <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
            ✨ {story.template.name}
          </span>
        </Link>

        {/* Floating Share action */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-xs text-zinc-200 hover:bg-black/60 shadow-lg transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-rose-400" /> Share
          </button>
        </div>
      </header>

      {/* Main Full-Viewport Canvas Presentation */}
      <main className="w-full h-full min-h-[100dvh] flex-1 flex flex-col">
        {canonicalTemplateSlug === "our-little-story" ? (
          <div className="w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar">
             <OurStoryRenderer pages={pages as any} />
             <div className="h-16" /> 
          </div>
        ) : canonicalTemplateSlug === "a-little-surprise" ? (
          <ExperienceRenderer templateSlug={canonicalTemplateSlug} fieldValues={(pages[0]?.fieldValues ?? {}) as Record<string, any>} />
        ) : canonicalTemplateSlug === "the-journey" ? (
          <div className="w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar">
             <TravelRenderer pages={pages as any} />
             <div className="h-16" /> 
          </div>
        ) : (
          activePage && (
            <PageRenderer
              key={`${activePage.id}-${animKey}`}
              componentKey={activePage.componentKey}
              fixedConfig={activePage.fixedConfig}
              fieldValues={activePage.fieldValues}
              isActive={true}
              isExiting={isExiting}
            />
          )
        )}
      </main>


      {/* Subtle Floating Bottom Branding Overlay */}
      <footer className="fixed bottom-3 left-4 right-4 z-30 flex items-center justify-between text-[11px] font-mono text-zinc-400/80 pointer-events-none drop-shadow">
        <div className="flex items-center gap-1.5">
          <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          <span>Made with MemoryFlix</span>
        </div>

        <Link
          href="/templates"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 hover:text-rose-300 pointer-events-auto transition-colors"
        >
          <Sparkles className="w-3 h-3" /> Create Your Story &rarr;
        </Link>
      </footer>
    </div>
  );
}
