"""
GitHub Activity & Contribution Synchronization Script
Fetches authentic GitHub contributions from jogruber API and repository metrics from GitHub REST API,
performs strict schema and date validation, and writes an atomic snapshot to public/data/github-activity.json.
"""

import argparse
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
from datetime import datetime, timezone

DEFAULT_USERNAME = "Sumit2003-dev"
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Antigravity-Sync/1.0"

# Standard GitHub linguistic palette mapping
LANGUAGE_COLORS = {
    "TypeScript": "#3178C6",
    "Python": "#3572A5",
    "Jupyter Notebook": "#DA5B0B",
    "JavaScript": "#F1E05A",
    "HTML": "#E34C26",
    "CSS": "#563D7C",
    "PLpgSQL": "#336791",
    "SQL": "#E38C00",
    "PowerShell": "#012456",
    "Shell": "#89E051",
    "C++": "#F34B7D",
    "C": "#555555",
    "Rust": "#DEA584",
    "Go": "#00ADD8",
    "Dart": "#00B4AB",
    "Java": "#B07219",
    "Dockerfile": "#384D54"
}

def get_auth_headers() -> dict:
    headers = {"User-Agent": USER_AGENT, "Accept": "application/vnd.github.v3+json"}
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return headers

def fetch_json(url: str, headers: dict = None, retries: int = 3, timeout: int = 15):
    if headers is None:
        headers = {"User-Agent": USER_AGENT}
    for attempt in range(1, retries + 1):
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                if resp.status == 200:
                    return json.loads(resp.read().decode("utf-8"))
                print(f"[Attempt {attempt}] Unexpected HTTP status {resp.status} for {url}")
        except Exception as e:
            print(f"[Attempt {attempt}/{retries}] Error fetching {url}: {e}")
            if attempt < retries:
                time.sleep(2 * attempt)
    raise RuntimeError(f"Failed to fetch JSON from {url} after {retries} attempts.")

def validate_date_string(date_str: str) -> bool:
    if not isinstance(date_str, str):
        return False
    return bool(re.match(r"^\d{4}-\d{2}-\d{2}$", date_str))

def sync_github_data(username: str = DEFAULT_USERNAME) -> dict:
    headers = get_auth_headers()

    # 1. Fetch User Profile
    print(f"[GITHUB-SYNC] Fetching user profile for @{username} ...")
    user_url = f"https://api.github.com/users/{username}"
    user_data = fetch_json(user_url, headers=headers)

    public_repos = user_data.get("public_repos", 0)
    followers = user_data.get("followers", 0)
    user_name = user_data.get("name") or username
    profile_url = user_data.get("html_url") or f"https://github.com/{username}"
    avatar_url = user_data.get("avatar_url", "")

    # 2. Fetch All Public Repositories (with pagination)
    print(f"[GITHUB-SYNC] Fetching all repositories for @{username} (paginated) ...")
    page = 1
    all_repos = []
    while True:
        repos_url = f"https://api.github.com/users/{username}/repos?per_page=100&type=owner&page={page}"
        batch = fetch_json(repos_url, headers=headers)
        if not batch or len(batch) == 0:
            break
        all_repos.extend(batch)
        if len(batch) < 100:
            break
        page += 1

    print(f"[GITHUB-SYNC] Retrieved {len(all_repos)} total repositories across {page} page(s).")

    # Filter owned, non-fork, non-archived repositories
    owned_repos = [r for r in all_repos if not r.get("fork") and not r.get("archived")]
    print(f"[GITHUB-SYNC] {len(owned_repos)} active owned non-fork repositories found.")

    # 3. Calculate Language Distribution by aggregating language byte counts
    print("[GITHUB-SYNC] Aggregating codebase language bytes across repositories ...")
    language_bytes_total = {}
    for r in owned_repos:
        lang_url = r.get("languages_url")
        if lang_url:
            try:
                repo_langs = fetch_json(lang_url, headers=headers)
                for lang_name, byte_count in repo_langs.items():
                    language_bytes_total[lang_name] = language_bytes_total.get(lang_name, 0) + byte_count
            except Exception as e:
                print(f"[GITHUB-SYNC WARNING] Could not fetch languages for {r.get('name')}: {e}")

    total_bytes = sum(language_bytes_total.values())
    languages_list = []
    for lang_name, b_count in sorted(language_bytes_total.items(), key=lambda x: x[1], reverse=True):
        pct = round((b_count / total_bytes) * 100, 1) if total_bytes > 0 else 0
        if pct > 0 or b_count > 10000:
            languages_list.append({
                "name": lang_name,
                "bytes": b_count,
                "percentage": pct,
                "color": LANGUAGE_COLORS.get(lang_name, "#8b949e")
            })

    # 4. Select Featured Repositories
    # Sort by stars, forks, and recency of push
    def repo_rank(r):
        stars = r.get("stargazers_count", 0)
        forks = r.get("forks_count", 0)
        pushed = r.get("pushed_at") or r.get("updated_at") or ""
        return (stars * 10 + forks * 5, pushed)

    sorted_repos = sorted(owned_repos, key=repo_rank, reverse=True)
    selected_repos = []
    for r in sorted_repos[:6]:
        selected_repos.append({
            "name": r.get("name"),
            "description": r.get("description") or "Open-source software repository and machine learning project.",
            "stars": r.get("stargazers_count", 0),
            "forks": r.get("forks_count", 0),
            "language": r.get("language") or "Code",
            "languageColor": LANGUAGE_COLORS.get(r.get("language"), "#8b949e"),
            "url": r.get("html_url") or f"https://github.com/{username}/{r.get('name')}",
            "updatedAt": r.get("pushed_at") or r.get("updated_at") or ""
        })

    # 5. Fetch Authentic Contribution Heatmap from jogruber API
    print(f"[GITHUB-SYNC] Fetching daily contribution calendar from jogruber API ...")
    contrib_url = f"https://github-contributions-api.jogruber.de/v4/{username}?y=last"
    contrib_data = fetch_json(contrib_url)

    raw_contributions = contrib_data.get("contributions", [])
    if not isinstance(raw_contributions, list) or len(raw_contributions) < 350:
        raise ValueError(f"Validation failed: Expected at least 350 contribution day entries, got {len(raw_contributions)}.")

    validated_days = []
    seen_dates = set()
    calculated_total = 0

    for idx, day in enumerate(raw_contributions):
        date_str = day.get("date", "")
        if not validate_date_string(date_str):
            raise ValueError(f"Validation failed: Day #{idx} has invalid date string: '{date_str}'.")

        if date_str in seen_dates:
            raise ValueError(f"Validation failed: Duplicate date detected in contributions: '{date_str}'.")
        seen_dates.add(date_str)

        count = day.get("count", 0)
        if not isinstance(count, int) or count < 0:
            raise ValueError(f"Validation failed: Day '{date_str}' has invalid count: {count}.")

        level = day.get("level", 0)
        if not isinstance(level, int) or level < 0 or level > 4:
            raise ValueError(f"Validation failed: Day '{date_str}' has invalid level: {level}.")

        calculated_total += count
        validated_days.append({
            "date": date_str,
            "count": count,
            "level": level
        })

    start_date = validated_days[0]["date"]
    end_date = validated_days[-1]["date"]
    total_last_year = contrib_data.get("total", {}).get("lastYear", calculated_total)

    # 6. Assemble Verified Snapshot
    now_iso = datetime.now(timezone.utc).isoformat()
    snapshot = {
        "status": "success",
        "syncedAt": now_iso,
        "username": username,
        "profile": {
            "name": user_name,
            "publicRepos": public_repos,
            "followers": followers,
            "profileUrl": profile_url,
            "avatarUrl": avatar_url,
            "provenance": "GitHub REST API v3 server-side synchronization"
        },
        "contributions": {
            "total": calculated_total,
            "calculatedTotal": calculated_total,
            "totalLastYear": total_last_year,
            "daysCount": len(validated_days),
            "startDate": start_date,
            "endDate": end_date,
            "days": validated_days,
            "provenance": "jogruber v4 verified GitHub contribution transcript"
        },
        "languages": languages_list,
        "totalLanguageBytes": total_bytes,
        "repositories": selected_repos
    }

    return snapshot

def main():
    parser = argparse.ArgumentParser(description="Synchronize authentic GitHub activity and repository metrics")
    parser.add_argument("--username", default=DEFAULT_USERNAME, help="GitHub username to sync")
    parser.add_argument("--build-step", action="store_true", help="Run as build-step: exit 0 gracefully on error if snapshot exists")
    parser.add_argument("--output", help="Custom output path for snapshot JSON")
    args = parser.parse_args()

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    public_data_dir = os.path.join(base_dir, "public", "data")
    os.makedirs(public_data_dir, exist_ok=True)

    snapshot_path = args.output or os.path.join(public_data_dir, "github-activity.json")

    try:
        snapshot = sync_github_data(args.username)
    except Exception as e:
        print(f"[GITHUB-SYNC ERROR] Synchronization failed: {e}")
        if args.build_step:
            if os.path.exists(snapshot_path):
                print(f"[BUILD-STEP] Existing valid snapshot at {snapshot_path} retained without failing build.")
                sys.exit(0)
            else:
                print(f"[BUILD-STEP ERROR] No existing snapshot found at {snapshot_path}.")
                sys.exit(1)
        sys.exit(1)

    # Atomic write to snapshot_path
    temp_snapshot = snapshot_path + ".tmp"
    with open(temp_snapshot, "w", encoding="utf-8") as f:
        json.dump(snapshot, f, indent=2, ensure_ascii=False)
    os.replace(temp_snapshot, snapshot_path)

    total_contribs = snapshot["contributions"]["total"]
    repos_count = snapshot["profile"]["publicRepos"]
    langs_count = len(snapshot["languages"])
    print(f"[GITHUB-SYNC SUCCESS] Saved atomic snapshot -> {snapshot_path}")
    print(f"[GITHUB-SYNC SUCCESS] Total Contributions (12mo): {total_contribs}")
    print(f"[GITHUB-SYNC SUCCESS] Public Repositories: {repos_count}")
    print(f"[GITHUB-SYNC SUCCESS] Top Languages: {langs_count} tracked")
    print(f"[GITHUB-SYNC SUCCESS] Selected Repositories: {len(snapshot['repositories'])} featured")
    print(f"[GITHUB-SYNC COMPLETE] All operations completed successfully.")

if __name__ == "__main__":
    main()
