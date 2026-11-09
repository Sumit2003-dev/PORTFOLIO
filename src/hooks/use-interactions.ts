import { useEffect, useRef } from "react";

/**
 * Magnetic pull: the wrapped element drifts toward the cursor and
 * springs back when the pointer leaves.
 * Pass a range (px) to control the maximum travel.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.35, range = 28) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let raf = 0;
    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;

    const render = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(render);
    };

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > range) {
        tx = 0;
        ty = 0;
        return;
      }
      const strengthNow = strength * (1 - dist / range);
      tx = dx * strengthNow;
      ty = dy * strengthNow;
    };

    const onLeave = () => {
      tx = 0;
      ty = 0;
    };

    render();
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      el.style.transform = "";
    };
  }, [strength, range]);

  return ref;
}

/**
 * 3D tilt that rotates a card toward the cursor, keeping a wrapper stationary
 * so the layout stays stable. Reset on leave.
 */
export function useTilt<T extends HTMLElement>(max = 10) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let raf = 0;
    const render = () => raf = requestAnimationFrame(render);

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rx = (0.5 - py) * max;
      const ry = (px - 0.5) * max;
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    };

    const onLeave = () => {
      el.style.transition = "transform 0.6s cubic-bezier(0.22,1,0.36,1)";
      el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
      setTimeout(() => { el.style.transition = ""; }, 600);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      el.style.transform = "";
    };
  }, [max]);

  return ref;
}