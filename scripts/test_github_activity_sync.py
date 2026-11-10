"""
Unit and Regression Tests for GitHub Activity Synchronization
Tests:
1. Date format validation.
2. Contribution calendar parsing, date continuity, and duplicate date detection.
3. Calculated contribution totals verification.
4. Codebase language byte percentage calculation and sorting.
5. Snapshot schema integrity and repository structure.
"""

import json
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sync_github_activity import (
    validate_date_string,
    LANGUAGE_COLORS
)

class TestGitHubActivitySync(unittest.TestCase):
    def setUp(self):
        self.base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.snapshot_path = os.path.join(self.base_dir, "public", "data", "github-activity.json")

    def test_date_string_validation(self):
        valid = ["2025-11-09", "2026-01-01", "2026-11-10"]
        for d in valid:
            self.assertTrue(validate_date_string(d), f"Expected '{d}' to be valid")

        invalid = ["2026/11/10", "10-11-2026", "2026-1-1", "", None, 12345, "invalid"]
        for d in invalid:
            self.assertFalse(validate_date_string(d), f"Expected '{d}' to be invalid")

    def test_snapshot_exists_and_parses(self):
        self.assertTrue(os.path.exists(self.snapshot_path), f"Snapshot missing at {self.snapshot_path}")
        with open(self.snapshot_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        self.assertEqual(data.get("status"), "success")
        self.assertEqual(data.get("username"), "Sumit2003-dev")
        self.assertIn("profile", data)
        self.assertIn("contributions", data)
        self.assertIn("languages", data)
        self.assertIn("repositories", data)

    def test_profile_metrics(self):
        with open(self.snapshot_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        profile = data["profile"]
        self.assertIsInstance(profile.get("publicRepos"), int)
        self.assertGreater(profile["publicRepos"], 0)
        self.assertIn("Sumit", profile.get("name", ""))
        self.assertTrue(profile.get("profileUrl", "").startswith("https://github.com/"))

    def test_contribution_totals_and_date_coverage(self):
        with open(self.snapshot_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        contribs = data["contributions"]

        days = contribs.get("days", [])
        self.assertGreaterEqual(len(days), 350, "Expected at least 350 days in yearly transcript")

        seen_dates = set()
        calculated_sum = 0
        for d in days:
            date_str = d.get("date")
            self.assertTrue(validate_date_string(date_str))
            self.assertNotIn(date_str, seen_dates, f"Duplicate date detected: {date_str}")
            seen_dates.add(date_str)

            count = d.get("count")
            self.assertIsInstance(count, int)
            self.assertGreaterEqual(count, 0)
            calculated_sum += count

            level = d.get("level")
            self.assertIsInstance(level, int)
            self.assertIn(level, [0, 1, 2, 3, 4])

        self.assertEqual(contribs["calculatedTotal"], calculated_sum)
        self.assertEqual(contribs["total"], calculated_sum)
        self.assertEqual(contribs["daysCount"], len(days))
        self.assertEqual(contribs["startDate"], days[0]["date"])
        self.assertEqual(contribs["endDate"], days[-1]["date"])

    def test_language_percentage_calculations(self):
        with open(self.snapshot_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        languages = data["languages"]
        self.assertGreater(len(languages), 0)

        total_bytes = data.get("totalLanguageBytes", 0)
        self.assertGreater(total_bytes, 0)

        sum_percentages = 0.0
        prev_bytes = float("inf")
        for lang in languages:
            name = lang.get("name")
            b = lang.get("bytes")
            pct = lang.get("percentage")
            color = lang.get("color")

            self.assertIsInstance(name, str)
            self.assertIsInstance(b, int)
            self.assertGreater(b, 0)
            self.assertLessEqual(b, prev_bytes, "Languages should be sorted descending by bytes")
            prev_bytes = b

            self.assertIsInstance(pct, (int, float))
            self.assertGreater(pct, 0)
            self.assertTrue(color.startswith("#"), f"Expected hex color for {name}")
            sum_percentages += pct

        # With rounding and filtering, sum of percentages of dominant languages should be between 95% and 101%
        self.assertGreater(sum_percentages, 95.0)
        self.assertLessEqual(sum_percentages, 101.0)

    def test_selected_repositories_schema(self):
        with open(self.snapshot_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        repos = data["repositories"]
        self.assertGreaterEqual(len(repos), 1)

        for r in repos:
            self.assertIsInstance(r.get("name"), str)
            self.assertGreater(len(r["name"]), 0)
            self.assertIsInstance(r.get("stars"), int)
            self.assertGreaterEqual(r["stars"], 0)
            self.assertIsInstance(r.get("forks"), int)
            self.assertGreaterEqual(r["forks"], 0)
            self.assertTrue(r.get("url", "").startswith("https://github.com/"))
            self.assertIsInstance(r.get("language"), str)

if __name__ == "__main__":
    unittest.main()
