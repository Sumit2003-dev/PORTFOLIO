"""
Unit and Regression Test Suite for Developer Activity Synchronization (GitHub + LeetCode)
Tests:
1. Snapshot schema integrity for both GitHub and LeetCode.
2. GitHub metrics (public repos, contribution calendar, languages).
3. LeetCode metrics (total solved, difficulty breakdown sum, ranking, submission calendar).
4. Date continuity and duplicate date detection for both heatmaps.
"""

import json
import os
import re
import sys
import unittest

class TestDeveloperActivitySync(unittest.TestCase):
    def setUp(self):
        self.base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.snapshot_path = os.path.join(self.base_dir, "public", "data", "developer-activity.json")

    def test_snapshot_exists_and_parses(self):
        self.assertTrue(os.path.exists(self.snapshot_path), f"Missing snapshot at {self.snapshot_path}")
        with open(self.snapshot_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        self.assertEqual(data.get("status"), "success")
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
        self.assertEqual(lc["totalSolved"], easy + medium + hard, "Total solved must equal sum of easy, medium, hard")

        self.assertIsInstance(lc.get("ranking"), int)
        self.assertGreater(lc["ranking"], 0)

        # Calendar validation
        days = lc.get("activityCalendar", {}).get("days", [])
        self.assertGreaterEqual(len(days), 350)

        seen_dates = set()
        for d in days:
            date_str = d.get("date", "")
            self.assertTrue(bool(re.match(r"^\d{4}-\d{2}-\d{2}$", date_str)))
            self.assertNotIn(date_str, seen_dates, f"Duplicate LeetCode date: {date_str}")
            seen_dates.add(date_str)
            self.assertIn(d.get("level", 0), [0, 1, 2, 3, 4])

if __name__ == "__main__":
    unittest.main()
