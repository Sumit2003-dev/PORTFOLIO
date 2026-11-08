import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { useParallax } from "@/hooks/use-scroll";

type SectionProps = {
  id: string;
  word: string;
  children: ReactNode;
  inverted?: boolean;
};

/**
 * Full-width cinematic section with a massive background title.
 */
export default function Section({ id, word, children, inverted = false }: SectionProps) {
  const wordRef = useRef<HTMLDivElement>(null);
  useParallax(wordRef, 0.3);

  useEffect(() => {
    const el = wordRef.current;
    if (!el) return;
    const fit = () => {
      const chars = word.length;
      if (chars < 1) return;
      const vw = window.innerWidth;
      const px = Math.max(Math.floor(vw / (chars * 0.6)), 48);
      el.style.fontSize = `${px}px`;
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [word]);

  return (
    <section
      id={id}
      className={`relative min-h-screen scroll-mt-20 overflow-hidden py-20 sm:py-28 lg:py-32 ${
        inverted ? "bg-[#0D1117]" : "bg-transparent"
      }`}
    >
      {/* Background typography */}
      <div
        ref={wordRef}
        className="giant-bg absolute inset-x-0 top-6 whitespace-nowrap text-center leading-none select-none pointer-events-none"
        aria-hidden
      >
        {word}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">{children}</div>
    </section>
  );
}