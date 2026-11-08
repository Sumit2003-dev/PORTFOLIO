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

/* ========================================================================
   1. Google Cloud Skills Boost Snapshot Metrics (November 2026)
   These figures are manually verified snapshots from the public profile transcript,
   NOT live real-time API feeds.
   ======================================================================== */
export const skillsBoostStats = {
  skillBadges: 178,
  points: 47957,
  league: "Diamond",
  streakDays: 12,
  leaguePosition: 18,
  lastVerified: "November 2026",
  provenance: "Manually verified snapshot from public profile transcript",
  profileUrl: "https://www.skills.google/public_profiles/d8429119-44bb-443a-8563-87b7953f74e9",
  credlyUrl: "https://www.credly.com/users/sumitdev2003/badges",
};

/* ========================================================================
   2. Google Developer Program (g.dev)
   Distinct from Skills Boost badges.
   Individual badge details are accessible directly on g.dev.
   ======================================================================== */
export const googleDevProgram = {
  profileUrl: "https://g.dev/sumit2003dev",
  membershipTier: "Premium Member",
  innovatorStatus: "Google Cloud Innovator",
  totalBadges: 12,
  lastVerified: "November 2026",
  provenance: "Manually maintained snapshot from g.dev public profile",
  notice:
    "Google Developer Program badges are recognized on the official g.dev platform for ecosystem engagement and cloud development. Individual badge credentials can be viewed directly on the public profile.",
};

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
export const verifiedSkillBadges: GoogleSkillBadge[] = (rawSkillBadges as any[]).map((b) => ({
  id: b.id,
  title: b.title,
  category: b.category as GoogleSkillBadge["category"],
  earnedDate: b.earnedDate,
  description: b.description || `Official Google Cloud skill badge validating competency in ${b.title}.`,
  skills: b.skills && b.skills.length > 0 ? b.skills : ["Google Cloud"],
  iconType: b.iconType as GoogleSkillBadge["iconType"],
  imageUrl: b.imageUrl,
  verificationUrl: b.verificationUrl,
}));
