import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MemoryFlix — Your love story, on screen",
  description:
    "Transform your memories into cinematic stories worth watching forever. Beautiful. Private. Yours.",
};

import { Toaster } from "react-hot-toast";
import SiteLoader from "@/components/common/SiteLoader";
import FloatingCursor from "@/components/common/FloatingCursor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fontVariables} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden bg-[#09090b] text-white">
        {/* Skip to content — screen reader / keyboard navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-xl focus:bg-rose-500 focus:px-6 focus:py-3 focus:text-sm focus:font-bold focus:text-white focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>
        <SiteLoader />
        <FloatingCursor />

        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: "#18181b",
              color: "#fafafa",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              padding: "12px 16px",
              fontSize: "14px",
              fontWeight: "500",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              backdropFilter: "blur(12px)",
            },
            success: {
              iconTheme: { primary: "#f43f5e", secondary: "#fafafa" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#fafafa" },
            },
          }}
        />
      </body>
    </html>
  );
}

