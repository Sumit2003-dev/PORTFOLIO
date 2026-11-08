const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

export const profile = {
  name: "Sumit Kumar",
  fullName: "Sumit Kumar Bharti",
  title: "Data Scientist",
  roles: ["Data Scientist", "AI Engineer", "Machine Learning Developer"],
  currentRole: "Machine Learning Intern · FlyRank AI",
  tagline:
    "I'm a Data Scientist and AI/ML developer interested in building practical machine learning systems. I work with Python, predictive modelling, NLP and RAG, turning ideas and real-world problems into working applications.",
  short: "Data Scientist and AI/ML developer building practical machine learning systems, predictive models, and context-grounded RAG applications.",
  description: [
    "Final-year Computer Science & Engineering student specialising in Artificial Intelligence and Data Science, currently gaining hands-on industry experience as a Machine Learning Intern at FlyRank AI.",
    "I have a proven record of building and deploying end-to-end ML applications, with strong skills in Python, Scikit-learn and data visualisation — translating academic training into production-oriented outcomes. I currently hold the #1 Diamond League ranking on Google Cloud Skills Boost with 171 skill badges and a 44-day learning streak. I'm also an active member of GDG (Google Developer Group) Lucknow and hold a Google Developer Program premium tier membership, staying engaged with the broader developer community beyond coursework.",
    "I'm actively expanding my expertise in Generative AI, RAG systems and LLMs through applied academic and industry projects.",
  ],
  email: "sumit.ku5981@gmail.com",
  phone: "+91 8810845474",
  location: "Lucknow, Uttar Pradesh, India",
  resume: asset("uploads/Sumit_Kumar_Bharti_Resume_Updated.pdf"),
  social: [
    { name: "GitHub", href: "https://github.com/Sumit2003-dev" },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/sumit2003-dev/" },
    { name: "Email", href: "mailto:sumit.ku5981@gmail.com" },
  ],
  leetcode: "https://leetcode.com/Sumit2003",
  githubHandle: "Sumit2003-dev",
};

/* ============================ ABOUT ============================ */
export const stats = [
  { label: "Projects", value: 6, suffix: "+" },
  { label: "Certificates", value: 11, suffix: "+" },
  { label: "Cloud Badges", value: 171, suffix: "+" },
  { label: "Internships", value: 1, suffix: "" },
];

export const aboutTimeline = [
  { year: "2026", title: "Google Cloud Arcade · #1 Diamond League Rank", text: "Ranked #1 in the Diamond League with 171 skill badges earned, 38,105 points, and a 44-day streak across Vertex AI, BigQuery ML, GKE, and Terraform." },
  { year: "2026", title: "ML Intern · FlyRank AI", text: "Building a content-opportunity scoring framework as an ML ranking problem — validating models against Precision@50 and building HuggingFace data contracts." },
  { year: "2026", title: "GyanVerse AI · RAG System", text: "Final-year project combining Sentence Transformers with FAISS/ChromaDB for intelligent, context-aware Q&A." },
  { year: "2025", title: "Google Data Analytics Professional Certificate", text: "Completed Google's Data Analytics track via Coursera with a 94.87% score, building foundational skills in SQL, R, and spreadsheet-based analysis — laying the groundwork for the ML and GCP-focused work that followed." },
  { year: "2023", title: "Started B.Tech AI & Data Science", text: "Began my engineering journey at SRMU, focused on AI, Machine Learning and Data Science (2023–2027)." },
];

export const interests = [
  "Generative AI & RAG systems",
  "Large Language Models (GPT / LLaMA)",
  "Machine Learning & Deep Learning",
  "Computer Vision",
  "Data Visualisation & Storytelling",
  "Clean, elegant engineering",
];

/* ================= SKILLS ================= */
export const skillTrees = [
  {
    category: "Languages",
    icon: "code",
    items: [
      { name: "Python", level: 93, tag: "Advanced" },
      { name: "Java", level: 76, tag: "Intermediate" },
      { name: "SQL / MySQL", level: 82, tag: "Intermediate" },
    ],
  },
  {
    category: "Machine Learning & GenAI",
    icon: "brain",
    items: [
      { name: "Supervised & Unsupervised", level: 88, tag: "ML Core" },
      { name: "Feature Engineering", level: 86, tag: "Pipeline" },
      { name: "Model Building & Eval", level: 84, tag: "Exp." },
      { name: "RAG Systems", level: 80, tag: "GenAI" },
      { name: "LLMs (GPT / LLaMA)", level: 78, tag: "GenAI" },
      { name: "Deep Learning", level: 76, tag: "Neural" },
    ],
  },
  {
    category: "Data, Viz & Frameworks",
    icon: "data",
    items: [
      { name: "Pandas", level: 90, tag: "Data" },
      { name: "NumPy", level: 88, tag: "Numerics" },
      { name: "Matplotlib", level: 82, tag: "Viz" },
      { name: "Scikit-learn", level: 88, tag: "Core" },
      { name: "FAISS / ChromaDB", level: 78, tag: "Vectors" },
      { name: "Power BI / Tableau", level: 76, tag: "BI" },
      { name: "Flask / REST", level: 72, tag: "Backend" },
      { name: "Streamlit", level: 78, tag: "Apps" },
      { name: "SQL", level: 82, tag: "Databases" },
      { name: "Git", level: 80, tag: "Versioning" },
    ],
  },
];

export const skillRings = [
  { name: "Python", value: 93, icon: "python" },
  { name: "Machine Learning", value: 88, icon: "ml" },
  { name: "Generative AI / RAG", value: 80, icon: "dl" },
  { name: "Data Science", value: 86, icon: "data" },
];

/* ================= PROJECTS ================= */
export type Project = {
  id: string;
  index: string;
  title: string;
  category: string;
  blurb: string;
  description: string;
  problem: string;
  solution: string;
  architecture: string;
  metrics: { label: string; value: string }[];
  tech: string[];
  github: string;
  demo?: string;
  gradient: string;
};

export const projects: Project[] = [
  {
    id: "beyondword-emotion-reader",
    index: "01",
    title: "Emotion Reader (BeyondWord) — Multilingual AI",
    category: "Generative AI · NLP",
    blurb:
      "Multilingual emotion and sentiment recognition classifying text into 6 core emotions and scoring psychometric VAD dimensions with calibrated probabilities.",
    description:
      "Hybrid transformer model in PyTorch served through a FastAPI backend. Supports 100+ languages including English, Hindi, Hinglish, Spanish and French with calibrated probability outputs, single-text & batch CSV analysis, session history, and copyable communication response guidance. Deployed on Vercel with React 19 + TanStack.",
    problem:
      "Nuanced emotional cues, cross-language sentiment subtleties, and mixed-dialect expressions (such as Hinglish) are lost in standard sentiment classifiers.",
    solution:
      "Built a hybrid PyTorch transformer classifier providing calibrated probability outputs across 6 core emotions along with psychometric Valence, Arousal, and Dominance (VAD) dimension scoring.",
    architecture:
      "Multilingual Input (Text / CSV) → FastAPI Inference Gateway → PyTorch Transformer Backbone → VAD Psychometric Scorer → Calibrated Probabilities → React 19 Client",
    metrics: [
      { label: "Languages", value: "100+" },
      { label: "Emotions", value: "6 Core + VAD" },
      { label: "Frontend", value: "React 19" },
    ],
    tech: ["Python", "PyTorch", "Transformers", "FastAPI", "React 19", "TanStack", "Vercel"],
    github: "https://github.com/Sumit2003-dev",
    gradient: "from-[#FF6A00]/25 via-burnt-red/10 to-transparent",
  },
  {
    id: "flyrank-ml-internship",
    index: "02",
    title: "FlyRank AI — ML Internship Case Study",
    category: "Machine Learning · Industry Internship",
    blurb:
      "Content-opportunity scoring framework as an ML ranking problem — designing and validating models against Precision@50 as the primary benchmark.",
    description:
      "Designed and trained automated ML ranking models evaluated against Precision@50 as the core success metric across four assignment milestones (ML-01–ML-04). Built reproducible data contracts against FlyRank's HuggingFace warehouse, with hands-on modules on Vertex AI, LoRA, RLHF, and GenAI agent workflows.",
    problem:
      "Identifying high-potential content opportunities requires scalable, automated ranking models rather than manual heuristics.",
    solution:
      "Designed and trained ML ranking models, benchmarked against Precision@50, and created versioned, reproducible data contracts with HuggingFace.",
    architecture:
      "HuggingFace Warehouse → Data Contract Validation → Feature Extraction → ML Ranking Model → Precision@50 Evaluation",
    metrics: [
      { label: "Metric", value: "P@50" },
      { label: "Milestones", value: "ML-01-04" },
      { label: "Data Pipeline", value: "HuggingFace" },
    ],
    tech: ["Python", "Scikit-learn", "Ranking Models", "Data Contracts", "HuggingFace", "Git"],
    github: "https://github.com/Sumit2003-dev/flyrank-ml-internship",
    gradient: "from-[#FF8A2B]/25 via-burnt-orange/10 to-transparent",
  },
  {
    id: "gyanverse-ai",
    index: "03",
    title: "GyanVerse AI — RAG Intelligent QnA",
    category: "Generative AI · RAG",
    blurb:
      "Context-aware multilingual educational chatbot powered by Sentence Transformers, FAISS/ChromaDB indexing, and GPT-4o-mini synthesis.",
    description:
      "Final-year capstone project designed to reduce query-resolution time for students by grounding AI responses in indexed course materials. Built with a 3-member team under faculty guidance, featuring low-latency retrieval (<1.2s) in a Streamlit UI.",
    problem:
      "Students waste hours sifting through static PDFs and lecture notes without direct, context-accurate answers.",
    solution:
      "Engineered an end-to-end RAG pipeline using Sentence Transformers, FAISS/ChromaDB vector search, and LLM synthesis with multilingual support.",
    architecture:
      "PDF Ingestion → Sentence Transformer Embeddings → FAISS Vector Store → Query Retrieval → Context Augmented LLM → Multilingual Response",
    metrics: [
      { label: "Accuracy", value: "~92%" },
      { label: "Latency", value: "<1.2s" },
      { label: "Model", value: "GPT-4o-mini" },
    ],
    tech: ["Python", "RAG", "FAISS", "ChromaDB", "Sentence Transformers", "GPT-4o-mini", "Streamlit"],
    github: "https://github.com/Sumit2003-dev/GyanVerse-AI",
    gradient: "from-amber-400/25 via-burnt-red/10 to-transparent",
  },
  {
    id: "railsaarthi-sih",
    index: "04",
    title: "RailSaarthi — Train ETA & Control-Room Platform",
    category: "Machine Learning · Smart India Hackathon",
    blurb:
      "Multi-factor train ETA prediction engine, delay root-cause classifier, and connecting-train miss-risk analyser for Indian Railways (SIH26028).",
    description:
      "Designed an automated multi-factor ETA prediction engine, delay root-cause classifier, connecting-train miss-risk analyser, and control-room zonal dashboard for Indian Railways. Developed for Smart India Hackathon 2026 (Team Garuda X, SIH26028, Ministry of Railways) owning ML data handling and model evaluation.",
    problem:
      "Cascading rail delays and connecting-train misses create operational bottlenecks and poor passenger experience across railway zones.",
    solution:
      "Engineered machine learning models to forecast ETA deviations, classify delay root causes, and predict connecting-train miss probability in real time.",
    architecture:
      "Transit Feeds → Scikit-learn ETA Engine → Delay Root-Cause Classifier → Miss-Risk Analyzer → Control-Room Dashboard",
    metrics: [
      { label: "Event", value: "SIH 2026" },
      { label: "Team", value: "Garuda X" },
      { label: "Problem ID", value: "SIH26028" },
    ],
    tech: ["Python", "Scikit-learn", "TypeScript", "TanStack Start", "Git"],
    github: "https://github.com/Sumit2003-dev",
    gradient: "from-ember-500/20 via-orange-500/10 to-transparent",
  },
  {
    id: "student-record-intelligence",
    index: "05",
    title: "Student Performance Prediction (NextGrade)",
    category: "Data Science · Analytics",
    blurb:
      "Predicts academic performance and flags at-risk students early from 1,200 records using tuned Gradient Boosting (R² 0.85).",
    description:
      "Analyzed 1,200 student records across study hours, attendance, prior scores, sleep, and lifestyle factors. Compared Linear Regression, Random Forest, and Gradient Boosting; selected tuned Gradient Boosting (R² 0.85, 5-fold CV R² 0.83) served via a Flask REST API with Chart.js radar charts at nextgrade.netlify.app.",
    problem:
      "Academic departments lack automated early-warning systems to identify students vulnerable to dropout or grade degradation.",
    solution:
      "Trained Gradient Boosting models with StandardScaler pipelines to deliver real-time risk scores and multi-factor radar visualizations.",
    architecture:
      "1,200 Student Records → StandardScaler ETL → Gradient Boosting Model (R² 0.85) → Flask REST API → Chart.js Dashboard",
    metrics: [
      { label: "R² Score", value: "0.85" },
      { label: "CV R²", value: "0.83" },
      { label: "Records", value: "1,200" },
    ],
    tech: ["Python", "Scikit-learn", "Flask", "JavaScript", "Chart.js", "Netlify"],
    github: "https://github.com/Sumit2003-dev/Student-Record-Intelligence-System",
    demo: "https://nextgrade.netlify.app",
    gradient: "from-orange-500/20 via-ember-600/10 to-transparent",
  },
  {
    id: "airline-delay-prediction",
    index: "06",
    title: "Airline Delay Prediction — ML Classification",
    category: "Machine Learning · Classification",
    blurb:
      "End-to-end ML classification pipeline on a 124K-row imbalanced flight dataset with Random Forest (ROC-AUC 0.67).",
    description:
      "Engineered end-to-end pipeline on 124K flight records with class imbalance handling (34.4% delayed flights). Benchmarked Logistic Regression, Decision Tree, and Random Forest using F1-score and ROC-AUC, selecting Random Forest (ROC-AUC 0.67) with departure-hour feature engineering.",
    problem:
      "Aviation delays cause schedule disruptions and passenger frustration, requiring predictive departure-time risk assessment.",
    solution:
      "Cleaned, engineered, and evaluated classification models with class imbalance metrics, validating key temporal features like departure windows.",
    architecture:
      "124K Flight Records → Imbalance Handling → Feature Engineering → Random Forest Classifier → ROC-AUC Evaluation",
    metrics: [
      { label: "Dataset", value: "124K Rows" },
      { label: "Model", value: "Random Forest" },
      { label: "ROC-AUC", value: "0.67" },
    ],
    tech: ["Python", "Pandas", "NumPy", "Scikit-learn", "Matplotlib"],
    github: "https://github.com/Sumit2003-dev/Airlines-Delay-Prediction",
    gradient: "from-[#FF6A00]/25 via-burnt-red/10 to-transparent",
  },
  {
    id: "karigarsetu-artisan",
    index: "07",
    title: "KarigarSetu — The Artisan's Ledger",
    category: "Data Science · Web App",
    blurb:
      "Platform connecting Lucknow Chikankari artisans directly with buyers with transparent pricing and digital authenticity. Top 10 finish at VIVEKA 2k26.",
    description:
      "Platform connecting Chikankari artisans of Lucknow directly with buyers, featuring artisan/buyer modules, transparent fair pricing, digital sales ledger, and authenticity verification badges. Finished Top 10 at VIVEKA: The Intelligence 5.0 (Techfest 2k26) with Team CodeVengers.",
    problem:
      "Traditional Chikankari artisans in Lucknow face exploitation by intermediaries with zero pricing transparency or provenance verification.",
    solution:
      "Designed a digital ledger and marketplace connecting artisans directly to consumers, with authenticity badges and fair margin verification.",
    architecture:
      "Artisan Profiles → Catalog & Ledger Database → Authenticity Verification → Buyer Portal → Digital Sales Analytics",
    metrics: [
      { label: "Finish", value: "Top 10" },
      { label: "Event", value: "VIVEKA 2k26" },
      { label: "Team", value: "CodeVengers" },
    ],
    tech: ["Python", "Web App", "Data Visualisation", "Git"],
    github: "https://github.com/Sumit2003-dev",
    gradient: "from-[#FF8A2B]/25 via-burnt-orange/10 to-transparent",
  },
  {
    id: "proctoring-research",
    index: "08",
    title: "AI-Based Exam Proctoring System",
    category: "Research · Computer Vision",
    blurb:
      "Co-authored research paper exploring ML and computer vision techniques for automated academic-integrity monitoring.",
    description:
      "Co-authored research paper supervised by Mrs. Anamika Sharma (SRMU) exploring machine learning and computer vision techniques for automated academic-integrity monitoring and scalable remote assessment.",
    problem:
      "Traditional manual exam proctoring is unscalable, prone to fatigue, and incapable of monitoring large-scale online examinations.",
    solution:
      "Investigated ML and computer vision algorithms for head-pose tracking, eye-gaze deviation, and audio-visual anomaly detection.",
    architecture:
      "Video Stream Ingestion → Facial & Head-Pose Detection → Gaze Deviation Tracking → Anomaly Scoring Engine → Supervised Research Paper",
    metrics: [
      { label: "Authors", value: "Co-author" },
      { label: "Supervisor", value: "Mrs. A. Sharma" },
      { label: "Domain", value: "ML + CV" },
    ],
    tech: ["Python", "Computer Vision", "Machine Learning", "Academic Writing"],
    github: "https://github.com/Sumit2003-dev",
    gradient: "from-amber-400/25 via-burnt-red/10 to-transparent",
  },
];

/* ================= EDUCATION ================= */
export const education = [
  {
    degree: "Bachelor of Technology (B.Tech)",
    major: "Computer Science & Engineering",
    specialization: "Artificial Intelligence & Data Science",
    institution: "Shri Ramswaroop Memorial University",
    location: "Barabanki, Uttar Pradesh",
    duration: "2023 — 2027 · Final Year",
    grade: "CGPA 7.98 / 10 (SGPA 8.26 — Sem VI)",
    status: "Pursuing",
    courses: [
      "Machine Learning",
      "Data Science",
      "Statistical Analysis",
      "Artificial Intelligence",
      "Big Data Analytics",
      "Data Visualisation",
      "Data Structures & Algorithms",
      "DBMS",
      "OOP",
      "Operating Systems",
    ],
  },
  {
    degree: "Senior Secondary (XII)",
    major: "Physics, Chemistry, Mathematics (PCM)",
    institution: "PM Shri Kendriya Vidyalaya",
    location: "Lucknow, Uttar Pradesh",
    duration: "2022 — 2023 · CBSE",
    grade: "75.4%",
    status: "Completed",
    courses: ["Mathematics", "Physics", "Chemistry", "Computer Science"],
  },
  {
    degree: "Secondary (X)",
    major: "Science Stream",
    institution: "Army School, Binaguri, West Bengal",
    location: "West Bengal",
    duration: "2020 — 2021 · CBSE",
    grade: "87.4%",
    status: "Completed",
    courses: ["Mathematics", "Science", "Social Science", "English", "Hindi"],
  },
];

/* ================= CERTIFICATES ================= */
export type CertificateItem = {
  title: string;
  issuer: string;
  date: string;
  level: string;
  credential: string;
  skills: string[];
  img: string;
  pdf?: string;
  hue: string;
};

const rawCertificates: CertificateItem[] = [
  {
    title: "Diamond League — #1 Rank",
    issuer: "Google Cloud Skills Boost",
    date: "2026",
    level: "Top Rank",
    credential: "171 Badges · 38,105 Pts · 44-Day Streak",
    skills: ["GCP", "BigQuery ML", "Vertex AI", "Terraform", "IAM", "Cloud Architecture", "GKE", "Cloud Run", "Pub/Sub", "Dataproc"],
    img: "/uploads/homepage.png",
    pdf: "/uploads/ALL CERTIFICATES_compressed.pdf",
    hue: "210 90% 55%",
  },
  {
    title: "Google Advanced Data Analytics Professional Certificate",
    issuer: "Google · Coursera",
    date: "2025–2026",
    level: "Advanced",
    credential: "Full Professional Certificate — Capstone Completed",
    skills: ["Machine Learning", "Python", "Regression", "Statistics", "Statistical Modeling"],
    img: "/uploads/google/34h2yX22_TdOiKGd+JpYh9qm5Hi4bsyrnfgLzq27hP8=.png",
    pdf: "/uploads/google/Google_Advanced_Data_Analytics_Capstone.pdf",
    hue: "215 85% 55%",
  },
  {
    title: "Google Data Analytics Professional Certificate",
    issuer: "Google · Coursera",
    date: "2025",
    level: "Professional",
    credential: "Score 94.87%",
    skills: ["Data Analytics", "SQL", "R", "Spreadsheets"],
    img: "/uploads/google/34h2yX22_TdOiKGd+JpYh9qm5Hi4bsyrnfgLzq27hP8=.png",
    pdf: "/uploads/google/Coursera ML Certificate.pdf",
    hue: "200 80% 50%",
  },
  {
    title: "AI Fluency · Framework & Foundations",
    issuer: "Anthropic",
    date: "2026",
    level: "AI Professional",
    credential: "Claude & AI Agents",
    skills: ["Anthropic", "Claude API", "LLMs", "Model Context Protocol"],
    img: "/uploads/fd360144-edaf-4922-bdb1-d0ca65819477.png",
    pdf: "/uploads/Anthropic/AI-Fluency-Framework&Foundations.pdf",
    hue: "270 70% 60%",
  },
  {
    title: "Data Analytics with Python",
    issuer: "NPTEL · IIT Roorkee",
    date: "Jan–Apr 2026",
    level: "Elite",
    credential: "Score 65%",
    skills: ["Python", "Data Analytics", "NumPy", "Pandas"],
    img: "/uploads/1107eb3a-4630-4613-8221-bb02370a27f9.png",
    pdf: "/uploads/NPTEL.pdf",
    hue: "25 90% 50%",
  },
  {
    title: "Generative AI Essentials · AI for All",
    issuer: "MPIT-CoE · TCS Foundation",
    date: "Apr 2026",
    level: "GenAI",
    credential: "via TCS iON",
    skills: ["Generative AI", "AI for All", "AI Literacy", "Prompting"],
    img: "/uploads/be3c8beb-c37d-45b6-9ed9-d387390ec931.png",
    pdf: "/uploads/AI FOR ALL.pdf",
    hue: "15 90% 50%",
  },
  {
    title: "IBM Generative AI & Prompt Engineering",
    issuer: "IBM",
    date: "2026",
    level: "IBM Certified",
    credential: "LLMs & Prompting",
    skills: ["Prompt Engineering", "LLMs", "Ethical AI", "Generative AI"],
    img: "/uploads/IBM/Prompt Engineering- Shaping Better AI Responses.png",
    pdf: "/uploads/ALL CERTIFICATES_compressed.pdf",
    hue: "210 90% 50%",
  },
  {
    title: "GenAI Powered Data Analytics",
    issuer: "Tata · Forage",
    date: "2026",
    level: "Job Simulation",
    credential: "Data Analytics",
    skills: ["GenAI", "Predictive Analytics", "Risk Profiling"],
    img: "/uploads/efdf1ec8-16dd-48d3-8a8e-eab3b7567963.png",
    pdf: "/uploads/GenAI Powered Data Analytics Job Simulation.pdf",
    hue: "330 75% 55%",
  },
  {
    title: "Deloitte Data Analytics Job Simulation",
    issuer: "Deloitte Australia · Forage",
    date: "2026",
    level: "Job Simulation",
    credential: "Data Analytics",
    skills: ["Data Analysis", "Forensic Tech", "Insights"],
    img: "/uploads/1abc962f-4012-4ce4-ac8d-af62c0a97a05.png",
    pdf: "/uploads/Data Analytics Job Simulation.PDF",
    hue: "140 70% 45%",
  },
  {
    title: "Jumpstart Machine Learning: Python Made Easy",
    issuer: "E-Certificate",
    date: "2025",
    level: "ML Certified",
    credential: "ML & Python",
    skills: ["Machine Learning", "Scikit-Learn", "Python", "Data Science"],
    img: "/uploads/eed1f08e-1703-4fa3-ac40-58a2fd60c914.png",
    pdf: "/uploads/E-Certificate for Jumpstart ML_ Python Made Easy - Sumit kumar .pdf",
    hue: "40 85% 50%",
  },
  {
    title: "National Workshop on AI & Data Science",
    issuer: "National Workshop",
    date: "2025",
    level: "Workshop",
    credential: "Hands-on AI",
    skills: ["AI Systems", "NLP", "Text Mining", "Python"],
    img: "/uploads/homepage.png",
    pdf: "/uploads/National Workshop.pdf",
    hue: "180 60% 45%",
  },
];

export const certificates: CertificateItem[] = rawCertificates.map((c) => ({
  ...c,
  img: asset(c.img),
  pdf: c.pdf ? asset(c.pdf) : undefined,
}));

/* ================= ACHIEVEMENTS ================= */
export const achievements = [
  { label: "#1 Diamond League Rank", value: 1, suffix: "st", icon: "trophy" },
  { label: "Cloud Skill Badges", value: 171, suffix: "+", icon: "repo" },
  { label: "Hackathons Completed", value: 3, suffix: "+", icon: "trophy" },
  { label: "Events Lead", value: 10, suffix: "+", icon: "git" },
];

export const leetcode = [
  { label: "Problems Solved", value: 341, suffix: "+" },
  { label: "Contest Rating", value: 1460, suffix: "" },
  { label: "Medium / Hard", value: 247, suffix: "" },
  { label: "Badges Earned", value: 2, suffix: "x" },
];

export const githubStats = [
  { label: "Repositories", value: 18, suffix: "+" },
  { label: "Live Apps", value: 6, suffix: "" },
  { label: "Papers", value: 1, suffix: "" },
];