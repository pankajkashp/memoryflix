"use client";

import { useActionState } from "react";
import { createStory, StoryActionState } from "@/app/actions/story";

const initialState: StoryActionState = {};

export default function CreateStoryForm() {
  const [state, action, pending] = useActionState(createStory, initialState);

  return (
    <div className="w-full rounded-[2rem] border border-white/10 bg-black/40 p-8 sm:p-10 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
      {/* Subtle internal glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-transparent to-purple-500/10 pointer-events-none" />

      <div className="relative z-10 mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">New Story</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Give your story a title to get started.
        </p>
      </div>

      {/* Template badge — Netflix only in MVP */}
      <div className="relative z-10 mt-4 mb-8 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-md">
        <span className="text-sm font-medium text-zinc-300">Selected Template:</span>
        <span className="rounded-full bg-gradient-to-r from-red-600 to-rose-600 px-3 py-1 text-xs font-bold text-white shadow-lg shadow-red-600/20 tracking-wider uppercase">
          Cinematic
        </span>
      </div>

      <form action={action} className="relative z-10 space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-zinc-300 ml-1 mb-1.5"
          >
            Story Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="e.g. Priya & Rohan's Wedding Story"
            className="block w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-zinc-500 shadow-inner focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-colors"
          />
          {state?.errors?.title && (
            <p className="mt-2 text-xs text-rose-400 ml-1">{state.errors.title[0]}</p>
          )}
        </div>

        {state?.errors?.general && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200 text-center backdrop-blur-md">
            {state.errors.general[0]}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-600/20 hover:from-rose-400 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 transition-all duration-300 mt-2 hover:scale-[1.02] active:scale-[0.98]"
        >
          {pending ? "Creating…" : "Create Story"}
        </button>
      </form>
    </div>
  );
}
