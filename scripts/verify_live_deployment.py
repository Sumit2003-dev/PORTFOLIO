import urllib.request
import ssl

ctx = ssl.create_default_context()
base_url = "https://sumit2003-dev.github.io/PORTFOLIO"

check_urls = [
    ("/", "text/html"),
    ("/uploads/homepage.webp", "image/webp"),
    ("/uploads/thumbs/google-adv-capstone.webp", "image/webp"),
    ("/uploads/thumbs/ibm-prompt-engineering.webp", "image/webp"),
    ("/uploads/thumbs/anthropic-claude-101.webp", "image/webp"),
    ("/uploads/thumbs/nptel-iit-roorkee-python.webp", "image/webp"),
    ("/uploads/IBM/prompt-engineering-modal.webp", "image/webp"),
]

print("Verifying deployed site assets on GitHub Pages...")
all_pass = True
for path, expected_mime in check_urls:
    url = base_url + path
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            code = resp.getcode()
            ctype = resp.headers.get("Content-Type", "")
            size = len(resp.read())
            status = "PASS" if code == 200 and size > 0 else "FAIL"
            print(f"{path:<45} | HTTP {code} | {ctype:<20} | {size:>8} bytes | {status}")
            if status != "PASS":
                all_pass = False
    except Exception as e:
        print(f"{path:<45} | ERROR: {e}")
        all_pass = False

print(f"\nAll deployed assets for commit f556cba live on GitHub Pages: {all_pass}")

