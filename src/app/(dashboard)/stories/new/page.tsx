import type { Metadata } from "next";
import Link from "next/link";
import CreateStoryForm from "@/components/story/CreateStoryForm";

export const metadata: Metadata = {
  title: "New Story — MemoryFlix",
};

export default function NewStoryPage() {
  return (
    <div className="max-w-2xl mx-auto pt-8">
      <Link
        href="/dashboard"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
      </Link>
      <CreateStoryForm />
    </div>
  );
}
