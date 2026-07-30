"use client";

/**
 * DashboardAnimations — Client-side GSAP animation controller for dashboard.
 *
 * Selects elements by data-gsap attributes and applies:
 * - Welcome heading entrance
 * - Stat cards slide-up + count-up (reads from data-count attr, avoids flash)
 * - Continue Editing card fade+scale
 * - Story cards grid scroll reveal
 * - Mouse parallax on ambient background gradients
 * - Magnetic FAB effect
 */

import { useEffect, useRef } from "react";
import { gsap, animateDashboard, animateCards, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap-utils";

export default function DashboardAnimations() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const dashContainer = document.querySelector<HTMLElement>("[data-dash-root]");
      if (dashContainer) {
        animateDashboard(dashContainer);
      }

      // ── Fix count-up: read from data-count attribute ──────────────────────
      // This prevents the "flash" where GSAP reads the server-rendered final
      // number and tries to animate from 0 to the same number (visible as a
      // number resetting). Instead we read the target from a data attribute.
      if (!reduced) {
        const statNums = document.querySelectorAll<HTMLElement>("[data-dash-stat-num]");
        statNums.forEach((el) => {
          const target = parseInt(el.dataset.count || el.textContent || "0", 10);
          if (isNaN(target)) return;
          el.textContent = "0";
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 1.4,
            delay: 0.4,
            ease: "power2.out",
            onUpdate() {
              el.textContent = Math.round(obj.val).toString();
            },
          });
        });
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

      // ── Mouse Parallax on ambient background gradients ────────────────────
      if (!reduced) {
        const gradients = document.querySelectorAll<HTMLElement>("[data-dash-root] .fixed.inset-0 > div:not(.absolute.inset-0.opacity-\\[0\\.03\\])");
        
        const handleMouseMove = (e: MouseEvent) => {
          const { clientX, clientY } = e;
          const xPercent = (clientX / window.innerWidth - 0.5) * 2;
          const yPercent = (clientY / window.innerHeight - 0.5) * 2;

          gradients.forEach((el, i) => {
            const factor = i === 0 ? 1 : -1;
            gsap.to(el, {
              x: xPercent * 25 * factor,
              y: yPercent * 20 * factor,
              duration: 1.2,
              ease: "power2.out",
              overwrite: "auto",
            });
          });
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        // Store cleanup reference
        (window as Window & { __mfParallaxCleanup?: () => void }).__mfParallaxCleanup = () =>
          window.removeEventListener("mousemove", handleMouseMove);
      }

      // ── Magnetic Elements ──────────────────────────────────────────────────────
      if (!reduced) {
        const magneticElements = document.querySelectorAll<HTMLElement>("[data-gsap-magnetic]");
        if (magneticElements.length > 0) {
          const mm = gsap.matchMedia();
          mm.add("(min-width: 768px)", () => {
            const cleanups: (() => void)[] = [];
            
            magneticElements.forEach((el) => {
              const onEnter = (e: MouseEvent) => {
                const rect = el.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = (e.clientX - cx) * 0.35;
                const dy = (e.clientY - cy) * 0.35;
                gsap.to(el, { x: dx, y: dy, duration: 0.3, ease: "power2.out" });
              };
              const onLeave = () => {
                gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });
              };
              el.addEventListener("mousemove", onEnter as EventListener);
              el.addEventListener("mouseleave", onLeave);
              
              cleanups.push(() => {
                el.removeEventListener("mousemove", onEnter as EventListener);
                el.removeEventListener("mouseleave", onLeave);
              });
            });

            return () => {
              cleanups.forEach((cleanup) => cleanup());
            };
          });
        }
      }
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      const win = window as Window & { __mfParallaxCleanup?: () => void };
      if (win.__mfParallaxCleanup) {
        win.__mfParallaxCleanup();
        delete win.__mfParallaxCleanup;
      }
    };
  }, []);

  return null; // Render-nothing controller component
}
