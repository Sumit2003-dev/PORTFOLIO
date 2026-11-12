import { useRef, useState, useEffect, useMemo } from "react";
import Section from "./Section";
import { achievements as defaultAchievements, leetcode as defaultLeetcode, githubStats as defaultGithubStats, profile, asset } from "@/lib/data";
import { useCounter, useFadeUp } from "@/hooks/use-scroll";
import { Trophy, FolderGit2, GitBranch, Code2, Database, BarChart3, ExternalLink } from "lucide-react";

interface CounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
}

function Counter({ value, suffix, prefix }: CounterProps) {
  const ref = useCounter(value);
  return (
    <span>
      {prefix || ""}<span ref={ref}>0</span>{suffix || ""}
    </span>
  );
}

export default function Achievements() {
  const ref = useRef<HTMLDivElement>(null);
  useFadeUp(ref);

  const [skillsData, setSkillsData] = useState<{
    profile?: {
      points?: number;
      totalBadges?: number;
      privateDashboard?: {
        leaguePosition?: number;
      };
      leaguePosition?: number;
    };
    badges?: unknown[];
  } | null>(null);

  const [leetcodeData, setLeetcodeData] = useState<{
    totalSolved?: number;
    easySolved?: number;
    mediumSolved?: number;
    hardSolved?: number;
    ranking?: number;
    submissionsTotal?: number;
    contestRating?: number | null;
  } | null>(null);

  const [githubData, setGithubData] = useState<{
    publicRepos?: number;
    totalContributions?: number;
    profile?: {
      publicRepos?: number;
    };
    contributions?: {
      total?: number;
    };
  } | null>(null);

  const [isSynced, setIsSynced] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const cacheWindow = Math.floor(Date.now() / (1000 * 60 * 15));

    // 1. Check local storage for quick hydration
    try {
      const cachedSkills = localStorage.getItem("skills_snapshot");
      if (cachedSkills && isMounted) {
        setSkillsData(JSON.parse(cachedSkills));
      }
      const cachedLc = localStorage.getItem("lc_activity_snapshot");
      if (cachedLc && isMounted) {
        setLeetcodeData(JSON.parse(cachedLc));
      }
      const cachedGh = localStorage.getItem("gh_activity_snapshot");
      if (cachedGh && isMounted) {
        setGithubData(JSON.parse(cachedGh));
      }
    } catch {
      // Ignore cache read failures
    }

    // 2. Fetch live snapshots
    const loadTelemetry = async () => {
      try {
        const [skillsResp, lcResp, ghResp] = await Promise.allSettled([
          fetch(`${asset("data/skills-snapshot.json")}?v=${cacheWindow}`),
          fetch(`${asset("data/leetcode-activity.json")}?v=${cacheWindow}`),
          fetch(`${asset("data/github-activity.json")}?v=${cacheWindow}`),
        ]);

        if (isMounted) {
          if (skillsResp.status === "fulfilled" && skillsResp.value.ok) {
            const sJson = await skillsResp.value.json();
            if (sJson && sJson.profile) {
              setSkillsData(sJson);
              try {
                localStorage.setItem("skills_snapshot", JSON.stringify(sJson));
              } catch {
                // Ignore storage quota errors
              }
            }
          }

          if (lcResp.status === "fulfilled" && lcResp.value.ok) {
            const lJson = await lcResp.value.json();
            if (lJson && lJson.totalSolved) {
              setLeetcodeData(lJson);
              try {
                localStorage.setItem("lc_activity_snapshot", JSON.stringify(lJson));
              } catch {
                // Ignore storage quota errors
              }
            }
          }

          if (ghResp.status === "fulfilled" && ghResp.value.ok) {
            const gJson = await ghResp.value.json();
            if (gJson) {
              setGithubData(gJson);
              try {
                localStorage.setItem("gh_activity_snapshot", JSON.stringify(gJson));
              } catch {
                // Ignore storage quota errors
              }
            }
          }

          setIsSynced(true);
        }
      } catch {
        // Fallback to static defaults
      }
    };

    loadTelemetry();

    return () => {
      isMounted = false;
    };
  }, []);

  const aIcons: Record<string, React.ReactNode> = {
    trophy: <Trophy className="h-5 w-5" />,
    briefcase: <Code2 className="h-5 w-5" />,
    git: <GitBranch className="h-5 w-5" />,
    repo: <FolderGit2 className="h-5 w-5" />,
  };

  // Google Cloud achievements items
  const liveAchievements = useMemo(() => {
    const leagueRank =
      skillsData?.profile?.privateDashboard?.leaguePosition ??
      skillsData?.profile?.leaguePosition ??
      defaultAchievements[0].value;

    const badgesCount =
      skillsData?.profile?.totalBadges ??
      skillsData?.badges?.length ??
      defaultAchievements[1].value;

    const points =
      skillsData?.profile?.points ??
      defaultAchievements[2].value;

    return [
      { label: "Diamond League Rank", value: leagueRank, suffix: "th", prefix: "#", icon: "trophy" },
      { label: "Cloud Skill Badges", value: badgesCount, suffix: "+", icon: "repo" },
      { label: "Arcade Points", value: points, suffix: "", icon: "trophy" },
      { label: "Events & Study Jams", value: 10, suffix: "+", icon: "git" },
    ];
  }, [skillsData]);

  // LeetCode live metrics
  const liveLeetcode = useMemo(() => {
    const totalSolved = leetcodeData?.totalSolved ?? defaultLeetcode[0].value ?? 372;
    const rating = leetcodeData?.contestRating ?? defaultLeetcode[1].value;
    const medHard =
      leetcodeData && typeof leetcodeData.mediumSolved === "number" && typeof leetcodeData.hardSolved === "number"
        ? leetcodeData.mediumSolved + leetcodeData.hardSolved
        : defaultLeetcode[2].value;
    const hardSolved = leetcodeData?.hardSolved ?? defaultLeetcode[3].value;

    return [
      { label: "Problems Solved", value: totalSolved, suffix: "+" },
      { label: "Contest Rating", value: rating, suffix: "" },
      { label: "Medium / Hard", value: medHard, suffix: "" },
      { label: "Hard Solved", value: hardSolved, suffix: "" },
    ];
  }, [leetcodeData]);

  // GitHub live metrics
  const liveGithub = useMemo(() => {
    const repos =
      githubData?.publicRepos ??
      githubData?.profile?.publicRepos ??
      defaultGithubStats[0].value;

    const contribs =
      githubData?.totalContributions ??
      githubData?.contributions?.total ??
      defaultGithubStats[1].value;

    const liveApps = defaultGithubStats[2].value;

    return [
      { label: "Public Repos", value: repos, suffix: "" },
      { label: "Contributions", value: contribs, suffix: "+" },
      { label: "Live Apps", value: liveApps, suffix: "" },
    ];
  }, [githubData]);

  const githubUrl = profile.social.find((s) => s.name === "GitHub")?.href || "https://github.com/Sumit2003-dev";

  return (
    <Section id="achievements" word="ACHIEVEMENTS">
      <div ref={ref}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 data-reveal className="font-display text-huge uppercase leading-[1.05] text-white">
              Achievements<span className="text-ember-500">.</span>
            </h2>
            <p data-reveal className="mt-3 max-w-2xl text-sm sm:text-base text-white/60">
              Beyond the projects — the discipline, competition and contributions that sharpen
              the craft.
            </p>
          </div>

          <div data-reveal className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Profile Telemetry
            </span>
          </div>
        </div>

        {/* Main Google Cloud Skills Boost Counters */}
        <div data-reveal className="mt-9 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {liveAchievements.map((a) => (
            <a
              key={a.label}
              href={profile.googleSkills}
              target="_blank"
              rel="noopener noreferrer"
              title="View verified public profile on Google Cloud Skills Boost"
              className="glass group relative overflow-hidden rounded-xl p-4 sm:p-5 lg:p-6 text-center transition-all duration-500 hover:-translate-y-0.5 hover:shadow-glow hover:border-ember-500/40"
            >
              <span className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-ember-500/15 text-ember-500 group-hover:scale-105 transition-transform">
                {aIcons[a.icon]}
              </span>
              <p className="mt-3.5 font-display text-2xl sm:text-3xl lg:text-4xl text-ember-500">
                <Counter value={a.value} suffix={a.suffix} prefix={a.prefix} />
              </p>
              <p className="mt-1 font-condensed text-xs sm:text-sm uppercase tracking-wider text-white/70 flex items-center justify-center gap-1">
                <span>{a.label}</span>
                <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100 text-ember-500" />
              </p>
            </a>
          ))}
        </div>

        {/* LeetCode & GitHub Verified Telemetry Split */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {/* LeetCode & Problem Solving */}
          <div data-reveal className="glass rounded-2xl p-5 border border-white/10 transition-all duration-300 hover:border-[#FFA116]/40 hover:shadow-[0_0_25px_rgba(255,161,22,0.12)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <BarChart3 className="h-5 w-5 text-[#FFA116]" />
                <h3 className="font-display text-lg uppercase text-white">LeetCode &amp; Problem Solving</h3>
              </div>
              <a
                href={profile.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 font-condensed text-[11px] uppercase tracking-wider text-[#FFA116] transition-colors hover:underline"
              >
                <span>LeetCode Profile</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {liveLeetcode.map((l) => (
                <div key={l.label} className="text-center rounded-xl bg-white/[0.02] border border-white/5 p-2.5">
                  <p className="font-display text-xl text-[#FFA116]">
                    {typeof l.value === "number" && l.value > 0 ? (
                      <Counter value={l.value} suffix={l.suffix} />
                    ) : (
                      <span className="font-sans text-sm text-white/60">Unavailable</span>
                    )}
                  </p>
                  <p className="mt-0.5 text-[11px] text-white/65 font-condensed uppercase tracking-wider">{l.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* GitHub Repository Highlights */}
          <div data-reveal className="glass rounded-2xl p-5 border border-white/10 transition-all duration-300 hover:border-ember-500/40 hover:shadow-glow">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <Database className="h-5 w-5 text-ember-500" />
                <h3 className="font-display text-lg uppercase text-white">Repository Highlights</h3>
              </div>
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 font-condensed text-[11px] uppercase tracking-wider text-ember-400 transition-colors hover:underline"
              >
                <span>GitHub Profile</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {liveGithub.map((g) => (
                <div key={g.label} className="text-center rounded-xl bg-white/[0.02] border border-white/5 p-2.5">
                  <p className="font-display text-xl text-ember-500">
                    <Counter value={g.value} suffix={g.suffix} />
                  </p>
                  <p className="mt-0.5 text-[11px] text-white/65 font-condensed uppercase tracking-wider">{g.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
