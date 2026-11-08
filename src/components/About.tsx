import { useRef } from "react";
import Section from "./Section";
import { stats, interests, profile } from "@/lib/data";
import { useCounter, useFadeUp } from "@/hooks/use-scroll";

function Stat({
  label,
  value,
  suffix,
  onMove,
}: {
  label: string;
  value: number;
  suffix: string;
  onMove?: (e: React.MouseEvent<HTMLElement>) => void;
}) {
  const ref = useCounter(value);
  return (
    <div
      onMouseMove={onMove}
      className="group glass relative overflow-hidden rounded-xl border border-white/10 p-3.5 sm:p-5 text-center transition-all duration-500 hover:-translate-y-0.5 hover:border-ember-500/40 hover:shadow-glow"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(180px circle at var(--mx,50%) var(--my,50%), rgba(255,106,0,0.18), transparent 70%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent" />
      <p className="relative font-display text-2xl sm:text-3xl lg:text-4xl text-ember-500">
        <span ref={ref}>0</span>
        <span>{suffix}</span>
      </p>
      <p className="relative mt-1.5 text-[11px] sm:text-xs uppercase tracking-widest text-white/55">{label}</p>
    </div>
  );
}

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  useFadeUp(ref);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <Section id="about" word="ABOUT">
      <div ref={ref} className="grid gap-8 lg:grid-cols-[1.15fr,0.85fr] lg:gap-12 items-start">
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

          <div data-reveal className="mt-7 grid grid-cols-2 gap-2.5 sm:gap-3.5 sm:grid-cols-4">
            {stats.map((s) => (
              <Stat key={s.label} {...s} onMove={onMove} />
            ))}
          </div>
        </div>

        {/* Right: glass card + interests */}
        <div className="lg:top-24">
          <div
            data-reveal
            onMouseMove={onMove}
            className="group/sticky glass relative overflow-hidden rounded-2xl border border-white/10 p-5 sm:p-6 transition-all duration-500 hover:border-ember-500/40 hover:shadow-glow"
          >
            {/* Spotlight hover effect */}
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/sticky:opacity-100"
              style={{
                background:
                  "radial-gradient(320px circle at var(--mx,50%) var(--my,50%), rgba(255,106,0,0.14), transparent 70%)",
              }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent" />

            <p className="relative font-condensed text-xs uppercase tracking-[0.3em] text-ember-500">Currently focused on</p>
            <h3 className="relative mt-1.5 font-display text-xl uppercase leading-tight text-white">
              Crafting predictive
              <br />
              intelligence
            </h3>

            <div className="relative mt-4 space-y-2 text-xs sm:text-sm">
              {interests.map((it) => (
                <div key={it} className="flex items-center gap-2.5 text-white/70">
                  <span className="h-1 w-1 shrink-0 rounded-full bg-ember-500" />
                  {it}
                </div>
              ))}
            </div>

            <div className="relative mt-6 h-px bg-white/10" />

            <div className="relative mt-4 space-y-2 text-xs text-white/55">
              <p className="flex justify-between border-b border-white/5 pb-1.5"><span>Specialization</span><span className="text-ember-500">AI &amp; Data Science</span></p>
              <p className="flex justify-between border-b border-white/5 pb-1.5"><span>Institution</span><span>SRMU · Lucknow</span></p>
              <p className="flex justify-between"><span>Status</span><span className="text-ember-500">Open to work</span></p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
