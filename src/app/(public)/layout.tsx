import { ReactNode } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-zinc-950 text-white min-h-screen antialiased selection:bg-red-500/30 selection:text-white">
      {/* Simple header for public viewers */}
      <header className="absolute top-0 w-full z-50 px-6 py-6 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="text-red-600 font-black text-2xl tracking-tighter drop-shadow-md">
          MEMORYFLIX
        </div>
      </header>
      {children}
    </div>
  );
}
