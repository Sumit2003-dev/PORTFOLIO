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
        <p data-reveal className="mt-4 max-w-2xl text-lg text-white/55">
          A strong academic foundation in Computer Science, sharpened toward artificial
          intelligence and data science.
        </p>

        <div className="relative mt-16 space-y-10 border-l border-white/10 pl-8 sm:pl-12">
          {/* glowing spine */}
          <span className="absolute -left-[3px] top-2 h-6 w-6 -translate-y-1/2 rounded-full bg-ember-500 blur-md" />

          {education.map((e) => (
            <div key={e.degree} data-reveal className="relative">
              <span className="absolute -left-[53px] top-2 grid h-9 w-9 place-items-center rounded-full border border-ember-500/40 bg-[#0D1117] text-ember-500 sm:-left-[69px]">
                <GraduationCap className="h-4 w-4" />
              </span>

              <div className="glass rounded-3xl p-6 transition-all duration-500 hover:-translate-y-1 hover:border-ember-500/30 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-condensed uppercase tracking-[0.2em] text-ember-500">{e.duration}</p>
                    <h3 className="mt-1 font-display text-2xl uppercase text-white">{e.degree}</h3>
                    <p className="font-condensed text-white/70">{e.major}</p>
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/50">{e.status}</span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-white/50">
                  <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-ember-500" /> {e.institution}, {e.location}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-ember-500" /> {e.duration}</span>
                  <span className="flex items-center gap-1.5"><Award className="h-3.5 w-3.5 text-ember-500" /> {e.grade}</span>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {e.courses.map((c) => (
                    <span key={c} className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/60">
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
