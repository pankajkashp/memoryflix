"use client";

/**
 * DashboardAnimations — Client-side GSAP animation controller for dashboard.
 *
 * Selects elements by data-gsap attributes and applies:
 * - Welcome heading entrance
 * - Stat cards slide-up + count-up
 * - Continue Editing card fade+scale
 * - Story cards grid scroll reveal
 */

import { useEffect, useRef } from "react";
import { gsap, animateDashboard, animateCards, ScrollTrigger } from "@/lib/gsap-utils";

export default function DashboardAnimations() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const ctx = gsap.context(() => {
      const dashContainer = document.querySelector<HTMLElement>("[data-dash-root]");
      if (dashContainer) {
        animateDashboard(dashContainer);
      }

      const cardsContainer = document.querySelector<HTMLElement>("[data-story-grid]");
      if (cardsContainer) {
        animateCards(cardsContainer, "[data-gsap-card]");
      }

      // Rotating quote fade in
      const quote = document.querySelector<HTMLElement>("[data-dash-quote]");
      if (quote) {
        gsap.fromTo(
          quote,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: quote,
              start: "top 88%",
              once: true,
            },
          }
        );
      }

      // Section heading
      const storiesHeading = document.querySelector<HTMLElement>("[data-dash-stories-heading]");
      if (storiesHeading) {
        gsap.fromTo(
          storiesHeading,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.55,
            ease: "power3.out",
            scrollTrigger: {
              trigger: storiesHeading,
              start: "top 88%",
              once: true,
            },
          }
        );
      }
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return null; // Render-nothing controller component
}
