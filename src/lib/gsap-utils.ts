/**
 * MemoryFlix — GSAP Animation Utilities
 *
 * Central module for all GSAP animations.
 * Registers plugins once and exports reusable functions.
 * All animations use only transform + opacity (GPU-accelerated).
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { GSAP_CONFIG } from "./gsapConfig";

// ── Plugin Registration (idempotent) ──────────────────────────────────────────
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, Flip);
}

// ── Reduced Motion Check ──────────────────────────────────────────────────────
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// ── Breakpoint Helpers ────────────────────────────────────────────────────────
export const breakpoints = {
  desktop: "(min-width: 1024px)",
  tablet: "(min-width: 640px) and (max-width: 1023px)",
  mobile: "(max-width: 639px)",
};


// ── 2. CARDS SCROLL REVEAL ────────────────────────────────────────────────────
// Scroll-triggered fade + translateY stagger for any card grid.
export function animateCards(
  container: HTMLElement,
  selector = "[data-gsap-card]"
) {
  const reduced = prefersReducedMotion();
  const cards = container.querySelectorAll<HTMLElement>(selector);
  if (!cards.length) return;

  const mm = gsap.matchMedia();

  mm.add(breakpoints.desktop, () => {
    gsap.fromTo(
      cards,
      { opacity: 0, y: reduced ? 0 : 48, scale: reduced ? 1 : 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: GSAP_CONFIG.duration.enter,
        stagger: GSAP_CONFIG.duration.stagger,
        ease: GSAP_CONFIG.ease,
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          once: true,
        },
      }
    );
  });

  mm.add(breakpoints.tablet, () => {
    gsap.fromTo(
      cards,
      { opacity: 0, y: reduced ? 0 : 28 },
      {
        opacity: 1,
        y: 0,
        duration: GSAP_CONFIG.duration.enter,
        stagger: GSAP_CONFIG.duration.stagger,
        ease: GSAP_CONFIG.ease,
        scrollTrigger: {
          trigger: container,
          start: "top 88%",
          once: true,
        },
      }
    );
  });

  mm.add(breakpoints.mobile, () => {
    gsap.fromTo(
      cards,
      { opacity: 0, y: reduced ? 0 : 16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container,
          start: "top 90%",
          once: true,
        },
      }
    );
  });
}

// ── 3. DASHBOARD ANIMATION ────────────────────────────────────────────────────
// Stat count-up + slide-up cards + continue-story card entrance.
export function animateDashboard(container: HTMLElement) {
  const reduced = prefersReducedMotion();
  const tl = gsap.timeline({ defaults: { ease: GSAP_CONFIG.ease } });

  // Welcome heading
  const heading = container.querySelector<HTMLElement>("[data-dash-heading]");
  if (heading) {
    tl.fromTo(
      heading,
      { opacity: 0, y: reduced ? 0 : 24 },
      { opacity: 1, y: 0, duration: 0.6 },
      0
    );
  }

  // Stat cards
  const statCards = container.querySelectorAll<HTMLElement>("[data-dash-stat]");
  if (statCards.length) {
    tl.fromTo(
      statCards,
      { opacity: 0, y: reduced ? 0 : 32, scale: reduced ? 1 : 0.94 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: "back.out(1.4)",
      },
      reduced ? 0 : 0.2
    );

    // Count-up for stat numbers
    if (!reduced) {
      statCards.forEach((card) => {
        const numEl = card.querySelector<HTMLElement>("[data-dash-stat-num]");
        if (!numEl) return;
        const target = parseInt(numEl.textContent || "0", 10);
        if (isNaN(target) || target === 0) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.2,
          delay: 0.4,
          ease: "power2.out",
          onUpdate() {
            numEl.textContent = Math.round(obj.val).toString();
          },
        });
      });
    }
  }

  // Continue editing card
  const continueCard = container.querySelector<HTMLElement>("[data-dash-continue]");
  if (continueCard) {
    tl.fromTo(
      continueCard,
      { opacity: 0, y: reduced ? 0 : 20, scale: reduced ? 1 : 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.65 },
      reduced ? 0 : 0.45
    );
  }

  return tl;
}


// ── 5. CHAPTER REVEAL ────────────────────────────────────────────────────────
// Chapter cards reveal one-by-one on scroll.
export function animateChapterReveal(container: HTMLElement) {
  const reduced = prefersReducedMotion();
  const cards = container.querySelectorAll<HTMLElement>("[data-chapter-card]");
  if (!cards.length) return;

  const mm = gsap.matchMedia();

  mm.add(breakpoints.desktop, () => {
    gsap.fromTo(
      cards,
      { opacity: 0, y: reduced ? 0 : 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container,
          start: "top 82%",
          once: true,
        },
      }
    );
  });

  mm.add(breakpoints.tablet, () => {
    gsap.fromTo(
      cards,
      { opacity: 0, y: reduced ? 0 : 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          once: true,
        },
      }
    );
  });

  mm.add(breakpoints.mobile, () => {
    gsap.fromTo(
      cards,
      { opacity: 0, y: reduced ? 0 : 14 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container,
          start: "top 88%",
          once: true,
        },
      }
    );
  });
}

// ── 6. MEMORY GRID ANIMATIONS ─────────────────────────────────────────────────

/** Masonry: scale + opacity + subtle rotate stagger (random delays) */
export function animateMasonryGrid(container: HTMLElement) {
  const reduced = prefersReducedMotion();
  const items = container.querySelectorAll<HTMLElement>("[data-masonry-item]");
  if (!items.length) return;

  gsap.fromTo(
    items,
    {
      opacity: 0,
      scale: reduced ? 1 : 0.88,
      rotation: reduced
        ? 0
        : () => (Math.random() - 0.5) * 4,
    },
    {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: reduced ? 0.35 : 0.7,
      stagger: {
        amount: reduced ? 0.2 : 0.6,
        from: "random",
      },
      ease: "power3.out",
      scrollTrigger: {
        trigger: container,
        start: "top 85%",
        once: true,
      },
    }
  );
}

/** Timeline layout: left/right alternating slides + line growth */
export function animateTimelineGrid(container: HTMLElement) {
  const reduced = prefersReducedMotion();
  const items = container.querySelectorAll<HTMLElement>("[data-timeline-item]");
  const line = container.querySelector<HTMLElement>("[data-timeline-line]");

  if (line && !reduced) {
    gsap.fromTo(
      line,
      { scaleY: 0, transformOrigin: "top center" },
      {
        scaleY: 1,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 0.5,
        },
      }
    );
  }

  items.forEach((item, idx) => {
    const fromLeft = idx % 2 === 0;
    gsap.fromTo(
      item,
      {
        opacity: 0,
        x: reduced ? 0 : (fromLeft ? -48 : 48),
      },
      {
        opacity: 1,
        x: 0,
        duration: reduced ? 0.35 : 0.65,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 88%",
          once: true,
        },
      }
    );
  });
}

/** Polaroid layout: fly in from various directions then settle */
export function animatePolaroidGrid(container: HTMLElement) {
  const reduced = prefersReducedMotion();
  const items = container.querySelectorAll<HTMLElement>("[data-polaroid-item]");
  if (!items.length) return;

  const directions = [
    { x: -80, y: -60 },
    { x: 80, y: -40 },
    { x: -60, y: 80 },
    { x: 60, y: 60 },
    { x: 0, y: -80 },
    { x: -80, y: 0 },
  ];

  items.forEach((item, idx) => {
    const dir = directions[idx % directions.length];
    gsap.fromTo(
      item,
      {
        opacity: 0,
        x: reduced ? 0 : dir.x,
        y: reduced ? 0 : dir.y,
        scale: reduced ? 1 : 0.7,
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: reduced ? 0.35 : 0.75,
        delay: idx * (reduced ? 0.03 : 0.08),
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          once: true,
        },
      }
    );
  });
}

/** Film strip: items slide in from right */
export function animateFilmStrip(container: HTMLElement) {
  const reduced = prefersReducedMotion();
  const items = container.querySelectorAll<HTMLElement>("[data-filmstrip-item]");
  if (!items.length) return;

  gsap.fromTo(
    items,
    { opacity: 0, x: reduced ? 0 : 64 },
    {
      opacity: 1,
      x: 0,
      duration: reduced ? 0.35 : 0.6,
      stagger: reduced ? 0.04 : 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: container,
        start: "top 88%",
        once: true,
      },
    }
  );
}


// ── 9. PAGE TRANSITION (entrance) ────────────────────────────────────────────
export function animatePageEntrance(container: HTMLElement) {
  const reduced = prefersReducedMotion();
  gsap.fromTo(
    container,
    {
      opacity: 0,
      y: reduced ? 0 : 20,
      filter: reduced ? "none" : "blur(4px)",
    },
    {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: reduced ? 0.3 : 0.65,
      ease: "power3.out",
      clearProps: "filter",
    }
  );
}

// Re-export GSAP + plugins for direct use in components
export { gsap, ScrollTrigger };
