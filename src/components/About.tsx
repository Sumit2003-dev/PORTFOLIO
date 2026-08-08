import { useRef } from "react";
import Section from "./Section";
import { stats, aboutTimeline, interests, profile } from "@/lib/data";
import { useCounter, useFadeUp } from "@/hooks/use-scroll";

function Stat({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  const ref = useCounter(value);
  return (
    <div className="glass rounded-2xl p-5 text-center transition-transform duration-500 hover:-translate-y-1">
      <p className="font-display text-4xl text-ember-500">
        <span ref={ref}>0</span>
        <span>{suffix}</span>
      </p>
      <p className="mt-1 text-xs uppercase tracking-widest text-white/50">{label}</p>
    </div>
  );
}

export default function About() {
  const ref = useRef<HTMLElement>(null);
  useFadeUp(ref);

  return (
    <Section id="about" word="ABOUT" inverted>
      <div ref={ref} className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr] lg:gap-16">
        {/* Left: narrative + counters */}
        <div>
          <h2 data-reveal className="font-display text-huge uppercase leading-[1.05] text-white">
            About <span className="text-ember-500 text-glow">Me</span>
          </h2>

          <div className="mt-7 space-y-5 text-lg leading-relaxed text-white/60">
            {profile.description.map((p) => (
              <p key={p.slice(0, 20)} data-reveal>{p}</p>
            ))}
          </div>

          <div data-reveal className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <Stat key={s.label} {...s} />
            ))}
          </div>

          {/* Timeline */}
          <div className="mt-12">
            <h3 data-reveal className="mb-6 font-condensed text-sm uppercase tracking-[0.3em] text-ember-500">
              Journey
            </h3>
            <div className="relative space-y-6 border-l border-white/10 pl-6">
              <span className="absolute -left-[3px] top-0 h-1.5 w-1.5 rounded-full bg-ember-500 shadow-glow" />
              {aboutTimeline.map((t) => (
                <div key={t.year} data-reveal className="relative">
                  <span className="absolute -left-[39px] top-1.5 h-2.5 w-2.5 rounded-full border border-ember-500/60 bg-[#0D1117]" />
                  <p className="font-display text-ember-500">{t.year}</p>
                  <h4 className="font-semibold text-white">{t.title}</h4>
                  <p className="text-sm text-white/50">{t.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: glass card + interests */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div data-reveal className="glass rounded-3xl p-8">
            <p className="font-condensed text-sm uppercase tracking-[0.3em] text-ember-500">Currently focused on</p>
            <h3 className="mt-2 font-display text-2xl uppercase leading-6 text-white">
              Crafting predictive
              <br />
              intelligence
            </h3>

            <div className="mt-6 space-y-3">
              {interests.map((it) => (
                <div key={it} className="flex items-center gap-3 text-white/70">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ember-500" />
                  {it}
                </div>
              ))}
            </div>

            <div className="mt-8 h-px bg-white/10" />

            <div className="mt-6 space-y-3 text-sm text-white/55">
              <p className="flex justify-between border-b border-white/5 pb-2"><span>Specialization</span><span className="text-ember-500">AI & Data Science</span></p>
              <p className="flex justify-between border-b border-white/5 pb-2"><span>Institution</span><span>SRMU · Lucknow</span></p>
              <p className="flex justify-between"><span>Status</span><span className="text-ember-500">Open to work</span></p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
