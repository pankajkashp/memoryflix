import { FixedPageConfig } from "@/lib/pageAnimations";

/**
 * fixedConfig shape for a SCENE_* componentKey row. Extends the shared
 * FixedPageConfig (colors/texture) with the graph-routing fields that make
 * a TemplatePageBlueprint row one node of a branching-scene experience.
 *
 * `next` / `choices[].targetSceneId` reference another row's `sceneId`
 * (a stable, seed-time string), never a Prisma cuid, so seed data stays
 * portable across environments.
 */
export interface SceneFixedConfig extends FixedPageConfig {
  /** Stable id for this scene, unique within the template. */
  sceneId: string;
  /** Marks the graph's entry point. Exactly one row per template should set this. */
  isEntry?: boolean;
  /** Single-exit target sceneId, used when the scene has no `choices`. */
  next?: string;
  /** Multi-choice routing (e.g. Yes/No). */
  choices?: Array<{ key: string; label: string; targetSceneId: string }>;
  /** Visual/interaction skin knob, e.g. "wax-seal" | "ribboned-boxes" | "glowing-orbs" | "paper-confetti" | "neon-burst". */
  animationPreset?: string;
  /** e.g. number of gift boxes for SCENE_GIFT_PICKER. */
  itemCount?: number;
}

export interface SceneProps {
  fixedConfig: SceneFixedConfig;
  fieldValues: Record<string, any>;
  /** Called when the scene is done. Pass a choice key ("yes"/"no") for choice scenes, or omit/"default" for single-exit scenes. */
  onExit: (choiceKey?: string) => void;
}
