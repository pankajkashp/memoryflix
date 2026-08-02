"use client";

import { useState } from "react";
import { Story, StoryTemplate, MediaAsset } from "@prisma/client";
import EditStoryForm from "./EditStoryForm";
import MediaUploader from "./MediaUploader";
import MediaList from "./MediaList";
import PublishButton from "./PublishButton";
import TemplateSelector from "./TemplateSelector";
import Link from "next/link";
import TypographySelector from "./TypographySelector";
import { motion, AnimatePresence } from "framer-motion";
import WizardTimeline, { STEPS } from "./WizardTimeline";

type StoryWithRelations = Story & {
  template: StoryTemplate;
  media: MediaAsset[];
};


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

  return (
    <div className="mx-auto pt-4 pb-24 transition-all duration-500 px-3 sm:px-4 max-w-4xl">
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
      <WizardTimeline currentStep={currentStep} setCurrentStep={setCurrentStep} />

      {/* ── Wizard Content Card ────────────────────────────────────────────── */}
      <div className="w-full rounded-[2rem] border border-white/10 bg-black/40 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl relative overflow-hidden min-h-[500px] flex flex-col">
        {/* Subtle internal glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-purple-500/5 pointer-events-none" />

        <div className="relative z-10 flex-grow">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="h-full"
            >
              {/* STEP 1: TEMPLATE */}
              {currentStep === 1 && (
                <div className="h-full flex flex-col">
                  <h2 className="text-3xl font-black tracking-tight text-white mb-2">Cinematic Theme</h2>
                  <p className="text-zinc-400 mb-8 max-w-xl text-lg">
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
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-white mb-2">Story Details</h2>
                  <p className="text-zinc-400 mb-8 max-w-xl text-lg">
                    Set the scene. Add a title, date, and description for your memory.
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

              {/* STEP 3: MEDIA */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-white mb-2">Upload Memories</h2>
                  <p className="text-zinc-400 mb-8 max-w-xl text-lg">
                    Add photos and videos to your story.
                  </p>
                  
                  <MediaUploader storyId={story.id} onUploadComplete={() => nextStep()} />
                  
                  <div className="mt-8 border-t border-white/10 pt-8">
                    <MediaList media={story.media} storyId={story.id} coverMediaId={story.coverMediaId} />
                  </div>
                </div>
              )}

              {/* STEP 4: COVER IMAGE */}
              {currentStep === 4 && (
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-white mb-2">The Poster</h2>
                  <p className="text-zinc-400 mb-8 max-w-xl text-lg">
                    Hover over an image below and click &quot;Set Cover&quot; to use it as the cinematic poster for your story.
                  </p>
                  
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <MediaList media={story.media} storyId={story.id} coverMediaId={story.coverMediaId} />
                  </div>
                </div>
              )}

              {/* STEP 5: TYPOGRAPHY */}
              {currentStep === 5 && (
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-white mb-2">Typography & Mood</h2>
                  <p className="text-zinc-400 mb-8 max-w-xl text-lg">
                    Choose an emotional preset that matches the tone of your story.
                  </p>
                  
                  <TypographySelector 
                    storyId={story.id} 
                    currentPresetId={story.typographyPreset} 
                    currentAccentId={story.accentColor} 
                  />
                </div>
              )}

              {/* STEP 6: PREVIEW */}
              {currentStep === 6 && (() => {
                const hasTitle = story.title && story.title !== "Untitled Story";
                const hasCover = !!story.coverMediaId;
                const hasMinMedia = story.media.length >= 4;
                const isReadyForPreview = hasTitle && hasCover && hasMinMedia;

                return (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    {!isReadyForPreview ? (
                      <div className="bg-black/50 border border-rose-500/30 rounded-2xl p-8 max-w-md w-full mx-auto text-left backdrop-blur-md">
                        <h3 className="text-2xl font-black tracking-tight text-white mb-2">Almost there!</h3>
                        <p className="text-zinc-400 text-sm mb-6">Complete these steps to unlock the Cinematic Preview.</p>
                        <ul className="space-y-4">
                          <li className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${hasTitle ? 'bg-green-500' : 'border border-zinc-500'}`}>
                              {hasTitle && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <span className={hasTitle ? 'text-zinc-300 font-medium' : 'text-zinc-500'}>Set Story Title</span>
                          </li>
                          <li className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${hasCover ? 'bg-green-500' : 'border border-zinc-500'}`}>
                              {hasCover && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <span className={hasCover ? 'text-zinc-300 font-medium' : 'text-zinc-500'}>Choose Cover Image</span>
                          </li>
                          <li className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${hasMinMedia ? 'bg-green-500' : 'border border-zinc-500'}`}>
                              {hasMinMedia && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <span className={hasMinMedia ? 'text-zinc-300 font-medium' : 'text-zinc-500'}>Upload 4 Media Assets ({story.media.length}/4)</span>
                          </li>
                        </ul>
                      </div>
                    ) : (
                      <>
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="w-32 h-32 mb-8 rounded-full bg-gradient-to-br from-rose-500/20 to-purple-600/20 border border-rose-500/30 flex items-center justify-center shadow-[0_0_60px_rgba(244,63,94,0.3)]"
                        >
                          <span className="text-6xl drop-shadow-xl">🍿</span>
                        </motion.div>
                        <h2 className="text-4xl font-black tracking-tight text-white mb-4">Ready for Premiere?</h2>
                        <p className="text-zinc-400 mb-10 max-w-md mx-auto text-lg">
                          Grab some popcorn. Take a look at how your story flows before you publish it to the world.
                        </p>
                        
                        <Link
                          href={`/stories/${story.id}/preview`}
                          target="_blank"
                          className="inline-flex items-center justify-center gap-2 sm:gap-3 rounded-full bg-white text-black px-6 py-3 sm:px-10 sm:py-5 font-black text-sm sm:text-lg hover:bg-zinc-200 transition-all shadow-xl shadow-white/10 hover:scale-105 active:scale-95 group whitespace-nowrap"
                        >
                          Watch Cinematic Preview
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </Link>
                      </>
                    )}
                  </div>
                );
              })()}

              {/* STEP 7: PUBLISH */}
              {currentStep === 7 && (() => {
                const hasTitle = story.title && story.title !== "Untitled Story";
                const hasCover = !!story.coverMediaId;
                const hasMinMedia = story.media.length >= 6;
                const hasDescription = story.description && story.description.trim().length > 0;
                
                const isReadyForPublish = hasTitle && hasCover && hasMinMedia && hasDescription;

                return (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <motion.h2 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="text-4xl font-black tracking-tight text-white mb-4"
                    >
                      {story.status === "PUBLISHED" ? "Your Story is Live!" : "Publish Your Masterpiece"}
                    </motion.h2>
                    <motion.p 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="text-zinc-400 mb-10 max-w-md mx-auto text-lg"
                    >
                      {story.status === "PUBLISHED" 
                        ? "Share this link with friends and family." 
                        : "Make your story public to get a shareable link. You can still make edits later."}
                    </motion.p>

                    {story.status === "DRAFT" ? (
                      !isReadyForPublish ? (
                        <motion.div 
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="bg-black/50 border border-rose-500/30 rounded-2xl p-8 max-w-md w-full mx-auto text-left mt-4 backdrop-blur-md"
                        >
                          <h3 className="text-2xl font-black tracking-tight text-white mb-2">Requirements</h3>
                          <p className="text-zinc-400 text-sm mb-6">Ensure your story meets MemoryFlix quality standards before publishing.</p>
                          <ul className="space-y-4">
                            <li className="flex items-center gap-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${hasTitle ? 'bg-green-500' : 'border border-zinc-500'}`}>
                                {hasTitle && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                              </div>
                              <span className={hasTitle ? 'text-zinc-300 font-medium' : 'text-zinc-500'}>Set Story Title</span>
                            </li>
                            <li className="flex items-center gap-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${hasCover ? 'bg-green-500' : 'border border-zinc-500'}`}>
                                {hasCover && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                              </div>
                              <span className={hasCover ? 'text-zinc-300 font-medium' : 'text-zinc-500'}>Choose Cover Image</span>
                            </li>
                            <li className="flex items-center gap-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${hasDescription ? 'bg-green-500' : 'border border-zinc-500'}`}>
                                {hasDescription && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                              </div>
                              <span className={hasDescription ? 'text-zinc-300 font-medium' : 'text-zinc-500'}>Add Description (Step 2)</span>
                            </li>
                            <li className="flex items-center gap-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${hasMinMedia ? 'bg-green-500' : 'border border-zinc-500'}`}>
                                {hasMinMedia && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                              </div>
                              <span className={hasMinMedia ? 'text-zinc-300 font-medium' : 'text-zinc-500'}>Upload 6 Media Assets ({story.media.length}/6)</span>
                            </li>
                          </ul>
                        </motion.div>
                      ) : (
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="scale-125 origin-center"
                        >
                          <PublishButton storyId={story.id} paymentStatus={story.paymentStatus} />
                        </motion.div>
                      )
                    ) : (
                      <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-full max-w-md rounded-2xl border border-rose-500/30 bg-rose-500/10 p-8 backdrop-blur-md shadow-[0_0_40px_rgba(244,63,94,0.1)]"
                      >
                        <p className="text-sm font-bold text-rose-400 uppercase tracking-widest mb-4">Public Link</p>
                        <div className="bg-black/50 border border-white/10 rounded-xl p-5 flex items-center justify-between gap-4">
                          <Link 
                            href={`/s/${story.slug}`} 
                            target="_blank" 
                            className="text-white hover:text-rose-400 font-bold truncate underline underline-offset-4 decoration-white/20 text-lg"
                          >
                            memoryflix.com/s/{story.slug}
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Footer Navigation ────────────────────────────────────────────── */}
        <div className="relative z-10 mt-12 pt-6 border-t border-white/10 flex items-center justify-between gap-3">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="rounded-full bg-white/5 border border-white/10 px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-colors whitespace-nowrap"
          >
            Previous
          </button>
          
          <button
            onClick={nextStep}
            disabled={currentStep === STEPS.length}
            className="rounded-full bg-gradient-to-r from-rose-500 to-purple-600 px-4 py-2 sm:px-8 sm:py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-rose-600/20 hover:from-rose-400 hover:to-purple-500 disabled:opacity-30 disabled:hover:from-rose-500 disabled:hover:to-purple-600 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            {currentStep === STEPS.length - 1 ? "Proceed to Publish" : "Next Step"}
          </button>
        </div>
      </div>
    </div>
  );
}
