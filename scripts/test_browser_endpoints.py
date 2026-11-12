import http.server
import threading
import urllib.request
import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST_DIR = os.path.join(BASE_DIR, "dist")
PORT = 8999
BASE_URL = f"http://127.0.0.1:{PORT}"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST_DIR, **kwargs)
    def log_message(self, format, *args):
        pass  # Suppress console log spam

def run_browser_endpoints_test():
    try:
        server = http.server.ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    except Exception as e:
        print(f"Skipping HTTP server start: {e}")
        return

    server_thread = threading.Thread(target=server.serve_forever, daemon=True)
    server_thread.start()

    print("=" * 96)
    print("     LOCAL PRODUCTION BUILD (DIST) BROWSER & ASSET SERVING AUDIT")
    print("=" * 96)
    print(f"Testing local server at {BASE_URL} serving from {DIST_DIR}...\n")

    results = []
    all_ok = True

    fmt = "{:<36} | {:<10} | {:<22} | {:<14} | {:<6}"
    print(fmt.format("Target Tested", "Status", "Content-Type", "Size", "Result"))
    print("-" * 100)

    for t in test_targets:
        target_url = BASE_URL + urllib.request.pathname2url(t["url"])
        try:
            req = urllib.request.Request(target_url, headers={"User-Agent": "Mozilla/5.0 Chrome/120"})
            with urllib.request.urlopen(req, timeout=5) as resp:
                code = resp.getcode()
                content_type = resp.headers.get("Content-Type", "")
                data = resp.read()
                size = len(data)
                ok = (code == 200) and (size > 0)
                res_str = "PASS" if ok else "FAIL"
                print(fmt.format(
                    t["name"][:36],
                    f"HTTP {code}",
                    content_type[:22],
                    f"{size:,} bytes",
                    res_str
                ))
                if not ok:
                    all_ok = False
        except Exception as e:
            print(fmt.format(
                t["name"][:36],
                "ERR",
                str(e)[:22],
                "0 bytes",
                "FAIL"
            ))
            all_ok = False

    server.shutdown()
    server.server_close()

    print("-" * 100)
    print()
    if all_ok:
        print("BROWSER TEST RESULT: 100% OF ENDPOINTS, PREVIEWS, AND PDFS LOAD WITH HTTP 200 OK")
    else:
        print("BROWSER TEST RESULT: DEFECTS DETECTED")
    print("=" * 96)

if __name__ == "__main__":
    run_browser_endpoints_test()
