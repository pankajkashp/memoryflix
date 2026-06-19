"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { updateCaption } from "@/app/actions/media";
import { Check, Pencil, Loader2 } from "lucide-react";

interface CaptionEditorProps {
  storyId: string;
  mediaId: string;
  initialCaption?: string | null;
}

const MAX_CAPTION_LENGTH = 200;
// Debounce ms — save automatically 1.5s after the user stops typing
const AUTOSAVE_DELAY = 1500;

export default function CaptionEditor({
  storyId,
  mediaId,
  initialCaption,
}: CaptionEditorProps) {
  const [value, setValue] = useState(initialCaption ?? "");
  const [savedValue, setSavedValue] = useState(initialCaption ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [justSaved, setJustSaved] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Auto-focus when entering edit mode
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      // Move cursor to end
      const len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
    }
  }, [isEditing]);

  const save = (caption: string) => {
    if (caption === savedValue) return; // No change — skip round-trip
    startTransition(async () => {
      await updateCaption(storyId, mediaId, caption);
      setSavedValue(caption);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value;
    if (next.length > MAX_CAPTION_LENGTH) return;
    setValue(next);

    // Debounce autosave
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => save(next), AUTOSAVE_DELAY);
  };

  const handleBlur = () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    save(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === "Escape") {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      setValue(savedValue); // Revert
      setIsEditing(false);
    }
  };

  // Cleanup timer on unmount
  useEffect(() => () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); }, []);

  if (!isEditing) {
    return (
      <div
        className="mt-2 min-h-[32px] cursor-pointer group/caption"
        onClick={() => setIsEditing(true)}
        title="Click to add a caption"
      >
        {value ? (
          <p className="text-[11px] sm:text-xs text-gray-600 leading-snug line-clamp-2 group-hover/caption:text-gray-900 transition-colors">
            {value}
          </p>
        ) : (
          <p className="text-[11px] text-gray-400 italic flex items-center gap-1 group-hover/caption:text-indigo-500 transition-colors">
            <Pencil className="w-2.5 h-2.5" />
            Add a caption…
          </p>
        )}

        {/* Status indicator */}
        <div className="flex items-center gap-1 mt-0.5 h-3">
          {isPending && (
            <Loader2 className="w-2.5 h-2.5 text-indigo-400 animate-spin" />
          )}
          {justSaved && !isPending && (
            <Check className="w-2.5 h-2.5 text-green-500" />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        rows={2}
        maxLength={MAX_CAPTION_LENGTH}
        placeholder="Add a caption… (Enter to save, Esc to cancel)"
        className="w-full resize-none rounded-md border border-indigo-300 bg-white px-2 py-1.5 text-xs text-gray-800 placeholder-gray-400 shadow-sm ring-1 ring-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      />
      <div className="flex justify-between items-center mt-0.5">
        <span className="text-[10px] text-gray-400 tabular-nums">
          {value.length}/{MAX_CAPTION_LENGTH}
        </span>
        {isPending && (
          <span className="text-[10px] text-indigo-500 flex items-center gap-1">
            <Loader2 className="w-2.5 h-2.5 animate-spin" /> Saving…
          </span>
        )}
      </div>
    </div>
  );
}
