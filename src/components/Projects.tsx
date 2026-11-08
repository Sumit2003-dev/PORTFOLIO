import { useState, useRef, useEffect } from "react";
import Section from "./Section";
import { projects } from "@/lib/data";
import type { Project } from "@/lib/data";
import { useFadeUp } from "@/hooks/use-scroll";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, X, ArrowUpRight, Search, Filter, Cpu, Code, Layers, Zap } from "lucide-react";

const CATEGORIES = ["All", "Generative AI", "Machine Learning", "Data Science", "Research"];

const GRADIENTS = [
  "radial-gradient(120% 90% at 15% 10%, rgba(255,106,0,0.28), transparent 60%)",
  "radial-gradient(120% 90% at 85% 15%, rgba(255,138,43,0.25), transparent 60%)",
  "radial-gradient(120% 90% at 20% 85%, rgba(184,78,2,0.28), transparent 60%)",
  "radial-gradient(120% 90% at 80% 80%, rgba(255,199,153,0.18), transparent 60%)",
];

export default function Projects() {
  const ref = useRef<HTMLDivElement>(null);
  useFadeUp(ref);
  const [active, setActive] = useState<Project | null>(null);
  const [selectedCat, setSelectedCat] = useState("All");
  const [search, setSearch] = useState("");

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "";
    const lenis = window.__lenis;
    if (active) lenis?.stop();
    else lenis?.start();
    return () => {
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [active]);

  const filteredProjects = projects.filter((p) => {
    const matchesCat =
      selectedCat === "All" ||
      p.category.toLowerCase().includes(selectedCat.toLowerCase()) ||
      p.tech.some((t) => t.toLowerCase().includes(selectedCat.toLowerCase()));

    const matchesSearch =
      search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.blurb.toLowerCase().includes(search.toLowerCase()) ||
      p.tech.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    return matchesCat && matchesSearch;
  });

  return (
    <Section id="projects" word="PROJECTS" inverted>
      <div ref={ref}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 data-reveal className="font-display text-huge uppercase leading-[1.05] text-white">
              Selected <span className="text-ember-500 text-glow">Work</span>
            </h2>
            <p data-reveal className="mt-3 max-w-2xl text-sm sm:text-base text-white/60">
              Real-world machine learning, data science and design engineering — each project a
              case study in turning complexity into clarity.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div data-reveal className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search tech or project..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full border border-white/10 bg-white/[0.03] pl-10 pr-4 py-2 text-xs text-white placeholder-white/40 outline-none focus:border-ember-500/60 sm:w-56"
              />
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div data-reveal className="mt-8 flex flex-wrap items-center gap-2">
          <span className="mr-2 flex items-center gap-1.5 font-condensed text-xs uppercase tracking-wider text-white/40">
            <Filter className="h-3.5 w-3.5 text-ember-500" /> Filter:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`rounded-full border px-4 py-1.5 text-xs transition-all ${
                selectedCat === cat
                  ? "border-ember-500 bg-ember-500 text-black font-semibold shadow-glow"
                  : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/30 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project List Grid */}
        <div className="mt-7 space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((p, i) => (
              <motion.article
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                key={p.id}
                onMouseMove={onMove}
                onClick={() => setActive(p)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-500 hover:-translate-y-0.5 hover:border-ember-500/30 hover:shadow-glow"
              >
                {/* Spotlight hover effect */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(300px circle at var(--mx,50%) var(--my,50%), rgba(255,138,43,0.16), transparent 70%)",
                  }}
                />
                {/* Gradient background wash */}
                <div
                  className="absolute inset-0 opacity-40 transition-opacity duration-700 group-hover:opacity-100"
                  style={{ background: GRADIENTS[i % GRADIENTS.length] }}
                />

                <div className="relative grid gap-4 p-4 sm:p-5 lg:p-6 lg:grid-cols-[70px,1fr,auto] lg:items-center">
                  <p className="font-display text-2xl sm:text-3xl text-white/15 transition-colors group-hover:text-ember-500/60">
                    {p.index}
                  </p>

                  <div>
                    <p className="mb-0.5 font-condensed text-[11px] uppercase tracking-[0.22em] text-ember-500">
                      {p.category}
                    </p>
                    <h3 className="font-display text-lg uppercase leading-tight text-white sm:text-xl">
                      {p.title}
                    </h3>
                    <p className="mt-1.5 max-w-xl text-xs text-white/55 sm:text-sm">{p.blurb}</p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {p.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-white/10 bg-black/20 px-2.5 py-0.5 text-[11px] text-white/70"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 lg:flex-col">
                    <ArrowUpRight className="h-5 w-5 text-white/30 transition-all group-hover:translate-x-1 group-hover:text-ember-500" />
                    <span className="font-condensed text-[10px] uppercase tracking-[0.18em] text-white/40 group-hover:text-white/70">
                      Case Study
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>

          {filteredProjects.length === 0 && (
            <div className="rounded-3xl border border-white/10 p-12 text-center text-white/50">
              No projects found matching "{search}". Try searching for Python, RAG, ML, or Flask.
            </div>
          )}
        </div>

        <div data-reveal className="mt-10 text-center">
          <a
            href="https://github.com/Sumit2003-dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm text-white/70 transition-all hover:border-ember-500/50 hover:text-ember-500"
          >
            <Github className="h-4 w-4" />
            View all repositories on GitHub
          </a>
        </div>
      </div>

      {/* Case Study Detail Modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Case study: ${active.title}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-[#060b11]/90 p-3 py-6 sm:p-6 lg:p-8 sm:py-10 backdrop-blur-xl"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="w-full max-w-3xl lg:max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Modal project={active} onClose={() => setActive(null)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}

function Modal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [modalTab, setModalTab] = useState<"overview" | "architecture" | "code">("overview");

  // Format pipeline string into flow steps
  const pipelineSteps = project.architecture
    .split(/\s*->\s*|\s*→\s*/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="glass-strong relative w-full overflow-hidden rounded-2xl border border-white/15 bg-[#08131e]">
      <div className="absolute right-3.5 top-3.5 z-20">
        <button
          onClick={onClose}
          className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition-colors hover:bg-ember-500 hover:text-black"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Header visual */}
      <div className="relative h-36 sm:h-44 lg:h-48 w-full overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: GRADIENTS[Number(project.index) % GRADIENTS.length] }}
        />
        <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-500/20 blur-2xl" />
        <p className="giant-bg absolute -bottom-6 left-0 select-none opacity-20">{project.index}</p>
        <div className="absolute inset-0 flex items-center justify-center">
          <h3 className="px-5 text-center font-display text-xl uppercase leading-none text-white drop-shadow-lg sm:text-2xl lg:text-3xl">
            {project.title}
          </h3>
        </div>
        <div className="absolute bottom-0 h-12 w-full bg-gradient-to-t from-[#08131e] to-transparent" />
      </div>

      {/* Modal Tab Switcher */}
      <div className="flex overflow-x-auto border-b border-white/10 bg-[#070e17] px-3 sm:px-5">
        {[
          { id: "overview", label: "Overview", icon: Layers },
          { id: "architecture", label: "Architecture", icon: Cpu },
          { id: "code", label: "Stack", icon: Code },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = modalTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setModalTab(t.id as "overview" | "architecture" | "code")}
              className={`flex items-center gap-1.5 border-b-2 px-3.5 py-2.5 text-xs font-condensed uppercase tracking-wider transition-colors ${
                isActive
                  ? "border-ember-500 text-ember-500 font-bold"
                  : "border-transparent text-white/50 hover:text-white"
              }`}
            >
              <Icon className="h-3 w-3" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-5 p-4 sm:p-6 lg:p-7">
        {/* TAB 1: OVERVIEW */}
        {modalTab === "overview" && (
          <>
            <div>
              <Label title="Overview" />
              <p className="text-xs sm:text-sm leading-relaxed text-white/70">{project.description}</p>
            </div>

            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              <div>
                <Label title="Problem Statement" />
                <p className="text-xs sm:text-sm text-white/60 leading-relaxed">{project.problem}</p>
              </div>
              <div>
                <Label title="Engineered Solution" />
                <p className="text-xs sm:text-sm text-white/60 leading-relaxed">{project.solution}</p>
              </div>
            </div>

            {/* Metrics */}
            <div>
              <Label title="Key Benchmark Metrics & Impact" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {project.metrics.map((m) => (
                  <div key={m.label} className="glass rounded-2xl p-4 text-center">
                    <p className="font-display text-2xl text-ember-500 text-glow">{m.value}</p>
                    <p className="mt-1 text-xs text-white/50">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* TAB 2: SYSTEM ARCHITECTURE */}
        {modalTab === "architecture" && (
          <div className="space-y-6">
            <Label title="End-to-End Pipeline Node Graph" />

            <div className="grid gap-3">
              {pipelineSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm font-mono text-white/90"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-ember-500/20 text-ember-400 font-bold text-xs">
                      0{idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                  {idx < pipelineSteps.length - 1 && (
                    <Zap className="h-4 w-4 text-ember-500 animate-pulse" />
                  )}
                </div>
              ))}
            </div>

            <div className="glass rounded-2xl p-5 font-mono text-xs leading-relaxed text-ember-400 border border-white/10">
              <p className="text-white/50 mb-1">// Raw Architecture Definition String:</p>
              {project.architecture}
            </div>
          </div>
        )}

        {/* TAB 3: IMPLEMENTATION STACK */}
        {modalTab === "code" && (
          <div className="space-y-6">
            <Label title="Technologies & Libraries" />
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-xl border border-ember-500/40 bg-ember-500/10 px-3.5 py-1.5 text-xs text-ember-400 font-mono"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/60 p-5 font-mono text-xs text-emerald-400 space-y-2">
              <p className="text-white/40">// Key Implementation Highlights</p>
              {project.id === "gyanverse-ai" ? (
                <>
                  <p>• Vector Search Engine: FAISS &amp; ChromaDB similarity matrix indexing</p>
                  <p>• Embeddings: Sentence Transformers (HuggingFace)</p>
                  <p>• Interface &amp; API: Streamlit &amp; Flask responsive interface</p>
                </>
              ) : project.id === "flyrank-ml-internship" ? (
                <>
                  <p>• Core Evaluation Metric: Precision@50 validation benchmark</p>
                  <p>• Data Contracts: HuggingFace warehouse reproducible pipeline</p>
                  <p>• Model Architecture: Ranking algorithms with Scikit-learn</p>
                </>
              ) : project.id === "student-record-intelligence" ? (
                <>
                  <p>• Data Ingestion &amp; Profiling: Multi-year Pandas ETL pipeline (1,000+ records)</p>
                  <p>• Statistical Engine: Automated correlation &amp; risk profiling</p>
                  <p>• Interactive Dashboard: Real-time filterable Streamlit UI</p>
                </>
              ) : project.id === "airline-delay-prediction" ? (
                <>
                  <p>• Modeling: Scikit-learn regression pipeline with cross-validation</p>
                  <p>• Performance: ~0.85 R² score on held-out test split</p>
                  <p>• Engineering: High-cardinality categorical encoding &amp; feature scaling</p>
                </>
              ) : (
                <>
                  <p>• Research Focus: Automated academic integrity monitoring via ML &amp; CV</p>
                  <p>• Methodology: Supervised problem framing &amp; reproducible evaluation</p>
                  <p>• Collaboration: Supervised by faculty at SRMU</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Action Links */}
        <div className="mt-8 flex flex-wrap gap-4 border-t border-white/10 pt-6">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ember flex items-center gap-2 px-6 py-3 text-sm font-semibold"
          >
            <Github className="h-4 w-4" /> View GitHub Repository
          </a>
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm text-white/80 transition-colors hover:border-ember-500 hover:text-ember-500"
            >
              <ExternalLink className="h-4 w-4" /> Launch Live Application
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function Label({ title }: { title: string }) {
  return (
    <div className="mb-2.5 flex items-center gap-3">
      <span className="h-2 w-2 rounded-full bg-ember-500 shadow-glow" />
      <h4 className="font-condensed text-sm uppercase tracking-[0.3em] text-white/80">{title}</h4>
    </div>
  );
}
