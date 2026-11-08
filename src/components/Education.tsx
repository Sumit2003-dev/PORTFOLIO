import { useRef } from "react";
import Section from "./Section";
import { education } from "@/lib/data";
import { useFadeUp } from "@/hooks/use-scroll";
import { GraduationCap, MapPin, Calendar, Award } from "lucide-react";

export default function Education() {
  const ref = useRef<HTMLDivElement>(null);
  useFadeUp(ref);

  return (
    <Section id="education" word="EDUCATION" inverted>
      <div ref={ref}>
        <h2 data-reveal className="font-display text-huge uppercase leading-[1.05] text-white">
          Education<span className="text-ember-500">.</span>
        </h2>
        <p data-reveal className="mt-2 max-w-xl text-xs sm:text-sm text-white/55">
          A strong academic foundation in Computer Science, sharpened toward artificial
          intelligence and data science.
        </p>

        <div className="relative mt-10 space-y-7 border-l border-white/10 pl-8 sm:pl-12">
          {/* glowing spine */}
          <span className="absolute -left-[3px] top-2 h-4 w-4 -translate-y-1/2 rounded-full bg-ember-500 blur-sm" />

          {education.map((e) => (
            <div key={e.degree} data-reveal className="relative">
              <span className="absolute -left-[50px] top-2 grid h-8 w-8 place-items-center rounded-full border border-ember-500/40 bg-[#0D1117] text-ember-500 sm:-left-[66px]">
                <GraduationCap className="h-3.5 w-3.5" />
              </span>

              <div className="glass rounded-2xl p-4 sm:p-6 transition-all duration-500 hover:-translate-y-0.5 hover:border-ember-500/30">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-condensed text-xs uppercase tracking-[0.2em] text-ember-500">{e.duration}</p>
                    <h3 className="mt-1 font-display text-xl sm:text-2xl uppercase text-white">{e.degree}</h3>
                    <p className="font-condensed text-xs sm:text-sm text-white/70">{e.major}</p>
                  </div>
                  <span className="rounded-full border border-white/10 px-2.5 py-0.5 text-[10px] text-white/50">{e.status}</span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/50">
                  <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3 text-ember-500" /> {e.institution}, {e.location}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3 text-ember-500" /> {e.duration}</span>
                  <span className="flex items-center gap-1.5"><Award className="h-3 w-3 text-ember-500" /> {e.grade}</span>
                </div>

                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {e.courses.map((c) => (
                    <span key={c} className="rounded-full border border-white/10 bg-black/20 px-2.5 py-0.5 text-[10px] text-white/60">
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
