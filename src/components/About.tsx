import { useRef } from "react";
import Section from "./Section";
import { stats, aboutTimeline, interests, profile } from "@/lib/data";
import { useCounter, useFadeUp } from "@/hooks/use-scroll";
import { Sparkles } from "lucide-react";

function Stat({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  const ref = useCounter(value);
  return (
    <div className="glass rounded-xl p-3.5 sm:p-5 text-center transition-transform duration-500 hover:-translate-y-0.5">
      <p className="font-display text-2xl sm:text-3xl lg:text-4xl text-ember-500">
        <span ref={ref}>0</span>
        <span>{suffix}</span>
      </p>
      <p className="mt-1.5 text-[11px] sm:text-xs uppercase tracking-widest text-white/55">{label}</p>
    </div>
  );
}

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  useFadeUp(ref);

  return (
    <Section id="about" word="ABOUT" inverted>
      <div ref={ref} className="grid gap-8 lg:grid-cols-[1.15fr,0.85fr] lg:gap-12">
        {/* Left: narrative + counters */}
        <div>
          <h2 data-reveal className="font-display text-huge uppercase leading-[1.05] text-white">
            About <span className="text-ember-500 text-glow">Me</span>
          </h2>

          <div className="mt-5 space-y-3.5 text-sm sm:text-base leading-relaxed text-white/60">
            {profile.description.map((p) => (
              <p key={p.slice(0, 20)} data-reveal>{p}</p>
            ))}
          </div>

          <div data-reveal className="mt-6 sm:mt-7 grid grid-cols-2 gap-2.5 sm:gap-3.5 sm:grid-cols-4">
            {stats.map((s) => (
              <Stat key={s.label} {...s} />
            ))}
          </div>

          {/* Timeline */}
          <div className="mt-12 sm:mt-16">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p data-reveal className="font-condensed text-xs sm:text-sm uppercase tracking-[0.28em] text-ember-500 font-semibold">
                  Career Evolution &amp; Milestones
                </p>
                <h3 data-reveal className="mt-1 font-display text-2xl sm:text-3xl lg:text-4xl uppercase text-white">
                  Journey<span className="text-ember-500 text-glow">.</span>
                </h3>
              </div>
              <span data-reveal className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 text-xs text-white/60">
                <Sparkles className="h-3.5 w-3.5 text-ember-500" /> 2023 — Present
              </span>
            </div>

            <div className="relative space-y-5 sm:space-y-6 border-l-2 border-ember-500/30 pl-6 sm:pl-8">
              <span className="absolute -left-[5px] top-0 h-2.5 w-2.5 rounded-full bg-ember-500 shadow-glow" />
              {aboutTimeline.map((t) => (
                <div
                  key={t.title}
                  data-reveal
                  className="glass group relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:border-ember-500/40 hover:-translate-y-0.5 hover:shadow-glow"
                >
                  {/* Timeline Marker Anchor */}
                  <span className="absolute -left-[33px] sm:-left-[41px] top-5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-ember-500 bg-[#071018] shadow-glow transition-transform duration-300 group-hover:scale-125">
                    <span className="h-1.5 w-1.5 rounded-full bg-ember-500" />
                  </span>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-full border border-ember-500/30 bg-ember-500/10 px-3 py-0.5 font-display text-sm font-bold text-ember-400">
                      {t.year}
                    </span>
                    <span className="text-[11px] font-condensed uppercase tracking-wider text-white/40">
                      Milestone
                    </span>
                  </div>

                  <h4 className="mt-2.5 font-display text-base sm:text-lg uppercase text-white tracking-wide transition-colors group-hover:text-ember-400">
                    {t.title}
                  </h4>
                  <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-white/65">
                    {t.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: glass card + interests */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div data-reveal className="glass rounded-2xl p-5 sm:p-6">
            <p className="font-condensed text-xs uppercase tracking-[0.3em] text-ember-500">Currently focused on</p>
            <h3 className="mt-1.5 font-display text-xl uppercase leading-tight text-white">
              Crafting predictive
              <br />
              intelligence
            </h3>

            <div className="mt-4 space-y-2 text-xs sm:text-sm">
              {interests.map((it) => (
                <div key={it} className="flex items-center gap-2.5 text-white/70">
                  <span className="h-1 w-1 shrink-0 rounded-full bg-ember-500" />
                  {it}
                </div>
              ))}
            </div>

            <div className="mt-6 h-px bg-white/10" />

            <div className="mt-4 space-y-2 text-xs text-white/55">
              <p className="flex justify-between border-b border-white/5 pb-1.5"><span>Specialization</span><span className="text-ember-500">AI & Data Science</span></p>
              <p className="flex justify-between border-b border-white/5 pb-1.5"><span>Institution</span><span>SRMU · Lucknow</span></p>
              <p className="flex justify-between"><span>Status</span><span className="text-ember-500">Open to work</span></p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
