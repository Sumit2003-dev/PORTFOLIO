/**
 * Google Developer Journey Data Model & Verified Catalog
 * Verified record as of November 2026.
 * Single source of truth for Google Cloud Skills Boost, Google Developer Program,
 * and Google Developer Groups (GDG Lucknow) participation.
 */

import rawSkillBadges from "./googleSkillsBadges.json";

export interface GoogleSkillBadge {
  id: string;
  title: string;
  category: "Generative AI" | "Data & BigQuery" | "Cloud Infrastructure" | "Security & IAM" | "DevOps & SRE";
  earnedDate: string;
  description: string;
  skills: string[];
  iconType: "gemini" | "cloud" | "data" | "security" | "kubernetes" | "devops" | "deepmind";
  imageUrl?: string;
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
   4. Authentic Google Cloud Skills Boost Badge Catalog (179 Verified Badges)
   Directly synced from Sumit's public profile transcript.
   ======================================================================== */
export const verifiedSkillBadges: GoogleSkillBadge[] = (rawSkillBadges as any[]).map((b) => ({
  id: b.id,
  title: b.title,
  category: b.category as GoogleSkillBadge["category"],
  earnedDate: b.earnedDate,
  description: b.description,
  skills: b.skills || ["Google Cloud"],
  iconType: b.iconType as GoogleSkillBadge["iconType"],
  imageUrl: b.imageUrl,
  verificationUrl: b.verificationUrl,
}));

