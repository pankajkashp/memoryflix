"use client";

import { useActionState } from "react";
import { createStory, StoryActionState } from "@/app/actions/story";

const initialState: StoryActionState = {};

export default function CreateStoryForm() {
  const [state, action, pending] = useActionState(createStory, initialState);

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900">New Story</h1>
      <p className="mt-1 text-sm text-gray-500">
        Give your story a title to get started.
      </p>

      {/* Template badge — Netflix only in MVP */}
      <div className="mt-4 flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-3">
        <span className="text-sm font-medium text-gray-700">Template:</span>
        <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-semibold text-white">
          Netflix
        </span>
      </div>

      <form action={action} className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Story Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="e.g. Priya & Rohan's Wedding Story"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
          {state?.errors?.title && (
            <p className="mt-1 text-xs text-red-600">{state.errors.title[0]}</p>
          )}
        </div>

        {state?.errors?.general && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {state.errors.general[0]}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-60"
        >
          {pending ? "Creating…" : "Create Story"}
        </button>
      </form>
    </div>
  );
}
