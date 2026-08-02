"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Shield,
  Loader2,
  ArrowLeft,
  Eye,
} from "lucide-react";
import PageRenderer from "@/components/story-pages/PageRenderer";
import { createStoryFromTemplate } from "@/app/actions/templateStory";
import toast from "react-hot-toast";

interface TemplateDetailClientProps {
  template: {
    id: string;
    name: string;
    slug: string;
    category: string;
    price: number;
    description: string;
    previewUrl: string;
    pages: Array<{
      id: string;
      position: number;
      componentKey: string;
      fixedConfig: any;
      editableSchema: any;
    }>;
  };
}

export default function TemplateDetailClient({
  template,
}: TemplateDetailClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const isTransitioningRef = useRef(false);

  const activeBlueprint = template.pages[currentPageIdx];
  const priceInRupees = Math.round(template.price / 100);

  // Extract defaults from editableSchema for live sample preview
  const defaultSampleFields = (activeBlueprint?.editableSchema?.fields || []).reduce(
    (acc: any, field: any) => {
      acc[field.name] = field.default || "";
      return acc;
    },
    {}
  );

  const handleAdvance = () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setIsExiting(true);

    setTimeout(() => {
      setCurrentPageIdx((p) => (p + 1) % template.pages.length);
      setIsExiting(false);
      setAnimKey((k) => k + 1);
      isTransitioningRef.current = false;
    }, 320); // 320ms reverse exit
  };

  // Keyboard navigation fallback
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
          setCurrentPageIdx((p) =>
            p === 0 ? template.pages.length - 1 : p - 1
          );
          setIsExiting(false);
          setAnimKey((k) => k + 1);
          isTransitioningRef.current = false;
        }, 250);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPageIdx, template.pages.length]);

  const handleCreate = () => {
    startTransition(async () => {
      try {
        const res = await createStoryFromTemplate(template.slug);
        if (!res.success || !res.storyId) {
          toast.error(res.error || "Failed to initialize story");
          return;
        }
        toast.success("Story workspace initialized!");
        router.push(`/create/${res.storyId}`);
      } catch (err: any) {
        toast.error("Failed to start story creation");
      }
    });
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-rose-500/30 select-none">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/70 border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link
          href="/templates"
          className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Templates
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
            {template.category}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            ₹{priceInRupees}
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Sample Preview Player (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-rose-500" />
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-300 font-semibold">
                  Interactive Live Sample
                </span>
              </div>
            </div>

            {/* Live Page Preview Frame (Tap anywhere to advance) */}
            <div
              onClick={handleAdvance}
              className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden border border-white/15 bg-zinc-950 shadow-2xl cursor-pointer"
            >
              {activeBlueprint && (
                <PageRenderer
                  key={`${activeBlueprint.id}-${animKey}`}
                  componentKey={activeBlueprint.componentKey}
                  fixedConfig={activeBlueprint.fixedConfig}
                  fieldValues={defaultSampleFields}
                  isActive={true}
                  isExiting={isExiting}
                />
              )}
            </div>
          </div>

          {/* Right Column: Template Info & CTA Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl p-6 sm:p-8 bg-zinc-950/90 border border-white/10 backdrop-blur-xl shadow-2xl space-y-6">
              {/* Badge & Title */}
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-rose-500/10 border border-rose-500/30 text-rose-300">
                  <Sparkles className="w-3.5 h-3.5" /> {template.category} Special
                </div>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-white">
                  {template.name}
                </h1>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {template.description}
                </p>
              </div>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 pt-4 border-t border-white/10">
                <span className="text-4xl font-bold text-white tracking-tight">
                  ₹{priceInRupees}
                </span>
                <span className="text-xs text-zinc-500 line-through">₹199</span>
                <span className="text-xs font-bold text-emerald-400">
                  Save 75% • One-time fee
                </span>
              </div>

              {/* Primary Action Button */}
              <button
                onClick={handleCreate}
                disabled={isPending}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-bold text-base shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 cursor-pointer active:scale-98"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Preparing Story Studio...</span>
                  </>
                ) : (
                  <>
                    <span>Create Your Story With This</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Features List */}
              <div className="space-y-3 pt-4 border-t border-white/10 text-xs text-zinc-300">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Includes all 7 animated chapter blueprints</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>30-day editing access after purchase</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Permanent ad-free public link forever</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
