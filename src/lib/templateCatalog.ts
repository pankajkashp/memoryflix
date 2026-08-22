export const templateCatalog = [
  { slug: "our-little-story", name: "Our Little Story", category: "love" },
  { slug: "a-little-surprise", name: "A Little Surprise", category: "celebration" },
  { slug: "the-journey", name: "The Journey", category: "travel" },
  { slug: "our-day", name: "Our Day", category: "celebration" },
  { slug: "chaos-memories", name: "Chaos & Memories", category: "memory" },
  { slug: "home", name: "Home", category: "love" },
  { slug: "the-next-chapter", name: "The Next Chapter", category: "milestone" },
  { slug: "pages", name: "Pages", category: "story" },
  { slug: "little-magic", name: "Little Magic", category: "storybook" },
  { slug: "the-film", name: "The Film", category: "cinematic" },
  { slug: "memory-box", name: "Memory Box", category: "archive" },
] as const;

export const templateSlugMap = {
  "our-story": "our-little-story",
  "birthday-magic": "a-little-surprise",
  "birthday-cinematic": "a-little-surprise",
  "travel-journey": "the-journey",
  "surprise": "a-little-surprise",
  "our-day": "our-day",
  "chaos-and-memories": "chaos-memories",
  "chaos-memories": "chaos-memories",
  "the-next-chapter": "the-next-chapter",
  "graduation": "the-next-chapter",
  "graduation-story": "the-next-chapter",
  "little-magic": "little-magic",
  "magic-story": "little-magic",
  "memory-box": "memory-box",
  "the-film": "the-film",
  "pages": "pages",
  "home": "home",
} as const;

export const immersiveTemplateSlugs: Set<string> = new Set(
  templateCatalog.map((template) => template.slug)
);

export function resolveTemplateSlug(slug?: string | null): string {
  if (!slug) return "";

  const normalized = slug.trim().toLowerCase();
  return templateSlugMap[normalized as keyof typeof templateSlugMap] ?? normalized;
}

export function isImmersiveTemplateSlug(slug?: string | null): boolean {
  return immersiveTemplateSlugs.has(resolveTemplateSlug(slug));
}
