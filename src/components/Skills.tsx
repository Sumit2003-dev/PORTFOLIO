import { useRef, useState, lazy, Suspense } from "react";
import Section from "./Section";
import { skillTrees, skillRings } from "@/lib/data";
import { useFadeUp } from "@/hooks/use-scroll";

const SkillCosmos3D = lazy(() => import("./3d/SkillCosmos3D"));
import {
  SiPython,
  SiPandas,
  SiScikitlearn,
  SiNumpy,
  SiGit,
  SiFlask,
  SiStreamlit,
} from "react-icons/si";
import {
  Brain,
  Code2,
  Database,
  Flame,
  Layers,
  Cpu,
  Terminal,
  Sparkles,
  BarChart3,
  Globe,
  Bot,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Python: <SiPython className="text-[#3776AB]" />,
  "SQL / MySQL": <Database className="text-ember-500" />,
  Java: <Code2 className="text-[#f89820]" />,
  "Supervised & Unsupervised": <Brain className="text-ember-500" />,
  "Feature Engineering": <Layers className="text-[#FF8A2B]" />,
  "Model Building & Eval": <Cpu className="text-ember-500" />,
  "RAG Systems": <Sparkles className="text-ember-500" />,
  "LLMs (GPT / LLaMA)": <Bot className="text-[#10a37f]" />,
  "Deep Learning": <Flame className="text-[#FF6A00]" />,
  Pandas: <SiPandas className="text-[#E70488]" />,
  NumPy: <SiNumpy className="text-[#4DABCF]" />,
  Matplotlib: <BarChart3 className="text-ember-500" />,
  "Scikit-learn": <SiScikitlearn className="text-[#F7931E]" />,
  "FAISS / ChromaDB": <Database className="text-[#FF8A2B]" />,
  "Power BI / Tableau": <BarChart3 className="text-[#F2C811]" />,
  "Flask / REST": <SiFlask className="text-white" />,
  Streamlit: <SiStreamlit className="text-[#FF4B4B]" />,
  SQL: <Database className="text-ember-500" />,
  Git: <SiGit className="text-[#F05032]" />,
};

const categoryIcons: Record<string, React.ReactNode> = {
  Languages: <Code2 className="h-5 w-5 text-ember-500" />,
  "Machine Learning & GenAI": <Brain className="h-5 w-5 text-ember-500" />,
  "Data, Viz & Frameworks": <Database className="h-5 w-5 text-ember-500" />,
};

export default function Skills() {
  const ref = useRef<HTMLDivElement>(null);
  useFadeUp(ref);
  const [viewMode, setViewMode] = useState<"tree" | "3d">("tree");

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <Section id="skills" word="SKILLS">
      <div ref={ref}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 data-reveal className="font-display text-huge uppercase leading-[1.05] text-white">
              Skills<span className="text-ember-500 text-glow">.</span>
            </h2>
            <p data-reveal className="mt-3 max-w-2xl text-sm sm:text-base text-white/60">
              A toolkit for turning raw data into intelligence — from language mastery and ML core
              pipelines to vector databases and Generative AI.
            </p>
          </div>

          {/* View Toggle */}
          <div data-reveal className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] p-1">
            <button
              onClick={() => setViewMode("tree")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                viewMode === "tree" ? "bg-ember-500 text-black shadow-glow" : "text-white/60 hover:text-white"
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode("3d")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                viewMode === "3d" ? "bg-ember-500 text-black shadow-glow" : "text-white/60 hover:text-white"
              }`}
            >
              3D Cosmos
            </button>
          </div>
        </div>

        {viewMode === "3d" ? (
          <div className="mt-10">
            <Suspense
              fallback={
                <div className="glass flex h-[380px] w-full items-center justify-center rounded-2xl border border-white/10">
                  <div className="flex flex-col items-center gap-3 text-ember-500 font-condensed tracking-widest text-xs uppercase">
                    <span className="h-6 w-6 animate-spin rounded-full border-2 border-ember-500 border-t-transparent" />
                    <span>Initializing 3D Cosmos...</span>
                  </div>
                </div>
              }
            >
              <SkillCosmos3D />
            </Suspense>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr,0.85fr]">
            {/* Skill tree */}
            <div className="space-y-4">
              {skillTrees.map((tree) => (
                <div
                  key={tree.category}
                  data-reveal
                  onMouseMove={onMove}
                  className="group/spot glass relative overflow-hidden rounded-2xl p-5 sm:p-6"
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
                    style={{
                      background:
                        "radial-gradient(320px circle at var(--mx,50%) var(--my,50%), rgba(255,138,43,0.12), transparent 70%)",
                    }}
                  />
                  <div className="relative mb-4 flex items-center gap-2.5">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-ember-500/15">
                      {categoryIcons[tree.category] ?? <Code2 className="h-4 w-4 text-ember-500" />}
                    </span>
                    <h3 className="font-condensed text-base uppercase tracking-[0.18em] text-white">
                      {tree.category}
                    </h3>
                  </div>
                  <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                    {tree.items.map((item) => (
                      <div key={item.name} className="group">
                        <div className="mb-1 flex items-center justify-between text-xs sm:text-sm">
                          <span className="flex items-center gap-1.5 text-white/80">
                            <span className="text-sm">{iconMap[item.name] ?? <Terminal className="h-3.5 w-3.5 text-ember-500" />}</span>
                            {item.name}
                            <span className="hidden text-[11px] text-white/30 sm:inline">· {item.tag}</span>
                          </span>
                          <span className="font-display text-xs text-ember-500">{item.level}%</span>
                        </div>
                        <div className="h-1 overflow-hidden rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-ember-500 to-burnt-red transition-all duration-1000 ease-out group-hover:shadow-glow"
                            style={{ width: `${item.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Rings */}
            <div data-reveal className="grid content-start grid-cols-2 gap-2.5 sm:gap-3.5">
              {skillRings.map((r) => (
                <Ring key={r.name} name={r.name} value={r.value} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}

function Ring({ name, value }: { name: string; value: number }) {
  const C = 2 * Math.PI * 40;
  const gid = `rg-${name.replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <div className="group glass flex flex-col items-center justify-center rounded-xl p-3 sm:p-4 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-glow">
      <div className="relative h-20 w-20 sm:h-24 sm:w-24">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={`url(#${gid})`}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${(value / 100) * C} ${C}`}
            className="transition-[filter] duration-500 group-hover:drop-shadow-[0_0_6px_rgba(255,106,0,0.8)]"
          />
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FF6A00" />
              <stop offset="100%" stopColor="#B84E02" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute inset-0 grid place-items-center font-display text-sm sm:text-base text-ember-500 transition-transform duration-500 group-hover:scale-105">
          {value}%
        </span>
      </div>
      <p className="mt-2 text-center text-xs font-medium text-white/80">{name}</p>
    </div>
  );
}
