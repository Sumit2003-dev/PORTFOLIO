"""
Unit and Regression Test Suite for Google Skills Boost Synchronization Improvements
Tests:
1. Strict HTTPS URL validation (valid https, invalid http, empty, malformed).
2. Badge parsing enforcement of HTTPS verification and image URLs.
3. Scoped TypeScript metric updates in skillsBoostStats without mutating unrelated objects.
4. Safe failure on corrupted or missing target blocks.
"""

import os
import re
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from bs4 import BeautifulSoup
from sync_skills_profile import (
    is_valid_https_url,
    parse_profile,
    update_google_developer_data_file,
    PRIVATE_DASHBOARD
)

class TestStrictHttpsValidation(unittest.TestCase):
    def test_valid_https_urls(self):
        valid_urls = [
            "https://www.skills.google/public_profiles/d8429119/badges/12345",
            "https://cdn.qwiklabs.com/K%2BnnNq330QsP7umOZxxUbiADWPm1JpailDKupQeV9EU%3D",
            "https://example.com/badge.png",
            "https://sub.domain.co.uk/path/to/resource?query=1&b=2#frag",
        ]
        for url in valid_urls:
            with self.subTest(url=url):
                self.assertTrue(is_valid_https_url(url), f"Expected '{url}' to be valid HTTPS")

    def test_invalid_http_urls(self):
        http_urls = [
            "http://www.skills.google/public_profiles/d8429119/badges/12345",
            "http://cdn.qwiklabs.com/image.png",
            "http://localhost:3000/badge.png",
        ]
        for url in http_urls:
            with self.subTest(url=url):
                self.assertFalse(is_valid_https_url(url), f"Expected '{url}' to be rejected (HTTP)")

    def test_empty_and_whitespace_urls(self):
        invalid_empty = ["", "   ", None, False, 123]
        for val in invalid_empty:
            with self.subTest(val=val):
                self.assertFalse(is_valid_https_url(val), f"Expected '{val}' to be rejected")

    def test_malformed_and_non_https_schemes(self):
        malformed_urls = [
            "https://",
            "https://   ",
            "ftp://files.example.com/badge.png",
            "//cdn.qwiklabs.com/image.png",
            "javascript:alert(1)",
            "file:///C:/path/to/badge.png",
            "not-a-valid-url",
            "https:example.com/no-slashes",
        ]
        for url in malformed_urls:
            with self.subTest(url=url):
                self.assertFalse(is_valid_https_url(url), f"Expected '{url}' to be rejected")


class TestParserHttpsEnforcement(unittest.TestCase):
    def _create_mock_html(self, badge_href: str, badge_img: str, count: int = 150) -> str:
        badges_html = []
        for i in range(1, count + 1):
            href = badge_href if i == 1 else f"https://www.skills.google/public_profiles/test/badges/{1000 + i}"
            img = badge_img if i == 1 else f"https://cdn.qwiklabs.com/img{i}.png"
            badges_html.append(f"""
            <div class="profile-badge">
                <a href="{href}"><img src="{img}"></a>
                <span class="ql-title-medium">Badge Title {i}</span>
                <span class="ql-body-medium">Earned Nov 10, 2026</span>
            </div>
            """)
        return f"""
        <html>
            <body>
                <h1>Sumit Bharti</h1>
                <div class="profile-league">
                    <h2>Diamond League</h2>
                    <strong>48,079 Arcade Points</strong>
                </div>
                <div class="profile-badges">
                    {''.join(badges_html)}
                </div>
            </body>
        </html>
        """

    def test_parser_accepts_valid_https_badges(self):
        html = self._create_mock_html(
            badge_href="https://www.skills.google/public_profiles/test/badges/1001",
            badge_img="https://cdn.qwiklabs.com/valid.png",
            count=150
        )
        snapshot = parse_profile(html)
        self.assertEqual(snapshot["status"], "success")
        self.assertEqual(snapshot["profile"]["totalBadges"], 150)
        self.assertEqual(snapshot["badges"][0]["verificationUrl"], "https://www.skills.google/public_profiles/test/badges/1001")
        self.assertEqual(snapshot["badges"][0]["imageUrl"], "https://cdn.qwiklabs.com/valid.png")

    def test_parser_rejects_http_verification_url(self):
        html = self._create_mock_html(
            badge_href="http://www.skills.google/public_profiles/test/badges/1001",
            badge_img="https://cdn.qwiklabs.com/valid.png",
            count=150
        )
        with self.assertRaises(ValueError) as ctx:
            parse_profile(html)
        self.assertIn("non-HTTPS verification URL", str(ctx.exception))

    def test_parser_rejects_http_image_url(self):
        html = self._create_mock_html(
            badge_href="https://www.skills.google/public_profiles/test/badges/1001",
            badge_img="http://cdn.qwiklabs.com/insecure.png",
            count=150
        )
        with self.assertRaises(ValueError) as ctx:
            parse_profile(html)
        self.assertIn("non-HTTPS image URL", str(ctx.exception))

    def test_parser_rejects_malformed_url(self):
        html = self._create_mock_html(
            badge_href="https://",
            badge_img="https://cdn.qwiklabs.com/valid.png",
            count=150
        )
        with self.assertRaises(ValueError):
            parse_profile(html)


class TestScopedTypeScriptMetricUpdates(unittest.TestCase):
    def test_scoped_replacement_preserves_unrelated_objects(self):
        initial_ts = """// Leading header comment
export interface OtherInterface {
  skillBadges?: number;
  points?: number;
  league?: string;
}

// Unrelated object BEFORE target
export const gamingStats = {
  skillBadges: 42,
  points: 99999,
  league: "Master Tier",
  comment: "This must never be modified",
};

/* ========================================================================
   1. Google Cloud Skills Boost Snapshot Metrics (November 2026)
   ======================================================================== */
export const skillsBoostStats = {
  skillBadges: 100,
  points: 20000,
  league: "Silver League",
  streakDays: 12,
  leaguePosition: 18,
  lastVerified: "November 2026",
  provenance: "Server-side synchronization snapshot from public profile",
  profileUrl: "https://www.skills.google/public_profiles/d8429119-44bb-443a-8563-87b7953f74e9",
  credlyUrl: "https://www.credly.com/users/sumitdev2003/badges",
};

// Unrelated object AFTER target
export const communityStats = {
  skillBadges: 777,
  points: 54321,
  league: "Grandmaster League",
  notes: "Also must remain untouched",
};
"""
        with tempfile.NamedTemporaryFile("w+", delete=False, suffix=".ts", encoding="utf-8") as tmp:
            tmp.write(initial_ts)
            tmp_path = tmp.name

        try:
            # Run scoped updater
            res = update_google_developer_data_file(
                tmp_path,
                total_badges=181,
                points=48079,
                league="Diamond League"
            )
            self.assertTrue(res, "Update should return True when changes occur")

            with open(tmp_path, "r", encoding="utf-8") as f:
                updated_ts = f.read()

            # 1. Verify skillsBoostStats was properly updated
            self.assertIn("export const skillsBoostStats = {", updated_ts)
            skills_block_match = re.search(r"export const skillsBoostStats = \{([\s\S]*?)\};", updated_ts)
            self.assertIsNotNone(skills_block_match)
            skills_block = skills_block_match.group(1)

            self.assertIn("skillBadges: 181,", skills_block)
            self.assertIn("points: 48079,", skills_block)
            self.assertIn('league: "Diamond League",', skills_block)
            self.assertIn("streakDays: 12,", skills_block)
            self.assertIn("leaguePosition: 18,", skills_block)
            self.assertIn('lastVerified: "November 2026",', skills_block)

            # 2. Verify unrelated gamingStats remains 100% UNCHANGED
            self.assertIn("skillBadges: 42,", updated_ts)
            self.assertIn("points: 99999,", updated_ts)
            self.assertIn('league: "Master Tier",', updated_ts)
            self.assertIn('"This must never be modified"', updated_ts)

            # 3. Verify unrelated communityStats remains 100% UNCHANGED
            self.assertIn("skillBadges: 777,", updated_ts)
            self.assertIn("points: 54321,", updated_ts)
            self.assertIn('league: "Grandmaster League",', updated_ts)
            self.assertIn('"Also must remain untouched"', updated_ts)

            # 4. Running again with identical values returns False (no-op)
            res_noop = update_google_developer_data_file(
                tmp_path,
                total_badges=181,
                points=48079,
                league="Diamond League"
            )
            self.assertFalse(res_noop, "Update should return False when data is identical")

        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)

    def test_safe_failure_on_missing_target(self):
        missing_ts = """
export const someOtherConfig = {
  title: "Test",
};
"""
        with tempfile.NamedTemporaryFile("w+", delete=False, suffix=".ts", encoding="utf-8") as tmp:
            tmp.write(missing_ts)
            tmp_path = tmp.name

        try:
            res = update_google_developer_data_file(tmp_path, 181, 48079, "Diamond League")
            self.assertFalse(res, "Should fail safely and return False when target object is missing")
            with open(tmp_path, "r", encoding="utf-8") as f:
                content = f.read()
            self.assertEqual(content, missing_ts, "File content should remain unaltered")
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)

    def test_real_file_schema_scoped_update(self):
        real_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "src", "lib", "googleDeveloperData.ts")
        self.assertTrue(os.path.exists(real_path), f"File {real_path} must exist")
        with open(real_path, "r", encoding="utf-8") as f:
            original_content = f.read()

        with tempfile.NamedTemporaryFile("w+", delete=False, suffix=".ts", encoding="utf-8") as tmp:
            tmp.write(original_content)
            tmp_path = tmp.name

        try:
            # Update with simulated new metrics
            res = update_google_developer_data_file(tmp_path, total_badges=185, points=49999, league="Ruby League")
            self.assertTrue(res, "Update on real schema must succeed")

            with open(tmp_path, "r", encoding="utf-8") as f:
                new_content = f.read()

            # Ensure skillsBoostStats was updated
            self.assertIn("skillBadges: 185,", new_content)
            self.assertIn("points: 49999,", new_content)
            self.assertIn('league: "Ruby League",', new_content)

            # Ensure all other objects (e.g. googleDevProgram, gdgLucknow, googleDevBadges) remain identical
            self.assertIn('membershipTier: "Premium Member",', new_content)
            self.assertIn('totalBadges: 15,', new_content)
            self.assertIn('chapterName: "Google Developer Group (GDG) Lucknow",', new_content)
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)


if __name__ == "__main__":
    unittest.main()
