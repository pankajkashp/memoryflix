"use client";

import { useState } from "react";
import { publishStory } from "@/app/actions/story";

export default function PublishButton({ storyId }: { storyId: string }) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePublish = async () => {
    setIsPublishing(true);
    setError(null);
    try {
      await publishStory(storyId);
    } catch (err: any) {
      setError(err.message || "Failed to publish story.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex flex-col items-end">
      <button
        onClick={handlePublish}
        disabled={isPublishing}
        className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-green-700 disabled:opacity-50 transition-colors"
      >
        {isPublishing ? "Publishing..." : "Publish Story"}
      </button>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
