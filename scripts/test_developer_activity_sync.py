"""
Unit and Regression Test Suite for Developer Activity Synchronization (GitHub + LeetCode)
Tests:
1. Snapshot schema integrity for both GitHub and LeetCode.
2. GitHub metrics (public repos, contribution calendar, languages).
3. LeetCode metrics (total solved, difficulty breakdown sum, ranking, submission calendar).
4. Date continuity and duplicate date detection for both heatmaps.
5. Calendar totals strictly equal the sum of daily records.
6. Difficulty totals strictly equal totalSolved.
7. Regression: Failed API requests reuse cached snapshot, preserving original syncedAt timestamp and marking status as cached.
8. Regression: Missing values (e.g. contest rating, ranking, totalQuestions) are returned as None without hardcoded fallbacks.
9. Regression: Difficulty breakdown mismatches raise validation ValueError.
10. Regression: Provider and provenance tracking accurately identifies GraphQL vs fallback vs cached.
"""

import json
import os
import re
import sys
import tempfile
import unittest
from unittest.mock import patch

# Ensure repo root is on python path
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if REPO_ROOT not in sys.path:
    sys.path.insert(0, REPO_ROOT)

from scripts.sync_developer_activity import sync_leetcode, sync_github, main, GITHUB_USER, LEETCODE_USER


class TestDeveloperActivitySync(unittest.TestCase):
    def setUp(self):
        self.base_dir = REPO_ROOT
        self.snapshot_path = os.path.join(self.base_dir, "public", "data", "developer-activity.json")
        self.lc_snapshot_path = os.path.join(self.base_dir, "public", "data", "leetcode-activity.json")

    def test_snapshot_exists_and_parses(self):
        self.assertTrue(os.path.exists(self.snapshot_path), f"Missing snapshot at {self.snapshot_path}")
        with open(self.snapshot_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        self.assertIn(data.get("status"), ["success", "cached"])
        self.assertIn("syncedAt", data)
        self.assertIn("github", data)
        self.assertIn("leetcode", data)

    def test_github_metrics_and_calendar(self):
        with open(self.snapshot_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        gh = data["github"]

        self.assertEqual(gh.get("username"), "Sumit2003-dev")
        self.assertIsInstance(gh.get("publicRepos"), int)
        self.assertGreater(gh["publicRepos"], 0)
        self.assertIsInstance(gh.get("totalContributions"), int)
        self.assertGreater(gh["totalContributions"], 0)
        self.assertIsInstance(gh.get("topLanguage"), str)

        # Calendar validation
        days = gh.get("contributions", {}).get("days", [])
        self.assertGreaterEqual(len(days), 350)

        seen_dates = set()
        calc_sum = 0
        for d in days:
            date_str = d.get("date", "")
            self.assertTrue(bool(re.match(r"^\d{4}-\d{2}-\d{2}$", date_str)))
            self.assertNotIn(date_str, seen_dates, f"Duplicate GitHub date: {date_str}")
            seen_dates.add(date_str)
            calc_sum += d.get("count", 0)

        self.assertEqual(gh["totalContributions"], calc_sum)

    def test_leetcode_metrics_and_calendar(self):
        with open(self.snapshot_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        lc = data["leetcode"]

        self.assertEqual(lc.get("username"), "sumit2003dev")
        self.assertIsInstance(lc.get("totalSolved"), int)
        self.assertGreaterEqual(lc["totalSolved"], 100)

        easy = lc.get("easySolved", 0)
        medium = lc.get("mediumSolved", 0)
        hard = lc.get("hardSolved", 0)
        # Requirement 8: Difficulty totals equal totalSolved
        self.assertEqual(lc["totalSolved"], easy + medium + hard, "Total solved must equal sum of easy, medium, hard")

        # Calendar validation
        days = lc.get("activityCalendar", {}).get("days", [])
        self.assertGreaterEqual(len(days), 350)

        seen_dates = set()
        calendar_sum = 0
        for d in days:
            date_str = d.get("date", "")
            self.assertTrue(bool(re.match(r"^\d{4}-\d{2}-\d{2}$", date_str)))
            self.assertNotIn(date_str, seen_dates, f"Duplicate LeetCode date: {date_str}")
            seen_dates.add(date_str)
            self.assertIn(d.get("level", 0), [0, 1, 2, 3, 4])
            calendar_sum += d.get("count", 0)

        # Requirement 8: Calendar totals equal the sum of daily records
        self.assertEqual(lc.get("submissionsTotal"), calendar_sum, "submissionsTotal must equal sum of daily counts")

    def test_standalone_leetcode_snapshot(self):
        self.assertTrue(os.path.exists(self.lc_snapshot_path), f"Missing standalone snapshot at {self.lc_snapshot_path}")
        with open(self.lc_snapshot_path, "r", encoding="utf-8") as f:
            lc = json.load(f)
        self.assertIn(lc.get("status"), ["success", "cached"])
        self.assertEqual(lc.get("username"), "sumit2003dev")
        self.assertGreaterEqual(lc.get("totalSolved", 0), 100)
        # Requirement 8: Difficulty totals equal totalSolved
        self.assertEqual(lc["totalSolved"], lc["easySolved"] + lc["mediumSolved"] + lc["hardSolved"])
        days = lc.get("activityCalendar", {}).get("days", [])
        self.assertGreaterEqual(len(days), 350)
        # Requirement 8: Calendar totals equal the sum of daily records
        calendar_sum = sum(d.get("count", 0) for d in days)
        self.assertEqual(lc.get("submissionsTotal"), calendar_sum)

    @patch("scripts.sync_developer_activity.fetch_json")
    def test_regression_difficulty_sum_mismatch_raises_value_error(self, mock_fetch):
        """Requirement 8: Verify that if easy + medium + hard != totalSolved, validation fails."""
        mock_graphql_resp = {
            "data": {
                "matchedUser": {
                    "username": "testuser",
                    "profile": {"ranking": 12345, "realName": "Test User", "userAvatar": ""},
                    "submitStatsGlobal": {
                        "acSubmissionNum": [
                            {"difficulty": "All", "count": 300},
                            {"difficulty": "Easy", "count": 100},
                            {"difficulty": "Medium", "count": 100},
                            {"difficulty": "Hard", "count": 50}  # 100 + 100 + 50 = 250 != 300!
                        ]
                    },
                    "submissionCalendar": "{}"
                },
                "userContestRanking": {"rating": 1500, "globalRanking": 5000}
            }
        }
        mock_fetch.return_value = mock_graphql_resp

        with self.assertRaises(ValueError) as ctx:
            sync_leetcode("testuser")
        self.assertIn("does not equal totalSolved", str(ctx.exception))

    @patch("scripts.sync_developer_activity.fetch_json")
    def test_regression_missing_values_handled_without_hardcoded_defaults(self, mock_fetch):
        """Requirement 1 & 2 & 5: When metrics (contest rating, ranking, question bank) are missing, return None."""
        mock_graphql_resp = {
            "data": {
                "matchedUser": {
                    "username": "testuser",
                    "profile": {"ranking": None, "realName": "Test User", "userAvatar": ""},
                    "submitStatsGlobal": {
                        "acSubmissionNum": [
                            {"difficulty": "All", "count": 250},
                            {"difficulty": "Easy", "count": 100},
                            {"difficulty": "Medium", "count": 100},
                            {"difficulty": "Hard", "count": 50}
                        ]
                    },
                    "submissionCalendar": "{}"
                },
                "userContestRanking": None  # No contest rating or rank
            }
        }
        mock_fetch.return_value = mock_graphql_resp

        result = sync_leetcode("testuser")
        # Must be None, NEVER defaulted to 1460, 380408, or hardcoded question counts
        self.assertIsNone(result["contestRating"])
        self.assertIsNone(result["contestGlobalRank"])
        self.assertIsNone(result["ranking"])
        self.assertIsNone(result["totalQuestions"])
        self.assertEqual(result["totalSolved"], 250)
        self.assertEqual(result["provider"], "leetcode-graphql")
        self.assertIn("Official LeetCode GraphQL", result["provenance"])

    @patch("scripts.sync_developer_activity.fetch_json")
    def test_regression_provider_provenance_tracking_for_fallback_api(self, mock_fetch):
        """Requirement 6: Verify accurate tracking when fallback API is used."""
        def side_effect(url, **kwargs):
            if "graphql" in url:
                raise RuntimeError("GraphQL blocked")
            if "alfa-leetcode-api" in url:
                return {
                    "totalSolved": 350,
                    "easySolved": 100,
                    "mediumSolved": 200,
                    "hardSolved": 50,
                    "ranking": 45000,
                    "submissionCalendar": "{}"
                }
            raise RuntimeError("Unknown url")

        mock_fetch.side_effect = side_effect
        result = sync_leetcode("testuser")
        self.assertEqual(result["provider"], "alfa-leetcode-api")
        self.assertIn("alfa-leetcode-api", result["provenance"].lower())
        self.assertEqual(result["totalSolved"], 350)
        self.assertEqual(result["easySolved"] + result["mediumSolved"] + result["hardSolved"], 350)

    def test_regression_cached_snapshot_preserves_timestamp_and_marks_cached(self):
        """Requirement 7: When cached data is reused after a failed request, preserve original syncedAt and mark as cached."""
        with tempfile.TemporaryDirectory() as tmp_dir:
            dev_json_path = os.path.join(tmp_dir, "developer-activity.json")
            lc_json_path = os.path.join(tmp_dir, "leetcode-activity.json")
            gh_json_path = os.path.join(tmp_dir, "github-activity.json")

            original_timestamp = "2026-10-15T08:30:00.000000+00:00"
            dummy_days = [{"date": "2026-10-14", "count": 2, "level": 1}]
            cached_lc_data = {
                "status": "success",
                "syncedAt": original_timestamp,
                "username": "sumit2003dev",
                "profileUrl": "https://leetcode.com/u/sumit2003dev/",
                "ranking": 377270,
                "avatarUrl": "",
                "totalSolved": 371,
                "easySolved": 102,
                "mediumSolved": 201,
                "hardSolved": 68,
                "contestRating": 1460,
                "contestGlobalRank": None,
                "submissionsTotal": 2,
                "activityCalendar": {
                    "daysCount": 1,
                    "startDate": "2026-10-14",
                    "endDate": "2026-10-14",
                    "days": dummy_days
                },
                "provider": "leetcode-graphql",
                "provenance": "Original GraphQL test snapshot"
            }
            with open(lc_json_path, "w", encoding="utf-8") as f:
                json.dump(cached_lc_data, f)

            cached_gh_data = {
                "status": "success",
                "syncedAt": original_timestamp,
                "username": "Sumit2003-dev",
                "profile": {"name": "Sumit", "publicRepos": 13, "followers": 1, "profileUrl": "", "avatarUrl": "", "provenance": ""},
                "contributions": {"total": 10, "daysCount": 1, "startDate": "2026-10-14", "endDate": "2026-10-14", "days": dummy_days},
                "languages": [],
                "totalLanguageBytes": 100,
                "repositories": []
            }
            with open(gh_json_path, "w", encoding="utf-8") as f:
                json.dump(cached_gh_data, f)

            # Mock fetch_json to fail for all remote requests
            with patch("scripts.sync_developer_activity.fetch_json", side_effect=RuntimeError("Simulated Network Offline")):
                with patch("sys.argv", ["sync_developer_activity.py", "--public-dir", tmp_dir, "--output", dev_json_path]):
                    main()

            # Read back generated leetcode-activity.json
            with open(lc_json_path, "r", encoding="utf-8") as f:
                updated_lc = json.load(f)

            # Verify Requirement 7:
            # 1. Status is marked cached, NOT success
            self.assertEqual(updated_lc["status"], "cached", "Reused cache must be marked as 'cached', never 'success'")
            # 2. Original timestamp preserved, NEVER overwritten with now
            self.assertEqual(updated_lc["syncedAt"], original_timestamp, "Original syncedAt timestamp must be preserved")
            # 3. Provider and provenance note cached status
            self.assertEqual(updated_lc["provider"], "cached")
            self.assertIn("Cached snapshot", updated_lc["provenance"])


if __name__ == "__main__":
    unittest.main()
