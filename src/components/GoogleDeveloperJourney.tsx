import { useState, useRef, useMemo, useEffect } from "react";
import Section from "./Section";
import {
  skillsBoostStats,
  googleDevProgram,
  gdgLucknow,
  verifiedSkillBadges,
  googleDevBadges,
  GoogleSkillBadge,
} from "@/lib/googleDeveloperData";
import { asset } from "@/lib/data";
import { useFadeUp, useCounter } from "@/hooks/use-scroll";
import {
  Trophy,
  Flame,
  Sparkles,
  ExternalLink,
  Search,
  X,
  CheckCircle2,
  MapPin,
  Users,
  Award,
  ShieldCheck,
  Star,
  ChevronDown,
  RotateCcw,
  Info,
} from "lucide-react";
import { SiGooglecloud, SiGoogle } from "react-icons/si";

function StatCounter({ value, suffix }: { value: number; suffix?: string }) {
  const ref = useCounter(value);
  return (
    <span>
      <span ref={ref}>0</span>
      {suffix || ""}
    </span>
  );
}

// Google 4-Color Accent Dot Strip
function GoogleColorStrip({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`} aria-hidden>
      <span className="h-2 w-2 rounded-full bg-[#4285F4]" />
      <span className="h-2 w-2 rounded-full bg-[#EA4335]" />
      <span className="h-2 w-2 rounded-full bg-[#FBBC05]" />
      <span className="h-2 w-2 rounded-full bg-[#34A853]" />
    </div>
  );
}

export default function GoogleDeveloperJourney() {
  const ref = useRef<HTMLDivElement>(null);
  useFadeUp(ref);

  const [activeTab, setActiveTab] = useState<"skills-boost" | "dev-program" | "gdg">("skills-boost");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [visibleCount, setVisibleCount] = useState<number>(16);

  // Live Snapshot Sync State for Google Cloud Skills Boost
  const [skillBadges, setSkillBadges] = useState<GoogleSkillBadge[]>(verifiedSkillBadges);
  const [skillsStats, setSkillsStats] = useState(skillsBoostStats);
  const [syncStatus, setSyncStatus] = useState<"loading" | "synced" | "cached">("loading");
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadSnapshot = async () => {
      try {
        // Cache-busting 15-minute slice to fetch latest snapshot on GitHub Pages
        const cacheWindow = Math.floor(Date.now() / (1000 * 60 * 15));
        const snapshotUrl = `${asset("data/skills-snapshot.json")}?v=${cacheWindow}`;
        const response = await fetch(snapshotUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        if (isMounted && data && Array.isArray(data.badges) && data.badges.length > 0) {
          setSkillBadges(data.badges);
          setSkillsStats((prev) => ({
            ...prev,
            skillBadges: data.profile?.totalBadges || data.badges.length,
            points: data.profile?.points || prev.points,
            league: data.profile?.league || prev.league,
            lastVerified: data.profile?.lastVerified || prev.lastVerified,
          }));
          setLastSyncedTime(data.syncedAt || null);
          setSyncStatus(data.status === "success" ? "synced" : "cached");
        }
      } catch (err) {
        if (isMounted) {
          console.warn("Using bundled Skills Boost snapshot fallback:", err);
          setSyncStatus("cached");
        }
      }
    };

    loadSnapshot();
    return () => {
      isMounted = false;
    };
  }, []);

  const formattedSyncTime = useMemo(() => {
    if (!lastSyncedTime) return null;
    try {
      const d = new Date(lastSyncedTime);
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
  }, [lastSyncedTime]);

  // Filter skills boost badges
  const categories = ["All", "Generative AI", "Data & BigQuery", "Cloud Infrastructure", "Security & IAM", "DevOps & SRE"];

  // Filter developer program badges
  const devCategories = [
    "All",
    "Agent AI & Gemini",
    "Cloud & Infrastructure",
    "Developer Communities",
    "Recognitions & Learning",
  ];
  const [selectedDevCategory, setSelectedDevCategory] = useState<string>("All");
  const [devSearchQuery, setDevSearchQuery] = useState("");

  const filteredDevBadges = useMemo(() => {
    return googleDevBadges.filter((b) => {
      const matchCat = selectedDevCategory === "All" || b.category === selectedDevCategory;
      const q = devSearchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.skills.some((s) => s.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [devSearchQuery, selectedDevCategory]);

  const filteredBadges = useMemo(() => {
    return skillBadges.filter((b) => {
      const matchCat = selectedCategory === "All" || b.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        !query ||
        b.title.toLowerCase().includes(query) ||
        b.description.toLowerCase().includes(query) ||
        b.skills.some((s) => s.toLowerCase().includes(query));
      return matchCat && matchSearch;
    });
  }, [skillBadges, searchQuery, selectedCategory]);

  const displayedBadges = filteredBadges.slice(0, visibleCount);
  const hasMore = visibleCount < filteredBadges.length;

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <Section id="google-journey" word="GOOGLE DEV">
      <div ref={ref} className="relative z-10">
        {/* Section Heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div data-reveal className="flex items-center gap-3">
              <GoogleColorStrip />
              <span className="font-condensed text-xs uppercase tracking-[0.25em] text-ember-500 font-semibold">
                Google Cloud Ecosystem
              </span>
            </div>
            <h2 data-reveal className="mt-2 font-display text-huge uppercase leading-[1.05] text-white">
              Google Developer <span className="text-ember-500 text-glow">Journey</span>
            </h2>
            <p data-reveal className="mt-3 max-w-2xl text-sm sm:text-base text-white/60">
              Exploring Google Cloud, building technical skills, and growing through developer communities.
            </p>
          </div>

          {/* Public Profile Links */}
          <div data-reveal className="flex flex-wrap items-center gap-2">
            <a
              href={skillsBoostStats.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 rounded-full border border-ember-500/40 bg-ember-500/10 px-3.5 py-1.5 text-xs text-ember-400 transition-all hover:bg-ember-500 hover:text-black hover:shadow-glow"
              title="View public profile on Google Cloud Skills Boost"
            >
              <SiGooglecloud className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
              <span>Skills Boost Public Profile</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href={googleDevProgram.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs text-white/70 transition-all hover:border-ember-500/60 hover:text-white"
              title="View Google Developer Profile on g.dev"
            >
              <SiGoogle className="h-3.5 w-3.5 text-blue-400" />
              <span>g.dev/sumit2003dev</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div data-reveal className="mt-8 flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab("skills-boost")}
            className={`group relative flex items-center gap-2.5 rounded-full px-4 py-2 font-condensed text-xs uppercase tracking-wider transition-all ${
              activeTab === "skills-boost"
                ? "border border-ember-500/60 bg-ember-500/15 text-white shadow-glow"
                : "border border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:text-white"
            }`}
          >
            <SiGooglecloud className="h-3.5 w-3.5 text-blue-400" />
            <span>Cloud Skills Boost</span>
            <span className="rounded-full bg-ember-500/20 px-2 py-0.5 text-[10px] font-mono text-ember-400">
              {skillBadges.length} Badges
            </span>
          </button>

          <button
            onClick={() => setActiveTab("dev-program")}
            className={`group relative flex items-center gap-2.5 rounded-full px-4 py-2 font-condensed text-xs uppercase tracking-wider transition-all ${
              activeTab === "dev-program"
                ? "border border-ember-500/60 bg-ember-500/15 text-white shadow-glow"
                : "border border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:text-white"
            }`}
          >
            <Star className="h-3.5 w-3.5 text-yellow-400" />
            <span>Developer Program</span>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-mono text-white/70">
              {googleDevProgram.totalBadges} Badges · {googleDevProgram.membershipTier}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("gdg")}
            className={`group relative flex items-center gap-2.5 rounded-full px-4 py-2 font-condensed text-xs uppercase tracking-wider transition-all ${
              activeTab === "gdg"
                ? "border border-ember-500/60 bg-ember-500/15 text-white shadow-glow"
                : "border border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:text-white"
            }`}
          >
            <Users className="h-3.5 w-3.5 text-emerald-400" />
            <span>GDG Lucknow</span>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-mono text-white/70">
              Community Member
            </span>
          </button>
        </div>

        {/* =========================================================================
            TAB 1: Google Cloud Skills Boost
           ========================================================================= */}
        {activeTab === "skills-boost" && (
          <div className="mt-8 space-y-8">
            {/* Profile Statistics (Snapshot) */}
            <div data-reveal className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
              {/* Skill Badges */}
              <div
                onMouseMove={onMove}
                className="group glass relative overflow-hidden rounded-2xl border border-white/10 p-4 sm:p-5 text-center transition-all duration-500 hover:-translate-y-0.5 hover:border-ember-500/40 hover:shadow-glow"
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(180px circle at var(--mx,50%) var(--my,50%), rgba(255,106,0,0.18), transparent 70%)",
                  }}
                />
                <span className="mx-auto grid h-9 w-9 place-items-center rounded-xl bg-ember-500/15 text-ember-500">
                  <Trophy className="h-4 w-4" />
                </span>
                <p className="mt-3 font-display text-2xl sm:text-3xl text-ember-500">
                  <StatCounter value={skillBadges.length} />
                </p>
                <p className="mt-1 font-condensed text-xs uppercase tracking-wider text-white/60">Skill Badges</p>
                <span className="mt-2 inline-block rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] text-white/60 font-mono">
                  {syncStatus === "synced" ? "Synced Profile Count" : "Profile Snapshot"}
                </span>
              </div>

              {/* Arcade Points */}
              <div
                onMouseMove={onMove}
                className="group glass relative overflow-hidden rounded-2xl border border-white/10 p-4 sm:p-5 text-center transition-all duration-500 hover:-translate-y-0.5 hover:border-ember-500/40 hover:shadow-glow"
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(180px circle at var(--mx,50%) var(--my,50%), rgba(255,106,0,0.18), transparent 70%)",
                  }}
                />
                <span className="mx-auto grid h-9 w-9 place-items-center rounded-xl bg-ember-500/15 text-ember-500">
                  <Flame className="h-4 w-4" />
                </span>
                <p className="mt-3 font-display text-2xl sm:text-3xl text-ember-500">
                  <StatCounter value={skillsStats.points} />
                </p>
                <p className="mt-1 font-condensed text-xs uppercase tracking-wider text-white/60">Arcade Points</p>
                <span className="mt-2 inline-block text-[10px] text-white/40 font-mono">Public Profile Score</span>
              </div>

              {/* League Standing */}
              <div
                onMouseMove={onMove}
                className="group glass relative overflow-hidden rounded-2xl border border-white/10 p-4 sm:p-5 text-center transition-all duration-500 hover:-translate-y-0.5 hover:border-ember-500/40 hover:shadow-glow"
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(180px circle at var(--mx,50%) var(--my,50%), rgba(66,133,244,0.18), transparent 70%)",
                  }}
                />
                <span className="mx-auto grid h-9 w-9 place-items-center rounded-xl bg-blue-500/15 text-blue-400">
                  <Sparkles className="h-4 w-4" />
                </span>
                <p className="mt-3 font-display text-2xl sm:text-3xl text-blue-400">
                  {skillsStats.league}
                </p>
                <p className="mt-1 font-condensed text-xs uppercase tracking-wider text-white/60">League Tier</p>
                <span className="mt-2 inline-block text-[10px] text-blue-300 font-mono">Diamond Division</span>
              </div>

              {/* League Position */}
              <div
                onMouseMove={onMove}
                className="group glass relative overflow-hidden rounded-2xl border border-white/10 p-4 sm:p-5 text-center transition-all duration-500 hover:-translate-y-0.5 hover:border-ember-500/40 hover:shadow-glow"
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(180px circle at var(--mx,50%) var(--my,50%), rgba(255,106,0,0.18), transparent 70%)",
                  }}
                />
                <span className="mx-auto grid h-9 w-9 place-items-center rounded-xl bg-ember-500/15 text-ember-500">
                  <Award className="h-4 w-4" />
                </span>
                <p className="mt-3 font-display text-2xl sm:text-3xl text-ember-500">
                  #<StatCounter value={skillsStats.leaguePosition} />
                </p>
                <p className="mt-1 font-condensed text-xs uppercase tracking-wider text-white/60">League Position</p>
                <span className="mt-2 inline-block text-[10px] text-white/40 font-mono">Private Dashboard</span>
              </div>

              {/* Current Streak */}
              <div
                onMouseMove={onMove}
                className="group col-span-2 sm:col-span-1 glass relative overflow-hidden rounded-2xl border border-white/10 p-4 sm:p-5 text-center transition-all duration-500 hover:-translate-y-0.5 hover:border-ember-500/40 hover:shadow-glow"
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(180px circle at var(--mx,50%) var(--my,50%), rgba(234,67,53,0.18), transparent 70%)",
                  }}
                />
                <span className="mx-auto grid h-9 w-9 place-items-center rounded-xl bg-red-500/15 text-red-400">
                  <Flame className="h-4 w-4" />
                </span>
                <p className="mt-3 font-display text-2xl sm:text-3xl text-red-400">
                  <StatCounter value={skillsStats.streakDays} suffix="d" />
                </p>
                <p className="mt-1 font-condensed text-xs uppercase tracking-wider text-white/60">Active Streak</p>
                <span className="mt-2 inline-block text-[10px] text-white/40 font-mono">Private Dashboard</span>
              </div>
            </div>

            {/* Provenance & Synchronization Notice Bar */}
            <div data-reveal className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-xs text-white/60 backdrop-blur">
                <div className="flex items-center gap-2">
                  {syncStatus === "synced" ? (
                    <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-mono text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Sync Active
                    </span>
                  ) : syncStatus === "loading" ? (
                    <span className="flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-mono text-blue-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-ping" />
                      Checking Sync...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-0.5 text-[10px] font-mono text-yellow-400" title="Using cached local snapshot">
                      <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                      Cached Fallback
                    </span>
                  )}
                  <span>
                    {syncStatus === "synced" && formattedSyncTime ? (
                      <>Verified snapshot synced from public profile · Updated <strong className="text-white">{formattedSyncTime}</strong></>
                    ) : syncStatus === "loading" ? (
                      <>Checking public profile snapshot...</>
                    ) : (
                      <>Cached profile snapshot (<strong className="text-white">{skillsStats.lastVerified}</strong> fallback)</>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[11px] text-white/40">
                  <span className="font-mono">Profile badges: {skillBadges.length}</span>
                  <span className="h-3 w-px bg-white/10" />
                  <a
                    href={skillsStats.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ember-400 hover:underline flex items-center gap-1"
                  >
                    <span>View Public Profile</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
              <p className="text-[11px] text-white/45 pl-1">
                * Badges, League, and Points are synced server-side from public profile HTML. Streak and Leaderboard Rank reflect verified private dashboard sessions.
              </p>
            </div>

            {/* Badge Explorer Toolbar */}
            <div data-reveal className="space-y-4 rounded-2xl border border-white/10 bg-[#08131e]/70 p-4 sm:p-5 backdrop-blur-xl">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-display text-xl uppercase tracking-wide text-white">
                    Badge Collection Explorer
                  </h3>
                  <p className="text-xs text-white/50">
                    Search and inspect individual Google Cloud skill badge credentials with direct links to their official records.
                  </p>
                </div>

                {/* Search Input */}
                <div className="relative w-full sm:w-72">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setVisibleCount(16);
                    }}
                    placeholder="Search badges, tools, topics..."
                    className="w-full rounded-full border border-white/15 bg-white/[0.04] py-1.5 pl-9 pr-8 text-xs text-white placeholder-white/40 transition-colors focus:border-ember-500 focus:bg-white/[0.08] focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                      aria-label="Clear search"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setVisibleCount(16);
                    }}
                    className={`rounded-full px-3 py-1 font-condensed text-[11px] uppercase tracking-wider transition-all ${
                      selectedCategory === cat
                        ? "border border-ember-500/80 bg-ember-500 text-black font-semibold shadow-glow-sm"
                        : "border border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
                <span className="ml-auto text-[11px] text-white/40">
                  Showing {displayedBadges.length} of {filteredBadges.length} entries · Profile total: {skillBadges.length}
                </span>
              </div>
            </div>

            {/* Badge Cards Grid */}
            {filteredBadges.length === 0 ? (
              <div data-reveal className="glass flex flex-col items-center justify-center rounded-2xl p-12 text-center">
                <Search className="h-8 w-8 text-white/30" />
                <h4 className="mt-3 font-display text-lg uppercase text-white">No badges found</h4>
                <p className="mt-1 max-w-sm text-xs text-white/50">
                  No badges match "{searchQuery}" in category "{selectedCategory}".
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  className="mt-4 flex items-center gap-1.5 rounded-full border border-ember-500/50 bg-ember-500/10 px-4 py-1.5 text-xs text-ember-400 hover:bg-ember-500 hover:text-black"
                >
                  <RotateCcw className="h-3 w-3" /> Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {displayedBadges.map((badge) => (
                  <div
                    key={badge.id}
                    data-reveal
                    onMouseMove={onMove}
                    className="group glass relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 p-4 sm:p-5 transition-all duration-500 hover:-translate-y-1 hover:border-ember-500/40 hover:shadow-glow"
                  >
                    {/* Spotlight hover effect */}
                    <div
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background:
                          "radial-gradient(220px circle at var(--mx,50%) var(--my,50%), rgba(255,106,0,0.14), transparent 70%)",
                      }}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent" />

                    <div>
                      {/* Top: Official CDN Badge Artwork & Earned Date */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-black/40 p-1.5 shadow-md transition-transform duration-300 group-hover:scale-105">
                          <img
                            src={badge.imageUrl}
                            alt={badge.title}
                            loading="lazy"
                            className="h-full w-full object-contain filter drop-shadow"
                          />
                        </div>

                        <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] font-condensed uppercase tracking-wider text-white/50">
                          {badge.earnedDate}
                        </span>
                      </div>

                      {/* Badge Title */}
                      <h4 className="mt-3.5 font-display text-base uppercase leading-snug text-white transition-colors group-hover:text-ember-400">
                        {badge.title}
                      </h4>

                      <p className="mt-1 font-condensed text-[11px] uppercase tracking-wider text-ember-500">
                        {badge.category}
                      </p>

                      <p className="mt-2 text-xs leading-relaxed text-white/60 line-clamp-2">
                        {badge.description}
                      </p>

                      {/* Skills tags */}
                      <div className="mt-3 flex flex-wrap gap-1">
                        {badge.skills.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[9px] text-white/60"
                          >
                            {s}
                          </span>
                        ))}
                        {badge.skills.length > 3 && (
                          <span className="rounded-full border border-white/5 px-1.5 py-0.5 text-[9px] text-white/40">
                            +{badge.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom individual verification link */}
                    <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Skill Badge
                      </span>
                      <a
                        href={badge.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[11px] text-ember-500 hover:underline"
                        title={`View credential for ${badge.title}`}
                      >
                        View Credential ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* View More / Expand Badges */}
            {hasMore && (
              <div data-reveal className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 16)}
                  className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-2.5 font-condensed text-xs uppercase tracking-wider text-white transition-all hover:border-ember-500/60 hover:bg-ember-500/10 hover:text-ember-400"
                >
                  <span>Load More Badges (+16)</span>
                  <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                </button>
                <button
                  onClick={() => setVisibleCount(filteredBadges.length)}
                  className="group flex items-center gap-2 rounded-full border border-ember-500/40 bg-ember-500/10 px-6 py-2.5 font-condensed text-xs uppercase tracking-wider text-ember-400 transition-all hover:bg-ember-500 hover:text-black hover:shadow-glow"
                >
                  <span>Show All ({filteredBadges.length} Badges)</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: Google Developer Program
           ========================================================================= */}
        {activeTab === "dev-program" && (
          <div className="mt-8 space-y-6">
            {/* Membership & Profile Card */}
            <div data-reveal className="glass-strong relative overflow-hidden rounded-2xl border border-white/15 p-6 sm:p-8">
              <div className="absolute right-0 top-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-gradient-to-br from-blue-500/20 to-transparent blur-3xl pointer-events-none" />

              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <GoogleColorStrip />
                    <span className="font-condensed text-xs uppercase tracking-[0.25em] text-blue-400 font-semibold">
                      Google Developer Platform
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-2xl sm:text-3xl uppercase text-white">
                    Google Developer Program
                  </h3>
                  <p className="mt-2 max-w-2xl text-xs sm:text-sm text-white/60 leading-relaxed">
                    Public developer profile on Google's unified developer platform (<strong className="text-white">g.dev</strong>). This is a distinct achievement system from Google Cloud Skills Boost, recognizing platform engagement and cloud development.
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-3.5 py-2">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <div>
                        <p className="text-[10px] uppercase font-condensed text-yellow-300">Membership Tier</p>
                        <p className="text-xs font-semibold text-white">{googleDevProgram.membershipTier}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3.5 py-2">
                      <SiGooglecloud className="h-4 w-4 text-blue-400" />
                      <div>
                        <p className="text-[10px] uppercase font-condensed text-blue-300">Recognition</p>
                        <p className="text-xs font-semibold text-white">{googleDevProgram.innovatorStatus}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2">
                      <Award className="h-4 w-4 text-ember-400" />
                      <div>
                        <p className="text-[10px] uppercase font-condensed text-white/50">Confirmed Total</p>
                        <p className="text-xs font-semibold text-white">{googleDevProgram.totalBadges} Developer Badges</p>
                      </div>
                    </div>
                  </div>

                  <p className="mt-5 max-w-2xl text-xs text-white/50 leading-relaxed">
                    {googleDevProgram.notice}
                  </p>
                </div>

                <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
                  <a
                    href={googleDevProgram.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ember flex items-center gap-2 px-5 py-2.5 text-xs font-semibold"
                  >
                    <SiGoogle className="h-3.5 w-3.5" />
                    <span>View Public Profile</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <span className="text-[11px] text-white/40 font-mono">
                    Snapshot: {googleDevProgram.lastVerified}
                  </span>
                </div>
              </div>
            </div>

            {/* Developer Program Badges Section */}
            <div className="space-y-4 pt-4">
              <div data-reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-t border-white/10 pt-6">
                <div>
                  <div className="flex items-center gap-2">
                    <GoogleColorStrip />
                    <span className="font-condensed text-xs uppercase tracking-[0.25em] text-blue-400 font-semibold">
                      Credential Explorer
                    </span>
                  </div>
                  <h4 className="mt-1 font-display text-xl sm:text-2xl uppercase text-white">
                    Developer Program Badges ({googleDevBadges.length})
                  </h4>
                  <p className="mt-1 max-w-2xl text-xs sm:text-sm text-white/60 leading-relaxed">
                    Verified achievements earned on the Google Developer Platform (<strong className="text-white">g.dev/sumit2003dev</strong>), covering Gemini Agent Ready engineering, Google Cloud Innovator tiers, and GDG community membership.
                  </p>
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    value={devSearchQuery}
                    onChange={(e) => setDevSearchQuery(e.target.value)}
                    placeholder="Search developer badges..."
                    className="w-full rounded-full border border-white/10 bg-black/40 pl-9 pr-8 py-2 text-xs text-white placeholder-white/40 outline-none transition-colors focus:border-blue-500/60 focus:bg-white/[0.04]"
                  />
                  {devSearchQuery && (
                    <button
                      onClick={() => setDevSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                      title="Clear search"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter Pills */}
              <div data-reveal className="flex flex-wrap items-center gap-2 pt-1">
                {devCategories.map((cat) => {
                  const count =
                    cat === "All"
                      ? googleDevBadges.length
                      : googleDevBadges.filter((b) => b.category === cat).length;
                  const isActive = selectedDevCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedDevCategory(cat)}
                      className={`group flex items-center gap-2 rounded-full px-3.5 py-1.5 font-condensed text-xs uppercase tracking-wider transition-all ${
                        isActive
                          ? "border border-blue-500/60 bg-blue-500/20 text-white shadow-glow"
                          : "border border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <span>{cat}</span>
                      <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] font-mono text-white/70">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Badges Grid */}
              {filteredDevBadges.length === 0 ? (
                <div data-reveal className="glass rounded-2xl border border-white/10 p-8 text-center">
                  <p className="text-sm text-white/60">No developer badges match "{devSearchQuery}".</p>
                  <button
                    onClick={() => {
                      setDevSearchQuery("");
                      setSelectedDevCategory("All");
                    }}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.03] px-4 py-1.5 text-xs text-white/80 hover:text-white hover:border-white/30"
                  >
                    <RotateCcw className="h-3 w-3" /> Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-2">
                  {filteredDevBadges.map((badge) => (
                    <div
                      key={badge.id}
                      data-reveal
                      onMouseMove={onMove}
                      className="group glass relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 p-5 transition-all duration-500 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-glow"
                    >
                      <div
                        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        style={{
                          background:
                            "radial-gradient(240px circle at var(--mx,50%) var(--my,50%), rgba(66,133,244,0.15), transparent 70%)",
                        }}
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent" />

                      <div>
                        {/* Top: Official Badge Artwork & Earned Date */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-black/40 p-2 shadow-md transition-transform duration-300 group-hover:scale-105">
                            <img
                              src={asset(badge.localImage)}
                              alt={badge.title}
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.src = badge.cdnImage;
                              }}
                              className="h-full w-full object-contain filter drop-shadow"
                            />
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[10px] font-condensed uppercase tracking-wider text-white/50">
                              {badge.earnedDate}
                            </span>
                            {badge.badgeLevel && (
                              <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[9px] font-mono text-blue-300">
                                {badge.badgeLevel}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Title */}
                        <h4 className="mt-3.5 font-display text-base uppercase leading-snug text-white transition-colors group-hover:text-blue-300">
                          {badge.title}
                        </h4>

                        <p className="mt-1 font-condensed text-[11px] uppercase tracking-wider text-blue-400">
                          {badge.category}
                        </p>

                        <p className="mt-2 text-xs leading-relaxed text-white/60 line-clamp-3">
                          {badge.description}
                        </p>

                        {/* Skills / Keywords */}
                        <div className="mt-3 flex flex-wrap gap-1">
                          {badge.skills.map((s) => (
                            <span
                              key={s}
                              className="rounded-full border border-white/10 bg-black/30 px-2 py-0.5 text-[9px] text-white/70"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Bar: Direct Profile Link */}
                      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                        <span className="text-[10px] text-blue-400 flex items-center gap-1 font-mono">
                          <CheckCircle2 className="h-3 w-3 text-blue-400" /> g.dev Badge
                        </span>
                        <a
                          href={badge.verificationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[11px] font-medium text-ember-400 transition-colors hover:text-white hover:underline"
                          title={`View ${badge.title} on g.dev`}
                        >
                          <span>Verify Credential</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: Google Developer Groups (GDG Lucknow)
           ========================================================================= */}
        {activeTab === "gdg" && (
          <div className="mt-8 space-y-6">
            {/* GDG Community Header Card */}
            <div data-reveal className="glass-strong relative overflow-hidden rounded-2xl border border-white/15 p-6 sm:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <GoogleColorStrip />
                    <span className="font-condensed text-xs uppercase tracking-[0.25em] text-emerald-400 font-semibold">
                      Community Chapter
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-2xl sm:text-3xl uppercase text-white">
                    {gdgLucknow.chapterName}
                  </h3>
                  <p className="mt-2 max-w-2xl text-xs sm:text-sm text-white/65 leading-relaxed">
                    {gdgLucknow.description}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-white/60">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-medium text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" /> {gdgLucknow.membershipStatus}
                    </span>
                    <span className="h-3 w-px bg-white/10" />
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-ember-500" /> {gdgLucknow.location}
                    </span>
                  </div>

                  <p className="mt-4 text-[11px] text-white/45">
                    * Community membership is distinct from organizer, speaker, or volunteer roles.
                  </p>
                </div>

                <div className="shrink-0">
                  <a
                    href={gdgLucknow.communityUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-2.5 text-xs text-white/80 transition-all hover:border-emerald-500/60 hover:text-white"
                  >
                    <Users className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Official Chapter Page</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
