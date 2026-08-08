import { useRef } from "react";
import Section from "./Section";
import { useFadeUp } from "@/hooks/use-scroll";
import { Github, GitCommit, GitPullRequest, Star, Code2, Cpu } from "lucide-react";

export default function GithubStats() {
  const ref = useRef<HTMLElement>(null);
  useFadeUp(ref);

  const stats = [
    { label: "Public Repositories", value: "18+", icon: Code2 },
    { label: "Total Contributions (2025–2026)", value: "640+", icon: GitCommit },
    { label: "Primary Stack", value: "Python / ML", icon: Cpu },
    { label: "Pull Requests Merged", value: "45+", icon: GitPullRequest },
  ];

  const languages = [
    { name: "Python", share: "48%", color: "#3776AB" },
    { name: "TypeScript / React", share: "28%", color: "#3178C6" },
    { name: "SQL & Analytics", share: "14%", color: "#E34F26" },
    { name: "R & Statistics", share: "10%", color: "#276DC3" },
  ];

  return (
    <Section id="github-stats" word="METRICS">
      <div ref={ref}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 data-reveal className="font-display text-huge uppercase leading-[1.05] text-white">
              GitHub & ML<span className="text-ember-500 text-glow">.</span> Activity
            </h2>
            <p data-reveal className="mt-4 max-w-2xl text-lg text-white/55">
              Consistent open-source contributions, engineering metrics, and language distribution across Machine Learning, Data Analytics, and Full-Stack repositories.
            </p>
          </div>
          <a
            data-reveal
            href="https://github.com/Sumit2003-dev"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ember flex items-center gap-2 px-5 py-2.5 text-xs font-semibold"
          >
            <Github className="h-4 w-4" /> Visit @Sumit2003-dev
          </a>
        </div>

        {/* Stats Metric Cards */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                data-reveal
                className="glass relative flex flex-col justify-between overflow-hidden rounded-3xl p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-ember-500/40 hover:shadow-glow"
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-ember-500/15 text-ember-400">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-xs text-white/40">Verified</span>
                </div>

                <div className="mt-6">
                  <p className="font-display text-3xl text-white uppercase">{s.value}</p>
                  <p className="mt-1 font-condensed text-xs uppercase tracking-wider text-white/50">
                    {s.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Language Breakdown & Contribution Visualizer */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Language Distribution */}
          <div data-reveal className="glass rounded-3xl border border-white/10 p-6 text-left">
            <h3 className="font-condensed text-xs uppercase tracking-[0.25em] text-ember-500 font-semibold">
              Codebase Language Breakdown
            </h3>

            <div className="mt-6 space-y-4">
              {languages.map((l) => (
                <div key={l.name}>
                  <div className="flex justify-between text-xs font-condensed uppercase tracking-wider text-white/80">
                    <span>{l.name}</span>
                    <span className="font-mono text-ember-400">{l.share}</span>
                  </div>
                  <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: l.share, backgroundColor: l.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GitHub Activity Grid Heatmap Visual */}
          <div data-reveal className="glass rounded-3xl border border-white/10 p-6 text-left flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-condensed text-xs uppercase tracking-[0.25em] text-ember-500 font-semibold">
                  Git Contribution Velocity
                </h3>
                <span className="font-mono text-[11px] text-white/40">640+ commits</span>
              </div>

              {/* Grid visualizer */}
              <div className="mt-6 grid grid-cols-16 gap-1.5 overflow-x-auto pb-2">
                {Array.from({ length: 64 }).map((_, i) => {
                  const intensity = (i * 7 + 13) % 4;
                  return (
                    <div
                      key={i}
                      className={`h-4.5 w-4.5 rounded-md transition-all hover:scale-125 ${
                        intensity === 3
                          ? "bg-ember-500 shadow-glow"
                          : intensity === 2
                          ? "bg-ember-500/65"
                          : intensity === 1
                          ? "bg-ember-500/35"
                          : "bg-white/10"
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-[11px] text-white/40 font-mono">
              <span>Less</span>
              <div className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm bg-white/10" />
                <span className="h-2.5 w-2.5 rounded-sm bg-ember-500/35" />
                <span className="h-2.5 w-2.5 rounded-sm bg-ember-500/65" />
                <span className="h-2.5 w-2.5 rounded-sm bg-ember-500" />
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
