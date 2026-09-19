/**
 * sceneGraph — pure resolution logic for the data-driven branching-scene engine.
 *
 * A "scene graph" is the set of TemplatePageBlueprint rows for a branching
 * experience, each carrying a stable `sceneId` plus either a single `next`
 * exit or a set of `choices` (see SceneFixedConfig in scene-engine/types.ts).
 * This module contains no React/DOM code so it can be unit tested directly.
 */

export interface SceneGraphChoice {
  key: string;
  targetSceneId: string;
}

export interface SceneGraphNode {
  sceneId: string;
  position: number;
  next?: string;
  choices?: SceneGraphChoice[];
}

/**
 * Resolves the entry scene for a graph: the node explicitly flagged
 * `isEntry`, or otherwise the node with the lowest `position`.
 */
export function resolveEntryScene<T extends { sceneId: string; position: number; isEntry?: boolean }>(
  scenes: T[]
): string | null {
  if (scenes.length === 0) return null;
  const explicit = scenes.find((s) => s.isEntry);
  if (explicit) return explicit.sceneId;
  return [...scenes].sort((a, b) => a.position - b.position)[0].sceneId;
}

/**
 * Resolves the next scene id given the current scene and an exit key.
 *
 * Resolution order:
 * 1. If the current scene declares `choices`, match `exitKey` against a
 *    choice's `key` and follow its `targetSceneId`.
 * 2. Else if the current scene declares `next`, follow it regardless of
 *    `exitKey` (single-exit scenes should always call onExit("default")).
 * 3. Else fall back to the scene with the next-highest `position`.
 *
 * Returns null if there is nowhere to go (end of graph, or the current
 * scene id / a configured target doesn't exist in `scenes`).
 */
export function resolveNextScene(
  scenes: SceneGraphNode[],
  currentSceneId: string,
  exitKey: string
): string | null {
  const current = scenes.find((s) => s.sceneId === currentSceneId);
  if (!current) return null;

  const bySceneId = new Map(scenes.map((s) => [s.sceneId, s]));

  if (current.choices && current.choices.length > 0) {
    const choice = current.choices.find((c) => c.key === exitKey);
    if (!choice) return null;
    return bySceneId.has(choice.targetSceneId) ? choice.targetSceneId : null;
  }

  if (current.next) {
    return bySceneId.has(current.next) ? current.next : null;
  }

  const sorted = [...scenes].sort((a, b) => a.position - b.position);
  const idx = sorted.findIndex((s) => s.sceneId === currentSceneId);
  if (idx === -1 || idx === sorted.length - 1) return null;
  return sorted[idx + 1].sceneId;
}
