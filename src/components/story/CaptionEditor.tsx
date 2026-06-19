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
        className="mt-3 min-h-[32px] cursor-pointer group/caption rounded-lg p-2 transition-all hover:bg-white/5 border border-transparent hover:border-white/10"
        onClick={() => setIsEditing(true)}
        title="Click to add a caption"
      >
        {value ? (
          <p className="text-[11px] sm:text-xs text-zinc-300 leading-snug line-clamp-2 group-hover/caption:text-white transition-colors text-center">
            {value}
          </p>
        ) : (
          <p className="text-[11px] text-zinc-500 italic flex justify-center items-center gap-1.5 group-hover/caption:text-rose-400 transition-colors">
            <Pencil className="w-3 h-3" />
            Add a caption…
          </p>
        )}

        {/* Status indicator */}
        <div className="flex justify-center items-center gap-1 mt-1 h-3">
          {isPending && (
            <Loader2 className="w-3 h-3 text-rose-400 animate-spin" />
          )}
          {justSaved && !isPending && (
            <Check className="w-3 h-3 text-green-400" />
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
        placeholder="Add a caption… (Enter to save)"
        className="w-full resize-none rounded-lg border border-rose-500/30 bg-black/50 px-3 py-2 text-xs text-white placeholder-zinc-500 shadow-inner focus:outline-none focus:ring-1 focus:ring-rose-500 transition-colors"
      />
      <div className="flex justify-between items-center mt-1 px-1">
        <span className="text-[10px] text-zinc-500 tabular-nums">
          {value.length}/{MAX_CAPTION_LENGTH}
        </span>
        {isPending && (
          <span className="text-[10px] text-rose-400 flex items-center gap-1">
            <Loader2 className="w-2.5 h-2.5 animate-spin" /> Saving
          </span>
        )}
      </div>
    </div>
  );
}
