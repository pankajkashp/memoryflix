"use client";

import React, { useState, useTransition, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, Save } from "lucide-react";
import { updateMediaDetails } from "@/app/actions/media";
import { motion, AnimatePresence } from "framer-motion";

interface MediaDetailsDrawerProps {
  storyId: string;
  mediaId: string;
  initialData: {
    title?: string | null;
    memoryNote?: string | null;
    location?: string | null;
    memoryDate?: Date | string | null;
  };
  onClose: () => void;
}

export default function MediaDetailsDrawer({
  storyId,
  mediaId,
  initialData,
  onClose,
}: MediaDetailsDrawerProps) {
  const [title, setTitle] = useState(initialData.title || "");
  const [memoryNote, setMemoryNote] = useState(initialData.memoryNote || "");
  const [location, setLocation] = useState(initialData.location || "");
  
  // Format the date for the date input (YYYY-MM-DD)
  const formattedDate = initialData.memoryDate 
    ? new Date(initialData.memoryDate).toISOString().split("T")[0]
    : "";
  const [memoryDate, setMemoryDate] = useState(formattedDate);

  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = () => {
    startTransition(async () => {
      await updateMediaDetails(storyId, mediaId, {
        title,
        memoryNote,
        location,
        memoryDate: memoryDate || null,
      });
      onClose();
    });
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          onClick={onClose}
        />

        {/* Drawer */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-lg bg-[#121212] border-l border-white/10 shadow-2xl flex flex-col h-full"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
            <h2 className="text-2xl font-black text-white tracking-tight">Edit Memory</h2>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-400">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., The Eiffel Tower"
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 transition-all"
            />
          </div>

          {/* Memory Note */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-400">Memory Note</label>
            <textarea
              value={memoryNote}
              onChange={(e) => setMemoryNote(e.target.value)}
              placeholder="What made this memory special?"
              rows={5}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 transition-all resize-none text-base"
            />
            <p className="text-xs text-zinc-500">This will appear in a handwritten style in your preview.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Location */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-400">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Paris, France"
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 transition-all"
              />
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-400">Date</label>
              <input
                type="date"
                value={memoryDate}
                onChange={(e) => setMemoryDate(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 transition-all [color-scheme:dark]"
              />
            </div>
          </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 bg-black/20 flex justify-end gap-3 shrink-0">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl text-base font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isPending}
              className="px-6 py-3 rounded-xl text-base font-bold bg-white text-black hover:bg-rose-50 transition-colors flex items-center gap-2 disabled:opacity-50 shadow-xl"
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save Details
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
