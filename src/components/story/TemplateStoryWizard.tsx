"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Check,
  Loader2,
  Eye,
} from "lucide-react";
import PageRenderer from "@/components/story-pages/PageRenderer";
import FormImageUploader from "./FormImageUploader";
import { finalizeStoryDraft } from "@/app/actions/templateStory";
import toast from "react-hot-toast";

export interface StoryPageInstanceWithBlueprint {
  id: string;
  storyId: string;
  templatePageBlueprintId: string;
  fieldValues: Record<string, any>;
  blueprint: {
    id: string;
    position: number;
    componentKey: string;
    fixedConfig: any;
    editableSchema: any;
  };
}

interface TemplateStoryWizardProps {
  story: {
    id: string;
    email?: string | null;
    status: string;
    template: {
      id: string;
      name: string;
      slug: string;
      category: string;
    };
  };
  pageInstances: StoryPageInstanceWithBlueprint[];
  initialPageIndex?: number;
}

export default function TemplateStoryWizard({
  story,
  pageInstances,
  initialPageIndex = 0,
}: TemplateStoryWizardProps) {
  const router = useRouter();
  const [currentPageIdx, setCurrentPageIdx] = useState(initialPageIndex);
  const [pagesData, setPagesData] = useState<Record<string, Record<string, any>>>(
    () => {
      const initial: Record<string, Record<string, any>> = {};
      pageInstances.forEach((inst) => {
        initial[inst.id] = (inst.fieldValues as Record<string, any>) || {};
      });
      return initial;
    }
  );
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "idle">("idle");
  const [isFinalizing, startFinalizeTransition] = useTransition();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeInstance = pageInstances[currentPageIdx];
  const activeBlueprint = activeInstance?.blueprint;
  const currentValues = (activeInstance && pagesData[activeInstance.id]) || {};

  // Auto-save logic
  const triggerAutoSave = (instanceId: string, values: Record<string, any>) => {
    setSaveStatus("saving");
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await fetch(`/api/story/${story.id}/page/${instanceId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fieldValues: values }),
        });
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2500);
      } catch (err) {
        console.error("Auto-save failed:", err);
        setSaveStatus("idle");
      }
    }, 600);
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    if (!activeInstance) return;
    const updatedValues = {
      ...currentValues,
      [fieldName]: value,
    };

    setPagesData((prev) => ({
      ...prev,
      [activeInstance.id]: updatedValues,
    }));

    triggerAutoSave(activeInstance.id, updatedValues);
  };

  const handleNext = async () => {
    // Force instant save before switching or finalizing
    if (activeInstance) {
      try {
        await fetch(`/api/story/${story.id}/page/${activeInstance.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fieldValues: currentValues }),
        });
      } catch (err) {
        console.error("Save before next failed:", err);
      }
    }

    if (currentPageIdx < pageInstances.length - 1) {
      setCurrentPageIdx((p) => p + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Last page -> finalize draft & redirect to preview
      startFinalizeTransition(async () => {
        try {
          const res = await finalizeStoryDraft(story.id);
          if (!res.success) {
            toast.error(res.error || "Failed to finalize story");
            return;
          }
          toast.success("All chapters customized! Preparing preview...");
          router.push(`/create/${story.id}/preview`);
        } catch (err) {
          toast.error("Failed to complete draft");
        }
      });
    }
  };

  const handlePrev = () => {
    if (currentPageIdx > 0) {
      setCurrentPageIdx((p) => p - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const schemaFields = (activeBlueprint?.editableSchema?.fields || []) as Array<{
    name: string;
    label: string;
    type: "text" | "textarea" | "image";
    required?: boolean;
    default?: string;
  }>;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-rose-500/30 flex flex-col">
      {/* Top Wizard Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-zinc-950/80 border-b border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/templates"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Templates
          </Link>
          <span className="text-zinc-700">|</span>
          <div>
            <span className="text-xs font-bold text-white">
              {story.template.name}
            </span>
            <span className="text-zinc-500 text-xs ml-2">
              (Chapter {currentPageIdx + 1} of {pageInstances.length})
            </span>
          </div>
        </div>

        {/* Auto-save status */}
        <div className="flex items-center gap-3">
          <div className="text-xs font-mono flex items-center gap-1.5 text-zinc-400">
            {saveStatus === "saving" && (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span className="text-amber-400">Saving...</span>
              </>
            )}
            {saveStatus === "saved" && (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Saved</span>
              </>
            )}
            {saveStatus === "idle" && (
              <span className="text-zinc-500">Auto-saves live</span>
            )}
          </div>

          <Link
            href={`/create/${story.id}/preview`}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs hover:bg-white/10 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-zinc-400" /> Preview All
          </Link>
        </div>
      </header>

      {/* Chapter Progress Step Pills */}
      <div className="bg-zinc-950/40 border-b border-white/5 px-4 sm:px-8 py-2.5 overflow-x-auto no-scrollbar flex items-center gap-2">
        {pageInstances.map((inst, idx) => {
          const isCurrent = currentPageIdx === idx;
          const isPassed = currentPageIdx > idx;

          return (
            <button
              key={inst.id}
              onClick={() => setCurrentPageIdx(idx)}
              className={`px-3 py-1 rounded-full text-xs font-mono flex items-center gap-1.5 shrink-0 transition-all ${
                isCurrent
                  ? "bg-rose-500 text-white font-bold shadow-md shadow-rose-500/20"
                  : isPassed
                  ? "bg-white/10 text-zinc-200 hover:bg-white/15"
                  : "bg-white/5 text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <span>{idx + 1}.</span>
              <span>{inst.blueprint.editableSchema?.title || inst.blueprint.componentKey}</span>
              {isPassed && <Check className="w-3 h-3 text-emerald-400" />}
            </button>
          );
        })}
      </div>

      {/* Main Split Layout: Top Live Preview + Bottom Form */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-6 space-y-8">
        {/* Top: Live Interactive Preview Frame */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-mono uppercase tracking-widest text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" /> Live Interactive Preview
            </span>
            <span>Updates in real-time as you customize</span>
          </div>

          <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-3xl overflow-hidden border border-white/15 bg-zinc-950 shadow-2xl">
            {activeBlueprint && (
              <PageRenderer
                key={`${activeBlueprint.id}-${currentPageIdx}`}
                componentKey={activeBlueprint.componentKey}
                fixedConfig={activeBlueprint.fixedConfig}
                fieldValues={currentValues}
                isActive={true}
              />
            )}
          </div>
        </div>

        {/* Bottom: Dynamic Customization Form */}
        <div className="rounded-3xl p-6 sm:p-8 bg-zinc-950/90 border border-white/10 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>{activeBlueprint?.editableSchema?.title || "Customize Chapter"}</span>
            </h2>
            {activeBlueprint?.editableSchema?.description && (
              <p className="text-xs sm:text-sm text-zinc-400">
                {activeBlueprint.editableSchema.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {schemaFields.map((field) => {
              const val = currentValues[field.name] ?? field.default ?? "";

              if (field.type === "image") {
                return (
                  <div key={field.name} className="md:col-span-2">
                    <FormImageUploader
                      label={field.label}
                      value={val}
                      onChange={(url) => handleFieldChange(field.name, url)}
                      required={field.required}
                    />
                  </div>
                );
              }

              if (field.type === "textarea") {
                return (
                  <div key={field.name} className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-300">
                      {field.label} {field.required && <span className="text-rose-400">*</span>}
                    </label>
                    <textarea
                      rows={3}
                      value={val}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                      className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-white/10 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-rose-500 transition-colors resize-none leading-relaxed"
                    />
                  </div>
                );
              }

              return (
                <div key={field.name} className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    {field.label} {field.required && <span className="text-rose-400">*</span>}
                  </label>
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-rose-500 transition-colors"
                  />
                </div>
              );
            })}
          </div>

          {/* Form Action Controls */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentPageIdx === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-zinc-300 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Previous Chapter
            </button>

            <button
              onClick={handleNext}
              disabled={isFinalizing}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white text-xs font-bold shadow-lg shadow-rose-500/25 cursor-pointer disabled:opacity-50 transition-all"
            >
              {isFinalizing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Preparing Story...
                </>
              ) : currentPageIdx === pageInstances.length - 1 ? (
                <>
                  Finalize & Preview All <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  Next Chapter <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
