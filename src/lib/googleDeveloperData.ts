/**
 * Google Developer Journey Data Model & Catalog
 * Audited for strict authenticity and factual provenance.
 * Snapshot date: November 2026.
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
  imageUrl: string;
  verificationUrl: string;
}

export interface GoogleDevBadge {
  id: string;
  title: string;
  category: "Agent AI & Gemini" | "Cloud & Infrastructure" | "Developer Communities" | "Recognitions & Learning";
  earnedDate: string;
  badgeLevel?: string;
  description: string;
  skills: string[];
  localImage: string;
  cdnImage: string;
  verificationUrl: string;
}

/* ========================================================================
   1. Google Cloud Skills Boost Snapshot Metrics (November 2026)
   These figures are manually verified snapshots from the public profile transcript,
   NOT live real-time API feeds.
   ======================================================================== */
export const skillsBoostStats = {
  skillBadges: 190,
  points: 48422,
  league: "Diamond League",
  streakDays: 12,
  leaguePosition: 18,
  lastVerified: "November 2026",
  provenance: "Server-side synchronization snapshot from public profile",
  profileUrl: "https://www.skills.google/public_profiles/d8429119-44bb-443a-8563-87b7953f74e9",
  credlyUrl: "https://www.credly.com/users/sumitdev2003/badges",
};

/* ========================================================================
   2. Google Developer Program (g.dev)
   Snapshot of 15 authentic badges extracted from g.dev/sumit2003dev.
   Includes GEAR (Gemini Agent Ready), Cloud Innovators, GDG, & Recognitions.
   ======================================================================== */
export const googleDevProgram = {
  profileUrl: "https://g.dev/sumit2003dev",
  membershipTier: "Premium Member",
  innovatorStatus: "Google Cloud Innovator",
  totalBadges: 15,
  lastVerified: "November 2026",
  provenance: "Manually maintained snapshot from g.dev public profile",
  notice:
    "Google Developer Program badges are recognized on the official g.dev platform for ecosystem engagement and cloud development. Individual badge credentials can be viewed directly on the public profile.",
};

export const googleDevBadges: GoogleDevBadge[] = [
  {
    id: "gdev-premium-tier",
    title: "Google Developer Program Premium Tier",
    category: "Cloud & Infrastructure",
    earnedDate: "Feb 13, 2026",
    description: "Official recognition for Premium Tier membership within the Google Developer Program and Google Cloud Innovator status.",
    skills: ["Google Cloud", "Innovator Plus", "GCP"],
    localImage: "images/gdev-badges/09-google-developer-program-premium-tier.svg",
    cdnImage: "https://www.gstatic.com/googledevelopers/profile/badges/community/innovators/cloud/innovators_plus/badge.svg",
    verificationUrl: "https://g.dev/sumit2003dev",
  },
  {
    id: "gdev-gear-core",
    title: "Gemini Agent Ready (GEAR)",
    category: "Agent AI & Gemini",
    earnedDate: "Aug 7, 2026",
    description: "Core Google qualification validating autonomous agent design, Gemini API integration, and tool orchestration.",
    skills: ["Gemini 1.5", "AI Agents", "Function Calling", "Multimodal"],
    localImage: "images/gdev-badges/06-gemini-agent-ready.svg",
    cdnImage: "https://www.gstatic.com/googledevelopers/profile/badges/community/gear/badge.svg",
    verificationUrl: "https://g.dev/sumit2003dev",
  },
  {
    id: "gdev-gear-production",
    title: "GEAR: Building Production-Ready Agents",
    category: "Agent AI & Gemini",
    earnedDate: "Aug 9, 2026",
    description: "Advanced engineering badge for architecting production-grade, resilient agent workflows with prompt grounding and validation.",
    skills: ["Production Agents", "Agent Evaluation", "Reliability", "Prompt Engineering"],
    localImage: "images/gdev-badges/05-gear-building-production-ready-agents.svg",
    cdnImage: "https://www.gstatic.com/googledevelopers/profile/badges/community/gear/agent-build/badge.svg",
    verificationUrl: "https://g.dev/sumit2003dev",
  },
  {
    id: "gdev-gear-intro",
    title: "GEAR: Intro to Agents",
    category: "Agent AI & Gemini",
    earnedDate: "Jul 30, 2026",
    description: "Foundational qualification covering autonomous decision loops, agent memory architectures, and LLM reasoning patterns.",
    skills: ["Agentic Reasoning", "ReAct Framework", "Gemini", "Context Caching"],
    localImage: "images/gdev-badges/07-gear-intro-to-agents.svg",
    cdnImage: "https://www.gstatic.com/googledevelopers/profile/badges/community/gear/agent-intro/badge.svg",
    verificationUrl: "https://g.dev/sumit2003dev",
  },
  {
    id: "gdev-gear-scale",
    title: "GEAR: Scaling Agents Across the Enterprise",
    category: "Agent AI & Gemini",
    earnedDate: "Jul 20, 2026",
    description: "Enterprise multi-agent scaling strategies, rate-limiting policies, security controls, and production telemetry on Google Cloud.",
    skills: ["Enterprise Scaling", "Agent Governance", "Cloud Run", "Vertex AI"],
    localImage: "images/gdev-badges/08-gear-scaling-agents-across-the-enterprise.svg",
    cdnImage: "https://www.gstatic.com/googledevelopers/profile/badges/community/gear/agent-scale/badge.svg",
    verificationUrl: "https://g.dev/sumit2003dev",
  },
  {
    id: "gdev-arcade-gear",
    title: "Arcade - GEAR Challenge",
    category: "Agent AI & Gemini",
    earnedDate: "Aug 15, 2026",
    description: "Hands-on applied challenge track validating Gemini agent development and practical cloud deployment.",
    skills: ["Google Cloud Arcade", "Gemini Labs", "Agent Deployment"],
    localImage: "images/gdev-badges/04-arcade---gear.png",
    cdnImage: "https://www.gstatic.com/googledevelopers/profile/badges/community/gear/arcade/badge.png",
    verificationUrl: "https://g.dev/sumit2003dev",
  },
  {
    id: "gdev-cloud-innovator",
    title: "Google Cloud Innovator",
    category: "Cloud & Infrastructure",
    earnedDate: "Oct 27, 2025",
    badgeLevel: "Level 1",
    description: "Official Google Cloud Innovator recognition connecting with Google engineers, roadmap discussions, and technical exchanges.",
    skills: ["Google Cloud", "Community", "Architecture"],
    localImage: "images/gdev-badges/13-google-cloud-innovator.svg",
    cdnImage: "https://www.gstatic.com/googledevelopers/profile/badges/community/innovators/cloud/2021_member/badge.svg",
    verificationUrl: "https://g.dev/sumit2003dev",
  },
  {
    id: "gdev-maps-innovators",
    title: "Google Maps Platform Innovators",
    category: "Cloud & Infrastructure",
    earnedDate: "Aug 19, 2026",
    description: "Innovator recognition for engineering location-aware web applications and geospatial interfaces with Google Maps Platform APIs.",
    skills: ["Maps JavaScript API", "Geocoding", "Places API", "Geospatial"],
    localImage: "images/gdev-badges/01-google-maps-platform-innovators.svg",
    cdnImage: "https://www.gstatic.com/googledevelopers/profile/badges/community/innovators/maps/badge.svg",
    verificationUrl: "https://g.dev/sumit2003dev",
  },
  {
    id: "gdev-nvidia-community",
    title: "Google Cloud & NVIDIA Community Member",
    category: "Cloud & Infrastructure",
    earnedDate: "Aug 19, 2026",
    description: "Developer recognition for GPU-accelerated computing, AI model training, and high-performance inference on Google Cloud infrastructure.",
    skills: ["NVIDIA GPUs", "Accelerated Computing", "Vertex AI", "CUDA"],
    localImage: "images/gdev-badges/02-google-cloud---nvidia-community-member.svg",
    cdnImage: "https://www.gstatic.com/googledevelopers/profile/badges/nvidia-developer/badge.svg",
    verificationUrl: "https://g.dev/sumit2003dev",
  },
  {
    id: "gdev-get-certified",
    title: "Get Certified Application",
    category: "Cloud & Infrastructure",
    earnedDate: "Aug 19, 2026",
    description: "Selected participant in Google Cloud's Get Certified program preparing for professional cloud architecture credentials.",
    skills: ["Cloud Certification", "Architecture", "Engineering"],
    localImage: "images/gdev-badges/03-get-certified-application.svg",
    cdnImage: "https://www.gstatic.com/googledevelopers/profile/badges/community/get-certified-26-edition-3/badge.svg",
    verificationUrl: "https://g.dev/sumit2003dev",
  },
  {
    id: "gdev-gdg-lucknow",
    title: "GDG Lucknow Member",
    category: "Developer Communities",
    earnedDate: "Oct 29, 2025",
    description: "Verified community member of Google Developer Group (GDG) Lucknow, collaborating with technologists across Uttar Pradesh.",
    skills: ["GDG Lucknow", "Developer Community", "Tech Events"],
    localImage: "images/gdev-badges/12-gdg-lucknow-member.svg",
    cdnImage: "https://www.gstatic.com/googledevelopers/profile/badges/community/gdg/chapter/badge.svg",
    verificationUrl: "https://g.dev/sumit2003dev",
  },
  {
    id: "gdev-gdg-member",
    title: "Google Developer Group Member",
    category: "Developer Communities",
    earnedDate: "Oct 29, 2025",
    description: "Global community membership recognition within the worldwide Google Developer Groups network.",
    skills: ["Google Developer Groups", "Global Network", "Community"],
    localImage: "images/gdev-badges/11-google-developer-group-member.svg",
    cdnImage: "https://www.gstatic.com/googledevelopers/profile/badges/community/gdg/member/badge.svg",
    verificationUrl: "https://g.dev/sumit2003dev",
  },
  {
    id: "gdev-gdg-discovery",
    title: "Google Developer Group Discovery",
    category: "Developer Communities",
    earnedDate: "Oct 29, 2025",
    description: "Community discovery badge for actively joining and exploring local GDG chapters and technical workshops.",
    skills: ["GDG Discovery", "Community Onboarding"],
    localImage: "images/gdev-badges/10-google-developer-group-discovery.svg",
    cdnImage: "https://www.gstatic.com/googledevelopers/profile/badges/community/gdg/discovery/badge.svg",
    verificationUrl: "https://g.dev/sumit2003dev",
  },
  {
    id: "gdev-learning-pathways",
    title: "Developer Learning Pathways",
    category: "Recognitions & Learning",
    earnedDate: "Nov 9, 2026",
    badgeLevel: "3 Completed",
    description: "Milestone achievement tracking completion of 3 structured developer learning pathways on Google Developer Platform.",
    skills: ["Developer Pathways", "Google Codelabs", "Hands-on"],
    localImage: "images/gdev-badges/00-learning.svg",
    cdnImage: "https://www.gstatic.com/googledevelopers/profile/badges/recognitions/learnings/learnings.svg",
    verificationUrl: "https://g.dev/sumit2003dev",
  },
  {
    id: "gdev-skills-linkage",
    title: "Google Skills Profile Integration",
    category: "Recognitions & Learning",
    earnedDate: "Oct 25, 2025",
    description: "Official profile connection linking Google Cloud Skills Boost achievements and completions directly to g.dev.",
    skills: ["Skills Boost", "Profile Sync", "Cloud Verification"],
    localImage: "images/gdev-badges/14-google-skills.svg",
    cdnImage: "https://www.gstatic.com/googledevelopers/profile/badges/skillsboost/earned-badge/badge.svg",
    verificationUrl: "https://g.dev/sumit2003dev",
  },
];

/* ========================================================================
   3. Google Developer Groups (GDG Lucknow)
   Authentic community membership (distinct from organizer or speaker status).
   ======================================================================== */
export const gdgLucknow = {
  chapterName: "Google Developer Group (GDG) Lucknow",
  membershipStatus: "Community Member",
  location: "Lucknow, Uttar Pradesh, India",
  communityUrl: "https://gdg.community.dev/gdg-lucknow/",
  description:
    "Member of Google Developer Group (GDG) Lucknow, connecting with fellow developers and participating in community learning around Google technologies in Uttar Pradesh.",
  provenance: "Community membership verified via official GDG chapter portal.",
};

/* ========================================================================
   4. Authentic Google Cloud Skills Boost Badge Catalog
   All 179 entries extracted directly from the public profile transcript,
   each with its original CDN artwork and individual verification URL.
   ======================================================================== */
export const verifiedSkillBadges: GoogleSkillBadge[] = (rawSkillBadges as Array<Record<string, unknown>>).map((b) => ({
  id: String(b.id || ""),
  title: String(b.title || ""),
  category: b.category as GoogleSkillBadge["category"],
  earnedDate: String(b.earnedDate || ""),
  description: String(b.description || `Official Google Cloud skill badge validating competency in ${b.title}.`),
  skills: Array.isArray(b.skills) && b.skills.length > 0 ? (b.skills as string[]) : ["Google Cloud"],
  iconType: b.iconType as GoogleSkillBadge["iconType"],
  imageUrl: String(b.imageUrl || ""),
  verificationUrl: String(b.verificationUrl || ""),
}));
