export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

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
    "I have a proven record of building and deploying end-to-end ML applications, with strong skills in Python, Scikit-learn and data visualisation — translating academic training into production-oriented outcomes. I actively learn and build on Google Cloud, standing in the Diamond League on Google Cloud Skills Boost with 188 skill badges, 48,371 points, and a continuous learning streak. I'm also an active member of GDG (Google Developer Group) Lucknow and hold a Google Developer Program premium tier membership, staying engaged with the broader developer community beyond coursework.",
    "I'm actively expanding my expertise in Generative AI, RAG systems and LLMs through applied academic and industry projects.",
  ],
  email: "sumit.ku5981@gmail.com",
  phone: "+91 8810845474",
  location: "Lucknow, Uttar Pradesh, India",
  resume: asset("uploads/Sumit_Kumar_Bharti_Resume_Updated.pdf"),
  social: [
    { name: "GitHub", href: "https://github.com/Sumit2003-dev" },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/sumit2003-dev/" },
    { name: "LeetCode", href: "https://leetcode.com/u/sumit2003dev/" },
    { name: "Google Skills", href: "https://www.skills.google/public_profiles/d8429119-44bb-443a-8563-87b7953f74e9" },
    { name: "Google Dev", href: "https://g.dev/sumit2003dev" },
    { name: "Credly", href: "https://www.credly.com/users/sumitdev2003/badges" },
    { name: "Email", href: "mailto:sumit.ku5981@gmail.com" },
  ],
  leetcode: "https://leetcode.com/u/sumit2003dev/",
  googleSkills: "https://www.skills.google/public_profiles/d8429119-44bb-443a-8563-87b7953f74e9",
  credly: "https://www.credly.com/users/sumitdev2003/badges",
  googleDev: "https://g.dev/sumit2003dev",
  githubHandle: "Sumit2003-dev",
};

/* ============================ ABOUT ============================ */
export const stats = [
  { label: "Projects", value: 6, suffix: "+" },
  { label: "Certificates", value: 51, suffix: "+" },
  { label: "Cloud Badges", value: 188, suffix: "+" },
  { label: "Internships", value: 1, suffix: "" },
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
    title: "BeyondWord — AI Emotion Recognition from Text",
    category: "Generative AI · NLP",
    blurb:
      "Emotion and sentiment recognition classifying text into 8 emotion classes with calibrated probability distributions and confidence scoring.",
    description:
      "PyTorch transformer classification model served through a FastAPI backend. Evaluates text across 8 emotion categories with calibrated probability outputs, single-text & batch analysis, and session response guidance. Deployed on Vercel with React frontend.",
    problem:
      "Nuanced emotional cues and context-dependent expressions are lost in basic positive/negative sentiment classifiers.",
    solution:
      "Trained a PyTorch transformer classifier providing calibrated probability outputs across 8 emotion classes with confidence distribution scoring.",
    architecture:
      "Input Text → FastAPI Gateway → PyTorch Transformer Backbone → Softmax Probability Calibration → React Client",
    metrics: [
      { label: "Classification", value: "8 Emotion Classes" },
      { label: "Architecture", value: "PyTorch & Transformers" },
      { label: "Serving", value: "FastAPI" },
    ],
    tech: ["Python", "PyTorch", "Transformers", "FastAPI", "React", "Vercel"],
    github: "https://github.com/Sumit2003-dev/AI-Based-Emotion-Recognition-from-Text",
    gradient: "from-[#FF6A00]/25 via-burnt-red/10 to-transparent",
  },
  {
    id: "flyrank-ml-internship",
    index: "02",
    title: "FlyRank AI — ML Internship Case Study",
    category: "Machine Learning · Industry Internship",
    blurb:
      "Content-opportunity scoring framework as an ML ranking problem — evaluating models against Precision@50 across assignment milestones.",
    description:
      "Machine Learning Internship practical deliverables and experimental work at FlyRank AI. Developed and evaluated content-opportunity ranking models against Precision@50 across structured assignment milestones (ML-01–ML-04), building data ingestion pipelines and training experiments while exploring Vertex AI, fine-tuning fundamentals, and LLM evaluation workflows.",
    problem:
      "Identifying high-potential content opportunities requires scalable, automated ranking models rather than manual heuristics.",
    solution:
      "Designed and trained ML ranking models, benchmarked against Precision@50, and created versioned, reproducible data contracts with HuggingFace.",
    architecture:
      "HuggingFace Warehouse → Data Contract Validation → Feature Extraction → ML Ranking Model → Precision@50 Evaluation",
    metrics: [
      { label: "Evaluation", value: "Precision@50" },
      { label: "Milestones", value: "ML-01–04" },
      { label: "Data Pipeline", value: "HuggingFace" },
    ],
    tech: ["Python", "Scikit-learn", "Ranking Models", "Data Contracts", "HuggingFace", "Git"],
    github: "https://github.com/Sumit2003-dev/flyrank-ml-internship",
    gradient: "from-[#FF8A2B]/25 via-burnt-orange/10 to-transparent",
  },
  {
    id: "gyanverse-ai",
    index: "03",
    title: "GyanVerse AI — RAG Educational Assistant",
    category: "Generative AI · RAG",
    blurb:
      "Context-grounded educational QnA assistant powered by Sentence Transformers, FAISS/ChromaDB indexing, and prompt-augmented LLM synthesis.",
    description:
      "Final-year capstone project designed to reduce query-resolution time for university students by grounding AI responses in indexed course syllabi, lecture notes, and reference materials. Built in a 3-member team under faculty guidance using Sentence Transformers, FAISS/ChromaDB vector indexing, and prompt-engineered context augmentation with a Streamlit interface.",
    problem:
      "Students spend excessive time searching through unindexed lecture notes and static PDFs without direct, context-grounded answers.",
    solution:
      "Engineered an end-to-end RAG pipeline using Sentence Transformers, FAISS/ChromaDB vector search, and context-augmented LLM synthesis.",
    architecture:
      "Course PDFs → Sentence Transformer Embeddings → FAISS Vector Store → Query Retrieval → Context Augmented LLM → Streamlit UI",
    metrics: [
      { label: "Architecture", value: "RAG Pipeline" },
      { label: "Vector Search", value: "FAISS & ChromaDB" },
      { label: "Embeddings", value: "Sentence Transformers" },
    ],
    tech: ["Python", "RAG", "FAISS", "ChromaDB", "Sentence Transformers", "LLMs", "Streamlit"],
    github: "https://github.com/Sumit2003-dev/GyanVerse-AI",
    gradient: "from-amber-400/25 via-burnt-red/10 to-transparent",
  },
  {
    id: "railsaarthi-sih",
    index: "04",
    title: "RailSaarthi — Train ETA & Control-Room Prototype",
    category: "Machine Learning · Hackathon Prototype",
    blurb:
      "Multi-factor train ETA prediction concept, delay root-cause classifier, and connecting-train miss-risk analyzer designed for SIH26028.",
    description:
      "Hackathon prototype developed for Smart India Hackathon (Problem Statement SIH26028 by Ministry of Railways, Team Garuda X). Designed a concept and machine learning prototype for multi-factor train ETA deviation forecasting, delay root-cause classification, and connecting-train miss probability analysis, alongside an interactive control-room dashboard concept.",
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
    github: "https://github.com/Sumit2003-dev/RailDristhi",
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
    github: "",
    demo: "https://nextgrade.netlify.app",
    gradient: "from-orange-500/20 via-ember-600/10 to-transparent",
  },
  {
    id: "airline-delay-prediction",
    index: "06",
    title: "Airline Delay Prediction — ML Classification",
    category: "Machine Learning · Classification",
    blurb:
      "End-to-end ML classification pipeline on a 124K-row imbalanced flight dataset with Random Forest (ROC-AUC 0.70 validation, 0.67 holdout).",
    description:
      "Engineered an end-to-end classification pipeline on 124K flight records with class imbalance handling (34.4% delayed flights). Evaluated Logistic Regression, Decision Tree, and Random Forest baselines, with Random Forest achieving 0.70 ROC-AUC in validation and 0.67 on holdout evaluation with departure-hour feature engineering.",
    problem:
      "Aviation delays cause schedule disruptions and passenger frustration, requiring predictive departure-time risk assessment.",
    solution:
      "Cleaned, engineered, and evaluated classification models with class imbalance metrics, validating key temporal features like departure windows.",
    architecture:
      "124K Flight Records → Imbalance Handling → Feature Engineering → Random Forest Classifier → ROC-AUC Evaluation",
    metrics: [
      { label: "Dataset", value: "124K Rows" },
      { label: "Model", value: "Random Forest" },
      { label: "ROC-AUC", value: "0.70 (Val) / 0.67 (Holdout)" },
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
    github: "https://github.com/Sumit2003-dev/KarigarSetu",
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
    github: "https://github.com/Sumit2003-dev/Proctor-AI",
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
    institution: "PM SHRI Kendriya Vidyalaya, Aliganj, Lucknow",
    location: "Lucknow, Uttar Pradesh",
    duration: "2022 — 2023 · CBSE",
    grade: "87.4%",
    status: "Completed",
    courses: ["Mathematics", "Physics", "Chemistry", "Computer Science"],
  },
  {
    degree: "Secondary (X)",
    major: "Science Stream",
    institution: "Army Public School, Binnaguri, West Bengal",
    location: "Binnaguri, West Bengal",
    duration: "2020 — 2021 · CBSE",
    grade: "75.4%",
    status: "Completed",
    courses: ["Mathematics", "Science", "Social Science", "English", "Hindi"],
  },
];

/* ================= ACHIEVEMENTS ================= */
export const achievements = [
  { label: "Diamond League Rank", value: 18, suffix: "th", prefix: "#", icon: "trophy" },
  { label: "Cloud Skill Badges", value: 188, suffix: "+", icon: "repo" },
  { label: "Arcade Points", value: 48371, suffix: "", icon: "trophy" },
  { label: "Events & Study Jams", value: 10, suffix: "+", icon: "git" },
];

export const leetcode = [
  { label: "Problems Solved", value: 372, suffix: "+" },
  { label: "Contest Rating", value: null as number | null, suffix: "" },
  { label: "Medium / Hard", value: 269, suffix: "" },
  { label: "Hard Solved", value: 68, suffix: "" },
];

export const githubStats = [
  { label: "Public Repos", value: 13, suffix: "" },
  { label: "Contributions", value: 123, suffix: "+" },
  { label: "Live Apps", value: 6, suffix: "" },
];