"""
Google Cloud Skills Boost Profile Synchronization Script
Fetches public profile from https://www.skills.google/public_profiles/d8429119-44bb-443a-8563-87b7953f74e9,
parses all badges and public profile metrics, performs strict data validation,
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

# Private dashboard verified baseline (cannot be extracted from public HTML)
PRIVATE_DASHBOARD = {
    "streakDays": 12,
    "leaguePosition": 18,
    "lastManualVerification": "November 2026",
    "provenance": "Manually verified private dashboard session (not exposed in public profile HTML)"
}

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
    raise RuntimeError(f"Failed to fetch profile HTML from {url} after {retries} attempts.")

def parse_profile(html_content: str, existing_badges: list[dict] = None) -> dict:
    soup = BeautifulSoup(html_content, "html.parser")

    # 1. Profile metadata - strict extraction, NO silent defaults
    h1 = soup.find("h1")
    if not h1 or not h1.get_text(strip=True):
        raise ValueError("Validation failed: Could not find user <h1> name tag in HTML.")
    user_name = h1.get_text(strip=True)

    league_div = soup.find(class_="profile-league")
    if not league_div:
        raise ValueError("Validation failed: Could not find .profile-league container in HTML.")

    h2 = league_div.find("h2")
    if not h2 or not h2.get_text(strip=True):
        raise ValueError("Validation failed: Could not extract league name from .profile-league container.")
    league_name = h2.get_text(strip=True)

    strong = league_div.find("strong")
    if not strong or not strong.get_text(strip=True):
        raise ValueError("Validation failed: Could not find <strong> points element in .profile-league.")

    m_points = re.search(r"(\d+)", strong.get_text())
    if not m_points:
        raise ValueError(f"Validation failed: Could not extract integer points from string: '{strong.get_text()}'.")
    points = int(m_points.group(1))

    if points < 40000:
        raise ValueError(f"Validation failed: Extracted points ({points}) suspiciously below 40,000 threshold.")

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
        raise ValueError("Validation failed: Could not find .profile-badges container in HTML.")

    badge_cards = parent.find_all(class_="profile-badge", recursive=False)
    if not badge_cards:
        raise ValueError("Validation failed: No .profile-badge elements found inside .profile-badges.")

    parsed_badges = []
    seen_ids = set()

    for idx, card in enumerate(badge_cards):
        link_el = card.find("a", href=re.compile(r"/badges/\d+"))
        if not link_el:
            raise ValueError(f"Validation failed: Badge card #{idx} is missing /badges/ anchor link.")
        href = link_el.get("href", "").strip()
        if not href.startswith("http"):
            raise ValueError(f"Validation failed: Badge card #{idx} has invalid verification URL: '{href}'.")

        m = re.search(r"/badges/(\d+)", href)
        if not m:
            raise ValueError(f"Validation failed: Badge card #{idx} missing numeric ID in URL: '{href}'.")
        badge_num = m.group(1)
        badge_id = f"gcp-{badge_num}"

        if badge_id in seen_ids:
            raise ValueError(f"Validation failed: Duplicate badge ID detected in profile: '{badge_id}'.")
        seen_ids.add(badge_id)

        img_el = link_el.find("img")
        if not img_el or not img_el.get("src"):
            raise ValueError(f"Validation failed: Badge '{badge_id}' is missing image element or src.")
        img_url = img_el.get("src", "").strip()
        if not img_url.startswith("http"):
            raise ValueError(f"Validation failed: Badge '{badge_id}' has invalid image URL: '{img_url}'.")

        title_el = card.find(class_=re.compile(r"ql-title", re.I))
        if not title_el or not title_el.get_text(strip=True):
            raise ValueError(f"Validation failed: Badge '{badge_id}' is missing title text.")
        title = title_el.get_text(strip=True)

        date_el = card.find(class_=re.compile(r"ql-body", re.I))
        raw_date = date_el.get_text(strip=True) if date_el else ""
        earned_date = clean_date(raw_date) if raw_date else ""
        if raw_date and not earned_date:
            raise ValueError(f"Validation failed: Badge '{badge_id}' has unparseable earned date: '{raw_date}'.")

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

    # Validate badge count constraints
    if len(parsed_badges) < 150:
        raise ValueError(f"Validation failed: Extracted only {len(parsed_badges)} badges, expected at least 150.")

    if existing_badges:
        prev_count = len(existing_badges)
        curr_count = len(parsed_badges)
        if curr_count < prev_count:
            raise ValueError(f"Validation failed: Badge count decreased from {prev_count} to {curr_count}.")
        if curr_count > prev_count + 25:
            raise ValueError(f"Validation failed: Suspiciously large badge count jump (+{curr_count - prev_count}).")

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
            "provenance": "Direct server-side sync from public profile HTML",
            "privateDashboard": PRIVATE_DASHBOARD
        },
        "badges": parsed_badges
    }
    return snapshot

def update_google_developer_data_file(filepath: str, total_badges: int, points: int, league: str) -> bool:
    """Updates the static snapshot constants in googleDeveloperData.ts if changed."""
    if not os.path.exists(filepath):
        return False
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Update skillsBoostStats block
    pattern = r"(export const skillsBoostStats = \{[\s\S]*?skillBadges:\s*)\d+([\s\S]*?points:\s*)\d+([\s\S]*?league:\s*\"[^\"]*\")"
    replacement = rf'\g<1>{total_badges}\g<2>{points}\g<3>'
    # check if league text needs replacing
    new_content = re.sub(r'skillBadges:\s*\d+', f'skillBadges: {total_badges}', content)
    new_content = re.sub(r'points:\s*\d+', f'points: {points}', new_content)
    new_content = re.sub(r'league:\s*"[^"]*"', f'league: "{league}"', new_content)

    if new_content != content:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        return True
    return False

def main():
    parser = argparse.ArgumentParser(description="Synchronize Google Cloud Skills Boost profile data")
    parser.add_argument("--local-html", help="Path to local HTML file instead of fetching live URL")
    parser.add_argument("--build-step", action="store_true", help="Run as a build-step: exit 0 gracefully on network error without corrupting files")
    args = parser.parse_args()

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    public_data_dir = os.path.join(base_dir, "public", "data")
    snapshot_path = os.path.join(public_data_dir, "skills-snapshot.json")
    bundled_badges_path = os.path.join(base_dir, "src", "lib", "googleSkillsBadges.json")
    dev_data_path = os.path.join(base_dir, "src", "lib", "googleDeveloperData.ts")

    os.makedirs(public_data_dir, exist_ok=True)

    # Load existing bundled badges
    existing_badges = []
    if os.path.exists(bundled_badges_path):
        try:
            with open(bundled_badges_path, "r", encoding="utf-8") as f:
                existing_badges = json.load(f)
        except Exception as e:
            print("[SYNC WARNING] Error reading bundled badges:", e)

    # Fetch or read HTML
    html_content = ""
    if args.local_html and os.path.exists(args.local_html):
        print(f"[SYNC] Reading HTML from local file: {args.local_html}")
        with open(args.local_html, "r", encoding="utf-8") as f:
            html_content = f.read()
    else:
        print(f"[SYNC] Fetching live profile from {PROFILE_URL} ...")
        try:
            html_content = fetch_html(PROFILE_URL)
        except Exception as e:
            print(f"[SYNC ERROR] Failed to fetch live profile: {e}")
            if args.build_step:
                print("[BUILD-STEP] Retaining existing valid snapshot without failing build.")
                if not os.path.exists(snapshot_path) and existing_badges:
                    fallback_snapshot = {
                        "status": "cached",
                        "syncedAt": datetime.now(timezone.utc).isoformat(),
                        "source": PROFILE_URL,
                        "profile": {
                            "name": "Sumit Bharti",
                            "league": "Diamond League",
                            "points": 48068,
                            "totalBadges": len(existing_badges),
                            "provenance": "Bundled repository snapshot fallback",
                            "privateDashboard": PRIVATE_DASHBOARD
                        },
                        "badges": existing_badges
                    }
                    with open(snapshot_path, "w", encoding="utf-8") as out:
                        json.dump(fallback_snapshot, out, indent=2, ensure_ascii=False)
                    print(f"[BUILD-STEP] Created baseline fallback snapshot at {snapshot_path}")
                sys.exit(0)
            else:
                sys.exit(1)

    # Parse and validate with strict rules
    try:
        snapshot = parse_profile(html_content, existing_badges)
    except Exception as e:
        print(f"[SYNC ERROR] Profile validation failed: {e}")
        print("[SYNC ERROR] Last known-good snapshot was NOT modified.")
        if args.build_step:
            print("[BUILD-STEP] Retaining existing snapshot without failing build.")
            sys.exit(0)
        sys.exit(1)

    total_badges = snapshot["profile"]["totalBadges"]
    points = snapshot["profile"]["points"]
    league = snapshot["profile"]["league"]
    user_name = snapshot["profile"]["name"]
    prev_len = len(existing_badges) if existing_badges else total_badges
    new_badges_count = total_badges - prev_len

    print(f"[SYNC SUCCESS] User: {user_name}")
    print(f"[SYNC SUCCESS] League: {league}")
    print(f"[SYNC SUCCESS] Points: {points:,}")
    print(f"[SYNC SUCCESS] Total Badges: {total_badges} (Delta: +{new_badges_count})")
    print(f"[SYNC SUCCESS] Timestamp: {snapshot['syncedAt']}")
    print(f"[SYNC SUCCESS] Private Dashboard: {PRIVATE_DASHBOARD['streakDays']}d streak, #{PRIVATE_DASHBOARD['leaguePosition']} rank ({PRIVATE_DASHBOARD['lastManualVerification']})")

    # Atomic write to snapshot_path
    temp_snapshot = snapshot_path + ".tmp"
    with open(temp_snapshot, "w", encoding="utf-8") as f:
        json.dump(snapshot, f, indent=2, ensure_ascii=False)
    os.replace(temp_snapshot, snapshot_path)
    print(f"[SYNC] Saved runtime snapshot -> {snapshot_path}")

    # Atomic write to bundled_badges_path
    temp_bundled = bundled_badges_path + ".tmp"
    with open(temp_bundled, "w", encoding="utf-8") as f:
        json.dump(snapshot["badges"], f, indent=2, ensure_ascii=False)
    os.replace(temp_bundled, bundled_badges_path)
    print(f"[SYNC] Updated bundled fallback -> {bundled_badges_path}")

    # Update googleDeveloperData.ts constants
    updated = update_google_developer_data_file(dev_data_path, total_badges, points, league)
    if updated:
        print(f"[SYNC] Updated {dev_data_path} constants.")

    print("[SYNC COMPLETE] All operations completed successfully.")

if __name__ == "__main__":
    main()
