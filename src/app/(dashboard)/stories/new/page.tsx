import type { Metadata } from "next";
import Link from "next/link";
import CreateStoryForm from "@/components/story/CreateStoryForm";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "New Story — MemoryFlix",
  description: "Start creating your cinematic memory story.",
};

export default function NewStoryPage() {
  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center py-12 px-4">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-rose-500/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Back link */}
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
          Back to Dashboard
        </Link>

        <CreateStoryForm />
      </div>
    </div>
  );
}
