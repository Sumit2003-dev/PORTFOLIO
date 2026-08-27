import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const bufRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bufRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelector(".line"),
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "center center", scrub: true },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  const back = () => {
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-[#071018]">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-10">
        {/* animated divider */}
        <div ref={bufRef} className="mb-12 h-px w-full origin-left bg-gradient-to-r from-ember-500 via-ember-500/30 to-transparent">
          <div className="line h-px w-full" />
        </div>

        <div className="flex flex-col items-start gap-10 md:flex-row md:items-center md:justify-between">
          <div>
            <button onClick={back} className="group flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary font-display text-2xl text-[#1a0e04] shadow-glow transition-transform group-hover:scale-105">
                S
              </span>
              <span className="font-condensed uppercase tracking-[0.2em] text-white/70">
                Sumit <span className="text-ember-500">Kumar</span>
              </span>
            </button>
            <p className="mt-3 max-w-xs text-sm text-white/40">
              Data Scientist & AI Engineer crafting cinematic intelligence.
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm text-white/50">
            <a href="https://github.com/Sumit2003-dev" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ember-500">GitHub</a>
            <a href="https://www.linkedin.com/in/sumit2003-dev/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ember-500">LinkedIn</a>
            <a href="mailto:sumit.ku5981@gmail.com" className="transition-colors hover:text-ember-500">Email</a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 text-xs text-white/35 sm:flex-row">
          <p>© {new Date().getFullYear()} Sumit Kumar. All rights reserved.</p>
          <button onClick={back} className="flex items-center gap-2 transition-colors hover:text-ember-500">
            Back to top <span aria-hidden>↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}