import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Sparkles, User, ArrowRight, RotateCcw, FileText, ExternalLink, Key, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { scrollToId } from "@/hooks/use-lenis";
import { profile, projects, certificates, education, aboutTimeline } from "@/lib/data";

type Message = {
  id: string;
  sender: "user" | "ai";
  text: string;
  action?: {
    label: string;
    href?: string;
    type?: "scroll" | "resume" | "external";
  };
};

type AskSumitAIProps = {
  onOpenResume?: () => void;
};

const SUGGESTIONS = [
  "What is Sumit's RAG system (GyanVerse)?",
  "Tell me about his FlyRank ML Internship",
  "Google Cloud #1 Diamond League rank?",
  "What are his core ML & Python skills?",
  "View / Download his Resume",
  "How can I contact or hire Sumit?",
];

type KnowledgeEntry = {
  keywords: string[];
  answer: string;
  action?: {
    label: string;
    href?: string;
    type?: "scroll" | "resume" | "external";
  };
};

const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  // 1. GyanVerse RAG
  {
    keywords: ["rag", "gyanverse", "sentence transformer", "faiss", "chromadb", "vector", "capstone", "final year"],
    answer:
      "**GyanVerse AI** is Sumit's final-year capstone project — an end-to-end Retrieval-Augmented Generation (RAG) system. It indexes academic course documents using Sentence Transformers, stores embeddings in FAISS/ChromaDB vector stores, and synthesizes context-grounded multilingual answers with <1.2s latency in a Streamlit UI.",
    action: { label: "View GyanVerse Case Study", href: "#projects", type: "scroll" },
  },
  // 2. FlyRank AI Internship
  {
    keywords: ["flyrank", "internship", "ranking", "p@50", "precision@50", "contract", "huggingface", "work experience"],
    answer:
      "Sumit is a **Machine Learning Intern at FlyRank AI**. He builds automated content-opportunity scoring frameworks framed as ML ranking problems, benchmarking models against **Precision@50** and creating reproducible data contracts against FlyRank's HuggingFace warehouse.",
    action: { label: "View FlyRank Project Details", href: "#projects", type: "scroll" },
  },
  // 3. Google Cloud Arcade & Badges
  {
    keywords: ["arcade", "cloud", "badge", "diamond", "rank", "streak", "points", "gcp", "vertex", "bigquery"],
    answer:
      "Sumit achieved the **#1 Diamond League ranking** globally on Google Cloud Skills Boost! He completed **171+ verified skill badges**, accumulated **38,105 points**, and maintained an unbroken **44-day learning streak** spanning Vertex AI, BigQuery ML, GKE, and Terraform.",
    action: { label: "See Career Milestones", href: "#about", type: "scroll" },
  },
  // 4. Student Record Intelligence
  {
    keywords: ["student", "record", "intelligence", "nextgrade", "analytics", "1000+", "academic performance"],
    answer:
      "The **Student Record Intelligence System** is an end-to-end data processing and analytics platform Sumit built with Python, Pandas, and Streamlit. It parses and analyzes 1,000+ student records with 15+ metrics to spot academic dropout risk profiles and performance trends.",
    action: { label: "Inspect Analytics System", href: "#projects", type: "scroll" },
  },
  // 5. Airline Delay Prediction
  {
    keywords: ["airline", "flight", "delay", "prediction", "regression", "r2", "r^2", "aviation"],
    answer:
      "Sumit developed the **Airline Delay Prediction** regression model using Scikit-learn, Pandas, and NumPy. The end-to-end pipeline handles rigorous feature engineering and achieves an **R² score of ~0.85** on held-out flight delay evaluation data.",
    action: { label: "Explore Flight Delay Model", href: "#projects", type: "scroll" },
  },
  // 6. Research Paper & Computer Vision
  {
    keywords: ["research", "paper", "proctoring", "exam", "vision", "cv", "publication", "anamika", "academic integrity"],
    answer:
      "Sumit co-authored an **AI-Based Exam Proctoring System** research paper under the supervision of Mrs. Anamika Sharma (SRMU), investigating machine learning and computer-vision algorithms for automated, scalable academic-integrity monitoring.",
    action: { label: "Review Research Case Study", href: "#projects", type: "scroll" },
  },
  // 7. Core Skills & Tech Stack
  {
    keywords: ["skills", "python", "scikit-learn", "pandas", "ml", "machine learning", "technologies", "tech stack", "languages", "numpy", "sql", "tools"],
    answer:
      "Sumit's primary stack includes:\n• **Languages**: Python (93% - Advanced), SQL / MySQL (82%), Java (76%)\n• **ML & GenAI**: Scikit-learn, RAG Systems, FAISS/ChromaDB, Sentence Transformers, LLMs (GPT/LLaMA)\n• **Data & Frameworks**: Pandas (90%), NumPy (88%), Matplotlib, Streamlit, Flask, Git",
    action: { label: "Explore Interactive Skill Tree", href: "#skills", type: "scroll" },
  },
  // 8. Certifications
  {
    keywords: ["certificate", "certification", "credential", "google data analytics", "coursera", "nptel", "ibm", "anthropic", "deloitte", "tata", "tcs"],
    answer:
      "Sumit holds **11+ verified professional credentials**, notably:\n• **Google Data Analytics Professional Certificate** (Coursera, 94.87% score)\n• **Anthropic Claude Architecture**\n• **IBM Python for Data Science**\n• **NPTEL Data Science for Engineers** (IIT Madras)\n• **Deloitte Technology Consulting Job Simulation**\n• **Tata Data Visualisation**",
    action: { label: "View Verified Certificates", href: "#certificates", type: "scroll" },
  },
  // 9. Education & University
  {
    keywords: ["education", "srmu", "gpa", "cgpa", "sgpa", "degree", "b.tech", "college", "university", "school", "kendriya vidyalaya", "12th", "10th"],
    answer:
      "Sumit is in his final year of **B.Tech in Computer Science & Engineering (Specialization in AI & Data Science)** at Shri Ramswaroop Memorial University (SRMU, 2023–2027), holding a **CGPA of 7.98 / 10** (SGPA 8.26 in Sem VI). Prior to this, he completed CBSE Senior Secondary at PM Shri Kendriya Vidyalaya (75.4%).",
    action: { label: "View Education Details", href: "#education", type: "scroll" },
  },
  // 10. Resume / CV
  {
    keywords: ["resume", "cv", "download resume", "view resume", "profile document", "pdf"],
    answer:
      "Sumit's verified resume is available for preview right inside this portfolio or as a direct PDF download. It highlights his FlyRank internship, GyanVerse RAG capstone, 171 Google Cloud badges, and technical competencies.",
    action: { label: "Open Resume Preview", type: "resume" },
  },
  // 11. Contact & Hiring
  {
    keywords: ["contact", "email", "hire", "phone", "linkedin", "github", "reach", "opportunity", "freelance", "interview"],
    answer:
      "Sumit is open for Data Scientist, AI Engineer, and Machine Learning roles (Full-Time / Internships / Freelance). You can reach him directly:\n• **Email**: sumit.ku5981@gmail.com\n• **Phone**: +91 8810845474\n• **Location**: Lucknow, Uttar Pradesh, India (Open to Remote / Relocation)",
    action: { label: "Go to Contact Form", href: "#contact", type: "scroll" },
  },
  // 12. Community & Memberships
  {
    keywords: ["gdg", "community", "google developer group", "developer program", "membership", "lucknow"],
    answer:
      "Sumit is an active member of **Google Developer Group (GDG) Lucknow** and holds a **Google Developer Program premium tier membership**, actively engaging with AI builders and tech communities across India.",
    action: { label: "Read Community Journey", href: "#about", type: "scroll" },
  },
  // 13. LeetCode & Coding
  {
    keywords: ["leetcode", "coding", "dsa", "algorithms", "problem solving"],
    answer:
      "Sumit practices algorithmic problem solving and Data Structures on **LeetCode** (@Sumit2003), focusing on arrays, dynamic programming, trees, and computational efficiency.",
    action: { label: "Visit LeetCode Profile", href: profile.leetcode, type: "external" },
  },
];

const SYSTEM_CONTEXT = `You are "Ask Sumit AI", the personal portfolio intelligence assistant for Sumit Kumar.
Sumit Kumar is a final-year B.Tech CSE student (Artificial Intelligence & Data Science) at Shri Ramswaroop Memorial University (SRMU), graduating in 2027 with a CGPA of 7.98/10.
He is currently a Machine Learning Intern at FlyRank AI, where he designs content-opportunity ranking models evaluated against Precision@50 and builds HuggingFace data contracts.
Key projects:
1. GyanVerse AI: Capstone RAG system using Sentence Transformers, FAISS/ChromaDB vector stores, Streamlit UI, <1.2s latency.
2. Student Record Intelligence: Analytics platform for 1000+ student records using Python, Pandas, Streamlit.
3. Airline Delay Prediction: Scikit-learn regression model with R² score of ~0.85.
4. AI-Based Exam Proctoring Research: Co-authored research on ML & Computer Vision for exam integrity under Mrs. Anamika Sharma.
Key achievements:
- #1 Diamond League Rank in Google Cloud Arcade with 171 skill badges, 38,105 points, and 44-day streak.
- Google Data Analytics Professional Certificate with 94.87% score.
- Active GDG Lucknow member and Google Developer Program premium member.
Technical skills: Python (93%), Machine Learning (88%), Scikit-learn, RAG & GenAI (80%), FAISS, Pandas, NumPy, SQL, Streamlit, Flask, Java.
Contact: sumit.ku5981@gmail.com, +91 8810845474, Lucknow, India.
Always answer helpfully, concisely, and professionally. Highlight his projects, skills, and readiness for Data Science & AI engineering roles.`;

function FormattedText({ text, isUser = false }: { text: string; isUser?: boolean }) {
  const lines = text.split("\n");

  return (
    <div className="space-y-1">
      {lines.map((line, lineIdx) => {
        if (!line.trim()) {
          return <div key={lineIdx} className="h-1" />;
        }
        const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g);
        return (
          <p key={lineIdx} className={line.startsWith("• ") || line.startsWith("- ") ? "pl-2" : ""}>
            {parts.map((part, partIdx) => {
              if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
                const boldContent = part.slice(2, -2);
                return (
                  <strong
                    key={partIdx}
                    className={isUser ? "font-bold text-black" : "font-semibold text-white"}
                  >
                    {boldContent}
                  </strong>
                );
              }
              if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
                const italicContent = part.slice(1, -1);
                return (
                  <em
                    key={partIdx}
                    className={isUser ? "italic text-black/90" : "italic text-white/95"}
                  >
                    {italicContent}
                  </em>
                );
              }
              return <span key={partIdx}>{part}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
}

export default function AskSumitAI({ onOpenResume }: AskSumitAIProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Hello! I am Sumit's AI Portfolio Assistant. Ask me about his RAG projects, Machine Learning models, FlyRank AI internship, Google Cloud Arcade #1 ranking, or skills!",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState<string>(() => {
    return (
      (import.meta as any).env?.VITE_GEMINI_API_KEY ||
      localStorage.getItem("sumit_gemini_api_key") ||
      ""
    );
  });
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setShowKeyInput(false);
      }
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const clearChat = () => {
    setMessages([
      {
        id: "welcome-reset",
        sender: "ai",
        text: "Chat cleared. What else would you like to know about Sumit's background or projects?",
      },
    ]);
  };

  const handleSaveKey = () => {
    const trimmed = tempKey.trim();
    setApiKey(trimmed);
    if (trimmed) {
      localStorage.setItem("sumit_gemini_api_key", trimmed);
    } else {
      localStorage.removeItem("sumit_gemini_api_key");
    }
    setShowKeyInput(false);
  };

  const queryLocalKnowledge = (query: string): { text: string; action?: Message["action"] } => {
    const raw = query.trim().toLowerCase();
    const clean = raw.replace(/[?!.,;:_]/g, " ").replace(/\s+/g, " ").trim();
    const words = clean.split(" ");

    // 1. Natural Greetings Handler ("hey", "hello", "hi", "sup", "good morning", etc.)
    const greetingWords = ["hey", "hello", "hi", "heyy", "heyya", "hola", "yo", "sup", "howdy", "greetings"];
    const greetingPhrases = ["good morning", "good afternoon", "good evening", "hi there", "hello there", "whats up", "what's up", "how are you"];
    
    if (
      greetingPhrases.some((phrase) => clean.includes(phrase)) ||
      (words.length <= 3 && words.some((w) => greetingWords.includes(w)))
    ) {
      return {
        text: "Hey there! 👋 I'm Sumit's AI Portfolio Assistant.\n\nI can walk you through his **GyanVerse RAG capstone**, his **FlyRank AI internship**, his **#1 Google Cloud Diamond League ranking**, or preview his **resume**. What would you like to know?",
        action: { label: "View Portfolio Projects", href: "#projects", type: "scroll" },
      };
    }

    // 2. Help & Guidance Handler ("need help", "help", "guide me", "what can you do", etc.)
    const helpKeywords = ["help", "need help", "guide", "what can you do", "options", "commands", "how to use", "how does this work", "assist"];
    if (helpKeywords.some((hk) => clean.includes(hk))) {
      return {
        text: "I'd be glad to help! Here are a few great questions you can ask me:\n• **'Tell me about GyanVerse AI'** — his multilingual RAG system with Sentence Transformers\n• **'What did Sumit do at FlyRank AI?'** — ML ranking models & HuggingFace data contracts\n• **'What is his Google Cloud #1 ranking?'** — 171 badges and 38k points\n• **'Can I see his resume?'** — opens the interactive PDF document\n• **'What are his main skills?'** — Python, Scikit-learn, SQL, and GenAI",
        action: { label: "Open Resume Preview", type: "resume" },
      };
    }

    // 3. Who is Sumit / Identity / Introduction ("who is sumit", "tell me about yourself", "who are you")
    if (
      clean.includes("who is sumit") ||
      clean.includes("who are you") ||
      clean.includes("about sumit") ||
      clean.includes("tell me about sumit") ||
      clean.includes("introduce sumit") ||
      (clean.includes("tell me about") && (clean.includes("yourself") || clean.includes("him")))
    ) {
      return {
        text: "Sumit Kumar is a final-year B.Tech Computer Science student specializing in **Artificial Intelligence & Data Science** at SRMU, and currently a **Machine Learning Intern at FlyRank AI**.\n\nHe specializes in building context-grounded RAG systems, predictive ML pipelines, and production data workflows, and holds the **#1 Diamond League rank** on Google Cloud Skills Boost.",
        action: { label: "Read Career Journey", href: "#about", type: "scroll" },
      };
    }

    // 4. Why Hire Sumit / Strengths
    if (
      clean.includes("why hire") ||
      clean.includes("why should we hire") ||
      clean.includes("strengths") ||
      clean.includes("hire sumit") ||
      clean.includes("value")
    ) {
      return {
        text: "Here is why Sumit is a strong fit for AI & Data Science teams:\n1. **Proven ML Delivery**: Hands-on industry internship at FlyRank AI, optimizing models against Precision@50.\n2. **Applied GenAI**: Architected GyanVerse, an end-to-end RAG system with Sentence Transformers & FAISS.\n3. **Relentless Drive**: #1 Diamond League rank on Google Cloud Skills Boost with 171 badges & a 44-day streak.\n4. **Production Stack**: Advanced Python (93%), Scikit-learn, SQL, Pandas, and versioned data contracts.",
        action: { label: "Get in Touch / Hire", href: "#contact", type: "scroll" },
      };
    }

    // 5. Gratitude & Pleasantries ("thanks", "thank you", "cool", "bye")
    const thanksWords = ["thanks", "thank you", "thx", "awesome", "great", "cool", "perfect", "bye", "goodbye"];
    if (words.some((w) => thanksWords.includes(w)) && clean.length < 25) {
      return {
        text: "You're very welcome! Feel free to reach out directly to Sumit if you'd like to collaborate or discuss an AI / Data Science role.",
        action: { label: "Go to Contact Section", href: "#contact", type: "scroll" },
      };
    }

    // 6. Direct Resume Trigger
    if (clean.includes("resume") || clean.includes("cv") || clean.includes("curriculum vitae") || clean.includes("biodata")) {
      const match = KNOWLEDGE_BASE.find((k) => k.keywords.includes("resume"));
      return {
        text: match?.answer || "Sumit's verified resume is available for preview right here or as a direct PDF download.",
        action: { label: "Open Resume Preview", type: "resume" },
      };
    }

    // 7. Best Keyword Match Scoring across Knowledge Base
    let bestMatch: KnowledgeEntry | null = null;
    let highestScore = 0;

    for (const entry of KNOWLEDGE_BASE) {
      let score = 0;
      for (const kw of entry.keywords) {
        if (clean.includes(kw)) {
          score += kw.length > 5 ? 3 : 2;
        }
      }
      if (score > highestScore) {
        highestScore = score;
        bestMatch = entry;
      }
    }

    if (bestMatch && highestScore > 0) {
      return {
        text: bestMatch.answer,
        action: bestMatch.action,
      };
    }

    // 8. Helpful Conversational Fallback (Instead of repeating the same robotic paragraph)
    return {
      text: "I didn't quite catch that question, but I can answer almost anything about Sumit's engineering background!\n\nWould you like to know about his **RAG system (GyanVerse)**, his **FlyRank ML internship**, his **Google Cloud #1 ranking**, or would you like to **view his resume**?",
      action: { label: "Open Resume Preview", type: "resume" },
    };
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    // If Gemini API Key is available, try real Gemini API
    if (apiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text: `${SYSTEM_CONTEXT}\n\nUser Question: ${query}\nProvide a concise, helpful answer as Sumit's portfolio assistant. If relevant, suggest visiting a section like #projects, #skills, #about, or #contact.`,
                    },
                  ],
                },
              ],
              generationConfig: {
                maxOutputTokens: 250,
                temperature: 0.4,
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            setMessages((prev) => [
              ...prev,
              {
                id: (Date.now() + 1).toString(),
                sender: "ai",
                text: candidateText.trim(),
                action: { label: "View Projects & Experience", href: "#projects", type: "scroll" },
              },
            ]);
            setIsTyping(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Gemini API call failed, falling back to local knowledge engine:", err);
      }
    }

    // Offline / Instant Local Knowledge Fallback
    setTimeout(() => {
      const result = queryLocalKnowledge(query);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: result.text,
          action: result.action,
        },
      ]);
      setIsTyping(false);
    }, 450);
  };

  const handleActionClick = (action?: Message["action"]) => {
    if (!action) return;
    setOpen(false);

    if (action.type === "resume") {
      if (onOpenResume) {
        onOpenResume();
      } else {
        window.open(profile.resume, "_blank");
      }
      return;
    }

    if (action.type === "external" && action.href) {
      window.open(action.href, "_blank");
      return;
    }

    if (action.href) {
      scrollToId(action.href);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-[90] flex items-center gap-3 rounded-full border border-ember-500/50 bg-[#0d141e]/90 px-4 py-3 text-white shadow-glow backdrop-blur-xl transition-all hover:scale-105 hover:border-ember-500 hover:bg-ember-500 hover:text-black group"
        aria-label="Ask Sumit AI Assistant"
      >
        <span className="relative grid h-8 w-8 place-items-center rounded-full bg-ember-500/20 text-ember-500 group-hover:text-black transition-colors">
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
            className="fixed bottom-20 sm:bottom-24 right-3 sm:right-6 z-[95] w-[calc(100vw-1.5rem)] sm:w-[440px] max-w-lg overflow-hidden rounded-3xl border border-white/15 bg-[#08131e]/95 shadow-2xl backdrop-blur-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-3.5 sm:px-5">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-xl bg-gradient-primary text-black">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
                <div>
                  <h3 className="font-display text-base sm:text-lg uppercase text-white">Ask Sumit AI</h3>
                  <p className="text-[10px] sm:text-[11px] text-ember-500 flex items-center gap-1">
                    <span>{apiKey ? "Live Gemini Mode" : "Smart Semantic Engine"}</span>
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Clear Chat */}
                <button
                  onClick={clearChat}
                  title="Clear conversation"
                  aria-label="Clear conversation"
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>

                {/* API Key Modal Toggle */}
                <button
                  onClick={() => setShowKeyInput((v) => !v)}
                  title={apiKey ? "Gemini API key configured" : "Configure Gemini API key"}
                  aria-label="Gemini API Key Settings"
                  className={`grid h-8 w-8 place-items-center rounded-full transition-colors ${
                    apiKey ? "bg-ember-500/20 text-ember-400 hover:bg-ember-500/30" : "bg-white/5 text-white/50 hover:bg-white/10"
                  }`}
                >
                  <Key className="h-3.5 w-3.5" />
                </button>

                {/* Close Button */}
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close assistant"
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Optional Gemini API Key Banner */}
            {showKeyInput && (
              <div className="border-b border-ember-500/20 bg-[#0d1c2b] p-3 text-xs text-white/90">
                <p className="font-semibold text-ember-400 flex items-center gap-1.5 mb-1">
                  <Key className="h-3.5 w-3.5" /> Optional Google Gemini API Key
                </p>
                <p className="text-[11px] text-white/60 mb-2">
                  Add a free Gemini API key for live generative conversational responses, or leave blank to use the instant built-in portfolio knowledge base.
                </p>
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={tempKey}
                    onChange={(e) => setTempKey(e.target.value)}
                    className="flex-1 rounded-lg border border-white/15 bg-black/40 px-3 py-1.5 text-xs text-white outline-none focus:border-ember-500"
                  />
                  <button
                    onClick={handleSaveKey}
                    className="btn-ember flex items-center gap-1 px-3 py-1.5 text-xs font-semibold"
                  >
                    <Check className="h-3.5 w-3.5" /> Save
                  </button>
                </div>
              </div>
            )}

            {/* Chat History */}
            <div className="h-72 sm:h-80 max-h-[52vh] overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
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
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                      m.sender === "user"
                        ? "bg-ember-500 text-[#1a0e04] font-medium"
                        : "glass text-white/90 border border-white/10"
                    }`}
                  >
                    <FormattedText text={m.text} isUser={m.sender === "user"} />
                    {m.action && (
                      <button
                        onClick={() => handleActionClick(m.action)}
                        className="mt-3 flex items-center gap-1.5 font-condensed text-xs uppercase tracking-wider text-ember-400 hover:text-ember-300 font-semibold transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-ember-500/20"
                      >
                        {m.action.type === "resume" && <FileText className="h-3.5 w-3.5 text-ember-400" />}
                        {m.action.type === "external" && <ExternalLink className="h-3.5 w-3.5 text-ember-400" />}
                        {m.action.type === "scroll" && <ArrowRight className="h-3.5 w-3.5 text-ember-400" />}
                        <span>{m.action.label}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-white/50 pl-2">
                  <Bot className="h-3.5 w-3.5 text-ember-500 animate-spin" />
                  <span>Synthesizing portfolio intelligence...</span>
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
                    className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/70 transition-colors hover:border-ember-500/40 hover:text-ember-400"
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
              className="flex items-center gap-2 border-t border-white/10 p-3 bg-white/[0.02]"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about projects, ML internship, Cloud #1 rank..."
                className="w-full rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs text-white placeholder-white/40 outline-none focus:border-ember-500 transition-colors"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ember-500 text-black transition-transform hover:scale-105 shadow-glow"
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
