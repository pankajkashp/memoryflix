import React from "react";
import Link from "next/link";

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white relative font-sans">

      {children}
    </div>
  );
}
