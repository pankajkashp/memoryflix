"use client";

import { useState } from "react";
import { Story, StoryTemplate, MediaAsset, Chapter } from "@prisma/client";
import EditStoryForm from "./EditStoryForm";
import MediaUploader from "./MediaUploader";
import MediaList from "./MediaList";
import PublishButton from "./PublishButton";
import ChapterEditor from "./ChapterEditor";
import TemplateSelector from "./TemplateSelector";
import Link from "next/link";

type StoryWithRelations = Story & {
  template: StoryTemplate;
  media: MediaAsset[];
  chapters: Chapter[];
};

const STEPS = [
  { id: 1, name: "Template" },
  { id: 2, name: "Details" },
  { id: 3, name: "Chapters" },
  { id: 4, name: "Media" },
  { id: 5, name: "Cover" },
  { id: 6, name: "Preview" },
  { id: 7, name: "Publish" },
];

export default function StoryWizard({ 
  story, 
  templates 
}: { 
  story: StoryWithRelations;
  templates?: StoryTemplate[];
}) {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // Determine if we can proceed
  // e.g. Step 3 requires media to proceed to Step 4? Not strictly enforcing to keep it flexible, but we could.

  return (
    <div className="mx-auto max-w-4xl pt-4 pb-24">
      {/* ── Header & Navigation ────────────────────────────────────────────── */}
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
        <div className="text-sm font-medium text-zinc-500">
          Step {currentStep} of {STEPS.length}
        </div>
      </div>

      {/* ── Progress Timeline ──────────────────────────────────────────────── */}
      <div className="mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/10 -translate-y-1/2 rounded-full hidden sm:block" />
        <div 
          className="absolute top-1/2 left-0 h-[2px] bg-gradient-to-r from-rose-500 to-purple-600 -translate-y-1/2 rounded-full transition-all duration-500 hidden sm:block"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />
        <div className="flex justify-between relative z-10 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 hide-scrollbar gap-4 sm:gap-0">
          {STEPS.map((step) => {
            const isActive = step.id === currentStep;
            const isPast = step.id < currentStep;
            return (
              <div 
                key={step.id} 
                className="flex flex-col items-center gap-2 min-w-[60px] cursor-pointer"
                onClick={() => setCurrentStep(step.id)}
              >
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 shadow-lg border-2 ${
                    isActive 
                      ? "bg-rose-500 text-white border-rose-400 shadow-rose-500/30 scale-110" 
                      : isPast 
                      ? "bg-rose-500/20 text-rose-300 border-rose-500/30" 
                      : "bg-black/50 text-zinc-500 border-white/10"
                  }`}
                >
                  {isPast ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
                <span className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${
                  isActive ? "text-rose-400" : isPast ? "text-zinc-400" : "text-zinc-600"
                }`}>
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Wizard Content Card ────────────────────────────────────────────── */}
      <div className="w-full rounded-[2rem] border border-white/10 bg-black/40 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl relative overflow-hidden min-h-[400px] flex flex-col">
        {/* Subtle internal glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-purple-500/5 pointer-events-none" />

        <div className="relative z-10 flex-grow">
          {/* STEP 1: TEMPLATE */}
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 h-full flex flex-col">
              <h2 className="text-2xl font-bold text-white mb-2">Cinematic Theme</h2>
              <p className="text-zinc-400 mb-8 max-w-lg">
                Choose the visual language for your story. This will determine the overall aesthetic, layout, colors, and typography.
              </p>
              
              <div className="mt-auto">
                {templates && (
                  <TemplateSelector 
                    storyId={story.id} 
                    currentTemplateId={story.templateId} 
                    templates={templates} 
                  />
                )}
              </div>
            </div>
          )}

          {/* STEP 2: DETAILS */}
          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-bold text-white mb-2">Story Details</h2>
              <p className="text-zinc-400 mb-8 max-w-lg">
                Set the scene. Add a title, date, and description for your memory. Be sure to click "Save Changes" before moving to the next step.
              </p>
              
              <EditStoryForm
                storyId={story.id}
                initialTitle={story.title}
                initialDescription={story.description}
                initialOccasion={story.occasion}
                initialEventDate={story.eventDate ? story.eventDate.toISOString().split("T")[0] : null}
              />
            </div>
          )}

          {/* STEP 3: CHAPTERS */}
          {currentStep === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-bold text-white mb-2">Memory Chapters</h2>
              <p className="text-zinc-400 mb-8 max-w-lg">
                Organize your story into chapters like "❤️ How We Met" or "✈️ First Trip". You'll assign media to these chapters in the next step.
              </p>
              
              <ChapterEditor storyId={story.id} chapters={story.chapters} />
            </div>
          )}

          {/* STEP 4: MEDIA */}
          {currentStep === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-bold text-white mb-2">Upload Memories</h2>
              <p className="text-zinc-400 mb-8 max-w-lg">
                Add photos and videos to your story. Assign them to chapters using the dropdown menu on each media card.
              </p>
              
              <MediaUploader storyId={story.id} />
              
              <div className="mt-8 border-t border-white/10 pt-8">
                <MediaList media={story.media} storyId={story.id} coverMediaId={story.coverMediaId} chapters={story.chapters} />
              </div>
            </div>
          )}

          {/* STEP 5: COVER IMAGE */}
          {currentStep === 5 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-bold text-white mb-2">Choose a Cover</h2>
              <p className="text-zinc-400 mb-8 max-w-lg">
                Hover over an image below and click "Set Cover" to use it as the main poster for your story.
              </p>
              
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <MediaList media={story.media} storyId={story.id} coverMediaId={story.coverMediaId} chapters={story.chapters} />
              </div>
            </div>
          )}

          {/* STEP 6: PREVIEW */}
          {currentStep === 6 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-rose-500/20 to-purple-600/20 border border-rose-500/30 flex items-center justify-center shadow-[0_0_40px_rgba(244,63,94,0.2)]">
                <span className="text-4xl">🎬</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Watch?</h2>
              <p className="text-zinc-400 mb-8 max-w-md mx-auto">
                Take a look at how your story flows. Make sure the sequence is right and the captions are perfect before publishing.
              </p>
              
              <Link
                href={`/stories/${story.id}/preview`}
                target="_blank"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-black px-8 py-4 font-bold hover:bg-zinc-200 transition-colors shadow-lg hover:scale-105 active:scale-95"
              >
                Open Cinematic Preview
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </Link>
            </div>
          )}

          {/* STEP 7: PUBLISH */}
          {currentStep === 7 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 h-full flex flex-col items-center justify-center text-center py-12">
              <h2 className="text-3xl font-bold text-white mb-2">
                {story.status === "PUBLISHED" ? "Your Story is Live!" : "Publish Your Story"}
              </h2>
              <p className="text-zinc-400 mb-8 max-w-md mx-auto">
                {story.status === "PUBLISHED" 
                  ? "Share this link with friends and family." 
                  : "Make your story public to get a shareable link. You can still make edits later."}
              </p>

              {story.status === "DRAFT" ? (
                <div className="scale-125 origin-center">
                  <PublishButton storyId={story.id} />
                </div>
              ) : (
                <div className="w-full max-w-md rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 backdrop-blur-md">
                  <p className="text-sm font-semibold text-rose-300 uppercase tracking-widest mb-3">Public Link</p>
                  <div className="bg-black/50 border border-white/10 rounded-xl p-4 flex items-center justify-between gap-4">
                    <Link 
                      href={`/s/${story.slug}`} 
                      target="_blank" 
                      className="text-white hover:text-rose-400 font-medium truncate underline underline-offset-4 decoration-white/20"
                    >
                      memoryflix.com/s/{story.slug}
                    </Link>
                    {/* Copy button could go here, but omitted for simplicity */}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Footer Navigation ────────────────────────────────────────────── */}
        <div className="relative z-10 mt-12 pt-6 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="rounded-full bg-white/5 border border-white/10 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-colors"
          >
            Previous
          </button>
          
          <button
            onClick={nextStep}
            disabled={currentStep === STEPS.length}
            className="rounded-full bg-gradient-to-r from-rose-500 to-purple-600 px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-600/20 hover:from-rose-400 hover:to-purple-500 disabled:opacity-30 disabled:hover:from-rose-500 disabled:hover:to-purple-600 transition-all hover:scale-105 active:scale-95"
          >
            {currentStep === STEPS.length - 1 ? "Proceed to Publish" : "Next Step"}
          </button>
        </div>
      </div>
    </div>
  );
}
