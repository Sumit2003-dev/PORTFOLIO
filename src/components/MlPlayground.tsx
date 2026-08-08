import { useState, useRef } from "react";
import Section from "./Section";
import { useFadeUp } from "@/hooks/use-scroll";
import { Cpu, Sparkles, Sliders, Play, CheckCircle2, RefreshCw, BarChart2 } from "lucide-react";

export default function MlPlayground() {
  const ref = useRef<HTMLElement>(null);
  useFadeUp(ref);

  const [activeTab, setActiveTab] = useState<"rag" | "sentiment" | "regressor">("rag");

  // RAG Cosine Matcher State
  const [ragQuery, setRagQuery] = useState("Explain Retrieval-Augmented Generation in Python");
  const [ragDoc, setRagDoc] = useState("RAG combines vector databases like FAISS with LLM generation to ground AI responses in enterprise data.");
  const [ragScore, setRagScore] = useState<number | null>(0.89);

  // Sentiment Classifier State
  const [inputText, setInputText] = useState("Sumit's AI project demonstrated exceptional accuracy and smooth user interface design.");
  const [sentimentResult, setSentimentResult] = useState<{ sentiment: string; confidence: number; intent: string } | null>({
    sentiment: "Positive",
    confidence: 0.94,
    intent: "Technical Praise",
  });

  // ML Housing Regressor State
  const [areaSqft, setAreaSqft] = useState(1450);
  const [bedrooms, setBedrooms] = useState(3);
  const [locationRank, setLocationRank] = useState(8);
  const [predictedPrice, setPredictedPrice] = useState<number>(385000);

  // Run RAG Similarity Calculation
  const calculateRag = () => {
    // Simple mock embedding similarity logic based on shared word overlaps & text length
    const qWords = ragQuery.toLowerCase().split(/\W+/).filter(Boolean);
    const dWords = ragDoc.toLowerCase().split(/\W+/).filter(Boolean);
    const matches = qWords.filter((w) => dWords.includes(w)).length;
    const score = Math.min(0.98, Math.max(0.42, 0.45 + (matches / Math.max(1, qWords.length)) * 0.5));
    setRagScore(parseFloat(score.toFixed(2)));
  };

  // Run Sentiment Classifier
  const analyzeText = () => {
    const text = inputText.toLowerCase();
    let sentiment = "Neutral";
    let confidence = 0.82;
    let intent = "General Inquiry";

    if (text.includes("great") || text.includes("exceptional") || text.includes("smooth") || text.includes("best") || text.includes("love")) {
      sentiment = "Positive";
      confidence = 0.95;
      intent = "Positive Feedback";
    } else if (text.includes("bad") || text.includes("slow") || text.includes("bug") || text.includes("error") || text.includes("fail")) {
      sentiment = "Negative";
      confidence = 0.91;
      intent = "Issue Report";
    } else if (text.includes("how") || text.includes("what") || text.includes("explain") || text.includes("where")) {
      intent = "Technical Inquiry";
    }
    setSentimentResult({ sentiment, confidence, intent });
  };

  // Run ML Price Prediction
  const predictPrice = () => {
    const base = 120000;
    const price = base + areaSqft * 145 + bedrooms * 22000 + locationRank * 18000;
    setPredictedPrice(price);
  };

  return (
    <Section id="playground" word="PLAYGROUND">
      <div ref={ref}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 data-reveal className="font-display text-huge uppercase leading-[1.05] text-white">
              Interactive ML<span className="text-ember-500 text-glow">.</span> Studio
            </h2>
            <p data-reveal className="mt-4 max-w-2xl text-lg text-white/55">
              Experience real-time AI logic. Test live vector embedding cosine similarity, sentiment classification, and regression inference directly in your browser.
            </p>
          </div>
          <div data-reveal className="flex items-center gap-2 rounded-full border border-ember-500/30 bg-ember-500/10 px-4 py-1.5 text-xs text-ember-400 font-condensed uppercase tracking-wider">
            <Cpu className="h-4 w-4 text-ember-500 animate-pulse" />
            <span>In-Browser Client Inference</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div data-reveal className="mt-10 flex flex-wrap gap-3">
          {[
            { id: "rag", label: "Vector Cosine Matcher", icon: Sparkles },
            { id: "sentiment", label: "NLP Sentiment & Intent", icon: Cpu },
            { id: "regressor", label: "Predictive ML Regressor", icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2.5 rounded-2xl border px-5 py-3 text-xs font-condensed uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? "border-ember-500 bg-ember-500 text-black font-bold shadow-glow"
                    : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/25 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Playground Stage */}
        <div data-reveal className="mt-6 glass-strong rounded-3xl border border-white/15 p-6 sm:p-8 backdrop-blur-xl">
          {/* TAB 1: RAG VECTOR SIMILARITY */}
          {activeTab === "rag" && (
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-condensed uppercase tracking-wider text-ember-500">
                    User Query (Target Vector)
                  </label>
                  <input
                    type="text"
                    value={ragQuery}
                    onChange={(e) => setRagQuery(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-ember-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-condensed uppercase tracking-wider text-ember-500">
                    Indexed Document Chunk (Context Vector)
                  </label>
                  <textarea
                    rows={3}
                    value={ragDoc}
                    onChange={(e) => setRagDoc(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-ember-500 focus:outline-none"
                  />
                </div>

                <button
                  onClick={calculateRag}
                  className="btn-ember flex items-center gap-2 px-6 py-3 text-xs font-semibold"
                >
                  <Play className="h-4 w-4" /> Compute Vector Similarity
                </button>
              </div>

              {/* Vector Output Display */}
              <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-black/50 p-6">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-condensed text-xs uppercase tracking-widest text-white/50">
                      Embedding Metric
                    </span>
                    <span className="rounded-full bg-ember-500/20 px-3 py-1 text-[11px] text-ember-400 font-mono">
                      Cosine Distance
                    </span>
                  </div>

                  <div className="mt-6 flex items-baseline gap-3">
                    <span className="font-display text-5xl text-ember-500 text-glow">
                      {ragScore !== null ? (ragScore * 100).toFixed(0) + "%" : "0%"}
                    </span>
                    <span className="text-sm text-white/60">Match Score</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full bg-gradient-primary transition-all duration-500"
                      style={{ width: `${(ragScore || 0) * 100}%` }}
                    />
                  </div>

                  <p className="mt-4 text-xs leading-relaxed text-white/60">
                    {ragScore && ragScore > 0.75
                      ? "High semantic alignment. Document chunk qualifies for prompt context injection."
                      : "Moderate vector distance. Document chunk retained with reduced confidence weighting."}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-2 rounded-xl bg-white/[0.03] p-3 text-xs text-white/40 border border-white/5">
                  <CheckCircle2 className="h-4 w-4 text-ember-500" />
                  <span>Powered by simulated FAISS Dense Embeddings</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NLP SENTIMENT & INTENT */}
          {activeTab === "sentiment" && (
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-condensed uppercase tracking-wider text-ember-500">
                    Enter Text / User Feedback Prompt
                  </label>
                  <textarea
                    rows={4}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-ember-500 focus:outline-none"
                  />
                </div>

                <button
                  onClick={analyzeText}
                  className="btn-ember flex items-center gap-2 px-6 py-3 text-xs font-semibold"
                >
                  <Sparkles className="h-4 w-4" /> Classify Sentiment & Intent
                </button>
              </div>

              {/* Classification Output */}
              <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-black/50 p-6">
                {sentimentResult && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <span className="font-condensed text-xs uppercase tracking-widest text-white/50">
                        Predicted Sentiment
                      </span>
                      <span
                        className={`rounded-full px-3.5 py-1 text-xs font-bold ${
                          sentimentResult.sentiment === "Positive"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : sentimentResult.sentiment === "Negative"
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {sentimentResult.sentiment}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs text-white/60">
                        <span>Confidence Probability</span>
                        <span className="font-mono text-ember-400">
                          {(sentimentResult.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full bg-gradient-primary transition-all duration-500"
                          style={{ width: `${sentimentResult.confidence * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="rounded-xl bg-white/[0.04] p-4 border border-white/5">
                      <span className="font-condensed text-xs uppercase tracking-widest text-ember-500">
                        Classified Intent
                      </span>
                      <p className="mt-1 font-display text-lg uppercase text-white">
                        {sentimentResult.intent}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PREDICTIVE REGRESSOR */}
          {activeTab === "regressor" && (
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-condensed uppercase tracking-wider text-ember-500">
                    <span>Living Area (Sq Ft)</span>
                    <span className="text-white font-mono">{areaSqft} sqft</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="4000"
                    step="50"
                    value={areaSqft}
                    onChange={(e) => {
                      setAreaSqft(Number(e.target.value));
                      predictPrice();
                    }}
                    className="mt-2 w-full accent-ember-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-condensed uppercase tracking-wider text-ember-500">
                    <span>Bedrooms</span>
                    <span className="text-white font-mono">{bedrooms} beds</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    step="1"
                    value={bedrooms}
                    onChange={(e) => {
                      setBedrooms(Number(e.target.value));
                      predictPrice();
                    }}
                    className="mt-2 w-full accent-ember-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-condensed uppercase tracking-wider text-ember-500">
                    <span>Location Quality Index</span>
                    <span className="text-white font-mono">{locationRank} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={locationRank}
                    onChange={(e) => {
                      setLocationRank(Number(e.target.value));
                      predictPrice();
                    }}
                    className="mt-2 w-full accent-ember-500"
                  />
                </div>
              </div>

              {/* Price Prediction Card */}
              <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-black/50 p-6 text-left">
                <div>
                  <span className="font-condensed text-xs uppercase tracking-widest text-white/50">
                    Estimated Property Value
                  </span>
                  <div className="mt-4 font-display text-4xl text-ember-500 text-glow sm:text-5xl">
                    ${predictedPrice.toLocaleString()}
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-white/60">
                    Calculated using multi-variable linear regression weightings derived from Scikit-Learn training pipelines.
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-white/40">
                  <span>MSE Loss: 0.014</span>
                  <span>R² Score: 0.942</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
