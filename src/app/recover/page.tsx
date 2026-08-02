"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, ArrowRight, Loader2, CheckCircle2, Shield } from "lucide-react";
import { recoverStoryLinks } from "@/app/actions/recover";
import toast from "react-hot-toast";

export default function RecoverPage() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    startTransition(async () => {
      try {
        const res = await recoverStoryLinks(email);
        if (res.success) {
          setSubmitted(true);
          toast.success("Recovery request sent!");
        } else {
          toast.error(res.error || "Recovery failed");
        }
      } catch (err) {
        toast.error("Failed to process recovery request");
      }
    });
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-rose-500/30 flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl px-4 sm:px-8 py-4 flex items-center justify-between">
        <Link
          href="/templates"
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Templates
        </Link>
        <span className="text-xs font-mono text-zinc-500">Story Recovery</span>
      </header>

      {/* Main Recovery Form */}
      <main className="max-w-md w-full mx-auto px-4 sm:px-8 py-12">
        <div className="rounded-3xl p-6 sm:p-8 bg-zinc-950/90 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-serif font-bold tracking-tight text-white">
              Find Your Story
            </h1>
            <p className="text-xs text-zinc-400">
              Lost your link? Enter the email you used at checkout to resend your public share link and 30-day edit link.
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-rose-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Looking Up Stories...
                  </>
                ) : (
                  <>
                    Resend My Story Links <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h3 className="text-sm font-bold text-emerald-300">
                Check Your Inbox
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                If any paid stories are linked to <strong>{email}</strong>, we have dispatched your links. Please check your spam folder if it doesn&apos;t arrive within a minute.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-xs text-zinc-400 underline hover:text-white pt-2"
              >
                Search another email
              </button>
            </div>
          )}

          <div className="pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-xs text-zinc-500">
            <Shield className="w-3.5 h-3.5 text-zinc-400" />
            <span>Protected by rate-limiting & encryption</span>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 bg-zinc-950/60 py-4 text-center text-xs text-zinc-600">
        MemoryFlix &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
