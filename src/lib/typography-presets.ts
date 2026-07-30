
export type TypographyPresetId = 
  | "honeymoon"
  | "whispering_serif"
  | "dear_diary"
  | "blockbuster"
  | "cinema_marquee"
  | "polaroid"
  | "the_crown";

export type AccentColorId = "rose" | "gold" | "blue" | "red";

export interface TypographyPresetConfig {
  id: TypographyPresetId;
  name: string;
  emoji: string;
  fontId: string;
  heroStyle: string; // Tailwind classes for the main hero text
  chapterStyle: string; // Tailwind classes for the chapter text
}

export const TYPOGRAPHY_PRESETS: TypographyPresetConfig[] = [
  {
    id: "honeymoon",
    name: "Honeymoon",
    emoji: "❤️",
    fontId: "pacifico",
    heroStyle: "text-6xl md:text-8xl tracking-normal drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] lowercase",
    chapterStyle: "text-4xl md:text-6xl tracking-wide",
  },
  {
    id: "whispering_serif",
    name: "Whispering Serif",
    emoji: "🌙",
    fontId: "cormorant",
    heroStyle: "text-6xl md:text-8xl tracking-widest font-light italic text-white/90 drop-shadow-lg",
    chapterStyle: "text-4xl md:text-5xl tracking-widest font-light italic",
  },
  {
    id: "dear_diary",
    name: "Dear Diary",
    emoji: "📖",
    fontId: "dancing-script",
    heroStyle: "text-6xl md:text-8xl tracking-normal text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]",
    chapterStyle: "text-4xl md:text-5xl tracking-normal",
  },
  {
    id: "blockbuster",
    name: "Blockbuster",
    emoji: "🎬",
    fontId: "inter",
    heroStyle: "text-6xl md:text-9xl font-black tracking-tighter uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]",
    chapterStyle: "text-5xl md:text-7xl font-black tracking-tighter uppercase",
  },
  {
    id: "cinema_marquee",
    name: "Cinema Marquee",
    emoji: "🎞",
    fontId: "bebas-neue",
    heroStyle: "text-7xl md:text-[10rem] tracking-widest text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]",
    chapterStyle: "text-5xl md:text-8xl tracking-widest",
  },
  {
    id: "polaroid",
    name: "Polaroid",
    emoji: "📸",
    fontId: "quicksand",
    heroStyle: "text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-md",
    chapterStyle: "text-3xl md:text-5xl font-bold tracking-tight",
  },
  {
    id: "the_crown",
    name: "The Crown",
    emoji: "👑",
    fontId: "cinzel",
    heroStyle: "text-6xl md:text-8xl tracking-[0.2em] font-medium uppercase text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]",
    chapterStyle: "text-4xl md:text-5xl tracking-[0.2em] font-medium uppercase",
  },
];

export const ACCENT_COLORS = [
  { id: "rose", name: "Romantic", color: "bg-rose-500", text: "text-rose-500", border: "border-rose-500" },
  { id: "gold", name: "Wedding", color: "bg-amber-500", text: "text-amber-500", border: "border-amber-500" },
  { id: "blue", name: "Travel", color: "bg-blue-500", text: "text-blue-500", border: "border-blue-500" },
  { id: "red", name: "Netflix", color: "bg-red-600", text: "text-red-600", border: "border-red-600" },
];

export function getPresetConfig(presetId: string | null | undefined): TypographyPresetConfig {
  if (!presetId) return TYPOGRAPHY_PRESETS[3]; // Default to Blockbuster
  return TYPOGRAPHY_PRESETS.find(p => p.id === presetId) || TYPOGRAPHY_PRESETS[3];
}

export function getAccentConfig(accentId: string | null | undefined) {
  if (!accentId) return ACCENT_COLORS[3]; // Default to Netflix Red
  return ACCENT_COLORS.find(a => a.id === accentId) || ACCENT_COLORS[3];
}
