import { useEffect, useRef, useState } from "react";
import { X, Terminal as TerminalIcon, CornerDownLeft, Sparkles } from "lucide-react";
import { profile, projects, skillTrees, certificates } from "@/lib/data";

type TerminalModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function TerminalModal({ isOpen, onClose }: TerminalModalProps) {
  const [inputVal, setInputVal] = useState("");
  const [logs, setLogs] = useState<Array<{ cmd: string; output: React.ReactNode }>>([
    {
      cmd: "welcome",
      output: (
        <div className="space-y-1 text-xs text-emerald-400 font-mono">
          <p className="text-white font-bold">Sumit Kumar Shell [Version 2.4.0-AI]</p>
          <p className="text-white/60">Type <span className="text-ember-400 font-bold">'help'</span> to view available terminal commands.</p>
        </div>
      ),
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  if (!isOpen) return null;

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCmd = inputVal.trim().toLowerCase();
    if (!cleanCmd) return;

    let output: React.ReactNode = null;

    switch (cleanCmd) {
      case "help":
        output = (
          <div className="grid gap-1 font-mono text-xs text-white/80">
            <p><span className="text-ember-400">whoami</span> - Display engineer overview</p>
            <p><span className="text-ember-400">skills</span> - List core technical competencies</p>
            <p><span className="text-ember-400">projects</span> - View featured AI/ML repositories</p>
            <p><span className="text-ember-400">certs</span> - List verified credentials</p>
            <p><span className="text-ember-400">contact</span> - Display direct email & links</p>
            <p><span className="text-ember-400">cat resume.txt</span> - Display resume highlights</p>
            <p><span className="text-ember-400">clear</span> - Clear terminal screen</p>
            <p><span className="text-ember-400">exit</span> - Close terminal window</p>
          </div>
        );
        break;

      case "whoami":
        output = (
          <div className="font-mono text-xs space-y-1 text-white/90">
            <p className="text-ember-400 font-bold">{profile.name} — {profile.role}</p>
            <p className="text-white/70">{profile.bio}</p>
            <p className="text-white/50">University: {profile.education.college} ({profile.education.cgpa})</p>
          </div>
        );
        break;

      case "skills":
        output = (
          <div className="font-mono text-xs space-y-2">
            {skillTrees.map((s) => (
              <div key={s.category}>
                <p className="text-ember-400 font-bold">[{s.category}]</p>
                <p className="text-white/80">{s.items.map((i) => i.name).join(", ")}</p>
              </div>
            ))}
          </div>
        );
        break;

      case "projects":
        output = (
          <div className="font-mono text-xs space-y-2">
            {projects.slice(0, 4).map((p) => (
              <div key={p.title} className="border-l-2 border-ember-500 pl-3">
                <p className="text-white font-bold">{p.title} ({p.category})</p>
                <p className="text-white/60">{p.blurb}</p>
                <p className="text-ember-400">Tech: {p.tech.join(" · ")}</p>
              </div>
            ))}
          </div>
        );
        break;

      case "certs":
        output = (
          <div className="font-mono text-xs space-y-1">
            {certificates.map((c) => (
              <p key={c.title} className="text-white/90">
                <span className="text-emerald-400">✓</span> <span className="text-white font-bold">{c.title}</span> ({c.issuer})
              </p>
            ))}
          </div>
        );
        break;

      case "contact":
        output = (
          <div className="font-mono text-xs space-y-1 text-white/90">
            <p>Email: <span className="text-ember-400">{profile.email}</span></p>
            <p>LinkedIn: <span className="text-ember-400">{profile.linkedin}</span></p>
            <p>GitHub: <span className="text-ember-400">{profile.github}</span></p>
          </div>
        );
        break;

      case "cat resume.txt":
        output = (
          <div className="font-mono text-xs space-y-1 text-emerald-300">
            <p className="text-white font-bold">--- SUMIT KUMAR RESUME SUMMARY ---</p>
            <p>• Machine Learning Intern @ FlyRank AI</p>
            <p>• Lead Developer of GyanVerse AI (RAG Multilingual Assistant)</p>
            <p>• Google Data Analytics Professional Certified (94.87%)</p>
            <p>• B.Tech Computer Science (AI & Data Science) · SRMU</p>
          </div>
        );
        break;

      case "clear":
        setLogs([]);
        setInputVal("");
        return;

      case "exit":
        onClose();
        setInputVal("");
        return;

      default:
        output = (
          <p className="font-mono text-xs text-rose-400">
            Command not recognized: '{cleanCmd}'. Type <span className="text-white font-bold">'help'</span> for list of commands.
          </p>
        );
        break;
    }

    setLogs((prev) => [...prev, { cmd: inputVal, output }]);
    setInputVal("");
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl"
      onClick={onClose}
    >
      <div
        className="relative flex h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/20 bg-[#060c14] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#091320] px-4 py-3">
          <div className="flex items-center gap-2">
            <TerminalIcon className="h-4 w-4 text-ember-500" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
              sumit@dev-terminal:~
            </span>
          </div>
          <button
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-lg bg-white/10 text-white hover:bg-ember-500 hover:text-black"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Terminal Output */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
          {logs.map((l, i) => (
            <div key={i} className="space-y-1.5">
              {l.cmd !== "welcome" && (
                <div className="flex items-center gap-2 text-white/50">
                  <span className="text-ember-500">guest@sumit-portfolio:~$</span>
                  <span className="text-white">{l.cmd}</span>
                </div>
              )}
              <div>{l.output}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleCommand} className="flex items-center border-t border-white/10 bg-[#070e17] px-4 py-3">
          <span className="font-mono text-xs text-ember-500 font-bold mr-2">guest@sumit:~$</span>
          <input
            type="text"
            autoFocus
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="type 'help', 'whoami', 'skills'..."
            className="flex-1 bg-transparent font-mono text-xs text-white placeholder-white/30 focus:outline-none"
          />
          <button type="submit" className="text-white/40 hover:text-ember-500">
            <CornerDownLeft className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
