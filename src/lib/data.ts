const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

export const profile = {
  name: "Sumit Kumar",
  fullName: "Sumit Kumar Bharti",
  title: "Data Scientist",
  roles: ["Data Scientist", "AI Engineer", "Machine Learning Developer"],
  currentRole: "Machine Learning Intern · FlyRank AI",
  tagline:
    "Turning raw data into cinematic intelligence — building models that predict, systems that learn, and products that feel alive.",
  short: "Final-year Computer Science & Engineering student (AI & Data Science) and Machine Learning Intern — building RAG systems, predictive models and end-to-end ML applications.",
  description: [
    "Final-year Computer Science & Engineering student specialising in Artificial Intelligence and Data Science, currently gaining hands-on industry experience as a Machine Learning Intern at FlyRank AI.",
    "I have a proven record of building and deploying end-to-end ML applications, with strong skills in Python, Scikit-learn and data visualisation — translating academic training into production-oriented outcomes. I currently hold the #1 Diamond League ranking on Google Cloud Skills Boost with 124 skill badges and a 44-day learning streak. I'm also an active member of GDG (Google Developer Group) Lucknow and hold a Google Developer Program premium tier membership, staying engaged with the broader developer community beyond coursework.",
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
  { label: "Projects", value: 4, suffix: "+" },
  { label: "Certificates", value: 11, suffix: "+" },
  { label: "Cloud Badges", value: 124, suffix: "+" },
  { label: "Internships", value: 1, suffix: "" },
];

export const aboutTimeline = [
  { year: "2026", title: "Google Cloud Arcade · #1 Diamond League Rank", text: "Ranked #1 in the Diamond League with 124 skill badges earned, 38,105 points, and a 44-day streak across Vertex AI, BigQuery ML, GKE, and Terraform." },
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
    id: "flyrank-ml-internship",
    index: "01",
    title: "FlyRank AI — ML Internship Case Study",
    category: "Machine Learning · Industry Internship",
    blurb:
      "Building a content-opportunity scoring framework as an ML ranking problem — designing and validating models against Precision@50 as the core success metric.",
    description:
      "Building a content-opportunity scoring framework as an ML ranking problem — designing and validating models against Precision@50 as the core success metric. Progressed through four assignment milestones (ML-01–ML-04), including building a data contract against FlyRank's HuggingFace warehouse for reproducible, versioned data pipelines.",
    problem:
      "Identifying high-potential content opportunities requires scalable, automated ranking models rather than manual heuristics.",
    solution:
      "Designed and trained ML ranking models, benchmarked against Precision@50, and created versioned data contracts with HuggingFace.",
    architecture:
      "HuggingFace Warehouse → Data Contract Validation → Feature Extraction → ML Ranking Model → Precision@50 Evaluation",
    metrics: [
      { label: "Metric", value: "P@50" },
      { label: "Milestones", value: "ML-01-04" },
      { label: "Data Pipeline", value: "HuggingFace" },
    ],
    tech: ["Python", "Scikit-learn", "Ranking Models", "Data Contracts", "HuggingFace", "Git"],
    github: "https://github.com/Sumit2003-dev/flyrank-ml-internship",
    gradient: "from-[#FF6A00]/25 via-burnt-red/10 to-transparent",
  },
  {
    id: "gyanverse-ai",
    index: "02",
    title: "GyanVerse AI",
    category: "Generative AI · RAG",
    blurb:
      "Context-aware multilingual educational chatbot powered by Sentence Transformers and vector database indexing.",
    description:
      "Final-year capstone project designed to reduce query-resolution time for students by grounding AI responses in indexed course materials.",
    problem:
      "Students waste hours sifting through static PDFs and lecture notes without direct, context-accurate answers.",
    solution:
      "Engineered an end-to-end RAG pipeline using Sentence Transformers, FAISS/ChromaDB vector search and LLM synthesis with multilingual support.",
    architecture:
      "PDF Ingestion → Sentence Transformer Embeddings → FAISS Vector Store → Query Retrieval → Context Augmented LLM → Multilingual Response",
    metrics: [
      { label: "Accuracy", value: "~92%" },
      { label: "Latency", value: "<1.2s" },
      { label: "Support", value: "Multi" },
    ],
    tech: ["Python", "RAG", "FAISS", "ChromaDB", "Sentence Transformers", "Flask", "Streamlit"],
    github: "https://github.com/Sumit2003-dev/GyanVerse-AI",
    gradient: "from-[#FF8A2B]/25 via-burnt-orange/10 to-transparent",
  },
  {
    id: "student-record-intelligence",
    index: "03",
    title: "Student Record Intelligence",
    category: "Data Science · Analytics",
    blurb:
      "End-to-end analytics platform transforming 1,000+ student records into actionable academic performance insights.",
    description:
      "A complete data processing and dashboard system built with Python, Pandas and Streamlit to analyse academic performance trends and risk profiles.",
    problem:
      "Academic departments lack real-time visibility into student performance trends and dropout risk factors.",
    solution:
      "Cleaned, structured and visualised complex multi-year student data with interactive filterable dashboards and automated statistical summaries.",
    architecture:
      "Raw CSV Data → Pandas Cleaning & ETL → Feature Profiling → Streamlit Dashboard → Interactive Analytics Visuals",
    metrics: [
      { label: "Records", value: "1,000+" },
      { label: "Fields", value: "15+" },
      { label: "Speed", value: "Real-time" },
    ],
    tech: ["Python", "Pandas", "NumPy", "Matplotlib", "Streamlit"],
    github: "https://github.com/Sumit2003-dev/Student-Record-Intelligence-System",
    gradient: "from-amber-400/25 via-burnt-red/10 to-transparent",
  },
  {
    id: "airline-delay-prediction",
    index: "04",
    title: "Airline Delay Prediction",
    category: "ML Regression",
    blurb: "Regression model forecasting flight delays, achieving an R² of ~0.85 on held-out data.",
    description: "Regression model forecasting flight delays, achieving an R² of ~0.85 on held-out data.",
    problem: "Unpredictable flight delays disrupt scheduling and passenger journeys.",
    solution: "Trained regression models on historical aviation data to forecast delay durations.",
    architecture: "Data Cleaning → Feature Engineering → Regression Modeling → Cross-Validation → Evaluation",
    metrics: [
      { label: "R² Score", value: "~0.85" },
      { label: "Model", value: "Regression" },
      { label: "Pipeline", value: "End-to-End" },
    ],
    tech: ["Python", "Pandas", "NumPy", "Scikit-learn", "Matplotlib"],
    github: "https://github.com/Sumit2003-dev/Airlines-Delay-Prediction",
    gradient: "from-ember-500/20 via-orange-500/10 to-transparent",
  },
  {
    id: "proctoring-research",
    index: "05",
    title: "AI-Based Exam Proctoring System",
    category: "Research · Computer Vision",
    blurb:
      "Co-authored research paper exploring ML/CV techniques for automated academic-integrity monitoring.",
    description:
      "Co-authored research paper supervised by Mrs. Anamika Sharma (SRMU) exploring machine learning and computer-vision techniques for automated academic-integrity monitoring.",
    problem:
      "Traditional exam proctoring is manual, error-prone and hard to scale.",
    solution:
      "Investigated ML/CV approaches for automated detection and monitoring, framing the problem for reproducible academic study.",
    architecture:
      "Literature review → ML/CV technique selection → integrity-monitoring problem framing → supervised research write-up.",
    metrics: [
      { label: "Authors", value: "Co-auth" },
      { label: "Focus", value: "ML + CV" },
      { label: "Status", value: "Paper" },
    ],
    tech: ["Python", "Computer Vision", "Machine Learning", "Academic Writing"],
    github: "https://github.com/Sumit2003-dev",
    gradient: "from-orange-500/20 via-ember-600/10 to-transparent",
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
    courses: ["Machine Learning", "Data Science", "Statistical Analysis", "Artificial Intelligence", "DSA", "Big Data Analytics", "Data Visualisation"],
  },
  {
    degree: "Senior Secondary (XII)",
    major: "Physics, Chemistry, Mathematics",
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
    institution: "Army Public School Binnaguri",
    location: "West Bengal",
    duration: "2020 — 2021 · CBSE",
    grade: "87.6%",
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
    credential: "124 Badges · 38,105 Pts · 44-Day Streak",
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
  { label: "Cloud Skill Badges", value: 124, suffix: "+", icon: "repo" },
  { label: "Hackathons Completed", value: 3, suffix: "+", icon: "trophy" },
  { label: "Events Lead", value: 10, suffix: "+", icon: "git" },
];

export const leetcode = [
  { label: "Model Accuracy", value: 92, suffix: "%" },
  { label: "Delay Accuracy", value: 88, suffix: "%" },
  { label: "GPA / 10", value: 7, suffix: ".98" },
  { label: "Student Records", value: 1000, suffix: "+" },
];

export const githubStats = [
  { label: "Repositories", value: 18, suffix: "+" },
  { label: "Live Apps", value: 4, suffix: "" },
  { label: "Papers", value: 1, suffix: "" },
];