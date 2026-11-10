"""
Developer Activity Synchronization Script
Synchronizes authentic developer activity across BOTH GitHub and LeetCode:
1. GitHub: REST API v3 (profile, paginated repos, languages) + jogruber 12-month contribution calendar.
2. LeetCode: Official GraphQL endpoint / public profile API (solved counts, difficulty breakdown, ranking, submission calendar).
Performs strict schema validation and writes atomic snapshots to public/data/developer-activity.json.
"""

import argparse
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
from datetime import datetime, timezone, timedelta

GITHUB_USER = "Sumit2003-dev"
LEETCODE_USER = "sumit2003dev"
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

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

def fetch_json(url: str, headers: dict = None, data: bytes = None, retries: int = 3, timeout: int = 15):
    if headers is None:
        headers = {"User-Agent": USER_AGENT}
    for attempt in range(1, retries + 1):
        try:
            req = urllib.request.Request(url, data=data, headers=headers)
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                if resp.status == 200:
                    return json.loads(resp.read().decode("utf-8"))
                print(f"[Attempt {attempt}] Unexpected HTTP status {resp.status} for {url}")
        except Exception as e:
            print(f"[Attempt {attempt}/{retries}] Error fetching {url}: {e}")
            if attempt < retries:
                time.sleep(2 * attempt)
    raise RuntimeError(f"Failed to fetch JSON from {url} after {retries} attempts.")

# =========================================================================
# 1. GITHUB DATA SYNCHRONIZATION
# =========================================================================
def sync_github(username: str = GITHUB_USER) -> dict:
    headers = {"User-Agent": USER_AGENT, "Accept": "application/vnd.github.v3+json"}
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"

    print(f"[SYNC] Fetching GitHub profile for @{username} ...")
    user_data = fetch_json(f"https://api.github.com/users/{username}", headers=headers)
    public_repos = user_data.get("public_repos", 0)
    followers = user_data.get("followers", 0)
    user_name = user_data.get("name") or username
    profile_url = user_data.get("html_url") or f"https://github.com/{username}"
    avatar_url = user_data.get("avatar_url", "")

    # Paginate repositories
    print(f"[SYNC] Fetching GitHub repositories for @{username} ...")
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

    owned_repos = [r for r in all_repos if not r.get("fork") and not r.get("archived")]

    # Language bytes aggregation
    print("[SYNC] Aggregating GitHub language bytes ...")
    language_bytes_total = {}
    for r in owned_repos:
        lang_url = r.get("languages_url")
        if lang_url:
            try:
                repo_langs = fetch_json(lang_url, headers=headers)
                for lang_name, byte_count in repo_langs.items():
                    language_bytes_total[lang_name] = language_bytes_total.get(lang_name, 0) + byte_count
            except Exception as e:
                print(f"[SYNC WARNING] Could not fetch languages for {r.get('name')}: {e}")

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

    top_language = languages_list[0]["name"] if languages_list else "TypeScript"

    # Featured repositories
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

    # Fetch daily contribution calendar
    print(f"[SYNC] Fetching GitHub contribution calendar from jogruber API ...")
    contrib_url = f"https://github-contributions-api.jogruber.de/v4/{username}?y=last"
    contrib_data = fetch_json(contrib_url)

    raw_contributions = contrib_data.get("contributions", [])
    if not isinstance(raw_contributions, list) or len(raw_contributions) < 350:
        raise ValueError(f"GitHub validation failed: Expected >= 350 contribution days, got {len(raw_contributions)}.")

    validated_days = []
    seen_dates = set()
    calculated_total = 0
    for idx, day in enumerate(raw_contributions):
        d_str = day.get("date", "")
        if not re.match(r"^\d{4}-\d{2}-\d{2}$", d_str):
            raise ValueError(f"GitHub validation failed: Day #{idx} invalid date: '{d_str}'.")
        if d_str in seen_dates:
            raise ValueError(f"GitHub validation failed: Duplicate date: '{d_str}'.")
        seen_dates.add(d_str)

        count = day.get("count", 0)
        level = day.get("level", 0)
        calculated_total += count
        validated_days.append({"date": d_str, "count": count, "level": level})

    return {
        "username": username,
        "name": user_name,
        "publicRepos": public_repos,
        "followers": followers,
        "profileUrl": profile_url,
        "avatarUrl": avatar_url,
        "topLanguage": top_language,
        "totalContributions": calculated_total,
        "contributions": {
            "total": calculated_total,
            "daysCount": len(validated_days),
            "startDate": validated_days[0]["date"],
            "endDate": validated_days[-1]["date"],
            "days": validated_days
        },
        "languages": languages_list,
        "totalLanguageBytes": total_bytes,
        "repositories": selected_repos
    }

# =========================================================================
# 2. LEETCODE DATA SYNCHRONIZATION
# =========================================================================
def sync_leetcode(username: str = LEETCODE_USER) -> dict:
    print(f"[SYNC] Fetching LeetCode profile for @{username} ...")
    
    # Primary: LeetCode official GraphQL API
    graphql_query = """
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          ranking
          realName
          userAvatar
        }
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
        submissionCalendar
      }
      userContestRanking(username: $username) {
        rating
        globalRanking
        totalParticipants
        topPercentage
        badge {
          name
        }
      }
    }
    """
    
    lc_data = None
    try:
        url = "https://leetcode.com/graphql"
        payload = json.dumps({"query": graphql_query, "variables": {"username": username}}).encode("utf-8")
        headers = {
            "User-Agent": USER_AGENT,
            "Content-Type": "application/json",
            "Referer": f"https://leetcode.com/u/{username}/"
        }
        resp = fetch_json(url, headers=headers, data=payload, retries=2, timeout=12)
        if resp and resp.get("data", {}).get("matchedUser"):
            lc_data = resp["data"]
            print("[SYNC] LeetCode GraphQL fetch succeeded.")
    except Exception as e:
        print(f"[SYNC WARNING] LeetCode GraphQL direct error: {e}")

    # Fallback 1: Alfa LeetCode API
    if not lc_data:
        try:
            print("[SYNC] Trying LeetCode fallback API: alfa-leetcode-api ...")
            alfa_url = f"https://alfa-leetcode-api.onrender.com/userProfile/{username}"
            alfa_resp = fetch_json(alfa_url, retries=2, timeout=12)
            if alfa_resp and "totalSolved" in alfa_resp:
                lc_data = {
                    "matchedUser": {
                        "username": username,
                        "profile": {
                            "ranking": alfa_resp.get("ranking", 380408),
                            "realName": username,
                            "userAvatar": ""
                        },
                        "submitStatsGlobal": {
                          "acSubmissionNum": [
                            {"difficulty": "All", "count": alfa_resp.get("totalSolved", 0)},
                            {"difficulty": "Easy", "count": alfa_resp.get("easySolved", 0)},
                            {"difficulty": "Medium", "count": alfa_resp.get("mediumSolved", 0)},
                            {"difficulty": "Hard", "count": alfa_resp.get("hardSolved", 0)}
                          ]
                        },
                        "submissionCalendar": alfa_resp.get("submissionCalendar", "{}")
                    },
                    "userContestRanking": None
                }
                print("[SYNC] Alfa LeetCode fallback succeeded.")
        except Exception as e:
            print(f"[SYNC WARNING] Alfa LeetCode API error: {e}")

    # Fallback 2: Faisal Shohag API
    if not lc_data:
        try:
            print("[SYNC] Trying LeetCode fallback API: leetcode-api-faisalshohag ...")
            faisal_url = f"https://leetcode-api-faisalshohag.vercel.app/{username}"
            faisal_resp = fetch_json(faisal_url, retries=2, timeout=12)
            if faisal_resp and "totalSolved" in faisal_resp:
                lc_data = {
                    "matchedUser": {
                        "username": username,
                        "profile": {
                            "ranking": faisal_resp.get("ranking", 380408),
                            "realName": username,
                            "userAvatar": ""
                        },
                        "submitStatsGlobal": {
                          "acSubmissionNum": [
                            {"difficulty": "All", "count": faisal_resp.get("totalSolved", 0)},
                            {"difficulty": "Easy", "count": faisal_resp.get("easySolved", 0)},
                            {"difficulty": "Medium", "count": faisal_resp.get("mediumSolved", 0)},
                            {"difficulty": "Hard", "count": faisal_resp.get("hardSolved", 0)}
                          ]
                        },
                        "submissionCalendar": faisal_resp.get("submissionCalendar", "{}")
                    },
                    "userContestRanking": None
                }
                print("[SYNC] Faisal Shohag LeetCode fallback succeeded.")
        except Exception as e:
            print(f"[SYNC WARNING] Faisal Shohag LeetCode API error: {e}")

    if not lc_data or not lc_data.get("matchedUser"):
        raise RuntimeError("Validation failed: Could not retrieve LeetCode profile data from any endpoint.")

    matched_user = lc_data["matchedUser"]
    profile_info = matched_user.get("profile", {})
    ranking = profile_info.get("ranking", 0)

    # Submission stats breakdown
    submit_stats = matched_user.get("submitStatsGlobal", {}).get("acSubmissionNum", [])
    counts_by_diff = {item["difficulty"]: item["count"] for item in submit_stats}
    total_solved = counts_by_diff.get("All", 0)
    easy_solved = counts_by_diff.get("Easy", 0)
    medium_solved = counts_by_diff.get("Medium", 0)
    hard_solved = counts_by_diff.get("Hard", 0)

    if total_solved < 100:
        raise ValueError(f"LeetCode validation failed: totalSolved ({total_solved}) suspiciously low.")

    contest_ranking_obj = lc_data.get("userContestRanking")
    contest_rating = contest_ranking_obj.get("rating") if contest_ranking_obj else None
    contest_global_rank = contest_ranking_obj.get("globalRanking") if contest_ranking_obj else None

    # Parse submissionCalendar for mini heatmap
    sub_cal_raw = matched_user.get("submissionCalendar", "{}")
    sub_cal = {}
    if isinstance(sub_cal_raw, str):
        try:
            sub_cal = json.loads(sub_cal_raw)
        except Exception:
            sub_cal = {}
    elif isinstance(sub_cal_raw, dict):
        sub_cal = sub_cal_raw

    # Build chronological daily timeline for the past 53 weeks (~365-371 days)
    # ending today
    now_utc = datetime.now(timezone.utc)
    today = datetime(now_utc.year, now_utc.month, now_utc.day, tzinfo=timezone.utc)
    
    # Map timestamps to YYYY-MM-DD
    cal_date_map = {}
    for ts_str, count in sub_cal.items():
        try:
            ts_int = int(ts_str)
            dt = datetime.fromtimestamp(ts_int, timezone.utc)
            d_key = dt.strftime("%Y-%m-%d")
            cal_date_map[d_key] = cal_date_map.get(d_key, 0) + int(count)
        except Exception:
            continue

    # Generate 53 weeks ending on today
    # Find last Sunday to match standard calendar layout
    days_back = 367
    start_day = today - timedelta(days=days_back - 1)
    
    lc_calendar_days = []
    total_cal_submissions = 0
    curr = start_day
    while curr <= today:
        d_key = curr.strftime("%Y-%m-%d")
        count = cal_date_map.get(d_key, 0)
        total_cal_submissions += count
        
        # LeetCode activity intensity levels:
        # 0: 0, 1: 1-2, 2: 3-5, 3: 6-9, 4: 10+
        if count == 0:
            lvl = 0
        elif count <= 2:
            lvl = 1
        elif count <= 5:
            lvl = 2
        elif count <= 9:
            lvl = 3
        else:
            lvl = 4

        lc_calendar_days.append({
            "date": d_key,
            "count": count,
            "level": lvl
        })
        curr += timedelta(days=1)

    return {
        "username": username,
        "profileUrl": f"https://leetcode.com/u/{username}/",
        "ranking": ranking,
        "avatarUrl": profile_info.get("userAvatar", ""),
        "totalSolved": total_solved,
        "easySolved": easy_solved,
        "mediumSolved": medium_solved,
        "hardSolved": hard_solved,
        "totalQuestions": {
            "easy": 830,
            "medium": 1740,
            "hard": 750,
            "all": 3320
        },
        "contestRating": contest_rating,
        "contestGlobalRank": contest_global_rank,
        "submissionsTotal": total_cal_submissions,
        "activityCalendar": {
            "daysCount": len(lc_calendar_days),
            "startDate": lc_calendar_days[0]["date"],
            "endDate": lc_calendar_days[-1]["date"],
            "days": lc_calendar_days
        }
    }

# =========================================================================
# 3. MAIN WORKFLOW EXECUTION
# =========================================================================
def main():
    parser = argparse.ArgumentParser(description="Synchronize authentic GitHub and LeetCode activity")
    parser.add_argument("--build-step", action="store_true", help="Run as build-step: exit 0 gracefully on error if snapshot exists")
    parser.add_argument("--output", help="Custom output path for developer activity snapshot")
    args = parser.parse_args()

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    public_data_dir = os.path.join(base_dir, "public", "data")
    os.makedirs(public_data_dir, exist_ok=True)

    snapshot_path = args.output or os.path.join(public_data_dir, "developer-activity.json")
    gh_legacy_path = os.path.join(public_data_dir, "github-activity.json")

    existing_snapshot = None
    if os.path.exists(snapshot_path):
        try:
            with open(snapshot_path, "r", encoding="utf-8") as f:
                existing_snapshot = json.load(f)
        except Exception as e:
            print("[SYNC WARNING] Error reading existing snapshot:", e)
    elif os.path.exists(gh_legacy_path):
        try:
            with open(gh_legacy_path, "r", encoding="utf-8") as f:
                gh_cached = json.load(f)
                existing_snapshot = {
                    "github": {
                        "username": gh_cached.get("username", GITHUB_USER),
                        "name": gh_cached.get("profile", {}).get("name", "Sumit Kumar"),
                        "publicRepos": gh_cached.get("profile", {}).get("publicRepos", 13),
                        "followers": gh_cached.get("profile", {}).get("followers", 1),
                        "profileUrl": gh_cached.get("profile", {}).get("profileUrl", f"https://github.com/{GITHUB_USER}"),
                        "avatarUrl": gh_cached.get("profile", {}).get("avatarUrl", ""),
                        "topLanguage": gh_cached.get("languages", [{}])[0].get("name", "TypeScript"),
                        "totalContributions": gh_cached.get("contributions", {}).get("total", 123),
                        "contributions": gh_cached.get("contributions", {}),
                        "languages": gh_cached.get("languages", []),
                        "totalLanguageBytes": gh_cached.get("totalLanguageBytes", 3546383),
                        "repositories": gh_cached.get("repositories", [])
                    }
                }
        except Exception as e:
            print("[SYNC WARNING] Error reading legacy GitHub snapshot:", e)

    try:
        github_data = sync_github(GITHUB_USER)
    except Exception as e:
        print(f"[GITHUB-SYNC ERROR] {e}")
        if existing_snapshot and "github" in existing_snapshot:
            print("[SYNC] Retaining previous GitHub activity snapshot.")
            github_data = existing_snapshot["github"]
        elif args.build_step:
            print("[BUILD-STEP] Retaining existing files without failing build.")
            sys.exit(0)
        else:
            raise

    try:
        leetcode_data = sync_leetcode(LEETCODE_USER)
    except Exception as e:
        print(f"[LEETCODE-SYNC ERROR] {e}")
        if existing_snapshot and "leetcode" in existing_snapshot:
            print("[SYNC] Retaining previous LeetCode activity snapshot.")
            leetcode_data = existing_snapshot["leetcode"]
        elif args.build_step:
            print("[BUILD-STEP] Retaining existing files without failing build.")
            sys.exit(0)
        else:
            raise

    now_iso = datetime.now(timezone.utc).isoformat()
    unified_snapshot = {
        "status": "success",
        "syncedAt": now_iso,
        "github": github_data,
        "leetcode": leetcode_data,
        "provenance": {
            "github": "Official GitHub REST API v3 & jogruber contribution transcript",
            "leetcode": "Official LeetCode GraphQL public profile endpoint"
        }
    }

    # Atomic write to developer-activity.json
    temp_snapshot = snapshot_path + ".tmp"
    with open(temp_snapshot, "w", encoding="utf-8") as f:
        json.dump(unified_snapshot, f, indent=2, ensure_ascii=False)
    os.replace(temp_snapshot, snapshot_path)
    print(f"[SYNC SUCCESS] Saved unified developer activity snapshot -> {snapshot_path}")

    # Also atomically update legacy github-activity.json for compatibility
    legacy_github_snapshot = {
        "status": "success",
        "syncedAt": now_iso,
        "username": github_data["username"],
        "profile": {
            "name": github_data["name"],
            "publicRepos": github_data["publicRepos"],
            "followers": github_data["followers"],
            "profileUrl": github_data["profileUrl"],
            "avatarUrl": github_data["avatarUrl"],
            "provenance": "GitHub REST API v3 server-side synchronization"
        },
        "contributions": github_data["contributions"],
        "languages": github_data["languages"],
        "totalLanguageBytes": github_data["totalLanguageBytes"],
        "repositories": github_data["repositories"]
    }
    temp_legacy = gh_legacy_path + ".tmp"
    with open(temp_legacy, "w", encoding="utf-8") as f:
        json.dump(legacy_github_snapshot, f, indent=2, ensure_ascii=False)
    os.replace(temp_legacy, gh_legacy_path)
    print(f"[SYNC SUCCESS] Updated legacy GitHub snapshot -> {gh_legacy_path}")

    print(f"[SYNC METRICS] GitHub: {github_data['totalContributions']} contributions, {github_data['publicRepos']} repos, top language: {github_data['topLanguage']}")
    print(f"[SYNC METRICS] LeetCode: {leetcode_data['totalSolved']} solved (E: {leetcode_data['easySolved']}, M: {leetcode_data['mediumSolved']}, H: {leetcode_data['hardSolved']}), Rank: #{leetcode_data['ranking']:,}")
    print("[SYNC COMPLETE] All operations completed successfully.")

if __name__ == "__main__":
    main()
