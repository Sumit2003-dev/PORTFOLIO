import { useRef, useState } from "react";
import Section from "./Section";
import { skillTrees, skillRings } from "@/lib/data";
import { useFadeUp } from "@/hooks/use-scroll";
import SkillCosmos3D from "./3d/SkillCosmos3D";
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
  Pandas: <SiPandas className="text-[#150458]" />,
  NumPy: <SiNumpy className="text-[#013243]" />,
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
  const ref = useRef<HTMLElement>(null);
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
            <p data-reveal className="mt-4 max-w-2xl text-lg text-white/55">
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
            <SkillCosmos3D />
          </div>
        ) : (
          <div className="mt-14 grid gap-10 lg:grid-cols-[1.15fr,0.85fr]">
            {/* Skill tree */}
            <div className="space-y-6">
              {skillTrees.map((tree) => (
                <div
                  key={tree.category}
                  data-reveal
                  onMouseMove={onMove}
                  className="group/spot glass relative overflow-hidden rounded-3xl p-6 sm:p-8"
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
                    style={{
                      background:
                        "radial-gradient(360px circle at var(--mx,50%) var(--my,50%), rgba(255,138,43,0.14), transparent 70%)",
                    }}
                  />
                  <div className="relative mb-5 flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-ember-500/15">
                      {categoryIcons[tree.category] ?? <Code2 className="h-5 w-5 text-ember-500" />}
                    </span>
                    <h3 className="font-condensed text-lg uppercase tracking-[0.2em] text-white">
                      {tree.category}
                    </h3>
                  </div>
                  <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                    {tree.items.map((item) => (
                      <div key={item.name} className="group">
                        <div className="mb-1.5 flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 text-white/80">
                            <span className="text-base">{iconMap[item.name] ?? <Terminal className="h-4 w-4 text-ember-500" />}</span>
                            {item.name}
                            <span className="hidden text-xs text-white/30 sm:inline">· {item.tag}</span>
                          </span>
                          <span className="font-display text-ember-500">{item.level}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
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
            <div data-reveal className="grid content-start grid-cols-2 gap-5 sm:grid-cols-2">
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
  const C = 2 * Math.PI * 52;
  const gid = `rg-${name.replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <div className="group glass flex flex-col items-center rounded-3xl p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-glow">
      <div className="relative h-28 w-28">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke={`url(#${gid})`}
            strokeWidth="7"
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
        <span className="absolute inset-0 grid place-items-center font-display text-2xl text-ember-500 transition-transform duration-500 group-hover:scale-110">
          {value}%
        </span>
      </div>
      <p className="mt-4 text-center font-medium text-white/80">{name}</p>
    </div>
  );
}
