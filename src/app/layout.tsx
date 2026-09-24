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
      <body className="min-h-full flex flex-col overflow-x-hidden bg-[#FFF8F2] text-[#3B2436]">
        {/* Skip to content — screen reader / keyboard navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-xl focus:bg-[#E85D75] focus:px-6 focus:py-3 focus:text-sm focus:font-bold focus:text-white focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>
        <SiteLoader />
        <FloatingCursor />

        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "rgba(255, 253, 251, 0.92)",
              color: "#3B2436",
              border: "1px solid #F3DEE2",
              borderRadius: "16px",
              padding: "16px 20px",
              fontSize: "14px",
              fontWeight: "600",
              boxShadow: "0 20px 40px -18px rgba(178,110,120,0.35), inset 0 1px 0 rgba(255,255,255,0.6)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            },
            success: {
              iconTheme: { primary: "#E85D75", secondary: "#fff" },
            },
            error: {
              iconTheme: { primary: "#B9425C", secondary: "#fff" },
            },
          }}
        />
      </body>
    </html>
  );
}

