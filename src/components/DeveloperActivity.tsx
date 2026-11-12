import { useState, useEffect, useRef, useMemo } from "react";
import Section from "./Section";
import { useFadeUp, useCounter } from "@/hooks/use-scroll";
import { asset } from "@/lib/data";
import {
  ExternalLink,
  Trophy,
  Activity,
  Flame,
  CheckCircle2,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { SiLeetcode } from "react-icons/si";

interface LeetCodeDay {
  date: string;
  count: number;
  level: number;
}

interface LeetCodeActivityData {
  status: string;
  syncedAt?: string;
  username: string;
  profileUrl: string;
  ranking?: number | null;
  avatarUrl?: string;
  totalSolved?: number | null;
  easySolved?: number | null;
  mediumSolved?: number | null;
  hardSolved?: number | null;
  totalQuestions?: {
    easy: number;
    medium: number;
    hard: number;
    all: number;
  } | null;
  contestRating?: number | null;
  contestGlobalRank?: number | null;
  submissionsTotal?: number | null;
  activityCalendar?: {
    daysCount: number;
    startDate: string;
    endDate: string;
    days: LeetCodeDay[];
  };
  provider?: string;
  provenance?: string;
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

export default function DeveloperActivity() {
  const ref = useRef<HTMLDivElement>(null);
  useFadeUp(ref);

  const [data, setData] = useState<LeetCodeActivityData | null>(null);
  const [syncStatus, setSyncStatus] = useState<"loading" | "synced" | "cached" | "error">("loading");
  const [hoveredDay, setHoveredDay] = useState<LeetCodeDay | null>(null);

  useEffect(() => {
    let isMounted = true;

    // 1. Try reading localStorage cache first
    try {
      const cached = localStorage.getItem("lc_activity_snapshot");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.activityCalendar && Array.isArray(parsed.activityCalendar.days)) {
          if (isMounted) {
            setData(parsed);
            setSyncStatus(parsed.status === "cached" ? "cached" : "cached");
          }
        }
      }
    } catch {
      // Ignore localStorage read failures
    }

    // 2. Fetch runtime snapshot from public/data/leetcode-activity.json (with fallback to developer-activity.json)
    const loadSnapshot = async () => {
      try {
        const cacheWindow = Math.floor(Date.now() / (1000 * 60 * 15));
        let snapshotData: LeetCodeActivityData | null = null;

        // Try dedicated leetcode-activity.json first
        try {
          const resp = await fetch(`${asset("data/leetcode-activity.json")}?v=${cacheWindow}`);
          if (resp.ok) {
            snapshotData = await resp.json();
          }
        } catch {
          // Fall through to developer-activity.json
        }

        // Fallback to developer-activity.json
        if (!snapshotData || !snapshotData.activityCalendar) {
          const fallbackResp = await fetch(`${asset("data/developer-activity.json")}?v=${cacheWindow}`);
          if (fallbackResp.ok) {
            const devJson = await fallbackResp.json();
            if (devJson && devJson.leetcode) {
              snapshotData = {
                status: devJson.leetcode.status || devJson.status || "success",
                syncedAt: devJson.leetcode.syncedAt || devJson.syncedAt,
                ...devJson.leetcode,
              };
            }
          }
        }

        if (isMounted && snapshotData && snapshotData.activityCalendar && Array.isArray(snapshotData.activityCalendar.days)) {
          setData(snapshotData);
          setSyncStatus(snapshotData.status === "cached" ? "cached" : snapshotData.status === "success" ? "synced" : "cached");
          try {
            localStorage.setItem("lc_activity_snapshot", JSON.stringify(snapshotData));
          } catch {
            // Ignore quota errors
          }
        } else if (isMounted) {
          setSyncStatus((prev) => (prev === "cached" ? "cached" : "error"));
        }
      } catch (err) {
        if (isMounted) {
          console.warn("Using cached LeetCode activity snapshot fallback:", err);
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

  // Group daily submission counts into 53 weeks (columns)
  const calendarData = useMemo(() => {
    if (!data?.activityCalendar?.days) return { weeks: [], monthHeaders: [] };
    const days = data.activityCalendar.days;

    const weeks: (LeetCodeDay | null)[][] = [];
    let currentWeek: (LeetCodeDay | null)[] = [];

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
  }, [data?.activityCalendar?.days]);

  // Authentic profile fields - NO hardcoded statistic fallbacks
  const username = data?.username || "sumit2003dev";
  const profileUrl = data?.profileUrl || "https://leetcode.com/u/sumit2003dev/";
  const totalSolved = typeof data?.totalSolved === "number" ? data.totalSolved : null;
  const easySolved = typeof data?.easySolved === "number" ? data.easySolved : null;
  const mediumSolved = typeof data?.mediumSolved === "number" ? data.mediumSolved : null;
  const hardSolved = typeof data?.hardSolved === "number" ? data.hardSolved : null;
  const contestRating = typeof data?.contestRating === "number" ? data.contestRating : null;
  const submissionsTotal = typeof data?.submissionsTotal === "number" ? data.submissionsTotal : null;

  const startDateFormatted = data?.activityCalendar?.startDate ? formatDate(data.activityCalendar.startDate) : null;
  const endDateFormatted = data?.activityCalendar?.endDate ? formatDate(data.activityCalendar.endDate) : null;

  // Difficulty proportions - calculate only if authentic counts exist
  const hasDifficultyBreakdown =
    totalSolved !== null &&
    totalSolved > 0 &&
    easySolved !== null &&
    mediumSolved !== null &&
    hardSolved !== null;

  const easyPct = hasDifficultyBreakdown ? (easySolved / totalSolved) * 100 : null;
  const medPct = hasDifficultyBreakdown ? (mediumSolved / totalSolved) * 100 : null;
  const hardPct = hasDifficultyBreakdown ? (hardSolved / totalSolved) * 100 : null;

  const difficultyTiers = [
    { name: "Easy", count: easySolved, percentage: easyPct, color: "#00B8A3" },
    { name: "Medium", count: mediumSolved, percentage: medPct, color: "#FFC01E" },
    { name: "Hard", count: hardSolved, percentage: hardPct, color: "#FF375F" },
  ];

  return (
    <Section id="activity" word="ACTIVITY">
      {/* Anchor targets for backward compatibility */}
      <div id="leetcode" className="sr-only" aria-hidden="true" />
      <div id="github" className="sr-only" aria-hidden="true" />
      <div id="github-stats" className="sr-only" aria-hidden="true" />

      <div ref={ref} className="relative z-10">
        {/* Section Heading & Identity */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div data-reveal className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-lg bg-[#FFA116]/15 text-[#FFA116]">
                <SiLeetcode className="h-3.5 w-3.5" />
              </span>
              <span className="font-condensed text-xs uppercase tracking-[0.25em] text-ember-500 font-semibold">
                Algorithms & Problem Solving
              </span>
            </div>
            <h2 data-reveal className="mt-2 font-display text-huge uppercase leading-[1.05] text-white">
              LeetCode <span className="text-ember-500 text-glow">Activity.</span>
            </h2>
            <p data-reveal className="mt-3 max-w-2xl text-sm sm:text-base text-white/60">
              Problem solving. Consistency. Competitive programming.
            </p>
          </div>

          <div data-reveal className="flex flex-wrap items-center gap-3">
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ember flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider"
              title="Open LeetCode Profile"
            >
              <SiLeetcode className="h-4 w-4" />
              <span>Visit @{username}</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
          </div>
        </div>

        {/* 4 Premium Metric Cards Across the Top */}
        <div data-reveal className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {/* Card 1: Total Problems Solved */}
          <div className="glass relative overflow-hidden rounded-2xl border border-white/10 p-4 sm:p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-ember-500/40 hover:shadow-glow">
            <div className="flex items-center justify-between">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-ember-500/15 text-ember-400">
                <Trophy className="h-4 w-4" />
              </span>
              <span className="font-mono text-[10px] text-ember-400/90 bg-ember-500/10 px-2 py-0.5 rounded-full border border-ember-500/20">
                All Difficulties
              </span>
            </div>
            <div className="mt-4">
              <p className="font-display text-2xl sm:text-3xl text-white">
                {totalSolved !== null ? (
                  <StatCounter value={totalSolved} />
                ) : (
                  <span className="font-sans text-xl text-white/40">Unavailable</span>
                )}
              </p>
              <p className="mt-0.5 font-condensed text-[11px] uppercase tracking-wider text-white/50">
                Total Problems Solved
              </p>
            </div>
          </div>

          {/* Card 2: Easy Problems Solved */}
          <div className="glass relative overflow-hidden rounded-2xl border border-white/10 p-4 sm:p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-glow">
            <div className="flex items-center justify-between">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-500/15 text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
              </span>
              <span className="font-mono text-[10px] text-emerald-400/90 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Easy Tier
              </span>
            </div>
            <div className="mt-4">
              <p className="font-display text-2xl sm:text-3xl text-emerald-400">
                {easySolved !== null ? (
                  <StatCounter value={easySolved} />
                ) : (
                  <span className="font-sans text-xl text-white/40">Unavailable</span>
                )}
              </p>
              <p className="mt-0.5 font-condensed text-[11px] uppercase tracking-wider text-white/50">
                Easy Problems Solved
              </p>
            </div>
          </div>

          {/* Card 3: Medium Problems Solved */}
          <div className="glass relative overflow-hidden rounded-2xl border border-white/10 p-4 sm:p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-500/40 hover:shadow-glow">
            <div className="flex items-center justify-between">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#FFC01E]/15 text-[#FFC01E]">
                <Flame className="h-4 w-4" />
              </span>
              <span className="font-mono text-[10px] text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                Medium Tier
              </span>
            </div>
            <div className="mt-4">
              <p className="font-display text-2xl sm:text-3xl text-[#FFC01E]">
                {mediumSolved !== null ? (
                  <StatCounter value={mediumSolved} />
                ) : (
                  <span className="font-sans text-xl text-white/40">Unavailable</span>
                )}
              </p>
              <p className="mt-0.5 font-condensed text-[11px] uppercase tracking-wider text-white/50">
                Medium Problems Solved
              </p>
            </div>
          </div>

          {/* Card 4: Contest Rating */}
          <div className="glass relative overflow-hidden rounded-2xl border border-white/10 p-4 sm:p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-500/40 hover:shadow-glow">
            <div className="flex items-center justify-between">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-purple-500/15 text-purple-400">
                <Activity className="h-4 w-4" />
              </span>
              <span className="font-mono text-[10px] text-purple-400/90 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                Official Rating
              </span>
            </div>
            <div className="mt-4">
              <p className="font-display text-2xl sm:text-3xl text-purple-300">
                {contestRating !== null ? (
                  <StatCounter value={Math.round(contestRating)} />
                ) : (
                  <span className="font-sans text-xl text-white/40">Unavailable</span>
                )}
              </p>
              <p className="mt-0.5 font-condensed text-[11px] uppercase tracking-wider text-white/50">
                Contest Rating
              </p>
            </div>
          </div>
        </div>

        {/* Horizontal Synchronization / Status Bar */}
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
                Checking LeetCode Telemetry...
              </span>
            ) : syncStatus === "cached" ? (
              <span className="flex items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-0.5 text-[10px] font-mono text-yellow-400">
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                Cached Snapshot
              </span>
            ) : (
              <span className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-0.5 text-[10px] font-mono text-red-400">
                <AlertCircle className="h-3 w-3" />
                Unavailable
              </span>
            )}
            <span>
              {syncStatus === "synced" && formattedSyncTime ? (
                <>Verified snapshot from {data?.provenance || "LeetCode Public Profile"} · Synced <strong className="text-white">{formattedSyncTime}</strong></>
              ) : syncStatus === "cached" && formattedSyncTime ? (
                <>Cached snapshot from {data?.provenance || "prior sync"} · Preserved from <strong className="text-white">{formattedSyncTime}</strong></>
              ) : syncStatus === "loading" ? (
                <>Loading LeetCode activity records...</>
              ) : (
                <>LeetCode activity records unavailable</>
              )}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-white/40">
            <span className="font-mono text-white/60">@{username}</span>
            <span className="h-3 w-px bg-white/10" />
            <span className="font-mono">{startDateFormatted && endDateFormatted ? `${startDateFormatted} — ${endDateFormatted}` : "12-Month Transcript"}</span>
            <span className="h-3 w-px bg-white/10" />
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ember-400 hover:underline flex items-center gap-1 font-medium"
            >
              <span>View Profile</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Large Submission Activity Heatmap Panel */}
        <div data-reveal className="mt-6 rounded-2xl border border-white/10 bg-[#08131e]/75 p-5 sm:p-6 backdrop-blur-xl">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-ember-400" />
                <h3 className="font-display text-lg uppercase tracking-wide text-white">
                  Submission Activity Heatmap
                </h3>
                <span className="rounded-full bg-ember-500/15 border border-ember-500/30 px-2 py-0.5 font-mono text-[11px] text-ember-400">
                  {submissionsTotal !== null
                    ? `${submissionsTotal.toLocaleString()} Submissions`
                    : totalSolved !== null
                    ? `${totalSolved.toLocaleString()} Solved`
                    : "Unavailable"}
                </span>
              </div>
              <p className="mt-1 text-xs text-white/50">
                {hoveredDay ? (
                  <span className="text-ember-300 font-mono">
                    {hoveredDay.count === 0 ? "No" : hoveredDay.count} submission{hoveredDay.count === 1 ? "" : "s"} on {formatDate(hoveredDay.date)}
                  </span>
                ) : startDateFormatted && endDateFormatted ? (
                  <span>Verified 12-month submission timeline from {startDateFormatted} to {endDateFormatted}.</span>
                ) : (
                  <span>Verified 12-month submission timeline.</span>
                )}
              </p>
            </div>

            {/* Heatmap 5-Level Intensity Legend */}
            <div className="flex items-center gap-2 text-[11px] font-mono text-white/50">
              <span>Less</span>
              <div className="flex items-center gap-1">
                <span className="h-3 w-3 rounded-[2.5px] bg-white/[0.04] border border-white/[0.06]" title="Level 0: 0 submissions" />
                <span className="h-3 w-3 rounded-[2.5px] bg-ember-500/25 border border-ember-500/30" title="Level 1: 1–2 submissions" />
                <span className="h-3 w-3 rounded-[2.5px] bg-ember-500/50 border border-ember-500/50" title="Level 2: 3–5 submissions" />
                <span className="h-3 w-3 rounded-[2.5px] bg-ember-500/80 border border-ember-500/75" title="Level 3: 6–9 submissions" />
                <span className="h-3 w-3 rounded-[2.5px] bg-ember-500 border border-ember-400 shadow-[0_0_8px_rgba(255,106,0,0.6)]" title="Level 4: 10+ submissions" />
              </div>
              <span>More</span>
            </div>
          </div>

          {/* Calendar Heatmap Container */}
          <div className="mt-5 overflow-x-auto pb-3 pt-1 scrollbar-thin">
            {calendarData.weeks.length > 0 ? (
              <div className="min-w-[840px] select-none">
                {/* Month Labels Header */}
                <div className="relative mb-2 h-4 text-[10px] font-mono text-white/45">
                  {calendarData.monthHeaders.map((m, idx) => {
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
                              title={`${day.count === 0 ? "No" : day.count} submission${day.count === 1 ? "" : "s"} on ${formatDate(day.date)}`}
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
            ) : (
              <div className="py-8 text-center text-xs font-mono text-white/40">
                Activity calendar data unavailable.
              </div>
            )}
          </div>
        </div>

        {/* Problem Difficulty Distribution Panel */}
        <div data-reveal className="mt-6 rounded-2xl border border-white/10 bg-[#08131e]/75 p-5 sm:p-6 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-3 gap-2">
            <div>
              <h3 className="font-condensed text-xs uppercase tracking-[0.2em] text-ember-500 font-semibold">
                Problem Difficulty Distribution
              </h3>
              <p className="mt-0.5 text-[11px] text-white/50">
                Authentic distribution across Easy, Medium, and Hard problem tiers.
              </p>
            </div>
            <span className="font-mono text-xs text-white/60">
              {totalSolved !== null ? `${totalSolved} Total Solved` : "Unavailable"}
            </span>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {difficultyTiers.map((t) => (
              <div key={t.name} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs pb-2">
                    <span className="font-medium text-white flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: t.color }} />
                      {t.name}
                    </span>
                    <span className="font-mono text-xs text-ember-400 font-semibold">
                      {t.percentage !== null ? `${t.percentage.toFixed(1)}%` : "Unavailable"}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${t.percentage ?? 0}%`, backgroundColor: t.color }}
                    />
                  </div>
                </div>
                <p className="mt-3 text-xs font-mono text-white/50">
                  {t.count !== null ? `${t.count} Solved` : "Unavailable"}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-4 text-[10px] text-white/40 border-t border-white/5 pt-3">
            * Difficulty proportions derived directly from verified LeetCode problem solve statistics.
          </p>
        </div>

        {/* Global Section Provenance Note */}
        <p data-reveal className="mt-4 text-[11px] text-white/45 pl-1">
          * {data?.provenance || "Daily submission records and problem-solving statistics retrieved server-side from official LeetCode public profile."}
        </p>
      </div>
    </Section>
  );
}
