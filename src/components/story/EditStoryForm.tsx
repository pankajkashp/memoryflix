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
    <form action={action} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-zinc-300 ml-1 mb-1.5">
          Story Title <span className="text-rose-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={initialTitle}
          placeholder="e.g. Priya & Rohan's Wedding Story"
          className="block w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-zinc-500 shadow-inner focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-colors"
        />
        {state?.errors?.title && (
          <p className="mt-2 text-xs text-rose-400 ml-1">{state.errors.title[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Occasion */}
        <div>
          <label htmlFor="occasion" className="block text-sm font-medium text-zinc-300 ml-1 mb-1.5">
            Occasion
          </label>
          <input
            id="occasion"
            name="occasion"
            type="text"
            placeholder="e.g. Wedding, Vacation"
            defaultValue={initialOccasion || ""}
            className="block w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-zinc-500 shadow-inner focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-colors"
          />
          {state?.errors?.occasion && (
            <p className="mt-2 text-xs text-rose-400 ml-1">{state.errors.occasion[0]}</p>
          )}
        </div>

        {/* Event Date */}
        <div>
          <label htmlFor="eventDate" className="block text-sm font-medium text-zinc-300 ml-1 mb-1.5">
            Event Date
          </label>
          <input
            id="eventDate"
            name="eventDate"
            type="date"
            defaultValue={initialEventDate || ""}
            className="block w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-zinc-500 shadow-inner focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-colors"
          />
          {state?.errors?.eventDate && (
            <p className="mt-2 text-xs text-rose-400 ml-1">{state.errors.eventDate[0]}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-zinc-300 ml-1 mb-1.5">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          placeholder="A brief summary of this memory..."
          defaultValue={initialDescription || ""}
          className="block w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-zinc-500 shadow-inner focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-colors resize-none"
        />
        {state?.errors?.description && (
          <p className="mt-2 text-xs text-rose-400 ml-1">{state.errors.description[0]}</p>
        )}
      </div>

      {/* Messages */}
      <div className="min-h-[44px]">
        {state?.errors?.general && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200 text-center backdrop-blur-md">
            {state.errors.general[0]}
          </div>
        )}

        {successMsg && (
          <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300 text-center backdrop-blur-md transition-opacity animate-in fade-in slide-in-from-bottom-2">
            Story details saved successfully.
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-white/10 px-6 py-2.5 text-sm font-semibold text-white border border-white/20 hover:bg-white/20 disabled:opacity-50 transition-colors backdrop-blur-md"
        >
          {pending ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
