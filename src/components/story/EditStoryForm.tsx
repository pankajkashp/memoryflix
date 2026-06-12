"use client";

import { useActionState } from "react";
import { updateStory, StoryActionState } from "@/app/actions/story";

type Props = {
  storyId: string;
  initialTitle: string;
  status: string;
};

const initialState: StoryActionState = {};

export default function EditStoryForm({ storyId, initialTitle, status }: Props) {
  const updateWithId = updateStory.bind(null, storyId);
  const [state, action, pending] = useActionState(updateWithId, initialState);

  const isPublished = status === "PUBLISHED";

  return (
    <form action={action} className="space-y-4">
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
          defaultValue={initialTitle}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
        />
        {state?.errors?.title && (
          <p className="mt-1 text-xs text-red-600">{state.errors.title[0]}</p>
        )}
      </div>

      {/* Status — read-only in this form; publishing handled separately in Phase 6 */}
      <div>
        <span className="block text-sm font-medium text-gray-700">Status</span>
        <span
          className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            isPublished
              ? "bg-green-50 text-green-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {isPublished ? "Published" : "Draft"}
        </span>
        <p className="mt-1 text-xs text-gray-400">
          Publishing will be available in a future phase.
        </p>
      </div>

      {state?.errors?.general && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {state.errors.general[0]}
        </p>
      )}

      {/* Success feedback — no errors and not first render */}
      {!state?.errors && Object.keys(state ?? {}).length > 0 && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          Story updated.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
