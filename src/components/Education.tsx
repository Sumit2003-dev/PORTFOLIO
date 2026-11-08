import { useRef } from "react";
import Section from "./Section";
import { education } from "@/lib/data";
import { useFadeUp } from "@/hooks/use-scroll";
import { GraduationCap, MapPin, Calendar, Award } from "lucide-react";

export default function Education() {
  const ref = useRef<HTMLDivElement>(null);
  useFadeUp(ref);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <Section id="education" word="EDUCATION">
      <div ref={ref}>
        <h2 data-reveal className="font-display text-huge uppercase leading-[1.05] text-white">
          Education<span className="text-ember-500 text-glow">.</span>
        </h2>
        <p data-reveal className="mt-2 max-w-xl text-xs sm:text-sm text-white/55">
          A strong academic foundation in Computer Science, sharpened toward artificial
          intelligence and data science.
        </p>

        <div className="relative mt-10 space-y-7 border-l-2 border-ember-500/30 pl-8 sm:pl-12">
          {/* glowing spine header */}
          <span className="absolute -left-[5px] top-0 h-2.5 w-2.5 rounded-full bg-ember-500 shadow-glow" />

          {education.map((e) => (
            <div key={e.degree} data-reveal className="relative">
              <span className="absolute -left-[50px] top-4 grid h-8 w-8 place-items-center rounded-full border border-ember-500/50 bg-[#071018] text-ember-400 shadow-glow sm:-left-[66px] transition-transform duration-300 hover:scale-110">
                <GraduationCap className="h-4 w-4" />
              </span>

              <div
                onMouseMove={onMove}
                className="group glass relative overflow-hidden rounded-2xl border border-white/10 p-4 sm:p-6 transition-all duration-500 hover:-translate-y-0.5 hover:border-ember-500/40 hover:shadow-glow"
              >
                {/* Spotlight hover effect */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(340px circle at var(--mx,50%) var(--my,50%), rgba(255,138,43,0.14), transparent 70%)",
                  }}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent" />

                <div className="relative flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-condensed text-xs uppercase tracking-[0.2em] text-ember-500 font-semibold">{e.duration}</p>
                    <h3 className="mt-1 font-display text-xl sm:text-2xl uppercase text-white tracking-wide transition-colors group-hover:text-ember-400">{e.degree}</h3>
                    <p className="font-condensed text-xs sm:text-sm text-white/70">{e.major}</p>
                  </div>
                  <span className="rounded-full border border-ember-500/30 bg-ember-500/10 px-3 py-1 text-xs font-semibold text-ember-400 shadow-glow">
                    {e.status}
                  </span>
                </div>

                <div className="relative mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-white/60">
                  <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-ember-500" /> {e.institution}, {e.location}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-ember-500" /> {e.duration}</span>
                  <span className="flex items-center gap-1.5"><Award className="h-3.5 w-3.5 text-ember-500" /> {e.grade}</span>
                </div>

                <div className="relative mt-4 flex flex-wrap gap-1.5">
                  {e.courses.map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[11px] text-white/70 backdrop-blur transition-colors hover:border-ember-500/30 hover:text-white"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
