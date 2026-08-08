import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Initializes Lenis smooth scrolling, synced with GSAP ScrollTrigger.
 */
export function useLenis() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    (window as any).__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    function raf(time: number) {
      lenis.raf(time * 1000);
      (window as any).__rafId = requestAnimationFrame(raf);
    }
    (window as any).__rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame((window as any).__rafId);
      lenis.destroy();
      (window as any).__lenis = null;
    };
  }, []);
}

/* ---- smooth scrollTo which prefers Lenis ---- */
export function scrollToId(target: string) {
  const el = document.querySelector(target) as HTMLElement | null;
  if (!el) return;
  const lenis = (window as any).__lenis;
  if (lenis) {
    lenis.scrollTo(el, { offset: 0, duration: 1.2 });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}