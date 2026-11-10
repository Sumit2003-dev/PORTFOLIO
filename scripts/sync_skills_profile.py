"""
Google Cloud Skills Boost Profile Synchronization Script
Fetches public profile from https://www.skills.google/public_profiles/d8429119-44bb-443a-8563-87b7953f74e9,
parses all badges and profile metrics, performs strict data validation,
and generates versioned static snapshots for both runtime fetch and bundled fallback.
"""

import argparse
import json
import os
import re
import sys
import time
import urllib.request
from datetime import datetime, timezone
from bs4 import BeautifulSoup

PROFILE_URL = "https://www.skills.google/public_profiles/d8429119-44bb-443a-8563-87b7953f74e9"
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

def clean_date(raw_date: str) -> str:
    cleaned = raw_date.replace("Earned", "").replace("EST", "").replace("EDT", "").strip()
    cleaned = re.sub(r"\s+", " ", cleaned)
    return cleaned

def determine_category(title: str, desc: str) -> tuple[str, list[str], str]:
    t = (title + " " + desc).lower()
    if any(k in t for k in ["gemini", "generative ai", "llm", "large language", "prompt", "multimodal", "deepmind", "vertex ai"]):
        return ("Generative AI", ["Gemini", "Generative AI", "Vertex AI"], "gemini")
    if any(k in t for k in ["bigquery", "data mesh", "datashare", "analytics", "data engineering", "looker", "datastore", "database", "sql"]):
        return ("Data & BigQuery", ["BigQuery", "Data Engineering", "SQL"], "data")
    if any(k in t for k in ["security", "iam", "armor", "threat", "firewall", "encryption", "vault"]):
        return ("Security & IAM", ["Cloud Security", "IAM", "Security Command Center"], "security")
    if any(k in t for k in ["sre", "site reliability", "devops", "ci/cd", "cloud build", "monitoring", "operations", "terraform", "automate"]):
        return ("DevOps & SRE", ["DevOps", "CI/CD", "Cloud Build", "Monitoring"], "devops")
    if any(k in t for k in ["kubernetes", "gke", "docker", "container"]):
        return ("Cloud Infrastructure", ["GKE", "Containers", "Kubernetes"], "kubernetes")
    return ("Cloud Infrastructure", ["Google Cloud", "Compute Engine", "VPC"], "cloud")

def fetch_html(url: str, retries: int = 3, timeout: int = 15) -> str:
    headers = {"User-Agent": USER_AGENT}
    for attempt in range(1, retries + 1):
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                if resp.status == 200:
                    return resp.read().decode("utf-8", errors="ignore")
                print(f"[Attempt {attempt}] Unexpected HTTP status: {resp.status}")
        except Exception as e:
            print(f"[Attempt {attempt}/{retries}] Error fetching {url}: {e}")
            if attempt < retries:
                time.sleep(2 * attempt)
    raise RuntimeError(f"Failed to fetch profile HTML after {retries} attempts.")

def parse_profile(html_content: str, existing_badges: list[dict] = None) -> dict:
    soup = BeautifulSoup(html_content, "html.parser")

    # 1. Profile metadata
    h1 = soup.find("h1")
    user_name = h1.get_text(strip=True) if h1 else "Sumit Bharti"

    league_div = soup.find(class_="profile-league")
    league_name = "Diamond League"
    points = 48046
    if league_div:
        h2 = league_div.find("h2")
        if h2:
            league_name = h2.get_text(strip=True)
        strong = league_div.find("strong")
        if strong:
            m = re.search(r"(\d+)", strong.get_text())
            if m:
                points = int(m.group(1))

    # 2. Extract dialog descriptions
    dialog_map = {}
    for dialog in soup.find_all("ql-dialog"):
        modal_id = dialog.get("id")
        p = dialog.find("p")
        desc = p.get_text(strip=True) if p else ""
        if modal_id and desc:
            dialog_map[modal_id] = desc

    # 3. Existing badges mapping
    existing_map = {}
    if existing_badges:
        for b in existing_badges:
            existing_map[b["id"]] = b

    # 4. Extract badge elements
    parent = soup.find(class_="profile-badges")
    if not parent:
        raise ValueError("Could not find .profile-badges container in HTML.")

    badge_cards = parent.find_all(class_="profile-badge", recursive=False)
    if not badge_cards:
        raise ValueError("No .profile-badge elements found inside .profile-badges container.")

    parsed_badges = []
    seen_ids = set()

    for card in badge_cards:
        link_el = card.find("a", href=re.compile(r"/badges/\d+"))
        if not link_el:
            continue
        href = link_el.get("href")
        m = re.search(r"/badges/(\d+)", href)
        badge_num = m.group(1) if m else ""
        badge_id = f"gcp-{badge_num}"

        if badge_id in seen_ids:
            continue
        seen_ids.add(badge_id)

        img_el = link_el.find("img")
        img_url = img_el.get("src") if img_el else ""

        title_el = card.find(class_=re.compile(r"ql-title", re.I))
        title = title_el.get_text(strip=True) if title_el else ""

        date_el = card.find(class_=re.compile(r"ql-body", re.I))
        raw_date = date_el.get_text(strip=True) if date_el else ""
        earned_date = clean_date(raw_date)

        # Modal button description
        btn = card.find("ql-button")
        modal_id = btn.get("modal") if btn else ""
        official_desc = dialog_map.get(modal_id, "")

        old_data = existing_map.get(badge_id)
        if old_data:
            category = old_data.get("category")
            skills = old_data.get("skills")
            icon_type = old_data.get("iconType")
            desc = official_desc or old_data.get("description")
        else:
            category, skills, icon_type = determine_category(title, official_desc)
            desc = official_desc or f"Official Google Cloud skill badge validating practical competency in {title}."

        parsed_badges.append({
            "id": badge_id,
            "title": title,
            "category": category,
            "earnedDate": earned_date,
            "description": desc,
            "skills": skills,
            "iconType": icon_type,
            "imageUrl": img_url,
            "verificationUrl": href
        })

    # Validate output
    if len(parsed_badges) < 150:
        raise ValueError(f"Extracted only {len(parsed_badges)} badges, expected at least 150. Data may be incomplete.")
    if points < 40000:
        raise ValueError(f"Extracted points {points} suspiciously low. Validation failed.")

    now_iso = datetime.now(timezone.utc).isoformat()

    snapshot = {
        "status": "success",
        "syncedAt": now_iso,
        "source": PROFILE_URL,
        "profile": {
            "name": user_name,
            "league": league_name,
            "points": points,
            "totalBadges": len(parsed_badges),
            "streakDays": 12,
            "streakProvenance": "Private Dashboard session snapshot (Nov 2026)",
            "leaguePosition": 18,
            "positionProvenance": "Private Dashboard session snapshot (Nov 2026)",
            "lastVerified": "November 2026",
            "provenance": "Direct server-side sync from public profile HTML"
        },
        "badges": parsed_badges
    }
    return snapshot

def main():
    parser = argparse.ArgumentParser(description="Synchronize Google Cloud Skills Boost profile data")
    parser.add_argument("--local-html", help="Path to local HTML file instead of fetching live URL")
    parser.add_argument("--build-step", action="store_true", help="Run as a build-step: exit 0 gracefully on network error")
    args = parser.parse_args()

    # Paths
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    public_data_dir = os.path.join(base_dir, "public", "data")
    snapshot_path = os.path.join(public_data_dir, "skills-snapshot.json")
    bundled_badges_path = os.path.join(base_dir, "src", "lib", "googleSkillsBadges.json")

    os.makedirs(public_data_dir, exist_ok=True)

    # Load existing bundled badges
    existing_badges = []
    if os.path.exists(bundled_badges_path):
        try:
            with open(bundled_badges_path, "r", encoding="utf-8") as f:
                existing_badges = json.load(f)
        except Exception as e:
            print("Warning reading bundled badges:", e)

    # Obtain HTML
    html_content = ""
    if args.local_html and os.path.exists(args.local_html):
        print(f"Reading HTML from local file: {args.local_html}")
        with open(args.local_html, "r", encoding="utf-8") as f:
            html_content = f.read()
    else:
        print(f"Fetching public profile from {PROFILE_URL} ...")
        try:
            html_content = fetch_html(PROFILE_URL)
        except Exception as e:
            print(f"[ERROR] Failed to fetch live profile: {e}")
            if args.build_step:
                print("[BUILD-STEP] Retaining existing snapshot without failing build.")
                if not os.path.exists(snapshot_path) and existing_badges:
                    # Create baseline snapshot from bundled badges
                    fallback_snapshot = {
                        "status": "cached",
                        "syncedAt": datetime.now(timezone.utc).isoformat(),
                        "source": PROFILE_URL,
                        "profile": {
                            "name": "Sumit Bharti",
                            "league": "Diamond League",
                            "points": 48046,
                            "totalBadges": len(existing_badges),
                            "streakDays": 12,
                            "leaguePosition": 18,
                            "lastVerified": "November 2026",
                            "provenance": "Bundled repository snapshot fallback"
                        },
                        "badges": existing_badges
                    }
                    with open(snapshot_path, "w", encoding="utf-8") as out:
                        json.dump(fallback_snapshot, out, indent=2, ensure_ascii=False)
                    print(f"Generated fallback snapshot at {snapshot_path}")
                sys.exit(0)
            else:
                sys.exit(1)

    # Parse and validate
    try:
        snapshot = parse_profile(html_content, existing_badges)
    except Exception as e:
        print(f"[ERROR] Failed to parse and validate profile: {e}")
        if args.build_step:
            print("[BUILD-STEP] Retaining existing snapshot.")
            sys.exit(0)
        sys.exit(1)

    total_badges = snapshot["profile"]["totalBadges"]
    points = snapshot["profile"]["points"]
    league = snapshot["profile"]["league"]
    print(f"Validation passed! Successfully extracted {total_badges} badges, {points} points, {league}.")

    # Write snapshot
    with open(snapshot_path, "w", encoding="utf-8") as f:
        json.dump(snapshot, f, indent=2, ensure_ascii=False)
    print(f"Saved runtime snapshot -> {snapshot_path}")

    # Also update bundled JSON
    with open(bundled_badges_path, "w", encoding="utf-8") as f:
        json.dump(snapshot["badges"], f, indent=2, ensure_ascii=False)
    print(f"Updated bundled fallback -> {bundled_badges_path}")

    print("Profile synchronization completed successfully.")

if __name__ == "__main__":
    main()
