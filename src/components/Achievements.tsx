import { useRef } from "react";
import Section from "./Section";
import { achievements, leetcode, githubStats, profile } from "@/lib/data";
import { useCounter, useFadeUp } from "@/hooks/use-scroll";
import { Trophy, FolderGit2, GitBranch, Code2, Database, BarChart3, ExternalLink } from "lucide-react";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useCounter(value);
  return (
    <span>
      <span ref={ref}>0</span>{suffix}
    </span>
  );
}

export default function Achievements() {
  const ref = useRef<HTMLDivElement>(null);
  useFadeUp(ref);

  const aIcons: Record<string, React.ReactNode> = {
    trophy: <Trophy />,
    briefcase: <Code2 />,
    git: <GitBranch />,
    repo: <FolderGit2 />,
  };

  return (
    <Section id="achievements" word="ACHIEVEMENTS">
      <div ref={ref}>
        <h2 data-reveal className="font-display text-huge uppercase leading-[1.05] text-white">
          Achievements<span className="text-ember-500">.</span>
        </h2>
        <p data-reveal className="mt-3 max-w-2xl text-sm sm:text-base text-white/60">
          Beyond the projects — the discipline, competition and contributions that sharpen
          the craft.
        </p>

        {/* main counters */}
        <div data-reveal className="mt-9 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {achievements.map((a) => {
            const isCloud = a.label.includes("Diamond") || a.label.includes("Cloud");
            const Wrapper = isCloud ? "a" : "div";
            const wrapperProps = isCloud
              ? {
                  href: profile.googleSkills,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  title: "Verify on Google Cloud Skills Boost public profile",
                }
              : {};
            return (
              <Wrapper
                key={a.label}
                {...wrapperProps}
                className="glass group relative overflow-hidden rounded-xl p-4 sm:p-5 lg:p-6 text-center transition-all duration-500 hover:-translate-y-0.5 hover:shadow-glow hover:border-ember-500/40"
              >
                <span className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-ember-500/15 text-ember-500">
                  {aIcons[a.icon]}
                </span>
                <p className="mt-3.5 font-display text-2xl sm:text-3xl lg:text-4xl text-ember-500">
                  <Counter value={a.value} suffix={a.suffix} />
                </p>
                <p className="mt-1 font-condensed text-xs sm:text-sm uppercase tracking-wider text-white/55 flex items-center justify-center gap-1">
                  <span>{a.label}</span>
                  {isCloud && <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100 text-ember-500" />}
                </p>
              </Wrapper>
            );
          })}
        </div>

        {/* metrics + github */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div data-reveal className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BarChart3 className="h-5 w-5 text-ember-500" />
                <h3 className="font-display text-lg uppercase text-white">LeetCode &amp; Problem Solving</h3>
              </div>
              <a
                href={profile.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 font-condensed text-[11px] uppercase tracking-wider text-white/50 transition-colors hover:text-ember-500"
              >
                LeetCode Profile <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {leetcode.map((l) => (
                <div key={l.label} className="text-center">
                  <p className="font-display text-xl text-ember-500"><Counter value={l.value} suffix={l.suffix} /></p>
                  <p className="text-[11px] text-white/45">{l.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div data-reveal className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2.5">
              <Database className="h-5 w-5 text-ember-500" />
              <h3 className="font-display text-lg uppercase text-white">Repository Highlights</h3>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {githubStats.map((g) => (
                <div key={g.label} className="text-center">
                  <p className="font-display text-xl text-ember-500"><Counter value={g.value} suffix={g.suffix} /></p>
                  <p className="text-[11px] text-white/45">{g.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
