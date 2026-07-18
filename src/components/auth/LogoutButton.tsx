"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      aria-label="Log out"
      className="group flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-200 min-h-[36px] px-3 py-1.5 rounded-lg hover:bg-white/5"
    >
      <LogOut className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
      <span className="hidden sm:inline">Log out</span>
    </button>
  );
}
