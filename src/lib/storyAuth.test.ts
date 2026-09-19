import { describe, expect, it, vi, beforeEach } from "vitest";

const findUniqueMock = vi.fn();
vi.mock("@/lib/prisma", () => ({
  prisma: { story: { findUnique: (...args: unknown[]) => findUniqueMock(...args) } },
}));

const cookieStore = new Map<string, string>();
const cookiesMock = vi.fn(() => ({
  get: (name: string) => (cookieStore.has(name) ? { value: cookieStore.get(name) } : undefined),
  set: (name: string, value: string) => {
    cookieStore.set(name, value);
  },
}));
vi.mock("next/headers", () => ({
  cookies: () => cookiesMock(),
}));

import { assertStoryEditAccess, editAccessCookieName, grantStoryEditAccess } from "./storyAuth";

describe("assertStoryEditAccess", () => {
  const storyId = "story_1";

  beforeEach(() => {
    cookieStore.clear();
    findUniqueMock.mockReset();
  });

  it("rejects with 404 when the story doesn't exist", async () => {
    findUniqueMock.mockResolvedValue(null);
    const result = await assertStoryEditAccess(storyId);
    expect(result).toEqual({ ok: false, status: 404, error: "Story not found" });
  });

  it("rejects with 403 when there is no cookie at all (guessed/enumerated storyId)", async () => {
    findUniqueMock.mockResolvedValue({ id: storyId, editToken: "real-token", editTokenExpiresAt: null });
    const result = await assertStoryEditAccess(storyId);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(403);
  });

  it("rejects with 403 when the cookie holds the wrong token", async () => {
    findUniqueMock.mockResolvedValue({ id: storyId, editToken: "real-token", editTokenExpiresAt: null });
    cookieStore.set(editAccessCookieName(storyId), "wrong-token");
    const result = await assertStoryEditAccess(storyId);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(403);
  });

  it("rejects with 403 when the editToken has expired", async () => {
    findUniqueMock.mockResolvedValue({
      id: storyId,
      editToken: "real-token",
      editTokenExpiresAt: new Date(Date.now() - 1000),
    });
    cookieStore.set(editAccessCookieName(storyId), "real-token");
    const result = await assertStoryEditAccess(storyId);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(403);
  });

  it("grants access when the cookie holds the correct, unexpired token", async () => {
    const story = { id: storyId, editToken: "real-token", editTokenExpiresAt: null };
    findUniqueMock.mockResolvedValue(story);
    cookieStore.set(editAccessCookieName(storyId), "real-token");
    const result = await assertStoryEditAccess(storyId);
    expect(result).toEqual({ ok: true, story });
  });

  it("grants access when editTokenExpiresAt is in the future", async () => {
    const story = { id: storyId, editToken: "real-token", editTokenExpiresAt: new Date(Date.now() + 100000) };
    findUniqueMock.mockResolvedValue(story);
    cookieStore.set(editAccessCookieName(storyId), "real-token");
    const result = await assertStoryEditAccess(storyId);
    expect(result).toEqual({ ok: true, story });
  });

  it("grantStoryEditAccess mints a cookie that assertStoryEditAccess then accepts", async () => {
    const story = { id: storyId, editToken: "minted-token", editTokenExpiresAt: null };
    findUniqueMock.mockResolvedValue(story);
    await grantStoryEditAccess(story);
    const result = await assertStoryEditAccess(storyId);
    expect(result).toEqual({ ok: true, story });
  });
});
