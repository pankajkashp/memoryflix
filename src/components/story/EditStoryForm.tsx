"use client";

import { useActionState, useEffect, useState } from "react";
import { updateStory, StoryActionState } from "@/app/actions/story";

type Props = {
  storyId: string;
  initialTitle: string;
  initialDescription?: string | null;
  initialOccasion?: string | null;
  initialEventDate?: string | null;
};

const initialState: StoryActionState = {};

export default function EditStoryForm({ 
  storyId, 
  initialTitle, 
  initialDescription, 
  initialOccasion, 
  initialEventDate,
}: Props) {
  const updateWithId = updateStory.bind(null, storyId);
  const [state, action, pending] = useActionState(updateWithId, initialState);
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    if (state && !state.errors && Object.keys(state).length > 0) {
      setSuccessMsg(true);
      const timer = setTimeout(() => setSuccessMsg(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  return (
    <form action={action} className="space-y-8 max-w-2xl">
      {/* Title */}
      <div className="relative group">
        <label htmlFor="title" className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 transition-colors group-focus-within:text-rose-500">
          Story Title <span className="text-rose-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={initialTitle}
          placeholder="e.g. Priya & Rohan's Wedding Story"
          className="block w-full bg-transparent border-0 border-b-2 border-white/10 px-0 py-2 text-3xl md:text-5xl font-black text-white placeholder-zinc-700 focus:border-rose-500 focus:ring-0 transition-colors"
        />
        {state?.errors?.title && (
          <p className="mt-2 text-xs text-rose-400">{state.errors.title[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* Occasion */}
        <div className="relative group">
          <label htmlFor="occasion" className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 transition-colors group-focus-within:text-rose-500">
            Occasion
          </label>
          <input
            id="occasion"
            name="occasion"
            type="text"
            placeholder="e.g. Wedding, Vacation"
            defaultValue={initialOccasion || ""}
            className="block w-full bg-transparent border-0 border-b-2 border-white/10 px-0 py-2 text-xl md:text-2xl font-bold text-white placeholder-zinc-700 focus:border-rose-500 focus:ring-0 transition-colors"
          />
          {state?.errors?.occasion && (
            <p className="mt-2 text-xs text-rose-400">{state.errors.occasion[0]}</p>
          )}
        </div>

        {/* Event Date */}
        <div className="relative group">
          <label htmlFor="eventDate" className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 transition-colors group-focus-within:text-rose-500">
            Event Date
          </label>
          <input
            id="eventDate"
            name="eventDate"
            type="date"
            defaultValue={initialEventDate || ""}
            className="block w-full bg-transparent border-0 border-b-2 border-white/10 px-0 py-2 text-xl md:text-2xl font-bold text-white placeholder-zinc-700 focus:border-rose-500 focus:ring-0 transition-colors"
          />
          {state?.errors?.eventDate && (
            <p className="mt-2 text-xs text-rose-400">{state.errors.eventDate[0]}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="relative group">
        <label htmlFor="description" className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 transition-colors group-focus-within:text-rose-500">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          placeholder="A brief summary of this memory..."
          defaultValue={initialDescription || ""}
          className="block w-full bg-transparent border-0 border-b-2 border-white/10 px-0 py-2 text-lg text-zinc-300 placeholder-zinc-700 focus:border-rose-500 focus:ring-0 transition-colors resize-none leading-relaxed"
        />
        {state?.errors?.description && (
          <p className="mt-2 text-xs text-rose-400">{state.errors.description[0]}</p>
        )}
      </div>

      {/* Messages */}
      <div className="min-h-[44px]">
        {state?.errors?.general && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200 text-left backdrop-blur-md">
            {state.errors.general[0]}
          </div>
        )}

        {successMsg && (
          <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300 text-left backdrop-blur-md transition-opacity animate-in fade-in slide-in-from-bottom-2">
            Story details saved successfully.
          </div>
        )}
      </div>

      <div className="flex justify-start pt-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-white text-black px-8 py-3 text-sm font-bold shadow-lg shadow-white/10 hover:bg-zinc-200 disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
        >
          {pending ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
