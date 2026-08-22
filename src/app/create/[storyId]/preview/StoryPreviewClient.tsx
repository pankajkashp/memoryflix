"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Lock, Mail, Sparkles } from "lucide-react";
import PageRenderer from "@/components/story-pages/PageRenderer";
import OurStoryRenderer from "@/components/story-templates/our-story/OurStoryRenderer";
import BirthdayRenderer from "@/components/story-templates/birthday/BirthdayRenderer";
import TravelRenderer from "@/components/story-templates/travel/TravelRenderer";
import ExperienceRenderer from "@/components/story-templates/ExperienceRenderer";
import { resolveTemplateSlug } from "@/lib/templateCatalog";
import toast from "react-hot-toast";

interface StoryPreviewClientProps {
  story: {
    id: string;
    email?: string | null;
    status: string;
    paymentStatus: string;
    template: {
      name: string;
      slug?: string;
      price: number;
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

export default function StoryPreviewClient({
  story,
  pages,
}: StoryPreviewClientProps) {
  const router = useRouter();
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [email, setEmail] = useState(story.email || "");
  const [animKey, setAnimKey] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const isTransitioningRef = useRef(false);

  const activePage = pages[currentPageIdx];
  const isFinalPage = currentPageIdx === pages.length - 1;
  const priceInRupees = Math.round(story.template.price / 100);
  const canonicalTemplateSlug = resolveTemplateSlug(story.template.slug);

  // Advance to next page with smooth exit animation
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

  // Hidden keyboard navigation
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
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPageIdx, pages.length]);

  const handleProceedToCheckout = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address to receive your links");
      return;
    }
    router.push(`/checkout/${story.id}?email=${encodeURIComponent(email)}`);
  };

  return (
    <div
      onClick={handleAdvance}
      className="fixed inset-0 w-screen h-screen min-h-[100dvh] max-w-none overflow-hidden bg-black text-white selection:bg-rose-500/30 select-none cursor-pointer flex flex-col"
    >
      {/* Top Floating Header Overlay */}
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

        <div className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-[11px] font-mono uppercase tracking-widest text-zinc-300 pointer-events-auto shadow-lg">
          Full Story Preview
        </div>
      </header>

      {/* Main Full-Viewport Presentation Canvas */}
      <main className="w-full h-full min-h-[100dvh] flex-1 flex flex-col">
        {canonicalTemplateSlug === "our-little-story" ? (
          <div className="w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar">
             <OurStoryRenderer pages={pages as any} />
             <div className="h-40" /> 
          </div>
        ) : canonicalTemplateSlug === "a-little-surprise" ? (
          <ExperienceRenderer templateSlug={canonicalTemplateSlug} fieldValues={(pages[0]?.fieldValues ?? {}) as Record<string, any>} />
        ) : canonicalTemplateSlug === "the-journey" ? (
          <div className="w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar">
             <TravelRenderer pages={pages as any} />
             <div className="h-40" /> 
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

      {/* Checkout Overlay: for slide-based templates only */}
      {(isFinalPage || story.template.slug === "our-story" || story.template.slug === "birthday-magic" || story.template.slug === "travel-journey") && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-8 bg-gradient-to-t from-black/95 via-black/80 to-transparent backdrop-blur-sm pointer-events-auto animate-fadeIn cursor-default"
        >
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-zinc-950/90 border border-white/15 shadow-2xl backdrop-blur-2xl">
            {/* Email input */}
            <div className="w-full sm:w-auto flex-1">
              <label className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 mb-1.5 block">
                Deliver share link to:
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>
            </div>

            {/* Checkout CTA */}
            <div className="w-full sm:w-auto self-end sm:self-auto">
              <button
                onClick={handleProceedToCheckout}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-bold text-xs shadow-xl shadow-rose-500/30 cursor-pointer active:scale-98 transition-all"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Looks Good, Proceed to Pay (₹{priceInRupees})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
