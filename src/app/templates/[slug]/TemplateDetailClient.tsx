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
import BranchingExperiencePlayer from "@/components/story-pages/scenes/BranchingExperiencePlayer";
import { isSceneComponentKey } from "@/components/story-pages/scenes/sceneRegistry";
import AtmosphericBackground from "@/components/common/AtmosphericBackground";
import { createStoryFromTemplate } from "@/app/actions/templateStory";
import toast from "react-hot-toast";

function defaultFieldValues(editableSchema: any): Record<string, any> {
  return (editableSchema?.fields || []).reduce((acc: Record<string, any>, field: any) => {
    acc[field.name] = field.default || "";
    return acc;
  }, {});
}

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
  const isBranchingTemplate = template.pages.some((p) => isSceneComponentKey(p.componentKey));

  // Extract defaults from editableSchema for live sample preview
  const defaultSampleFields = defaultFieldValues(activeBlueprint?.editableSchema);

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
    <div className="relative min-h-screen bg-[#FFF8F2] text-[#3B2436] selection:bg-[#E85D75]/25 select-none overflow-x-hidden">
      {/* Ambient Atmospheric Background (Radial glow + noise/grid + floating particles) */}
      <AtmosphericBackground glowColor="rose" includeGrid={true} />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-[#F3DEE2] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link
          href="/templates"
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#8B6B7A] hover:text-[#3B2436] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Templates
        </Link>
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono uppercase tracking-widest text-[#8B6B7A]">
            {template.category}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F7C9CF]/50 text-[#B9425C] border border-[#E85D75]/30 shadow-sm">
            ₹{priceInRupees}
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Sample Preview Player (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#E85D75]" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#4A2C2A] font-semibold">
                  {isBranchingTemplate
                    ? "Interactive Live Sample"
                    : `Interactive Live Sample (${currentPageIdx + 1}/${template.pages.length})`}
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#B49AA4]">
                {isBranchingTemplate ? "Click through the story" : "Tap frame to advance"}
              </span>
            </div>

            {/* Live Page Preview Frame (Tap anywhere to advance, unless it's a click-driven branching experience) */}
            <div
              onClick={isBranchingTemplate ? undefined : handleAdvance}
              className={`relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden border-2 border-white shadow-magical transition-transform duration-300 hover:scale-[1.005] ${
                isBranchingTemplate ? "" : "cursor-pointer"
              }`}
              style={{
                boxShadow: "0 25px 60px -15px rgba(178,110,120,0.35), 0 0 40px -10px rgba(232,93,117,0.2)",
              }}
            >
              {isBranchingTemplate ? (
                <BranchingExperiencePlayer
                  pages={template.pages.map((p) => ({
                    ...p,
                    fieldValues: defaultFieldValues(p.editableSchema),
                  }))}
                />
              ) : (
                activeBlueprint && (
                  <PageRenderer
                    key={`${activeBlueprint.id}-${animKey}`}
                    componentKey={activeBlueprint.componentKey}
                    fixedConfig={activeBlueprint.fixedConfig}
                    fieldValues={defaultSampleFields}
                    isActive={true}
                    isExiting={isExiting}
                  />
                )
              )}
            </div>
          </div>

          {/* Right Column: Template Info & CTA Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl p-6 sm:p-8 bg-white/90 border border-[#F3DEE2] backdrop-blur-2xl shadow-magical space-y-6">
              {/* Badge & Title */}
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#F7C9CF]/40 border border-[#E85D75]/30 text-[#B9425C] shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-[#E85D75]" /> {template.category} Special
                </div>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-[#3B2436]">
                  {template.name}
                </h1>
                <p className="text-sm text-[#8B6B7A] leading-relaxed">
                  {template.description}
                </p>
              </div>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 pt-4 border-t border-[#F3DEE2]">
                <span className="text-4xl font-bold text-[#3B2436] tracking-tight">
                  ₹{priceInRupees}
                </span>
                <span className="text-xs text-[#B49AA4] line-through">₹199</span>
                <span className="text-xs font-bold text-[#3E8A6D]">
                  Save 75% • One-time fee
                </span>
              </div>

              {/* Primary Action Button */}
              <button
                onClick={handleCreate}
                disabled={isPending}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#E85D75] to-[#B9425C] hover:from-[#DB4A64] hover:to-[#A83A54] text-white font-bold text-base shadow-magical flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 cursor-pointer active:scale-98"
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
              <div className="space-y-3 pt-4 border-t border-[#F3DEE2] text-xs text-[#6B4C58]">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#3E8A6D] shrink-0" />
                  <span>Includes all 7 animated chapter blueprints</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#B79FD1] shrink-0" />
                  <span>30-day editing access after purchase</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-[#E85D75] shrink-0" />
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
