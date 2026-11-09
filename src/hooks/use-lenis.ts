import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __lenis?: Lenis | null;
    __rafId?: number;
  }
}

/**
 * Initializes Lenis smooth scrolling, synced with GSAP ScrollTrigger.
 */
export function useLenis() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof window !== "undefined" && ("ontouchstart" in window || window.innerWidth < 768)) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    window.__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    function raf(time: number) {
      lenis.raf(time);
      window.__rafId = requestAnimationFrame(raf);
    }
    window.__rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(window.__rafId ?? 0);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);
}

/* ---- smooth scrollTo which prefers Lenis ---- */
export function scrollToId(target: string) {
  const el = document.querySelector(target) as HTMLElement | null;
  if (!el) return;
  const lenis = window.__lenis;
  if (lenis) {
    lenis.scrollTo(el, { offset: 0, duration: 1.2 });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}