"use client";

import { Lottie } from "lottie-react";

/**
 * Full-body character stickers (not simple emoji glyphs) — vendored locally
 * from free, commercially-licensed LottieFiles animations. See
 * public/stickers/CREDITS.md for sources/license. Add more by dropping a
 * new .json into public/stickers/ and registering its name here.
 */
export const CHARACTER_STICKERS = ["panda-sleep", "panda-popcorn"] as const;
export type CharacterStickerName = (typeof CHARACTER_STICKERS)[number];

export interface CharacterStickerProps {
  name: CharacterStickerName | string;
  className?: string;
  reducedMotion?: boolean;
}

export default function CharacterSticker({ name, className, reducedMotion }: CharacterStickerProps) {
  if (reducedMotion || !CHARACTER_STICKERS.includes(name as CharacterStickerName)) {
    return null;
  }

  return <Lottie src={`/stickers/${name}.json`} loop autoplay className={className} />;
}
