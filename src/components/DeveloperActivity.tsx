import { useState, useEffect, useRef, useMemo } from "react";
import Section from "./Section";
import { useFadeUp, useCounter } from "@/hooks/use-scroll";
import { asset } from "@/lib/data";
import {
  Github,
  ExternalLink,
  Code2,
  Trophy,
  Activity,
  Flame,
  CheckCircle2,
  Calendar,
  Layers,
} from "lucide-react";
import { SiLeetcode } from "react-icons/si";

interface ActivityDay {
  date: string;
  count: number;
  level: number;
}

interface DeveloperActivityData {
  status: string;
  syncedAt: string;
  github: {
    username: string;
    name: string;
    publicRepos: number;
    followers: number;
    profileUrl: string;
    avatarUrl?: string;
    topLanguage: string;
    totalContributions: number;
    contributions: {
      total: number;
      daysCount: number;
      startDate: string;
      endDate: string;
      days: ActivityDay[];
    };
    languages: {
      name: string;
      bytes: number;
      percentage: number;
      color: string;
    }[];
  };
  leetcode: {
    username: string;
    profileUrl: string;
    ranking: number;
    avatarUrl?: string;
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    totalQuestions: {
      easy: number;
      medium: number;
      hard: number;
      all: number;
    };
    contestRating: number | null;
    contestGlobalRank: number | null;
    submissionsTotal: number;
    activityCalendar: {
      daysCount: number;
      startDate: string;
      endDate: string;
      days: ActivityDay[];
    };
  };
}

function StatCounter({ value, suffix }: { value: number; suffix?: string }) {
  const ref = useCounter(value);
  return (
    <span>
      <span ref={ref}>0</span>
      {suffix || ""}
    </span>
  );
}

function formatDate(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function buildCalendarWeeks(days: ActivityDay[]): (ActivityDay | null)[][] {
  const weeks: (ActivityDay | null)[][] = [];
  let currentWeek: (ActivityDay | null)[] = [];

  for (const d of days) {
    currentWeek.push(d);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }
  return weeks;
}

export default function DeveloperActivity() {
  const ref = useRef<HTMLDivElement>(null);
  useFadeUp(ref);

  const [data, setData] = useState<DeveloperActivityData | null>(null);
  const [syncStatus, setSyncStatus] = useState<"loading" | "synced" | "cached" | "error">("loading");
  const [hoveredGhDay, setHoveredGhDay] = useState<ActivityDay | null>(null);
  const [hoveredLcDay, setHoveredLcDay] = useState<ActivityDay | null>(null);

  useEffect(() => {
    let isMounted = true;

    // 1. Check local cache
    try {
      const cached = localStorage.getItem("dev_activity_snapshot");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.github && parsed.leetcode) {
          if (isMounted) {
            setData(parsed);
            setSyncStatus("cached");
          }
        }
      }
    } catch {
      // Ignore localStorage read errors
    }

    // 2. Fetch fresh JSON snapshot
    const loadSnapshot = async () => {
      try {
        const cacheWindow = Math.floor(Date.now() / (1000 * 60 * 15));
        const snapshotUrl = `${asset("data/developer-activity.json")}?v=${cacheWindow}`;
        const resp = await fetch(snapshotUrl);
        if (!resp.ok) {
          throw new Error(`HTTP ${resp.status}`);
        }
        const json: DeveloperActivityData = await resp.json();
        if (isMounted && json && json.github && json.leetcode) {
          setData(json);
          setSyncStatus(json.status === "success" ? "synced" : "cached");
          try {
            localStorage.setItem("dev_activity_snapshot", JSON.stringify(json));
          } catch {
            // Ignore quota errors
          }
        }
      } catch (err) {
        if (isMounted) {
          console.warn("Using cached developer activity snapshot fallback:", err);
          setSyncStatus((prev) => (prev === "cached" ? "cached" : "error"));
        }
      }
    };

    loadSnapshot();
    return () => {
      isMounted = false;
    };
  }, []);

  const formattedSyncTime = useMemo(() => {
    if (!data?.syncedAt) return null;
    try {
      const d = new Date(data.syncedAt);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return null;
    }
  }, [data?.syncedAt]);

  // GitHub weeks matrix
  const ghWeeks = useMemo(() => {
    const days = data?.github?.contributions?.days || [];
    return buildCalendarWeeks(days);
  }, [data?.github?.contributions?.days]);

  // LeetCode weeks matrix
  const lcWeeks = useMemo(() => {
    const days = data?.leetcode?.activityCalendar?.days || [];
    return buildCalendarWeeks(days);
  }, [data?.leetcode?.activityCalendar?.days]);

  // Fallback defaults
  const ghContribs = data?.github?.totalContributions ?? 123;
  const ghRepos = data?.github?.publicRepos ?? 13;
  const ghTopLang = data?.github?.topLanguage ?? "TypeScript";

  const lcTotal = data?.leetcode?.totalSolved ?? 370;
  const lcEasy = data?.leetcode?.easySolved ?? 102;
  const lcMedium = data?.leetcode?.mediumSolved ?? 200;
  const lcHard = data?.leetcode?.hardSolved ?? 68;
  const lcRank = data?.leetcode?.ranking ?? 380408;

  // Easy / Medium / Hard percentage proportions
  const easyPct = lcTotal > 0 ? (lcEasy / lcTotal) * 100 : 27.6;
  const medPct = lcTotal > 0 ? (lcMedium / lcTotal) * 100 : 54.1;
  const hardPct = lcTotal > 0 ? (lcHard / lcTotal) * 100 : 18.3;

  return (
    <Section id="activity" word="ACTIVITY">
      {/* Anchor for backward compatibility with #github */}
      <div id="github" className="sr-only" aria-hidden="true" />
      <div id="github-stats" className="sr-only" aria-hidden="true" />

      <div ref={ref} className="relative z-10">
        {/* Section Heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div data-reveal className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-lg bg-ember-500/15 text-ember-500">
                <Activity className="h-3.5 w-3.5" />
              </span>
              <span className="font-condensed text-xs uppercase tracking-[0.25em] text-ember-500 font-semibold">
                Open Source & Problem Solving
              </span>
            </div>
            <h2 data-reveal className="mt-2 font-display text-huge uppercase leading-[1.05] text-white">
              Developer <span className="text-ember-500 text-glow">Activity.</span>
            </h2>
            <p data-reveal className="mt-3 max-w-2xl text-sm sm:text-base text-white/60">
              Building in public. Solving with consistency.
            </p>
          </div>

          {/* Synchronization Status Pill */}
          <div data-reveal className="flex items-center gap-2 text-xs text-white/60">
            {syncStatus === "synced" ? (
              <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Sync Active
              </span>
            ) : syncStatus === "loading" ? (
              <span className="flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 font-mono text-[11px] text-blue-400">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-ping" />
                Updating telemetry...
              </span>
            ) : (
              <span className="flex items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 font-mono text-[11px] text-yellow-400">
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                Verified Snapshot
              </span>
            )}
          </div>
        </div>

        {/* =========================================================================
            TWO EQUALLY IMPORTANT PLATFORM CARDS (Side-by-side on desktop)
           ========================================================================= */}
        <div data-reveal className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* =======================================================================
              CARD 1: GITHUB
             ======================================================================= */}
          <div className="glass group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 p-5 sm:p-7 transition-all duration-500 hover:-translate-y-0.5 hover:border-ember-500/40 hover:shadow-glow">
            {/* Ambient Platform Glow */}
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full opacity-15 blur-3xl transition-opacity duration-500 group-hover:opacity-25"
              style={{ background: "#FF6A00" }}
            />

            <div>
              {/* Card Header: Platform + Identity */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white group-hover:scale-105 transition-transform">
                    <Github className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-xl uppercase tracking-wide text-white">
                      GitHub
                    </h3>
                    <p className="font-mono text-xs text-white/50">
                      @Sumit2003-dev
                    </p>
                  </div>
                </div>

                <span className="rounded-full border border-ember-500/25 bg-ember-500/10 px-3 py-1 font-mono text-[11px] text-ember-400">
                  Open Source
                </span>
              </div>

              {/* 3 Prominent Metrics */}
              <div className="mt-6 grid grid-cols-3 gap-3 text-left">
                {/* Contributions */}
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 sm:p-4">
                  <p className="font-display text-2xl sm:text-3xl text-white">
                    <StatCounter value={ghContribs} />
                  </p>
                  <p className="mt-1 font-condensed text-[11px] uppercase tracking-wider text-white/50">
                    Contributions (12mo)
                  </p>
                </div>

                {/* Repositories */}
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 sm:p-4">
                  <p className="font-display text-2xl sm:text-3xl text-ember-400">
                    <StatCounter value={ghRepos} />
                  </p>
                  <p className="mt-1 font-condensed text-[11px] uppercase tracking-wider text-white/50">
                    Public Repos
                  </p>
                </div>

                {/* Top Language */}
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 sm:p-4">
                  <p className="font-display text-xl sm:text-2xl text-blue-400 truncate">
                    {ghTopLang}
                  </p>
                  <p className="mt-1 font-condensed text-[11px] uppercase tracking-wider text-white/50">
                    Primary Language
                  </p>
                </div>
              </div>

              {/* Small Authentic GitHub Heatmap */}
              <div className="mt-6 rounded-xl border border-white/5 bg-[#08131e]/70 p-4">
                <div className="flex items-center justify-between pb-2 text-xs">
                  <span className="font-mono text-[11px] text-white/50">
                    {hoveredGhDay ? (
                      <span className="text-ember-300">
                        {hoveredGhDay.count === 0 ? "No" : hoveredGhDay.count} contribution{hoveredGhDay.count === 1 ? "" : "s"} on {formatDate(hoveredGhDay.date)}
                      </span>
                    ) : (
                      <span>Activity Timeline (Last 53 Weeks)</span>
                    )}
                  </span>
                  <div className="flex items-center gap-1 font-mono text-[10px] text-white/40">
                    <span>Less</span>
                    <span className="h-2 w-2 rounded-[1.5px] bg-white/[0.05]" />
                    <span className="h-2 w-2 rounded-[1.5px] bg-ember-500/25" />
                    <span className="h-2 w-2 rounded-[1.5px] bg-ember-500/50" />
                    <span className="h-2 w-2 rounded-[1.5px] bg-ember-500/75" />
                    <span className="h-2 w-2 rounded-[1.5px] bg-ember-500 shadow-[0_0_4px_rgba(255,106,0,0.6)]" />
                    <span>More</span>
                  </div>
                </div>

                {/* Grid of mini cells */}
                <div className="overflow-x-auto pb-1 pt-1.5 scrollbar-thin">
                  <div className="flex gap-[2px] min-w-max select-none">
                    {ghWeeks.map((week, colIdx) => (
                      <div key={`gh-col-${colIdx}`} className="flex flex-col gap-[2px]">
                        {week.map((day, rowIdx) => {
                          if (!day) {
                            return (
                              <div
                                key={`gh-empty-${colIdx}-${rowIdx}`}
                                className="h-2.5 w-2.5 rounded-[1.5px] opacity-0"
                              />
                            );
                          }
                          const isHovered = hoveredGhDay?.date === day.date;
                          let bg = "bg-white/[0.05]";
                          if (day.level === 1) bg = "bg-ember-500/25";
                          else if (day.level === 2) bg = "bg-ember-500/50";
                          else if (day.level === 3) bg = "bg-ember-500/75";
                          else if (day.level === 4) bg = "bg-ember-500 shadow-[0_0_4px_rgba(255,106,0,0.7)]";

                          return (
                            <div
                              key={day.date}
                              onMouseEnter={() => setHoveredGhDay(day)}
                              onMouseLeave={() => setHoveredGhDay(null)}
                              title={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${formatDate(day.date)}`}
                              className={`h-2.5 w-2.5 rounded-[1.5px] transition-transform cursor-pointer ${bg} ${
                                isHovered ? "scale-150 z-10 !bg-ember-400 !border-white shadow-glow" : ""
                              }`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action CTA Button */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <a
                href={data?.github?.profileUrl || "https://github.com/Sumit2003-dev"}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn flex items-center justify-center gap-2 w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:border-ember-500/50 hover:bg-ember-500/10 hover:text-ember-400 hover:shadow-glow"
              >
                <span>View GitHub Profile</span>
                <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </a>
            </div>
          </div>

          {/* =======================================================================
              CARD 2: LEETCODE
             ======================================================================= */}
          <div className="glass group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 p-5 sm:p-7 transition-all duration-500 hover:-translate-y-0.5 hover:border-[#FFA116]/40 hover:shadow-[0_0_30px_rgba(255,161,22,0.15)]">
            {/* Ambient Platform Glow */}
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full opacity-15 blur-3xl transition-opacity duration-500 group-hover:opacity-25"
              style={{ background: "#FFA116" }}
            />

            <div>
              {/* Card Header: Platform + Identity */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#FFA116]/15 text-[#FFA116] group-hover:scale-105 transition-transform">
                    <SiLeetcode className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-xl uppercase tracking-wide text-white">
                      LeetCode
                    </h3>
                    <p className="font-mono text-xs text-white/50">
                      @sumit2003dev
                    </p>
                  </div>
                </div>

                <span className="rounded-full border border-[#FFA116]/30 bg-[#FFA116]/10 px-3 py-1 font-mono text-[11px] text-[#FFA116]">
                  Algorithms & DSA
                </span>
              </div>

              {/* 3 Prominent Metrics */}
              <div className="mt-6 grid grid-cols-3 gap-3 text-left">
                {/* Total Problems Solved */}
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 sm:p-4">
                  <p className="font-display text-2xl sm:text-3xl text-white">
                    <StatCounter value={lcTotal} />
                  </p>
                  <p className="mt-1 font-condensed text-[11px] uppercase tracking-wider text-white/50">
                    Problems Solved
                  </p>
                </div>

                {/* Global Ranking */}
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 sm:p-4">
                  <p className="font-display text-xl sm:text-2xl text-[#FFA116] truncate">
                    #{lcRank ? lcRank.toLocaleString() : "380,408"}
                  </p>
                  <p className="mt-1 font-condensed text-[11px] uppercase tracking-wider text-white/50">
                    Global Ranking
                  </p>
                </div>

                {/* Contest Rating / Active Status */}
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 sm:p-4">
                  <p className="font-display text-xl sm:text-2xl text-emerald-400">
                    Active
                  </p>
                  <p className="mt-1 font-condensed text-[11px] uppercase tracking-wider text-white/50">
                    Practice Cadence
                  </p>
                </div>
              </div>

              {/* Easy / Medium / Hard Difficulty Breakdown Progress Bar */}
              <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] p-3.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-[#00B8A3]" />
                    Easy: <strong>{lcEasy}</strong>
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <span className="h-2 w-2 rounded-full bg-[#FFC01E]" />
                    Medium: <strong>{lcMedium}</strong>
                  </span>
                  <span className="flex items-center gap-1.5 text-rose-400">
                    <span className="h-2 w-2 rounded-full bg-[#FF375F]" />
                    Hard: <strong>{lcHard}</strong>
                  </span>
                </div>

                {/* 3-segment stacked bar */}
                <div className="mt-2.5 flex h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    style={{ width: `${easyPct}%` }}
                    className="h-full bg-[#00B8A3] transition-all duration-700"
                    title={`Easy: ${lcEasy} (${easyPct.toFixed(1)}%)`}
                  />
                  <div
                    style={{ width: `${medPct}%` }}
                    className="h-full bg-[#FFC01E] transition-all duration-700"
                    title={`Medium: ${lcMedium} (${medPct.toFixed(1)}%)`}
                  />
                  <div
                    style={{ width: `${hardPct}%` }}
                    className="h-full bg-[#FF375F] transition-all duration-700"
                    title={`Hard: ${lcHard} (${hardPct.toFixed(1)}%)`}
                  />
                </div>
              </div>

              {/* Small Authentic LeetCode Heatmap */}
              <div className="mt-4 rounded-xl border border-white/5 bg-[#08131e]/70 p-4">
                <div className="flex items-center justify-between pb-2 text-xs">
                  <span className="font-mono text-[11px] text-white/50">
                    {hoveredLcDay ? (
                      <span className="text-[#FFA116]">
                        {hoveredLcDay.count === 0 ? "No" : hoveredLcDay.count} submission{hoveredLcDay.count === 1 ? "" : "s"} on {formatDate(hoveredLcDay.date)}
                      </span>
                    ) : (
                      <span>Submission Timeline (Last 53 Weeks)</span>
                    )}
                  </span>
                  <div className="flex items-center gap-1 font-mono text-[10px] text-white/40">
                    <span>Less</span>
                    <span className="h-2 w-2 rounded-[1.5px] bg-white/[0.05]" />
                    <span className="h-2 w-2 rounded-[1.5px] bg-[#FFA116]/25" />
                    <span className="h-2 w-2 rounded-[1.5px] bg-[#FFA116]/50" />
                    <span className="h-2 w-2 rounded-[1.5px] bg-[#FFA116]/75" />
                    <span className="h-2 w-2 rounded-[1.5px] bg-[#FFA116] shadow-[0_0_4px_rgba(255,161,22,0.6)]" />
                    <span>More</span>
                  </div>
                </div>

                {/* Grid of mini cells */}
                <div className="overflow-x-auto pb-1 pt-1.5 scrollbar-thin">
                  <div className="flex gap-[2px] min-w-max select-none">
                    {lcWeeks.map((week, colIdx) => (
                      <div key={`lc-col-${colIdx}`} className="flex flex-col gap-[2px]">
                        {week.map((day, rowIdx) => {
                          if (!day) {
                            return (
                              <div
                                key={`lc-empty-${colIdx}-${rowIdx}`}
                                className="h-2.5 w-2.5 rounded-[1.5px] opacity-0"
                              />
                            );
                          }
                          const isHovered = hoveredLcDay?.date === day.date;
                          let bg = "bg-white/[0.05]";
                          if (day.level === 1) bg = "bg-[#FFA116]/25";
                          else if (day.level === 2) bg = "bg-[#FFA116]/50";
                          else if (day.level === 3) bg = "bg-[#FFA116]/75";
                          else if (day.level === 4) bg = "bg-[#FFA116] shadow-[0_0_4px_rgba(255,161,22,0.7)]";

                          return (
                            <div
                              key={day.date}
                              onMouseEnter={() => setHoveredLcDay(day)}
                              onMouseLeave={() => setHoveredLcDay(null)}
                              title={`${day.count} submission${day.count === 1 ? "" : "s"} on ${formatDate(day.date)}`}
                              className={`h-2.5 w-2.5 rounded-[1.5px] transition-transform cursor-pointer ${bg} ${
                                isHovered ? "scale-150 z-10 !bg-[#FFA116] !border-white shadow-glow" : ""
                              }`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action CTA Button */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <a
                href={data?.leetcode?.profileUrl || "https://leetcode.com/u/sumit2003dev/"}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn flex items-center justify-center gap-2 w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:border-[#FFA116]/50 hover:bg-[#FFA116]/10 hover:text-[#FFA116] hover:shadow-[0_0_20px_rgba(255,161,22,0.2)]"
              >
                <span>View LeetCode Profile</span>
                <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Global Section Provenance Note */}
        <div data-reveal className="mt-6 flex flex-wrap items-center justify-between gap-3 text-[11px] text-white/45 pl-1">
          <p>
            * GitHub telemetry verified via REST API v3 & jogruber transcript. LeetCode statistics retrieved from official GraphQL public profile.
          </p>
          {formattedSyncTime && (
            <span className="font-mono text-white/35">
              Updated: {formattedSyncTime}
            </span>
          )}
        </div>
      </div>
    </Section>
  );
}
