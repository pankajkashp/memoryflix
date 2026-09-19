"use client";

import { useMemo } from "react";
import { useSceneEngine } from "@/lib/scene-engine/useSceneEngine";
import { resolveEntryScene, resolveNextScene } from "@/lib/scene-engine/sceneGraph";
import { SCENE_COMPONENT_REGISTRY } from "./sceneRegistry";
import { SceneFixedConfig } from "./types";

export interface BranchingExperiencePage {
  id: string;
  position: number;
  componentKey: string;
  fixedConfig: SceneFixedConfig;
  fieldValues: Record<string, any>;
}

interface BranchingExperiencePlayerProps {
  pages: BranchingExperiencePage[];
}

/**
 * Full-graph playback for a SCENE_* branching experience. Renders exactly
 * one scene at a time and routes onExit(choiceKey) through the pure
 * resolveNextScene() graph resolver.
 *
 * Deliberately does not accept (or key off) any "current index"/"anim key"
 * props from a parent tap-to-advance wrapper — see the wiring notes in
 * TemplateDetailClient.tsx / PublicStoryPlayerClient.tsx / StoryPreviewClient.tsx.
 */
export default function BranchingExperiencePlayer({ pages }: BranchingExperiencePlayerProps) {
  const scenes = useMemo(
    () =>
      pages
        .filter((p) => p.fixedConfig?.sceneId)
        .map((p) => ({
          sceneId: p.fixedConfig.sceneId,
          position: p.position,
          isEntry: p.fixedConfig.isEntry,
          next: p.fixedConfig.next,
          choices: p.fixedConfig.choices,
        })),
    [pages]
  );

  const pageBySceneId = useMemo(() => {
    const map = new Map<string, BranchingExperiencePage>();
    for (const p of pages) {
      if (p.fixedConfig?.sceneId) map.set(p.fixedConfig.sceneId, p);
    }
    return map;
  }, [pages]);

  const entrySceneId = useMemo(() => resolveEntryScene(scenes) || scenes[0]?.sceneId || "", [scenes]);
  const { scene: currentSceneId, goTo } = useSceneEngine<string>(entrySceneId);

  const currentPage = pageBySceneId.get(currentSceneId);

  if (!currentPage) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-zinc-400 text-sm">
        This experience has no scenes configured.
      </div>
    );
  }

  const SceneComponent = SCENE_COMPONENT_REGISTRY[currentPage.componentKey];

  if (!SceneComponent) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-zinc-400 text-sm">
        Scene &ldquo;{currentPage.componentKey}&rdquo; not recognized.
      </div>
    );
  }

  const handleExit = (choiceKey: string = "default") => {
    const next = resolveNextScene(scenes, currentSceneId, choiceKey);
    if (next) goTo(next);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <SceneComponent
        key={currentPage.id}
        fixedConfig={currentPage.fixedConfig}
        fieldValues={currentPage.fieldValues}
        onExit={handleExit}
      />
    </div>
  );
}
