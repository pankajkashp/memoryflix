import type { Metadata } from "next";
import Link from "next/link";
import CreateStoryForm from "@/components/story/CreateStoryForm";

export const metadata: Metadata = {
  title: "New Story — MemoryFlix",
};

export default function NewStoryPage() {
  return (
    <div>
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
      >
        ← Back to Dashboard
      </Link>
      <CreateStoryForm />
    </div>
  );
}
