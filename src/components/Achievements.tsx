import { useRef } from "react";
import Section from "./Section";
import { achievements, leetcode, githubStats } from "@/lib/data";
import { useCounter, useFadeUp } from "@/hooks/use-scroll";
import { Trophy, Briefcase, FolderGit2, GitBranch, Code2, Database } from "lucide-react";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useCounter(value);
  return (
    <span>
      <span ref={ref}>0</span>{suffix}
    </span>
  );
}

export default function Achievements() {
  const ref = useRef<HTMLElement>(null);
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
        <p data-reveal className="mt-4 max-w-2xl text-lg text-white/55">
          Beyond the projects — the discipline, competition and contributions that sharpen
          the craft.
        </p>

        {/* main counters */}
        <div data-reveal className="mt-14 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {achievements.map((a) => (
            <div key={a.label} className="glass group relative overflow-hidden rounded-3xl p-6 text-center transition-all duration-500 hover:-translate-y-1 hover:shadow-glow">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-ember-500/15 text-ember-500">
                {aIcons[a.icon]}
              </span>
              <p className="mt-4 font-display text-4xl text-ember-500">
                <Counter value={a.value} suffix={a.suffix} />
              </p>
              <p className="mt-1 font-condensed text-sm uppercase tracking-widest text-white/50">{a.label}</p>
            </div>
          ))}
        </div>

        {/* leetcode + github */}
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <div data-reveal className="glass rounded-3xl p-7">
            <div className="flex items-center gap-3">
              <Code2 className="h-6 w-6 text-ember-500" />
              <h3 className="font-display text-xl uppercase text-white">LeetCode</h3>
            </div>
            <div className="mt-5 grid grid-cols-4 gap-4">
              {leetcode.map((l) => (
                <div key={l.label} className="text-center">
                  <p className="font-display text-2xl text-ember-500"><Counter value={l.value} suffix={l.suffix} /></p>
                  <p className="text-xs text-white/45">{l.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div data-reveal className="glass rounded-3xl p-7">
            <div className="flex items-center gap-3">
              <Database className="h-6 w-6 text-ember-500" />
              <h3 className="font-display text-xl uppercase text-white">GitHub</h3>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-4">
              {githubStats.map((g) => (
                <div key={g.label} className="text-center">
                  <p className="font-display text-2xl text-ember-500"><Counter value={g.value} suffix={g.suffix} /></p>
                  <p className="text-xs text-white/45">{g.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
