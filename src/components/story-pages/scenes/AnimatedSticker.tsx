"use client";

import { useState } from "react";
import { Lottie } from "lottie-react";

/**
 * Real animated stickers (not flat static emoji) for decorative use — the
 * same glossy, chat-app style animated emoji used across Google products,
 * sourced from Google's official public Noto Emoji CDN (fonts.gstatic.com,
 * Apache License 2.0, CORS-open, no API key). Lottie/vector rather than GIF:
 * ~15KB per sticker vs. ~150KB for the equivalent 512px animated GIF.
 *
 * Only emoji actually used as decor in this app are mapped — this is not a
 * general-purpose emoji picker.
 */
export const ANIMATED_STICKER_CODEPOINTS: Record<string, string> = {
  "💕": "1f495", // two hearts
  "💖": "1f496", // sparkling heart
  "💗": "1f497", // growing heart
  "✨": "2728", // sparkles
  "🎉": "1f389", // party popper
  "🎊": "1f38a", // confetti ball
  "🎈": "1f388", // balloon
  "🐻": "1f43b", // bear face
  "🐼": "1f43c", // panda
  "🥺": "1f97a", // pleading face
  "😠": "1f620", // angry face
  "🥳": "1f973", // partying face
  "🎁": "1f381", // wrapped gift
  "🎂": "1f382", // birthday cake
  "📸": "1f4f7", // camera
  "🍾": "1f37e", // bottle with popping cork
  "💌": "1f48c", // love letter
  "🔮": "1f52e", // crystal ball
  "🌟": "1f31f", // glowing star
};

function stickerUrl(codepoint: string): string {
  return `https://fonts.gstatic.com/s/e/notoemoji/latest/${codepoint}/lottie.json`;
}

export interface AnimatedStickerProps {
  /** The plain emoji character, e.g. "💕" — looked up in ANIMATED_STICKER_CODEPOINTS. */
  emoji: string;
  className?: string;
  /** Skips Lottie playback and just shows the static emoji glyph (prefers-reduced-motion). */
  reducedMotion?: boolean;
}

/**
 * Renders a real animated sticker for a mapped emoji, falling back to the
 * plain static glyph for unmapped emoji, on load failure, while the
 * animation is still loading, or when the viewer prefers reduced motion.
 */
export default function AnimatedSticker({ emoji, className, reducedMotion }: AnimatedStickerProps) {
  const codepoint = ANIMATED_STICKER_CODEPOINTS[emoji];
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!codepoint || reducedMotion || failed) {
    return <span className={className}>{emoji}</span>;
  }

  return (
    <span className={`relative inline-block ${className || ""}`}>
      {!ready && <span className="absolute inset-0 flex items-center justify-center">{emoji}</span>}
      <Lottie
        src={stickerUrl(codepoint)}
        loop
        autoplay
        className="w-full h-full"
        subscriptions={{
          ready: () => setReady(true),
          error: () => setFailed(true),
        }}
      />
    </span>
  );
}
