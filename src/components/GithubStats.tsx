import { useState, useEffect, useRef, useMemo } from "react";
import Section from "./Section";
import { useFadeUp, useCounter } from "@/hooks/use-scroll";
import { asset } from "@/lib/data";
import {
  Github,
  FolderGit2,
  Star,
  GitFork,
  Code2,
  Calendar,
  Sparkles,
  ExternalLink,
  Activity,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Layers,
} from "lucide-react";

interface GitHubDay {
  date: string;
  count: number;
  level: number;
}

interface GitHubLanguage {
  name: string;
  bytes: number;
  percentage: number;
  color: string;
}

interface GitHubRepo {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  languageColor: string;
  url: string;
  updatedAt: string;
}

interface GitHubActivityData {
  status: string;
  syncedAt: string;
  username: string;
  profile: {
    name: string;
    publicRepos: number;
    followers: number;
    profileUrl: string;
    avatarUrl?: string;
  };
  contributions: {
    total: number;
    calculatedTotal: number;
    totalLastYear: number;
    daysCount: number;
    startDate: string;
    endDate: string;
    days: GitHubDay[];
  };
  languages: GitHubLanguage[];
  totalLanguageBytes: number;
  repositories: GitHubRepo[];
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

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
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

export default function GithubStats() {
  const ref = useRef<HTMLDivElement>(null);
  useFadeUp(ref);

  const [data, setData] = useState<GitHubActivityData | null>(null);
  const [syncStatus, setSyncStatus] = useState<"loading" | "synced" | "cached" | "error">("loading");
  const [hoveredDay, setHoveredDay] = useState<GitHubDay | null>(null);

  useEffect(() => {
    let isMounted = true;

    // 1. Try reading localStorage cache first
    try {
      const cached = localStorage.getItem("gh_activity_snapshot");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.contributions && Array.isArray(parsed.contributions.days)) {
          if (isMounted) {
            setData(parsed);
            setSyncStatus("cached");
          }
        }
      }
    } catch {
      // Ignore localStorage read failures
    }

    // 2. Fetch runtime snapshot from public/data/github-activity.json
    const loadSnapshot = async () => {
      try {
        const cacheWindow = Math.floor(Date.now() / (1000 * 60 * 15));
        const snapshotUrl = `${asset("data/github-activity.json")}?v=${cacheWindow}`;
        const resp = await fetch(snapshotUrl);
        if (!resp.ok) {
          throw new Error(`HTTP ${resp.status}`);
        }
        const json: GitHubActivityData = await resp.json();
        if (isMounted && json && json.contributions && Array.isArray(json.contributions.days)) {
          setData(json);
          setSyncStatus(json.status === "success" ? "synced" : "cached");
          try {
            localStorage.setItem("gh_activity_snapshot", JSON.stringify(json));
          } catch {
            // Ignore localStorage quota failures
          }
        }
      } catch (err) {
        if (isMounted) {
          console.warn("Using cached GitHub activity snapshot fallback:", err);
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

  // Group daily contributions into 53 weeks (columns)
  const calendarData = useMemo(() => {
    if (!data?.contributions?.days) return { weeks: [], monthHeaders: [] };
    const days = data.contributions.days;

    const weeks: (GitHubDay | null)[][] = [];
    let currentWeek: (GitHubDay | null)[] = [];

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

    // Determine month headers with at least 2 columns gap
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthHeaders: { colIndex: number; label: string }[] = [];
    let lastMonth = -1;
    let lastCol = -10;

    weeks.forEach((week, colIdx) => {
      const firstValid = week.find((d) => d !== null);
      if (!firstValid) return;
      const m = parseInt(firstValid.date.split("-")[1], 10) - 1;
      if (m !== lastMonth && colIdx - lastCol >= 2) {
        monthHeaders.push({ colIndex: colIdx, label: monthNames[m] });
        lastMonth = m;
        lastCol = colIdx;
      }
    });

    return { weeks, monthHeaders };
  }, [data?.contributions?.days]);

  // Fallback defaults if initial load is pending
  const totalContributions = data?.contributions?.total ?? 123;
  const publicRepos = data?.profile?.publicRepos ?? 13;
  const languages = data?.languages ?? [];
  const repositories = data?.repositories ?? [];
  const startDateFormatted = data?.contributions?.startDate ? formatDate(data.contributions.startDate) : "Nov 9, 2025";
  const endDateFormatted = data?.contributions?.endDate ? formatDate(data.contributions.endDate) : "Nov 10, 2026";

  return (
    <Section id="github-stats" word="ACTIVITY">
      <div ref={ref} className="relative z-10">
        {/* Section Heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div data-reveal className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-lg bg-ember-500/15 text-ember-500">
                <Github className="h-3.5 w-3.5" />
              </span>
              <span className="font-condensed text-xs uppercase tracking-[0.25em] text-ember-500 font-semibold">
                Open Source & Engineering
              </span>
            </div>
            <h2 data-reveal className="mt-2 font-display text-huge uppercase leading-[1.05] text-white">
              GitHub <span className="text-ember-500 text-glow">Activity</span> & Stack
            </h2>
            <p data-reveal className="mt-3 max-w-2xl text-sm sm:text-base text-white/60">
              Authentic contribution telemetry, verified repository statistics, and codebase language distribution synchronized directly from GitHub.
            </p>
          </div>

          <div data-reveal className="flex flex-wrap items-center gap-3">
            <a
              href={data?.profile?.profileUrl || "https://github.com/Sumit2003-dev"}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ember flex items-center gap-2 px-4 py-2 text-xs font-semibold"
              title="Open GitHub Profile"
            >
              <Github className="h-4 w-4" />
              <span>Visit @Sumit2003-dev</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div data-reveal className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {/* Total Contributions */}
          <div className="glass relative overflow-hidden rounded-2xl border border-white/10 p-4 sm:p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-ember-500/40 hover:shadow-glow">
            <div className="flex items-center justify-between">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-ember-500/15 text-ember-400">
                <Activity className="h-4 w-4" />
              </span>
              <span className="font-mono text-[10px] text-ember-400/90 bg-ember-500/10 px-2 py-0.5 rounded-full border border-ember-500/20">
                12-Month Total
              </span>
            </div>
            <div className="mt-4">
              <p className="font-display text-2xl sm:text-3xl text-white">
                <StatCounter value={totalContributions} />
              </p>
              <p className="mt-0.5 font-condensed text-[11px] uppercase tracking-wider text-white/50">
                Contributions (Last Year)
              </p>
            </div>
          </div>

          {/* Public Repositories */}
          <div className="glass relative overflow-hidden rounded-2xl border border-white/10 p-4 sm:p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-ember-500/40 hover:shadow-glow">
            <div className="flex items-center justify-between">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-blue-500/15 text-blue-400">
                <Code2 className="h-4 w-4" />
              </span>
              <span className="font-mono text-[10px] text-blue-400/90 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                GitHub API v3
              </span>
            </div>
            <div className="mt-4">
              <p className="font-display text-2xl sm:text-3xl text-blue-400">
                <StatCounter value={publicRepos} />
              </p>
              <p className="mt-0.5 font-condensed text-[11px] uppercase tracking-wider text-white/50">
                Public Repositories
              </p>
            </div>
          </div>

          {/* Codebase Scale */}
          <div className="glass relative overflow-hidden rounded-2xl border border-white/10 p-4 sm:p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-ember-500/40 hover:shadow-glow">
            <div className="flex items-center justify-between">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-500/15 text-emerald-400">
                <Layers className="h-4 w-4" />
              </span>
              <span className="font-mono text-[10px] text-emerald-400/90 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Active Source
              </span>
            </div>
            <div className="mt-4">
              <p className="font-display text-2xl sm:text-3xl text-emerald-400">
                {data ? formatBytes(data.totalLanguageBytes) : "3.51 MB"}
              </p>
              <p className="mt-0.5 font-condensed text-[11px] uppercase tracking-wider text-white/50">
                Tracked Codebase Bytes
              </p>
            </div>
          </div>

          {/* Primary Stack */}
          <div className="glass relative overflow-hidden rounded-2xl border border-white/10 p-4 sm:p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-ember-500/40 hover:shadow-glow">
            <div className="flex items-center justify-between">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-purple-500/15 text-purple-400">
                <Cpu className="h-4 w-4" />
              </span>
              <span className="font-mono text-[10px] text-purple-400/90 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                Dominant Focus
              </span>
            </div>
            <div className="mt-4">
              <p className="font-display text-xl sm:text-2xl text-purple-300 truncate">
                TypeScript / Python
              </p>
              <p className="mt-0.5 font-condensed text-[11px] uppercase tracking-wider text-white/50">
                Primary Development Stack
              </p>
            </div>
          </div>
        </div>

        {/* Provenance & Synchronization Notice Bar */}
        <div data-reveal className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-xs text-white/60 backdrop-blur">
          <div className="flex items-center gap-2">
            {syncStatus === "synced" ? (
              <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-mono text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Sync Active
              </span>
            ) : syncStatus === "loading" ? (
              <span className="flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-mono text-blue-400">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-ping" />
                Checking GitHub Data...
              </span>
            ) : syncStatus === "cached" ? (
              <span className="flex items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-0.5 text-[10px] font-mono text-yellow-400">
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                Cached Snapshot
              </span>
            ) : (
              <span className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-0.5 text-[10px] font-mono text-red-400">
                <AlertCircle className="h-3 w-3" />
                Snapshot Fallback
              </span>
            )}
            <span>
              {syncStatus === "synced" && formattedSyncTime ? (
                <>Verified snapshot synced from GitHub REST API & jogruber · Updated <strong className="text-white">{formattedSyncTime}</strong></>
              ) : syncStatus === "loading" ? (
                <>Loading GitHub activity records...</>
              ) : (
                <>Offline / cached snapshot fallback</>
              )}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-white/40">
            <span className="font-mono">12-Month Transcript</span>
            <span className="h-3 w-px bg-white/10" />
            <a
              href="https://github.com/Sumit2003-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ember-400 hover:underline flex items-center gap-1"
            >
              <span>View Profile</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Authentic Contribution Heatmap Card */}
        <div data-reveal className="mt-6 rounded-2xl border border-white/10 bg-[#08131e]/75 p-5 sm:p-6 backdrop-blur-xl">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-ember-400" />
                <h3 className="font-display text-lg uppercase tracking-wide text-white">
                  Contribution Heatmap
                </h3>
                <span className="rounded-full bg-ember-500/15 border border-ember-500/30 px-2 py-0.5 font-mono text-[11px] text-ember-400">
                  {totalContributions} Contributions
                </span>
              </div>
              <p className="mt-1 text-xs text-white/50">
                {hoveredDay ? (
                  <span className="text-ember-300 font-mono">
                    {hoveredDay.count === 0 ? "No" : hoveredDay.count} contribution{hoveredDay.count === 1 ? "" : "s"} on {formatDate(hoveredDay.date)}
                  </span>
                ) : (
                  <span>Verified 12-month activity timeline from {startDateFormatted} to {endDateFormatted}.</span>
                )}
              </p>
            </div>

            {/* Heatmap 5-Level Intensity Legend */}
            <div className="flex items-center gap-2 text-[11px] font-mono text-white/50">
              <span>Less</span>
              <div className="flex items-center gap-1">
                <span className="h-3 w-3 rounded-[2.5px] bg-white/[0.04] border border-white/[0.06]" title="Level 0: 0 contributions" />
                <span className="h-3 w-3 rounded-[2.5px] bg-ember-500/25 border border-ember-500/30" title="Level 1: 1–3 contributions" />
                <span className="h-3 w-3 rounded-[2.5px] bg-ember-500/50 border border-ember-500/50" title="Level 2: 4–6 contributions" />
                <span className="h-3 w-3 rounded-[2.5px] bg-ember-500/75 border border-ember-500/70" title="Level 3: 7–9 contributions" />
                <span className="h-3 w-3 rounded-[2.5px] bg-ember-500 border border-ember-400 shadow-[0_0_8px_rgba(255,106,0,0.6)]" title="Level 4: 10+ contributions" />
              </div>
              <span>More</span>
            </div>
          </div>

          {/* Calendar Heatmap Container */}
          <div className="mt-5 overflow-x-auto pb-3 pt-1 scrollbar-thin">
            <div className="min-w-[840px] select-none">
              {/* Month Labels Header */}
              <div className="relative mb-2 h-4 text-[10px] font-mono text-white/45">
                {calendarData.monthHeaders.map((m, idx) => {
                  // Approximate pixel offset: ~32px for weekday column + colIndex * 16px
                  const leftPx = 32 + m.colIndex * 15.5;
                  return (
                    <span
                      key={`${m.label}-${idx}`}
                      className="absolute"
                      style={{ left: `${leftPx}px` }}
                    >
                      {m.label}
                    </span>
                  );
                })}
              </div>

              {/* Heatmap Grid with Weekday Labels on Left */}
              <div className="flex items-start gap-1.5">
                {/* Weekday Names (Mon, Wed, Fri) */}
                <div className="flex flex-col justify-between py-[2px] pr-2 text-[10px] font-mono text-white/35 h-[105px]">
                  <span>Mon</span>
                  <span>Wed</span>
                  <span>Fri</span>
                </div>

                {/* 53 Columns of 7 Days */}
                <div className="flex gap-[2.5px]">
                  {calendarData.weeks.map((week, colIdx) => (
                    <div key={`col-${colIdx}`} className="flex flex-col gap-[2.5px]">
                      {week.map((day, rowIdx) => {
                        if (!day) {
                          return (
                            <div
                              key={`empty-${colIdx}-${rowIdx}`}
                              className="h-[12.5px] w-[12.5px] sm:h-[13px] sm:w-[13px] rounded-[2px] opacity-0"
                            />
                          );
                        }

                        // Determine intensity color
                        const isHovered = hoveredDay?.date === day.date;
                        let cellColor = "bg-white/[0.04] border border-white/[0.06]";
                        if (day.level === 1) cellColor = "bg-ember-500/25 border border-ember-500/35";
                        else if (day.level === 2) cellColor = "bg-ember-500/50 border border-ember-500/55";
                        else if (day.level === 3) cellColor = "bg-ember-500/80 border border-ember-500/75";
                        else if (day.level === 4) cellColor = "bg-ember-500 border border-ember-400 shadow-[0_0_8px_rgba(255,106,0,0.6)]";

                        return (
                          <div
                            key={day.date}
                            onMouseEnter={() => setHoveredDay(day)}
                            onMouseLeave={() => setHoveredDay(null)}
                            onClick={() => setHoveredDay(day)}
                            title={`${day.count === 0 ? "No" : day.count} contribution${day.count === 1 ? "" : "s"} on ${formatDate(day.date)}`}
                            className={`h-[12.5px] w-[12.5px] sm:h-[13px] sm:w-[13px] rounded-[2.5px] transition-all duration-200 cursor-pointer ${cellColor} ${
                              isHovered ? "scale-125 z-10 !border-white !bg-ember-400 shadow-glow" : ""
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
        </div>

        {/* Split Section: Codebase Languages & Selected Repositories */}
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          {/* Column 1: Language Breakdown (5 cols) */}
          <div data-reveal className="lg:col-span-5 rounded-2xl border border-white/10 bg-[#08131e]/75 p-5 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="font-condensed text-xs uppercase tracking-[0.2em] text-ember-500 font-semibold">
                    Codebase Language Distribution
                  </h3>
                  <p className="mt-0.5 text-[11px] text-white/50">
                    Calculated from actual source bytes across owned, active public repositories.
                  </p>
                </div>
                <span className="font-mono text-[10px] text-white/40">
                  {languages.length} Languages
                </span>
              </div>

              {/* Multi-segment Stacked Language Bar */}
              <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-white/10 flex">
                {languages.map((l) => (
                  <div
                    key={l.name}
                    className="h-full transition-all duration-700"
                    style={{
                      width: `${l.percentage}%`,
                      backgroundColor: l.color,
                    }}
                    title={`${l.name}: ${l.percentage}% (${formatBytes(l.bytes)})`}
                  />
                ))}
              </div>

              {/* Individual Language List */}
              <div className="mt-5 space-y-3">
                {languages.slice(0, 7).map((l) => (
                  <div key={l.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: l.color }}
                        />
                        <span className="font-medium text-white/85">{l.name}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span className="text-white/45">{formatBytes(l.bytes)}</span>
                        <span className="text-ember-400 font-semibold">{l.percentage}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${l.percentage}%`, backgroundColor: l.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-5 text-[10px] text-white/40 border-t border-white/5 pt-3">
              * Language proportions derived from repo language byte counts via GitHub REST API.
            </p>
          </div>

          {/* Column 2: Selected Repositories (7 cols) */}
          <div data-reveal className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#08131e]/75 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-condensed text-xs uppercase tracking-[0.2em] text-ember-500 font-semibold">
                  Featured Open-Source Repositories
                </h3>
                <p className="mt-0.5 text-[11px] text-white/50">
                  Active projects with verified stars, forks, and primary technology stack.
                </p>
              </div>
              <a
                href="https://github.com/Sumit2003-dev?tab=repositories"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-ember-400 hover:underline flex items-center gap-1 font-mono"
              >
                <span>All {publicRepos} Repos</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Repositories 2-Column Grid */}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {repositories.map((repo) => (
                <a
                  key={repo.name}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass group relative flex flex-col justify-between rounded-xl border border-white/10 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-ember-500/40 hover:shadow-glow text-left"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 truncate pr-2">
                        <FolderGit2 className="h-3.5 w-3.5 text-ember-400 shrink-0" />
                        <span className="font-display text-sm text-white group-hover:text-ember-400 transition-colors truncate">
                          {repo.name}
                        </span>
                      </div>
                      <ExternalLink className="h-3 w-3 text-white/30 group-hover:text-ember-400 shrink-0 transition-colors" />
                    </div>

                    <p className="mt-2 text-xs text-white/55 line-clamp-2 leading-relaxed">
                      {repo.description}
                    </p>
                  </div>

                  <div className="mt-3.5 flex items-center justify-between border-t border-white/5 pt-2 text-[11px] text-white/50 font-mono">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: repo.languageColor }}
                      />
                      <span>{repo.language}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-white/60">
                        <Star className="h-3 w-3 text-amber-400" />
                        <span>{repo.stars}</span>
                      </span>
                      <span className="flex items-center gap-1 text-white/60">
                        <GitFork className="h-3 w-3 text-blue-400" />
                        <span>{repo.forks}</span>
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Global Section Provenance Note */}
        <p data-reveal className="mt-4 text-[11px] text-white/45 pl-1">
          * Daily contribution records verified via jogruber GitHub calendar API. Public repositories, stargazers, forks, and language byte distributions retrieved server-side from official GitHub REST API v3.
        </p>
      </div>
    </Section>
  );
}
