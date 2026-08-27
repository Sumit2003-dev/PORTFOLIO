import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Sparkles, User, ArrowRight, CornerDownLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { scrollToId } from "@/hooks/use-lenis";

type Message = {
  id: string;
  sender: "user" | "ai";
  text: string;
  action?: { label: string; href: string };
};

const SUGGESTIONS = [
  "What is Sumit's RAG system (GyanVerse)?",
  "What are Sumit's primary ML & AI skills?",
  "Tell me about NextGrade Student Performance model",
  "How can I contact or hire Sumit?",
];

const KNOWLEDGE_BASE: { keywords: string[]; answer: string; action?: { label: string; href: string } }[] = [
  {
    keywords: ["rag", "gyanverse", "sentence transformers", "faiss", "chromadb", "final year"],
    answer:
      "GyanVerse AI is Sumit's final-year project — a Retrieval-Augmented Generation (RAG) system built with Sentence Transformers, FAISS/ChromaDB vector stores, and LLMs (GPT/LLaMA) in a Streamlit UI for context-grounded Q&A.",
    action: { label: "View Project Case Study", href: "#projects" },
  },
  {
    keywords: ["skills", "python", "scikit-learn", "pandas", "ml", "machine learning", "technologies"],
    answer:
      "Sumit excels in Python (93%), Machine Learning (88%), RAG & GenAI (80%), Scikit-learn, Pandas, NumPy, FAISS, SQL, Flask, Streamlit, and Data Visualisation.",
    action: { label: "Explore Skill Trees", href: "#skills" },
  },
  {
    keywords: ["student", "performance", "nextgrade", "accuracy", "prediction", "92%"],
    answer:
      "Sumit built NextGrade — a full-stack ML web app trained on 1,000+ student records with ~92% accuracy and R² ≈ 0.86, deployed live on Netlify.",
    action: { label: "View Projects", href: "#projects" },
  },
  {
    keywords: ["internship", "flyrank", "role", "experience", "work"],
    answer:
      "Sumit is currently a Machine Learning Intern at FlyRank AI, building predictive models, optimizing data pipelines, and partnering with cross-functional AI teams.",
    action: { label: "Read Journey in About", href: "#about" },
  },
  {
    keywords: ["contact", "email", "hire", "phone", "linkedin", "github", "reach"],
    answer:
      "You can reach Sumit via email at sumit.ku5981@gmail.com, phone at +91 8810845474, or connect on LinkedIn (in/sumit2003-dev) and GitHub (Sumit2003-dev).",
    action: { label: "Go to Contact Form", href: "#contact" },
  },
  {
    keywords: ["education", "srmu", "gpa", "degree", "b.tech", "college"],
    answer:
      "Sumit is pursuing B.Tech in CSE (Specialization in AI & Data Science) at Shri Ramswaroop Memorial University (SRMU), maintaining a GPA of 8.37 / 10.",
    action: { label: "View Education", href: "#education" },
  },
];

export default function AskSumitAI() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Hi! I am Sumit's AI Portfolio Assistant. Ask me anything about his RAG projects, Machine Learning models, FlyRank AI internship, or skills!",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const lower = query.toLowerCase();
      const match = KNOWLEDGE_BASE.find((k) => k.keywords.some((kw) => lower.includes(kw)));

      const responseText = match
        ? match.answer
        : "Sumit is a Data Scientist & AI Engineer specializing in RAG systems, Scikit-learn ML pipelines, and predictive applications. Feel free to reach out directly via the Contact section!";

      const responseAction = match?.action;

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: responseText,
          action: responseAction,
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-[90] flex items-center gap-3 rounded-full border border-ember-500/50 bg-[#0d141e]/90 px-4 py-3 text-white shadow-glow backdrop-blur-xl transition-all hover:scale-105 hover:border-ember-500 hover:bg-ember-500 hover:text-black"
        aria-label="Ask Sumit AI"
      >
        <span className="relative grid h-8 w-8 place-items-center rounded-full bg-ember-500/20 text-ember-500 group-hover:text-black">
          <Bot className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-ember-500 animate-ping" />
        </span>
        <span className="hidden font-condensed text-sm font-semibold uppercase tracking-wider sm:inline">
          Ask Sumit AI
        </span>
      </button>

      {/* Floating Chat Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 z-[95] w-[calc(100vw-2rem)] max-w-md overflow-hidden rounded-3xl border border-white/15 bg-[#08131e]/95 shadow-2xl backdrop-blur-2xl sm:right-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-black">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-lg uppercase text-white">Ask Sumit AI</h3>
                  <p className="text-[11px] text-ember-500">RAG-Powered Portfolio Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chat History */}
            <div className="h-80 overflow-y-auto p-4 space-y-3 scrollbar-thin">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex items-start gap-2.5 ${m.sender === "user" ? "flex-row-reverse" : ""}`}
                >
                  <span
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                      m.sender === "user" ? "bg-white/20 text-white" : "bg-ember-500/20 text-ember-500"
                    }`}
                  >
                    {m.sender === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                  </span>
                  <div
                    className={`max-w-[82%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                      m.sender === "user"
                        ? "bg-ember-500 text-[#1a0e04] font-medium"
                        : "glass text-white/90"
                    }`}
                  >
                    {m.text}
                    {m.action && (
                      <button
                        onClick={() => {
                          setOpen(false);
                          scrollToId(m.action!.href);
                        }}
                        className="mt-2.5 flex items-center gap-1.5 font-condensed text-xs uppercase tracking-wider text-ember-500 hover:underline"
                      >
                        {m.action.label} <ArrowRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <Bot className="h-3.5 w-3.5 text-ember-500 animate-spin" />
                  AI is searching knowledge base...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggestion Chips */}
            <div className="border-t border-white/5 p-3 bg-white/[0.01]">
              <p className="mb-2 text-[10px] font-condensed uppercase tracking-wider text-white/40">
                Suggested Queries
              </p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/70 transition-colors hover:border-ember-500/40 hover:text-ember-500"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2 border-t border-white/10 p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about projects, skills, ML experience..."
                className="w-full rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs text-white placeholder-white/40 outline-none focus:border-ember-500"
              />
              <button
                type="submit"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ember-500 text-black transition-transform hover:scale-105"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
