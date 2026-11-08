import { useEffect, useRef, useState } from "react";
import Section from "./Section";
import { useFadeUp } from "@/hooks/use-scroll";
import { Github, GitCommit, GitPullRequest, Star, Code2, Cpu } from "lucide-react";

export default function GithubStats() {
  const ref = useRef<HTMLDivElement>(null);
  useFadeUp(ref);
  const [repoCount, setRepoCount] = useState<string>("18+");

  useEffect(() => {
    try {
      const cached = localStorage.getItem("gh_public_repos");
      if (cached) setRepoCount(cached);

      fetch("https://api.github.com/users/Sumit2003-dev")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && typeof data.public_repos === "number") {
            const formatted = `${data.public_repos}+`;
            setRepoCount(formatted);
            localStorage.setItem("gh_public_repos", formatted);
          }
        })
        .catch(() => {
          // Fallback silently if offline or rate-limited
        });
    } catch {
      // LocalStorage access restricted fallback
    }
  }, []);

  const stats = [
    { label: "Public Repositories", value: repoCount, icon: Code2, tag: "Live API" },
    { label: "Total Contributions", value: "640+", icon: GitCommit, tag: "2025–2026 Baseline" },
    { label: "Primary Stack", value: "Python / ML", icon: Cpu, tag: "Active Focus" },
    { label: "Pull Requests Merged", value: "45+", icon: GitPullRequest, tag: "Curated Archive" },
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
            <p data-reveal className="mt-3 max-w-2xl text-sm sm:text-base text-white/60">
              Open-source contributions, engineering metrics, and language distribution. Public repository counts are fetched dynamically via the GitHub API; contribution velocity and language shares reflect curated 2025–2026 developer baselines.
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
        <div className="mt-8 grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                data-reveal
                className="glass relative flex flex-col justify-between overflow-hidden rounded-2xl p-4 sm:p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-ember-500/40 hover:shadow-glow"
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-ember-500/15 text-ember-400">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="font-mono text-[10px] text-ember-400/80 bg-ember-500/10 px-2 py-0.5 rounded-full border border-ember-500/20">
                    {s.tag}
                  </span>
                </div>

                <div className="mt-4">
                  <p className="font-display text-2xl text-white uppercase">{s.value}</p>
                  <p className="mt-0.5 font-condensed text-[11px] uppercase tracking-wider text-white/50">
                    {s.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Language Breakdown & Contribution Visualizer */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {/* Language Distribution */}
          <div data-reveal className="glass rounded-2xl border border-white/10 p-4 sm:p-5 text-left">
            <div className="flex items-center justify-between">
              <h3 className="font-condensed text-[11px] uppercase tracking-[0.22em] text-ember-500 font-semibold">
                Codebase Language Breakdown
              </h3>
              <span className="font-mono text-[10px] text-white/40">2025–2026 Curated</span>
            </div>

            <div className="mt-4 space-y-3">
              {languages.map((l) => (
                <div key={l.name}>
                  <div className="flex justify-between text-[11px] font-condensed uppercase tracking-wider text-white/80">
                    <span>{l.name}</span>
                    <span className="font-mono text-ember-400">{l.share}</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/10">
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
          <div data-reveal className="glass rounded-2xl border border-white/10 p-4 sm:p-5 text-left flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-condensed text-[11px] uppercase tracking-[0.22em] text-ember-500 font-semibold">
                  Git Contribution Velocity
                </h3>
                <span className="font-mono text-[10px] text-white/40">2025–2026 Developer Activity</span>
              </div>

              {/* Grid visualizer */}
              <div className="mt-4 grid grid-cols-16 min-w-[280px] gap-1 overflow-x-auto pb-1">
                {Array.from({ length: 64 }).map((_, i) => {
                  const intensity = (i * 7 + 13) % 4;
                  return (
                    <div
                      key={i}
                      className={`h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-sm transition-all hover:scale-125 ${
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

            <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2 text-[10px] text-white/40 font-mono">
              <span>Less</span>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-sm bg-white/10" />
                <span className="h-2 w-2 rounded-sm bg-ember-500/35" />
                <span className="h-2 w-2 rounded-sm bg-ember-500/65" />
                <span className="h-2 w-2 rounded-sm bg-ember-500" />
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
