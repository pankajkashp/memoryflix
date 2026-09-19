"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Sparkles, Heart, Share2 } from "lucide-react";
import PageRenderer from "@/components/story-pages/PageRenderer";
import OurStoryRenderer from "@/components/story-templates/our-story/OurStoryRenderer";
import BirthdayRenderer from "@/components/story-templates/birthday/BirthdayRenderer";
import TravelRenderer from "@/components/story-templates/travel/TravelRenderer";
import ExperienceRenderer from "@/components/story-templates/ExperienceRenderer";
import BranchingExperiencePlayer from "@/components/story-pages/scenes/BranchingExperiencePlayer";
import { isSceneComponentKey } from "@/components/story-pages/scenes/sceneRegistry";
import { resolveTemplateSlug } from "@/lib/templateCatalog";
import toast from "react-hot-toast";

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.87.5 3.62 1.4 5.13L2 22l5.13-1.5a9.88 9.88 0 0 0 4.91 1.32h.01c5.46 0 9.9-4.45 9.9-9.91S17.5 2 12.04 2Zm5.79 14.14c-.24.68-1.4 1.3-1.93 1.35-.53.06-1.02.27-3.44-.72-2.91-1.19-4.78-4.15-4.93-4.34-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.27-.29.58-.36.77-.36.19 0 .39 0 .55.01.19.01.42-.07.66.5.25.6.85 2.06.92 2.21.07.15.12.32.02.51-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.02 1.12 1 2.06 1.31 2.35 1.46.29.15.46.13.63-.08.17-.2.72-.84.92-1.13.19-.29.39-.24.65-.14.27.09 1.7.8 1.99.95.29.15.48.22.55.34.07.13.07.72-.17 1.4Z" />
    </svg>
  );
}

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
  const isBranchingExperience = pages.some((p) => isSceneComponentKey(p.componentKey));

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

  const handleShareWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = `I made you something special! 💌✨ Open it here: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
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

        {/* Floating Share actions */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={handleShareWhatsApp}
            aria-label="Share on WhatsApp"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-xs text-zinc-200 hover:bg-black/60 shadow-lg transition-colors"
          >
            <WhatsAppGlyph className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp
          </button>
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
        {isBranchingExperience ? (
          <BranchingExperiencePlayer pages={pages as any} />
        ) : canonicalTemplateSlug === "our-little-story" ? (
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
