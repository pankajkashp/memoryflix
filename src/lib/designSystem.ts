/**
 * MemoryFlix design system — "storybook magic" direction: fairy-tale +
 * kawaii + romantic scrapbook. Light backgrounds only; no dark/neon UI.
 *
 * Approved color family (nothing outside this list, except status/a11y
 * colors where truly required): warm ivory/cream, blush/petal pink,
 * rose/deep rose, peach/apricot, lavender/lilac, mauve/dusty rose,
 * champagne/soft gold, berry/plum, and — only for playful templates —
 * soft mint/seafoam.
 *
 * Color role ratios to keep the UI feeling bright and dimensional rather
 * than washed out (apply per-screen, not per-component):
 *   ~60% light warm background   (cream/ivory/blush base)
 *   ~25% secondary pastel/mid-tone surfaces (cards, panels, chips)
 *   ~10% vivid accent            (primary buttons, active states, links)
 *    ~5% deep contrast           (headings, icons that need to pop, borders of emphasis)
 *
 * Three layers:
 *  1. `CHROME` — the app shell palette (nav, footer, marketing pages, the
 *     builder UI). One coordinated palette used everywhere that isn't a
 *     specific gift template.
 *  2. `OCCASION_PALETTES` — one coordinated palette per occasion, for the
 *     gift templates themselves. Deliberately distinct from each other so
 *     occasions don't all end up looking like the same reskinned page.
 *  3. `BUTTON_PRESETS` — ready-made background+text combinations so buttons
 *     never fall back to generic black/white.
 */

export const CHROME = {
  background: "#FFF8F2", // warm ivory — main background (60%)
  surface: "#FFFDFB", // near-white card surface (25%)
  surfaceAlt: "#FDEFE6", // soft peach panel (25%)
  border: "#F3DEE2", // blush border
  textPrimary: "#3B2436", // deep plum-berry ink — body text
  textMuted: "#8B6B7A", // dusty mauve — secondary text
  accent: "#E85D75", // berry-rose — primary actions (10%)
  accentSoft: "#F7C9CF", // blush pink
  accentDeep: "#B9425C", // deeper berry (hover/active, 5% deep contrast)
  secondary: "#B79FD1", // lavender
  gold: "#E9C989", // champagne — premium/decorative accents
  coral: "#FF9E7D", // soft coral
  plum: "#3A2340", // deep plum — headings needing max contrast (5%)
  shadow: "rgba(178, 110, 120, 0.22)",
} as const;

export type OccasionId = "birthday" | "anniversary" | "proposal" | "friendship" | "specialGift";

export interface OccasionPalette {
  id: OccasionId;
  name: string;
  mood: string;
  background: string;
  surface: string;
  textPrimary: string;
  textMuted: string;
  /** Vivid mid-tone accent — primary buttons / highlights (~10%). */
  accent: string;
  accentSoft: string;
  /** Second coordinated hue that keeps the palette from feeling one-note. */
  secondary: string;
  /** Berry/plum deep-contrast tone for headings & fine details (~5%). */
  deepAccent: string;
  gradient: string;
}

export const OCCASION_PALETTES: Record<OccasionId, OccasionPalette> = {
  birthday: {
    id: "birthday",
    name: "Birthday",
    mood: "Playful celebration — Cream + Peach + Petal Pink + Rose + Gold",
    background: "#FFF6EA",
    surface: "#FFFBF3",
    textPrimary: "#4A2C2A",
    textMuted: "#9C7362",
    accent: "#FF7DA6", // hot petal pink
    accentSoft: "#FFD9BE", // peach
    secondary: "#F4B942", // gold
    deepAccent: "#C23B63", // rose/berry
    gradient: "linear-gradient(135deg, #FFD9BE 0%, #FF7DA6 55%, #F4B942 100%)",
  },
  anniversary: {
    id: "anniversary",
    name: "Anniversary",
    mood: "Romantic scrapbook — Ivory + Blush + Dusty Rose + Deep Rose + Champagne",
    background: "#FFF7F5",
    surface: "#FFFCFB",
    textPrimary: "#4B2A34",
    textMuted: "#A9808B",
    accent: "#D9556F", // deep rose
    accentSoft: "#F6D3DA", // blush
    secondary: "#B98A93", // dusty rose
    deepAccent: "#7A2E43",
    gradient: "linear-gradient(135deg, #F6D3DA 0%, #D9556F 55%, #E9C989 100%)",
  },
  proposal: {
    id: "proposal",
    name: "Proposal",
    mood: "Cinematic fantasy — Ivory + Lavender + Lilac + Berry/Plum + Soft Gold",
    background: "#F7F2FA",
    surface: "#FDFBFF",
    textPrimary: "#3A2E4A",
    textMuted: "#8B7BA0",
    accent: "#9B7BC7", // lilac
    accentSoft: "#DDD0EC", // lavender
    secondary: "#E9C989", // soft gold
    deepAccent: "#4A2159", // berry/plum
    gradient: "linear-gradient(135deg, #DDD0EC 0%, #9B7BC7 55%, #E9C989 100%)",
  },
  friendship: {
    id: "friendship",
    name: "Friendship",
    mood: "Playful messy scrapbook — Cream + Peach + Pink + Lavender + occasional Seafoam",
    background: "#FFF3E8",
    surface: "#FFFAF3",
    textPrimary: "#4A3428",
    textMuted: "#A5836C",
    accent: "#FF9E7D", // peach-coral
    accentSoft: "#FFE0C7", // peach
    secondary: "#C9A8E0", // lavender
    deepAccent: "#8C4A6B",
    gradient: "linear-gradient(135deg, #FFE0C7 0%, #FF9E7D 45%, #C9A8E0 100%)",
  },
  specialGift: {
    id: "specialGift",
    name: "Special Gift",
    mood: "Mysterious, elegant reveal — Warm Ivory + Rose + Mauve + Lavender + Champagne",
    background: "#FBF3EF",
    surface: "#FFFBF7",
    textPrimary: "#4A2E3B",
    textMuted: "#957685",
    accent: "#C2517A", // rose
    accentSoft: "#E7CBD6", // mauve
    secondary: "#B79FD1", // lavender
    deepAccent: "#5C2A45",
    gradient: "linear-gradient(135deg, #E7CBD6 0%, #C2517A 50%, #E9C989 100%)",
  },
};

/** Optional soft mint/seafoam accent — only for selected playful templates (e.g. Friendship). */
export const SEAFOAM_ACCENT = "#8FD4C1";

export function getOccasionPalette(id: string | null | undefined): OccasionPalette {
  return OCCASION_PALETTES[(id as OccasionId) || "birthday"] || OCCASION_PALETTES.birthday;
}

/** Ready-made button color combinations — never fall back to plain black/white. */
export const BUTTON_PRESETS = {
  roseCream: { background: "#E85D75", text: "#FFFBF7" },
  berryIvory: { background: "#7A2E43", text: "#FFF8F2" },
  lavenderPlum: { background: "#B79FD1", text: "#3A2E4A" },
  peachDeepRose: { background: "#FFB199", text: "#7A2E43" },
  champagneBerry: { background: "#E9C989", text: "#5C2A45" },
} as const;
