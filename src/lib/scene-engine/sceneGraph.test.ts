import { describe, expect, it } from "vitest";
import { resolveEntryScene, resolveNextScene, SceneGraphNode } from "./sceneGraph";

describe("resolveEntryScene", () => {
  it("returns the scene explicitly flagged isEntry", () => {
    const scenes = [
      { sceneId: "a", position: 2 },
      { sceneId: "b", position: 1, isEntry: true },
    ];
    expect(resolveEntryScene(scenes)).toBe("b");
  });

  it("falls back to the lowest position when nothing is flagged isEntry", () => {
    const scenes = [
      { sceneId: "a", position: 2 },
      { sceneId: "b", position: 1 },
    ];
    expect(resolveEntryScene(scenes)).toBe("b");
  });

  it("returns null for an empty graph", () => {
    expect(resolveEntryScene([])).toBeNull();
  });
});

describe("resolveNextScene", () => {
  const graph: SceneGraphNode[] = [
    { sceneId: "envelope", position: 1, next: "question" },
    {
      sceneId: "question",
      position: 2,
      choices: [
        { key: "yes", targetSceneId: "accept" },
        { key: "no", targetSceneId: "reaction" },
      ],
    },
    { sceneId: "reaction", position: 3, next: "question" },
    { sceneId: "accept", position: 4, next: "finale" },
    { sceneId: "finale", position: 5 },
  ];

  it("follows a single-exit scene's next regardless of exitKey", () => {
    expect(resolveNextScene(graph, "envelope", "default")).toBe("question");
  });

  it("resolves a choice scene's target by exitKey", () => {
    expect(resolveNextScene(graph, "question", "yes")).toBe("accept");
    expect(resolveNextScene(graph, "question", "no")).toBe("reaction");
  });

  it("returns null for an unrecognized exitKey on a choice scene", () => {
    expect(resolveNextScene(graph, "question", "maybe")).toBeNull();
  });

  it("supports looping back to an earlier scene", () => {
    expect(resolveNextScene(graph, "reaction", "default")).toBe("question");
  });

  it("falls back to the next-highest position when neither next nor choices is set", () => {
    const linear: SceneGraphNode[] = [
      { sceneId: "one", position: 1 },
      { sceneId: "two", position: 2 },
      { sceneId: "three", position: 3 },
    ];
    expect(resolveNextScene(linear, "one", "default")).toBe("two");
    expect(resolveNextScene(linear, "two", "default")).toBe("three");
  });

  it("returns null when the position-fallback scene is the last one", () => {
    expect(resolveNextScene(graph, "finale", "default")).toBeNull();
  });

  it("returns null when the current scene id isn't in the graph", () => {
    expect(resolveNextScene(graph, "nonexistent", "default")).toBeNull();
  });

  it("returns null when a scene's next points at a scene id that doesn't exist", () => {
    const broken: SceneGraphNode[] = [{ sceneId: "a", position: 1, next: "ghost" }];
    expect(resolveNextScene(broken, "a", "default")).toBeNull();
  });

  it("returns null when a choice's targetSceneId doesn't exist", () => {
    const broken: SceneGraphNode[] = [
      { sceneId: "a", position: 1, choices: [{ key: "yes", targetSceneId: "ghost" }] },
    ];
    expect(resolveNextScene(broken, "a", "yes")).toBeNull();
  });
});
