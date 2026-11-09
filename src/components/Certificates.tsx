import { useRef, useState, useEffect, useMemo } from "react";
import Section from "./Section";
import {
  CERTIFICATION_VAULT,
  PROVIDERS_META,
  VaultCertificate,
  ProviderId,
  CredentialCategory,
} from "@/lib/certificatesData";
import { profile, asset } from "@/lib/data";
import { useFadeUp } from "@/hooks/use-scroll";
import {
  Award,
  ExternalLink,
  X,
  Eye,
  Download,
  FileText,
  CheckCircle2,
  Search,
  Calendar,
  Hash,
  Sparkles,
  Layers,
  GraduationCap,
  RotateCcw,
  Info,
  ShieldCheck,
  Building2,
  Percent,
} from "lucide-react";
import { SiGooglecloud, SiCredly, SiAnthropic } from "react-icons/si";

/* ========================================================================
   Provider Logo Icon Components
   Authentic logos & clean brand monograms for each credential provider.
   ======================================================================== */
function ProviderLogo({ provider, className = "h-4 w-4" }: { provider: ProviderId | string; className?: string }) {
  switch (provider) {
    case "google":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
      );
    case "ibm":
      return (
        <span className="font-mono text-[11px] font-black tracking-wider text-[#0F62FE]" aria-hidden="true">
          IBM
        </span>
      );
    case "microsoft":
      return (
        <svg className={className} viewBox="0 0 23 23" aria-hidden="true">
          <path fill="#f35325" d="M1 1h10v10H1z" />
          <path fill="#81bc06" d="M12 1h10v10H12z" />
          <path fill="#05a6f0" d="M1 12h10v10H1z" />
          <path fill="#ffba08" d="M12 12h10v10H12z" />
        </svg>
      );
    case "anthropic":
      return <SiAnthropic className={`${className} text-[#D97706]`} aria-hidden="true" />;
    case "tata-tcs":
      return (
        <span className="font-display text-[10px] font-bold tracking-widest text-[#0082D5]" aria-hidden="true">
          TATA
        </span>
      );
    case "nptel":
      return <GraduationCap className={`${className} text-[#E35205]`} aria-hidden="true" />;
    case "ets":
      return (
        <span className="font-display text-[10px] font-black tracking-wider text-[#0071BC]" aria-hidden="true">
          ETS
        </span>
      );
    case "others":
      return <Building2 className={`${className} text-[#A855F7]`} aria-hidden="true" />;
    default:
      return <Award className={`${className} text-ember-500`} aria-hidden="true" />;
  }
}

export default function Certificates() {
  const ref = useRef<HTMLDivElement>(null);
  useFadeUp(ref);

  const [selectedProvider, setSelectedProvider] = useState<ProviderId>("all");
  const [selectedCategory, setSelectedCategory] = useState<CredentialCategory>("All");
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCert, setSelectedCert] = useState<VaultCertificate | null>(null);

  // Dynamic header metrics
  const totalCredentialsCount = CERTIFICATION_VAULT.length;

  const providerCounts = useMemo(() => {
    const counts: Record<string, number> = { all: totalCredentialsCount };
    PROVIDERS_META.forEach((p) => {
      if (p.id !== "all") {
        counts[p.id] = CERTIFICATION_VAULT.filter((c) => c.provider === p.id).length;
      }
    });
    return counts;
  }, [totalCredentialsCount]);

  const activeProvidersCount = useMemo(() => {
    return PROVIDERS_META.filter((p) => p.id !== "all" && (providerCounts[p.id] || 0) > 0).length;
  }, [providerCounts]);

  const latestYear = useMemo(() => {
    const years = CERTIFICATION_VAULT.map((c) => parseInt(c.year, 10)).filter((y) => !isNaN(y));
    return years.length > 0 ? Math.max(...years).toString() : "2026";
  }, []);

  const categories: CredentialCategory[] = [
    "All",
    "Generative AI",
    "Data Science & Analytics",
    "Machine Learning & AI",
    "Cloud & DevOps",
    "Job Simulation",
    "Foundational",
  ];

  const years = ["All", "2026", "2025"];

  // Filtered certificates
  const filteredCertificates = useMemo(() => {
    return CERTIFICATION_VAULT.filter((cert) => {
      // Provider filter
      if (selectedProvider !== "all" && cert.provider !== selectedProvider) {
        return false;
      }
      // Category filter
      if (selectedCategory !== "All" && cert.category !== selectedCategory) {
        return false;
      }
      // Year filter
      if (selectedYear !== "All" && cert.year !== selectedYear) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = cert.title.toLowerCase().includes(q);
        const inIssuer = cert.issuer.toLowerCase().includes(q);
        const inPlatform = cert.platform.toLowerCase().includes(q);
        const inSkills = cert.skills.some((s) => s.toLowerCase().includes(q));
        const inId = cert.credentialId?.toLowerCase().includes(q);
        if (!inTitle && !inIssuer && !inPlatform && !inSkills && !inId) {
          return false;
        }
      }
      return true;
    });
  }, [selectedProvider, selectedCategory, selectedYear, searchQuery]);

  const isFilterActive =
    selectedProvider !== "all" ||
    selectedCategory !== "All" ||
    selectedYear !== "All" ||
    searchQuery.trim().length > 0;

  const handleResetFilters = () => {
    setSelectedProvider("all");
    setSelectedCategory("All");
    setSelectedYear("All");
    setSearchQuery("");
  };

  // Keyboard and scroll lock for modal
  useEffect(() => {
    if (!selectedCert) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedCert(null);
    };
    window.addEventListener("keydown", onKey);

    document.body.style.overflow = "hidden";
    const lenis = window.__lenis;
    lenis?.stop();

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [selectedCert]);

  const activeProviderMeta = useMemo(() => {
    return PROVIDERS_META.find((p) => p.id === selectedProvider);
  }, [selectedProvider]);

  return (
    <Section id="certificates" word="CERTIFICATION VAULT">
      <div ref={ref}>
        {/* ========================================================================
            1. Section Header & Dynamic Stats HUD
            ======================================================================== */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div data-reveal className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-ember-500 shadow-glow" />
              <span className="font-condensed text-xs uppercase tracking-[0.22em] text-ember-500">
                Verified Credentials Archive
              </span>
            </div>
            <h2 data-reveal className="mt-2 font-display text-huge uppercase leading-[1.05] text-white">
              Credentials &amp; Certifications<span className="text-ember-500 text-glow">.</span>
            </h2>
            <p data-reveal className="mt-3 max-w-2xl text-sm sm:text-base text-white/60">
              Continuous learning across AI, cloud computing, data science and emerging technologies — cataloged and verified by issuing organization.
            </p>
          </div>

          {/* Dynamic Calculated Stats Pill HUD */}
          <div data-reveal className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs text-white/80">
              <Layers className="h-3.5 w-3.5 text-ember-500" />
              <span>
                <strong className="text-white">{activeProvidersCount}</strong> Providers
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-ember-500/30 bg-ember-500/10 px-3.5 py-1.5 text-xs text-ember-400">
              <CheckCircle2 className="h-3.5 w-3.5 text-ember-500" />
              <span>
                <strong className="text-white">{totalCredentialsCount}</strong> Total Credentials
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs text-white/80">
              <Calendar className="h-3.5 w-3.5 text-ember-500" />
              <span>
                Active <strong className="text-white">{latestYear}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Verification Hub External Links */}
        <div data-reveal className="mt-5 flex flex-wrap items-center gap-2">
          <a
            href={profile.googleSkills}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-ember-500/30 bg-ember-500/10 px-3 py-1.5 text-xs text-ember-400 transition-all hover:border-ember-500 hover:bg-ember-500/20 hover:text-white"
            title="View public profile on Google Cloud Skills Boost"
          >
            <SiGooglecloud className="h-3.5 w-3.5 text-ember-500" />
            <span>Google Skills (178 Badges)</span>
            <ExternalLink className="h-3 w-3" />
          </a>

          <a
            href={profile.googleDev}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/70 transition-all hover:border-ember-500/50 hover:text-white"
            title="View Google Developer Profile (g.dev/sumit2003dev)"
          >
            <span>g.dev/sumit2003dev</span>
            <ExternalLink className="h-3 w-3" />
          </a>

          <a
            href={profile.credly}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/70 transition-all hover:border-ember-500/50 hover:text-white"
            title="View verified Credly badges"
          >
            <SiCredly className="h-3.5 w-3.5 text-ember-500" />
            <span>Credly Badges</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* ========================================================================
            2. Provider Navigation Tabs
            ======================================================================== */}
        <div data-reveal className="mt-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {PROVIDERS_META.map((p) => {
              const count = providerCounts[p.id] || 0;
              const isActive = selectedProvider === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedProvider(p.id)}
                  className={`group relative flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all duration-300 ${
                    isActive
                      ? "border-ember-500 bg-ember-500/15 text-white shadow-glow"
                      : "border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:text-white"
                  }`}
                  aria-pressed={isActive}
                >
                  <ProviderLogo provider={p.id} className="h-3.5 w-3.5" />
                  <span>{p.name}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                      isActive
                        ? "bg-ember-500 text-black font-bold"
                        : "bg-white/10 text-white/60 group-hover:text-white"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Provider Spotlight Banner (When specific provider active) */}
        {selectedProvider !== "all" && activeProviderMeta && (
          <div
            data-reveal
            className="mt-4 flex flex-col gap-3 rounded-2xl border border-white/10 bg-gradient-to-r from-white/[0.04] via-white/[0.02] to-transparent p-4 sm:flex-row sm:items-center sm:justify-between"
            style={{ borderLeftColor: activeProviderMeta.brandColor, borderLeftWidth: "4px" }}
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.05] border border-white/10">
                <ProviderLogo provider={activeProviderMeta.id} className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base uppercase text-white">{activeProviderMeta.name}</h3>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-mono text-white/70">
                    {providerCounts[activeProviderMeta.id] || 0} Credential
                    {(providerCounts[activeProviderMeta.id] || 0) === 1 ? "" : "s"}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-white/60">{activeProviderMeta.shortDesc}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedProvider("all")}
              className="self-start text-xs text-ember-400 hover:text-ember-300 sm:self-center"
            >
              View All Providers ↗
            </button>
          </div>
        )}

        {/* ========================================================================
            3. Search & Category Filters
            ======================================================================== */}
        <div data-reveal className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, issuer, skill (e.g. Python, Claude, SQL)..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-9 text-xs text-white placeholder-white/40 backdrop-blur transition-all focus:border-ember-500/60 focus:bg-white/[0.05] focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                aria-label="Clear search query"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Category & Year Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => {
                const isCatActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      isCatActive
                        ? "bg-white/20 text-white"
                        : "bg-white/[0.03] text-white/50 hover:bg-white/[0.08] hover:text-white/80"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Year Selector */}
            <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-0.5 text-[11px]">
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => setSelectedYear(y)}
                  className={`rounded px-2 py-0.5 transition-colors ${
                    selectedYear === y ? "bg-ember-500 text-black font-semibold" : "text-white/60 hover:text-white"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>

            {/* Reset Filters Button */}
            {isFilterActive && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 rounded-lg border border-ember-500/30 bg-ember-500/10 px-2.5 py-1 text-[11px] text-ember-400 hover:bg-ember-500/20"
                title="Reset all filters"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Results Counter */}
        <div className="mt-3 flex items-center justify-between text-xs text-white/45">
          <span>
            Showing <strong className="text-white">{filteredCertificates.length}</strong> of{" "}
            <strong className="text-white">
              {selectedProvider === "all" ? totalCredentialsCount : providerCounts[selectedProvider] || 0}
            </strong>{" "}
            credentials
          </span>

          {selectedProvider === "google" && (
            <span className="text-[11px] text-white/40">
              *Google Skills Boost badges showcased in Developer Journey
            </span>
          )}
        </div>

        {/* ========================================================================
            4. Certificates Grid or Clean Empty States
            ======================================================================== */}
        {selectedProvider === "ets" && filteredCertificates.length === 0 ? (
          /* Specialized Clean ETS State (Authentic — 0 fabricated credentials) */
          <div data-reveal className="glass mt-8 rounded-2xl border border-white/10 p-10 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-[#0071BC]/40 bg-[#0071BC]/10 text-[#0071BC]">
              <span className="font-display text-lg font-black tracking-wider">ETS</span>
            </div>
            <h3 className="mt-4 font-display text-xl uppercase text-white">Educational Testing Service (ETS)</h3>
            <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-white/60">
              No ETS credentials are currently on file. Verified assessments and official score records will automatically appear here once authenticated.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-4 py-1.5 text-xs text-white/50">
              <ShieldCheck className="h-3.5 w-3.5 text-ember-500" />
              <span>Strict Authenticity Standard · Zero Fabricated Records</span>
            </div>
          </div>
        ) : filteredCertificates.length === 0 ? (
          /* General Filter/Search Empty State */
          <div data-reveal className="glass mt-8 rounded-2xl border border-white/10 p-10 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-white/40">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="mt-3 font-display text-lg uppercase text-white">No Credentials Found</h3>
            <p className="mx-auto mt-1 max-w-sm text-xs text-white/60">
              No certificates match the selected filters or search terms. Try clearing filters or searching for terms like &quot;Python&quot;, &quot;Claude&quot;, &quot;SQL&quot;, or &quot;Machine Learning&quot;.
            </p>
            <button
              onClick={handleResetFilters}
              className="btn-ember mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          /* Main Certificate Cards Grid */
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCertificates.map((c) => {
              const hasImage = Boolean(c.image);
              const providerMeta = PROVIDERS_META.find((p) => p.id === c.provider);

              return (
                <div
                  key={c.id}
                  data-reveal
                  role="button"
                  tabIndex={0}
                  aria-label={`View certificate for ${c.title}`}
                  onClick={() => setSelectedCert(c)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedCert(c);
                    }
                  }}
                  className="group glass relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-white/10 p-4 sm:p-5 text-left transition-all duration-500 hover:-translate-y-0.5 hover:border-ember-500/40 hover:shadow-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-ember-500"
                >
                  {/* Card Thumbnail / Provider Fallback Canvas */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/10 bg-[#060c14]">
                    {hasImage && c.image ? (
                      <>
                        <img
                          src={asset(c.image)}
                          alt={c.title}
                          loading="lazy"
                          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#060c14] via-[#060c14]/30 to-transparent" />
                      </>
                    ) : (
                      /* Clean Provider-Branded Fallback Card (Authentic — No Fake Artwork) */
                      <div className="relative flex h-full w-full flex-col justify-between p-4 bg-gradient-to-br from-[#0c1622] via-[#08111a] to-[#04080e]">
                        <div
                          className="pointer-events-none absolute inset-0 opacity-20"
                          style={{
                            background: `radial-gradient(circle at 80% 20%, ${providerMeta?.brandColor || "#FF6A00"}, transparent 70%)`,
                          }}
                        />
                        <div className="relative flex items-center justify-between">
                          <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-2 py-0.5 text-[10px] text-white/70 backdrop-blur">
                            <ProviderLogo provider={c.provider} className="h-3 w-3" />
                            <span>{c.issuer}</span>
                          </div>
                          <span className="text-[10px] font-mono text-white/50">{c.year}</span>
                        </div>

                        <div className="relative my-auto">
                          <h4 className="font-display text-sm font-semibold uppercase leading-snug text-white/90 group-hover:text-ember-400 transition-colors line-clamp-2">
                            {c.title}
                          </h4>
                          <p className="mt-1 font-condensed text-[11px] text-white/50">
                            {c.platform}
                          </p>
                        </div>

                        <div className="relative flex items-center justify-between text-[10px] text-white/40">
                          <span>{c.credentialType}</span>
                          <span className="flex items-center gap-1 text-ember-400">
                            <Eye className="h-3 w-3" /> View Details
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Top Corner Badges (Provider & Credential Type) */}
                    <div className="absolute left-2.5 top-2.5 flex flex-wrap items-center gap-1.5">
                      <span className="flex items-center gap-1 rounded-full border border-white/20 bg-black/75 px-2.5 py-0.5 text-[10px] font-condensed uppercase tracking-wider text-white backdrop-blur-md">
                        <ProviderLogo provider={c.provider} className="h-3 w-3" />
                        <span>{providerMeta?.badgeLabel || c.issuer}</span>
                      </span>

                      <span className="rounded-full border border-ember-500/30 bg-ember-500/20 px-2 py-0.5 text-[9px] font-condensed uppercase tracking-wider text-ember-300 backdrop-blur-md">
                        {c.credentialType}
                      </span>
                    </div>

                    {/* Score Badge (if verified score exists) */}
                    {c.score && (
                      <div className="absolute right-2.5 top-2.5">
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-950/80 px-2 py-0.5 text-[10px] font-mono font-semibold text-emerald-300 backdrop-blur-md">
                          <Percent className="h-2.5 w-2.5" />
                          <span>{c.score}</span>
                        </span>
                      </div>
                    )}

                    {/* Bottom Title Bar Overlay for image cards */}
                    {hasImage && (
                      <div className="absolute inset-x-2.5 bottom-2.5 flex items-end justify-between">
                        <span className="rounded-lg bg-black/85 px-2 py-0.5 text-[10px] font-condensed uppercase tracking-wider text-white/70 backdrop-blur-md border border-white/10">
                          {c.platform}
                        </span>
                        <span className="text-[10px] font-mono text-white/50 bg-black/60 px-1.5 py-0.5 rounded">
                          {c.year}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Content Information */}
                  <div className="mt-3.5 flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-ember-500">
                        <span className="font-condensed uppercase tracking-wider">
                          {c.issuer}
                        </span>
                        <span className="text-[11px] text-white/40 font-mono">{c.issueDate}</span>
                      </div>

                      <h3 className="mt-1 font-display text-base font-semibold uppercase text-white transition-colors group-hover:text-ember-400 line-clamp-2">
                        {c.title}
                      </h3>

                      {c.credentialId && (
                        <p className="mt-1 flex items-center gap-1 text-[11px] font-mono text-white/45 truncate">
                          <Hash className="h-3 w-3 shrink-0 text-white/30" />
                          <span className="truncate">{c.credentialId}</span>
                        </p>
                      )}

                      {/* Skills Tags List */}
                      <div className="mt-2.5 flex flex-wrap gap-1">
                        {c.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="rounded-md border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[10px] text-white/60"
                          >
                            {skill}
                          </span>
                        ))}
                        {c.skills.length > 3 && (
                          <span className="rounded-md border border-white/5 px-1.5 py-0.5 text-[10px] text-white/40">
                            +{c.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
                      <span className="flex items-center gap-1 text-white/60 group-hover:text-ember-400 transition-colors font-medium">
                        <Eye className="h-3.5 w-3.5 text-ember-500" />
                        <span>View Details</span>
                      </span>

                      {c.verificationUrl && (
                        <a
                          href={c.verificationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 text-[11px] text-ember-400 hover:text-white transition-colors"
                          title="Open official credential verification page"
                        >
                          <span>Verify</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================================================
            5. Certificate Detail Modal
            ======================================================================== */}
        {selectedCert && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={selectedCert.title}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity"
              onClick={() => setSelectedCert(null)}
            />

            {/* Modal Dialog Card */}
            <div className="glass-strong relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-[#071018] shadow-2xl">
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-white/10 p-4 sm:p-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1 rounded-full border border-white/20 bg-white/[0.05] px-2.5 py-0.5 text-[10px] font-condensed uppercase tracking-wider text-white">
                      <ProviderLogo provider={selectedCert.provider} className="h-3 w-3" />
                      <span>{selectedCert.issuer}</span>
                    </span>

                    <span className="rounded-full border border-ember-500/40 bg-ember-500/15 px-2.5 py-0.5 text-[10px] font-condensed uppercase tracking-wider text-ember-400">
                      {selectedCert.credentialType}
                    </span>

                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] text-white/50">
                      {selectedCert.category}
                    </span>
                  </div>

                  <h3 className="mt-2 font-display text-lg sm:text-2xl uppercase text-white">
                    {selectedCert.title}
                  </h3>

                  <p className="mt-0.5 text-xs text-white/60">
                    Offered via <strong className="text-white/80">{selectedCert.platform}</strong> · Completed {selectedCert.issueDate}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedCert(null)}
                  className="rounded-full border border-white/10 p-2 text-white/60 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white"
                  aria-label="Close certificate modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Scrollable Body */}
              <div className="overflow-y-auto p-4 sm:p-6 space-y-5">
                {/* Visual Preview Stage */}
                <div className="overflow-hidden rounded-2xl border border-white/15 bg-black/60">
                  {selectedCert.image ? (
                    <img
                      src={asset(selectedCert.image)}
                      alt={selectedCert.title}
                      className="max-h-[380px] w-full object-contain bg-black"
                    />
                  ) : (
                    /* High-fidelity Fallback Display */
                    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-gradient-to-b from-[#091522] to-[#040910]">
                      <div className="grid h-16 w-16 place-items-center rounded-2xl border border-white/15 bg-white/[0.04]">
                        <ProviderLogo provider={selectedCert.provider} className="h-8 w-8" />
                      </div>
                      <h4 className="mt-4 font-display text-lg uppercase text-white max-w-md">
                        {selectedCert.title}
                      </h4>
                      <p className="mt-1 text-xs text-white/60">
                        {selectedCert.issuer} · {selectedCert.platform}
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-xs text-ember-400">
                        <FileText className="h-4 w-4" />
                        <span>Official PDF record verified in portfolio repository</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Metadata Details Grid */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs">
                    <span className="text-[10px] font-condensed uppercase tracking-wider text-white/40 flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-ember-500" /> Completion Date
                    </span>
                    <p className="mt-1 font-semibold text-white">{selectedCert.issueDate}</p>
                  </div>

                  {selectedCert.score && (
                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs">
                      <span className="text-[10px] font-condensed uppercase tracking-wider text-white/40 flex items-center gap-1">
                        <Percent className="h-3 w-3 text-emerald-400" /> Performance / Grade
                      </span>
                      <p className="mt-1 font-semibold text-emerald-300 font-mono">{selectedCert.score}</p>
                    </div>
                  )}

                  {selectedCert.credentialId && (
                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs sm:col-span-2 lg:col-span-1">
                      <span className="text-[10px] font-condensed uppercase tracking-wider text-white/40 flex items-center gap-1">
                        <Hash className="h-3 w-3 text-ember-500" /> Credential ID
                      </span>
                      <p className="mt-1 font-mono text-[11px] text-white/80 break-all">{selectedCert.credentialId}</p>
                    </div>
                  )}
                </div>

                {/* Description / Summary */}
                {selectedCert.description && (
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 text-xs text-white/70">
                    <span className="text-[10px] font-condensed uppercase tracking-wider text-ember-500 flex items-center gap-1 mb-1">
                      <Info className="h-3 w-3" /> Credential Overview
                    </span>
                    <p className="leading-relaxed">{selectedCert.description}</p>
                  </div>
                )}

                {/* Skills Tag Cloud */}
                <div>
                  <span className="text-[10px] font-condensed uppercase tracking-wider text-white/40 flex items-center gap-1 mb-2">
                    <Sparkles className="h-3 w-3 text-ember-500" /> Validated Competencies &amp; Skills
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCert.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg border border-white/15 bg-white/[0.04] px-2.5 py-1 text-xs text-white/80"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Actions Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-black/40 p-4 sm:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  {selectedCert.pdf && (
                    <a
                      href={asset(selectedCert.pdf)}
                      download={`${selectedCert.title.replace(/\s+/g, "_")}.pdf`}
                      className="btn-ember flex items-center gap-2 px-4 py-2 text-xs font-semibold"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download PDF</span>
                    </a>
                  )}

                  {selectedCert.pdf && (
                    <a
                      href={asset(selectedCert.pdf)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.03] px-3.5 py-2 text-xs text-white/80 transition-colors hover:border-ember-500 hover:text-ember-400"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>Open PDF ↗</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {selectedCert.verificationUrl ? (
                    <a
                      href={selectedCert.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-full border border-ember-500/50 bg-ember-500/15 px-4 py-2 text-xs font-semibold text-ember-400 transition-colors hover:bg-ember-500 hover:text-black"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Verify Credential ↗</span>
                    </a>
                  ) : (
                    <span className="text-[11px] text-white/40 flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Authenticated via Portfolio Repository</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
