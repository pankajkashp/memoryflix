"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  isDestructive?: boolean;
}

const MODAL_ID = "confirm-modal-title";
const MODAL_DESC_ID = "confirm-modal-desc";

export function ConfirmModal({
  isOpen,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isDestructive = true,
}: ConfirmModalProps) {
  const [isPending, setIsPending] = useState(false);
  const [mounted, setMounted] = useState(false);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-focus confirm button when modal opens
  useEffect(() => {
    if (isOpen && confirmBtnRef.current) {
      // Small delay to allow animation to start
      const t = setTimeout(() => confirmBtnRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Focus trap: keep Tab/Shift+Tab within modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
        return;
      }

      if (e.key !== "Tab") return;

      const focusable = [cancelBtnRef.current, confirmBtnRef.current].filter(Boolean) as HTMLElement[];
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement;

      if (e.shiftKey) {
        if (active === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleConfirm = async () => {
    setIsPending(true);
    try {
      await onConfirm();
    } finally {
      setIsPending(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={MODAL_ID}
          aria-describedby={MODAL_DESC_ID}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            aria-hidden="true"
          />

          {/* Modal panel — bottom sheet on mobile, centered card on desktop */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 24 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="relative w-full sm:max-w-sm bg-zinc-900 border border-white/10 shadow-2xl rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col"
          >
            {/* Mobile drag handle */}
            <div className="flex justify-center pt-3 sm:hidden">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            <div className="p-6 sm:p-8 flex flex-col items-center text-center space-y-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isDestructive ? "bg-red-500/10 text-red-500" : "bg-rose-500/10 text-rose-500"
                }`}
              >
                <AlertTriangle className="w-6 h-6" aria-hidden="true" />
              </div>
              <h2
                id={MODAL_ID}
                className="text-xl font-bold text-white tracking-tight"
              >
                {title}
              </h2>
              <p
                id={MODAL_DESC_ID}
                className="text-sm text-zinc-400 leading-relaxed"
              >
                {description}
              </p>
            </div>

            <div className="p-4 sm:p-6 border-t border-white/5 bg-black/20 flex flex-col-reverse sm:flex-row gap-3">
              <button
                ref={cancelBtnRef}
                onClick={onCancel}
                disabled={isPending}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                {cancelText}
              </button>
              <button
                ref={confirmBtnRef}
                onClick={handleConfirm}
                disabled={isPending}
                className={`w-full min-h-[44px] px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 ${
                  isDestructive
                    ? "bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] focus-visible:ring-red-500"
                    : "bg-white hover:bg-zinc-200 text-black focus-visible:ring-white"
                }`}
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
