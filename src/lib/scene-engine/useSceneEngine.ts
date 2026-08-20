/**
 * useSceneEngine — Core state machine for interactive template experiences.
 *
 * Manages:
 * - Active scene ID
 * - Transition guard (prevents double-firing)
 * - Reduced-motion detection
 * - Optional history stack for "go back" support
 */

import { useState, useCallback, useEffect, useRef } from "react";

export interface SceneEngineOptions {
  /** Delay (ms) between old scene unmounting and new scene mounting.
   *  Gives the exit animation time to play before React removes the node.
   *  Scenes should complete their exit within this window.
   *  Default: 60ms (enough for 1 RAF cycle to register exit tween) */
  transitionDelay?: number;
}

export interface SceneEngine<TScene extends string> {
  scene: TScene;
  goTo: (next: TScene) => void;
  goBack: () => void;
  isTransitioning: boolean;
  reducedMotion: boolean;
  history: TScene[];
}

export function useSceneEngine<TScene extends string>(
  initialScene: TScene,
  options: SceneEngineOptions = {}
): SceneEngine<TScene> {
  const { transitionDelay = 60 } = options;

  const [scene, setScene] = useState<TScene>(initialScene);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const historyRef = useRef<TScene[]>([initialScene]);
  const [historySnapshot, setHistorySnapshot] = useState<TScene[]>([initialScene]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const goTo = useCallback(
    (next: TScene) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      const delay = reducedMotion ? 0 : transitionDelay;
      setTimeout(() => {
        historyRef.current = [...historyRef.current, next];
        setHistorySnapshot([...historyRef.current]);
        setScene(next);
        setIsTransitioning(false);
      }, delay);
    },
    [isTransitioning, reducedMotion, transitionDelay]
  );

  const goBack = useCallback(() => {
    if (isTransitioning || historyRef.current.length < 2) return;
    setIsTransitioning(true);
    const delay = reducedMotion ? 0 : transitionDelay;
    setTimeout(() => {
      const newHistory = historyRef.current.slice(0, -1);
      const prev = newHistory[newHistory.length - 1];
      historyRef.current = newHistory;
      setHistorySnapshot([...newHistory]);
      setScene(prev);
      setIsTransitioning(false);
    }, delay);
  }, [isTransitioning, reducedMotion, transitionDelay]);

  return { scene, goTo, goBack, isTransitioning, reducedMotion, history: historySnapshot };
}
