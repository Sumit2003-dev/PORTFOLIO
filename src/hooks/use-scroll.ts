import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Fades section content upward as it enters the viewport.
 * Call inside a component after render, passing the section root.
 */
export function useFadeUp(ref: React.RefObject<HTMLElement>, deps: React.DependencyList = []) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const items = el.querySelectorAll("[data-reveal]");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
          },
        }
      );
    }, el);

    /*
     * Fail-safe: if a reveal ever fails to fire while its section is already on
     * screen, force the content visible so no text is permanently hidden by the
     * initial opacity:0 state.
     */
    const t = window.setTimeout(() => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      let changed = false;
      el.querySelectorAll("[data-reveal]").forEach((item) => {
        const it = item as HTMLElement;
        const r = it.getBoundingClientRect();
        if (r.top >= vh || r.bottom <= 0) return;
        const opacity = gsap.getProperty(it, "opacity") as number | undefined;
        if (opacity !== undefined && opacity < 0.99) {
          gsap.set(it, { opacity: 1, y: 0, clearProps: "transform" });
          changed = true;
        }
      });
      if (changed) ScrollTrigger.refresh();
    }, 2500);

    return () => {
      ctx.revert();
      window.clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Animated number counter that starts when scrolled into view.
 */
export function useCounter(
  end: number,
  duration = 1.6,
  start = true
) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ctx: gsap.Context | null = null;

    if (start) {
      ctx = gsap.context(() => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: end,
          duration,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            once: true,
          },
          onUpdate: () => {
            el.textContent = String(Math.round(obj.val));
          },
        });
      }, el);
    } else {
      el.textContent = String(end);
    }

    return () => ctx?.revert();
     
  }, [end, duration, start]);

  return ref;
}

/**
 * Parallax hook: element translates slower than scroll.
 */
export function useParallax(ref: React.RefObject<HTMLElement | null>, factor = 0.25) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [factor]);
}

/** Image clip-path mask reveal on scroll. */
export function useImageReveal(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { clipPath: "inset(0 0 100% 0)", y: 40 },
        {
          clipPath: "inset(0 0 0% 0)",
          y: 0,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        }
      );
      const img = el.querySelector("img");
      if (img) {
        gsap.fromTo(
          img,
          { scale: 1.25 },
          {
            scale: 1,
            duration: 1.6,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          }
        );
      }
    }, el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}