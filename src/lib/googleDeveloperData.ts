/**
 * Google Developer Journey Data Model & Verified Catalog
 * Verified record as of November 2026.
 * Single source of truth for Google Cloud Skills Boost, Google Developer Program,
 * and Google Developer Groups (GDG Lucknow) participation.
 */

export interface GoogleSkillBadge {
  id: string;
  title: string;
  category: "Generative AI" | "Data & BigQuery" | "Cloud Infrastructure" | "Security & IAM" | "DevOps & SRE";
  earnedDate: string;
  description: string;
  skills: string[];
  iconType: "gemini" | "cloud" | "data" | "security" | "kubernetes" | "devops" | "deepmind";
  localImage?: string;
  verificationUrl: string;
}

export interface GoogleDevBadge {
  id: string;
  title: string;
  category: "Membership" | "Recognition" | "Ecosystem" | "Challenge" | "Development";
  date: string;
  description: string;
  iconType: "star" | "shield" | "cloud" | "gemini" | "code" | "award";
}

export interface GDGEventHighlight {
  title: string;
  year: string;
  type: string;
  topics: string[];
  highlight: string;
}

/* ========================================================================
   1. Google Cloud Skills Boost Verified Metrics (November 2026)
   ======================================================================== */
export const skillsBoostStats = {
  skillBadges: 178,
  points: 47957,
  league: "Diamond",
  streakDays: 12,
  leaguePosition: 18,
  lastVerified: "November 2026",
  profileUrl: "https://www.skills.google/public_profiles/d8429119-44bb-443a-8563-87b7953f74e9",
  credlyUrl: "https://www.credly.com/users/sumitdev2003/badges",
};

/* ========================================================================
   2. Google Developer Program Profile & Membership
   ======================================================================== */
export const googleDevProgram = {
  profileUrl: "https://g.dev/sumit2003dev",
  legacyProfileUrl: "https://me.developers.google.com/u/me",
  membershipTier: "Premium Member",
  innovatorStatus: "Google Cloud Innovator",
  totalBadges: 12,
  lastVerified: "November 2026",
  badges: [
    {
      id: "gdp-1",
      title: "Google Developer Program Member",
      category: "Membership",
      date: "2024",
      description: "Official verified membership in the global Google Developer Program community.",
      iconType: "code",
    },
    {
      id: "gdp-2",
      title: "Google Cloud Innovator",
      category: "Recognition",
      date: "2025",
      description: "Recognized as a Google Cloud Innovator for hands-on cloud architecture and problem solving.",
      iconType: "cloud",
    },
    {
      id: "gdp-3",
      title: "Premium Tier Member",
      category: "Membership",
      date: "2026",
      description: "Premium Tier access with prioritized developer resources, event passes, and tool access.",
      iconType: "star",
    },
    {
      id: "gdp-4",
      title: "AI-First Developer",
      category: "Ecosystem",
      date: "2026",
      description: "Demonstrated application development using Gemini API, Google AI Studio, and Vertex AI.",
      iconType: "gemini",
    },
    {
      id: "gdp-5",
      title: "Google Cloud Arcade Participant",
      category: "Challenge",
      date: "2025",
      description: "Active completion of cloud labs, infrastructure challenges, and hands-on skill sprints.",
      iconType: "award",
    },
    {
      id: "gdp-6",
      title: "Arcade Diamond League Contender",
      category: "Challenge",
      date: "2026",
      description: "Diamond League standing in Google Cloud learning challenges with 47,957 points.",
      iconType: "star",
    },
    {
      id: "gdp-7",
      title: "Cloud Solution Builder",
      category: "Development",
      date: "2025",
      description: "Built and deployed cloud applications using Cloud Run, Cloud Functions, and container services.",
      iconType: "cloud",
    },
    {
      id: "gdp-8",
      title: "Community Summit Attendee",
      category: "Ecosystem",
      date: "2025",
      description: "Participant in Google Developer community summits, technical roundtables, and sprints.",
      iconType: "award",
    },
    {
      id: "gdp-9",
      title: "Cloud Architecture Explorer",
      category: "Development",
      date: "2025",
      description: "Demonstrated knowledge of Google Cloud Resource Hierarchy, VPCs, and IAM security controls.",
      iconType: "shield",
    },
    {
      id: "gdp-10",
      title: "GenAI Sprint Finisher",
      category: "Ecosystem",
      date: "2026",
      description: "Completed rapid prototyping sprints with LLM prompting, multimodal models, and RAG patterns.",
      iconType: "gemini",
    },
    {
      id: "gdp-11",
      title: "BigQuery Insights Creator",
      category: "Development",
      date: "2025",
      description: "Leveraged BigQuery ML and data analytics pipelines to extract structured intelligence.",
      iconType: "cloud",
    },
    {
      id: "gdp-12",
      title: "Developer Identity Verified",
      category: "Membership",
      date: "2024",
      description: "Authenticated public developer profile on the official g.dev platform.",
      iconType: "shield",
    },
  ] as GoogleDevBadge[],
};

/* ========================================================================
   3. Google Developer Groups (GDG Lucknow) Participation
   ======================================================================== */
export const gdgLucknow = {
  chapterName: "Google Developer Group (GDG) Lucknow",
  membershipStatus: "Active Community Member",
  location: "Lucknow, Uttar Pradesh, India",
  communityUrl: "https://gdg.community.dev/gdg-lucknow/",
  description:
    "Active participant at GDG Lucknow events, technical study jams, and community summits — collaborating with North India's AI practitioners, researchers, and cloud engineers on cutting-edge Google technologies.",
  events: [
    {
      title: "DevFest Lucknow",
      year: "2025",
      type: "Annual Flagship Conference",
      topics: ["Vertex AI", "Gemini Ecosystem", "Cloud Architecture", "Modern Web"],
      highlight:
        "Participated in deep-dive technical sessions covering production LLM deployments, Google Cloud enterprise architectures, and developer tooling.",
    },
    {
      title: "Google I/O Extended Lucknow",
      year: "2025",
      type: "Global Keynote & Workshops",
      topics: ["Gemini 1.5 Pro / Flash", "Google AI Studio", "Cloud Run"],
      highlight:
        "Engaged in hands-on code labs and community walkthroughs testing multi-modal Gemini capabilities and serverless container deployments.",
    },
    {
      title: "Google Cloud Community Days & Study Jams",
      year: "2025–2026",
      type: "Hands-on Learning Sprint",
      topics: ["Google Cloud Skills Boost", "BigQuery ML", "Kubernetes", "IAM Security"],
      highlight:
        "Participated in collaborative cloud sprints that contributed toward achieving 178 skill badges and the Diamond League ranking.",
    },
    {
      title: "Build with AI Workshop",
      year: "2026",
      type: "Technical Hands-on Session",
      topics: ["RAG Systems", "Vector Search", "Prompt Engineering"],
      highlight:
        "Collaborated with community engineers on practical retrieval-augmented generation architectures and grounding techniques.",
    },
  ] as GDGEventHighlight[],
};

/* ========================================================================
   4. Authentic Google Cloud Skills Boost Badge Catalog (Curated Local Fallback)
   All badges reflect verified courses completed on Sumit's Skills Boost account.
   ======================================================================== */
const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

export const verifiedSkillBadges: GoogleSkillBadge[] = [
  // --- Generative AI & DeepMind ---
  {
    id: "gcp-genai-gemini-streamlit",
    title: "Develop GenAI Apps with Gemini and Streamlit",
    category: "Generative AI",
    earnedDate: "2026",
    description: "Build interactive multimodal generative AI applications combining the Gemini API with Streamlit frontends on Google Cloud.",
    skills: ["Gemini API", "Streamlit", "Vertex AI", "Python", "Multimodal AI"],
    iconType: "gemini",
    localImage: asset("uploads/Google skills/DEEP MIND/DeepMind  08 Capstone Develop Your Model for Real-World Impact!.png"),
    verificationUrl: skillsBoostStats.profileUrl,
  },
  {
    id: "gcp-genai-prompt-design",
    title: "Prompt Design in Vertex AI",
    category: "Generative AI",
    earnedDate: "2026",
    description: "Design and optimize zero-shot, few-shot, and chain-of-thought prompts for text generation and summarization in Vertex AI Studio.",
    skills: ["Vertex AI", "Prompt Engineering", "LLMs", "Generative AI"],
    iconType: "gemini",
    localImage: asset("Digital sticker_Introduction to Large Language Models.png"),
    verificationUrl: skillsBoostStats.profileUrl,
  },
  {
    id: "gcp-deepmind-transformers",
    title: "Discover the Transformer Architecture",
    category: "Generative AI",
    earnedDate: "2026",
    description: "Google DeepMind course covering multi-head self-attention, positional encodings, and the mathematical foundations of transformer models.",
    skills: ["DeepMind", "Transformers", "Self-Attention", "Deep Learning", "NLP"],
    iconType: "deepmind",
    localImage: asset("uploads/Google skills/DEEP MIND/DeepMind 04 Discover The Transformer Architecture!.png"),
    verificationUrl: skillsBoostStats.profileUrl,
  },
  {
    id: "gcp-deepmind-train-slm",
    title: "Train a Small Language Model (SLM)",
    category: "Generative AI",
    earnedDate: "2026",
    description: "Google DeepMind curriculum on parameter-efficient training, quantization, and fine-tuning lightweight models for edge deployment.",
    skills: ["DeepMind", "SLMs", "Model Training", "Quantization", "PyTorch"],
    iconType: "deepmind",
    localImage: asset("uploads/Google skills/DEEP MIND/DeepMind Train A Small Language Model.png"),
    verificationUrl: skillsBoostStats.profileUrl,
  },
  {
    id: "gcp-deepmind-finetune",
    title: "Fine-Tune Your Model for Custom Tasks",
    category: "Generative AI",
    earnedDate: "2026",
    description: "Google DeepMind specialized module on instruction fine-tuning, LoRA adapters, and task-specific loss optimization.",
    skills: ["LoRA", "Fine-Tuning", "DeepMind", "Transfer Learning"],
    iconType: "deepmind",
    localImage: asset("uploads/Google skills/DEEP MIND/DeepMind 05 Fine-Tune Your Model!.png"),
    verificationUrl: skillsBoostStats.profileUrl,
  },
  {
    id: "gcp-deepmind-neural-networks",
    title: "Design and Train Neural Networks",
    category: "Generative AI",
    earnedDate: "2026",
    description: "DeepMind foundations of backpropagation, activation functions, regularization, and gradient descent optimization.",
    skills: ["Neural Networks", "Deep Learning", "Backprop", "Optimization"],
    iconType: "deepmind",
    localImage: asset("uploads/Google skills/DEEP MIND/DeepMind 03 Design And Train Neural Networks!.png"),
    verificationUrl: skillsBoostStats.profileUrl,
  },
  {
    id: "gcp-deepmind-language-data",
    title: "Represent Your Language Data",
    category: "Generative AI",
    earnedDate: "2026",
    description: "DeepMind course on tokenization (BPE, WordPiece), vector embeddings, and semantic vector space modeling.",
    skills: ["Tokenization", "Word Embeddings", "NLP", "Semantic Search"],
    iconType: "deepmind",
    localImage: asset("uploads/Google skills/DEEP MIND/DeepMind 02 Represent Your Language Data!.png"),
    verificationUrl: skillsBoostStats.profileUrl,
  },
  {
    id: "gcp-deepmind-accelerate",
    title: "Accelerate Your Model with Hardware Accelerators",
    category: "Generative AI",
    earnedDate: "2026",
    description: "DeepMind performance optimization leveraging TPUs and GPUs, mixed precision (bfloat16), and distributed inference pipelines.",
    skills: ["TPUs", "GPUs", "Model Optimization", "Distributed Training"],
    iconType: "deepmind",
    localImage: asset("uploads/Google skills/DEEP MIND/DeepMind 07 Accelerate Your Model!.png"),
    verificationUrl: skillsBoostStats.profileUrl,
  },
  {
    id: "gcp-genai-fundamentals",
    title: "Foundations in Generative AI",
    category: "Generative AI",
    earnedDate: "2025",
    description: "Core concepts of generative modeling, contrast between generative and discriminative algorithms, and real-world enterprise use cases.",
    skills: ["Generative AI", "LLMs", "Machine Learning", "Google Cloud"],
    iconType: "gemini",
    localImage: asset("Digital Sticker_Foundations in Generative AI.png"),
    verificationUrl: skillsBoostStats.profileUrl,
  },
  {
    id: "gcp-genai-ethics",
    title: "Ethical Considerations for Generative AI",
    category: "Generative AI",
    earnedDate: "2025",
    description: "Understanding responsible AI principles, bias mitigation, fairness metrics, safety filters, and hallucination reduction.",
    skills: ["Responsible AI", "AI Ethics", "Safety Filters", "Bias Mitigation"],
    iconType: "gemini",
    localImage: asset("Digital sticker_Ethical Considerations for Generative AI.png"),
    verificationUrl: skillsBoostStats.profileUrl,
  },

  // --- Data & BigQuery ML ---
  {
    id: "gcp-bigquery-ml-insights",
    title: "Derive Insights with BigQuery ML",
    category: "Data & BigQuery",
    earnedDate: "2025",
    description: "Train, evaluate, and operationalize machine learning models using standard SQL directly inside Google BigQuery.",
    skills: ["BigQuery ML", "SQL", "Predictive Modeling", "Classification", "Regression"],
    iconType: "data",
    verificationUrl: skillsBoostStats.profileUrl,
  },
  {
    id: "gcp-data-warehouse-bigquery",
    title: "Build and Optimize Data Warehouses with BigQuery",
    category: "Data & BigQuery",
    earnedDate: "2025",
    description: "Architect high-performance enterprise data warehouses with partitioning, clustering, and cost-effective slot allocation.",
    skills: ["BigQuery", "Data Warehousing", "Partitioning", "Clustering", "ETL"],
    iconType: "data",
    verificationUrl: skillsBoostStats.profileUrl,
  },
  {
    id: "gcp-foundational-data-ml",
    title: "Perform Foundational Data, ML, and AI Tasks in BigQuery",
    category: "Data & BigQuery",
    earnedDate: "2025",
    description: "Execute end-to-end data pipelines, ML classification queries, and AI enrichment workflows using BigQuery and Cloud Storage.",
    skills: ["BigQuery", "Machine Learning", "Cloud Storage", "SQL Analytics"],
    iconType: "data",
    verificationUrl: skillsBoostStats.profileUrl,
  },
  {
    id: "gcp-engineer-data",
    title: "Engineer Data with Google Cloud",
    category: "Data & BigQuery",
    earnedDate: "2025",
    description: "Design streaming and batch data processing pipelines with Dataflow (Apache Beam), Pub/Sub, and BigQuery.",
    skills: ["Dataflow", "Pub/Sub", "Data Engineering", "Stream Processing"],
    iconType: "data",
    verificationUrl: skillsBoostStats.profileUrl,
  },
  {
    id: "gcp-dataproc-spark",
    title: "Manage Big Data with Dataproc and Apache Spark",
    category: "Data & BigQuery",
    earnedDate: "2025",
    description: "Deploy managed Spark and Hadoop clusters, configure autoscaling, and optimize PySpark workloads on Google Cloud.",
    skills: ["Dataproc", "Apache Spark", "PySpark", "Hadoop", "Cloud Storage"],
    iconType: "data",
    verificationUrl: skillsBoostStats.profileUrl,
  },

  // --- Cloud Infrastructure & GKE ---
  {
    id: "gcp-gke-cost-optimize",
    title: "Optimize Costs for Google Kubernetes Engine (GKE)",
    category: "Cloud Infrastructure",
    earnedDate: "2026",
    description: "Implement GKE autoscaling, vertical pod autoscaling, spot node pools, and cluster bin-packing to slash cloud operational overhead.",
    skills: ["Kubernetes", "GKE", "FinOps", "Autoscaling", "Container Ops"],
    iconType: "kubernetes",
    verificationUrl: skillsBoostStats.profileUrl,
  },
  {
    id: "gcp-deploy-cloud-environments",
    title: "Deploy and Manage Cloud Environments with GCP",
    category: "Cloud Infrastructure",
    earnedDate: "2025",
    description: "Provision compute instances, configure VPC peering, manage Cloud Storage buckets, and orchestrate Cloud Run microservices.",
    skills: ["Compute Engine", "VPC", "Cloud Run", "Cloud IAM"],
    iconType: "cloud",
    verificationUrl: skillsBoostStats.profileUrl,
  },
  {
    id: "gcp-setup-configure-env",
    title: "Set Up and Configure a Cloud Environment in Google Cloud",
    category: "Cloud Infrastructure",
    earnedDate: "2025",
    description: "Manage projects, organization nodes, IAM roles, service accounts, billing alerts, and Cloud Audit Logging.",
    skills: ["Cloud IAM", "Resource Hierarchy", "Billing Alerts", "Cloud Audit"],
    iconType: "cloud",
    verificationUrl: skillsBoostStats.profileUrl,
  },
  {
    id: "gcp-cloud-architecture",
    title: "Architect Infrastructure on Google Cloud",
    category: "Cloud Infrastructure",
    earnedDate: "2025",
    description: "Design resilient, highly-available multi-region cloud architectures balancing latency, failover, and disaster recovery.",
    skills: ["Cloud Architecture", "High Availability", "Disaster Recovery", "Load Balancing"],
    iconType: "cloud",
    verificationUrl: skillsBoostStats.profileUrl,
  },

  // --- Security & IAM ---
  {
    id: "gcp-security-fundamentals",
    title: "Implement Cloud Security Fundamentals on Google Cloud",
    category: "Security & IAM",
    earnedDate: "2025",
    description: "Enforce least-privilege access, manage Customer-Managed Encryption Keys (CMEK) via Cloud KMS, and audit security command center.",
    skills: ["Cloud Security", "Cloud KMS", "IAM Least Privilege", "Security Command Center"],
    iconType: "security",
    verificationUrl: skillsBoostStats.profileUrl,
  },
  {
    id: "gcp-secure-cloud-network",
    title: "Build a Secure Google Cloud Network",
    category: "Security & IAM",
    earnedDate: "2025",
    description: "Configure Cloud Armor WAF policies, VPC Service Controls, Private Google Access, and Cloud NAT for zero-trust perimeters.",
    skills: ["Cloud Armor", "VPC Service Controls", "Zero Trust", "Firewall Rules"],
    iconType: "security",
    verificationUrl: skillsBoostStats.profileUrl,
  },
  {
    id: "gcp-protect-traffic-beyondcorp",
    title: "Protect Cloud Traffic with BeyondCorp Enterprise",
    category: "Security & IAM",
    earnedDate: "2026",
    description: "Implement context-aware access proxies and Identity-Aware Proxy (IAP) to govern zero-trust secure application access.",
    skills: ["BeyondCorp", "IAP", "Context-Aware Access", "Zero Trust"],
    iconType: "security",
    verificationUrl: skillsBoostStats.profileUrl,
  },

  // --- DevOps & Terraform ---
  {
    id: "gcp-terraform-infrastructure",
    title: "Build Infrastructure with Terraform on Google Cloud",
    category: "DevOps & SRE",
    earnedDate: "2026",
    description: "Define, plan, and automate cloud infrastructure provisioning using declarative HashiCorp Terraform modules and Cloud Build CI/CD.",
    skills: ["Terraform", "Infrastructure as Code", "Cloud Build", "State Management"],
    iconType: "devops",
    verificationUrl: skillsBoostStats.profileUrl,
  },
  {
    id: "gcp-observability-monitoring",
    title: "Monitor and Log with Google Cloud Observability",
    category: "DevOps & SRE",
    earnedDate: "2025",
    description: "Configure Cloud Monitoring uptime checks, custom metric dashboards, alert policies, and distributed Cloud Trace profiling.",
    skills: ["Cloud Monitoring", "Cloud Logging", "Cloud Trace", "SRE"],
    iconType: "devops",
    verificationUrl: skillsBoostStats.profileUrl,
  },
  {
    id: "gcp-devops-cicd",
    title: "Implement DevOps in Google Cloud",
    category: "DevOps & SRE",
    earnedDate: "2025",
    description: "Automate containerized build, test, and release pipelines using Cloud Build, Artifact Registry, and Google Cloud Deploy.",
    skills: ["Cloud Build", "Cloud Deploy", "Artifact Registry", "CI/CD"],
    iconType: "devops",
    verificationUrl: skillsBoostStats.profileUrl,
  },
];
