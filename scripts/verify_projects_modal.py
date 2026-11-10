import asyncio
import http.server
import json
import os
import subprocess
import threading
import time
import urllib.request
import websockets

DIST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dist"))
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 8998
CDP_PORT = 9224

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST_DIR, **kwargs)
    def log_message(self, format, *args):
        pass

def start_server():
    server = http.server.HTTPServer(("127.0.0.1", PORT), QuietHandler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server

async def send_cdp(ws, msg_id, method, params=None):
    payload = {"id": msg_id, "method": method}
    if params:
        payload["params"] = params
    await ws.send(json.dumps(payload))
    while True:
        resp = json.loads(await ws.recv())
        if resp.get("id") == msg_id:
            return resp.get("result", {})

async def eval_js(ws, msg_id, expr):
    res = await send_cdp(ws, msg_id, "Runtime.evaluate", {
        "expression": expr,
        "returnByValue": True,
        "awaitPromise": True
    })
    return res.get("result", {}).get("value")

async def run_tests():
    server = start_server()
    print(f"HTTP Server started for {DIST_DIR} on http://127.0.0.1:{PORT}")

    chrome_cmd = [
        CHROME_PATH,
        "--headless=new",
        f"--remote-debugging-port={CDP_PORT}",
        "--disable-gpu",
        "--no-sandbox",
        "--hide-scrollbars",
        "--user-data-dir=" + os.path.abspath("temp_chrome_profile_proj")
    ]
    proc = subprocess.Popen(chrome_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1.5)

    ws_url = None
    for _ in range(10):
        try:
            with urllib.request.urlopen(f"http://127.0.0.1:{CDP_PORT}/json") as r:
                tabs = json.loads(r.read().decode())
                if tabs:
                    ws_url = tabs[0]["webSocketDebuggerUrl"]
                    break
        except Exception:
            time.sleep(0.5)

    if not ws_url:
        print("Failed to connect to Chrome CDP.")
        proc.kill()
        return

    print("Connected to Chrome via CDP:", ws_url)
    results = {}
    msg_id = 1

    viewports = [
        ("Desktop 1920x1080", 1920, 1080),
        ("Laptop 1366x768", 1366, 768),
        ("Mobile 390x844", 390, 844)
    ]

    async with websockets.connect(ws_url) as ws:
        await send_cdp(ws, msg_id, "Page.enable"); msg_id += 1
        await send_cdp(ws, msg_id, "Runtime.enable"); msg_id += 1

        for label, width, height in viewports:
            print(f"\n==========================================")
            print(f"Testing Viewport: {label} ({width}x{height})")
            print(f"==========================================")
            results[label] = []

            await send_cdp(ws, msg_id, "Emulation.setDeviceMetricsOverride", {
                "width": width,
                "height": height,
                "deviceScaleFactor": 1,
                "mobile": (width < 600)
            }); msg_id += 1

            await send_cdp(ws, msg_id, "Page.navigate", {"url": f"http://127.0.0.1:{PORT}/#projects"}); msg_id += 1
            await asyncio.sleep(2.0)

            # Scroll down to ensure projects LazySection triggers
            card_count = await eval_js(ws, msg_id, """
                (async () => {
                    for (let i = 0; i < 30; i++) {
                        window.scrollBy(0, 800);
                        const cards = document.querySelectorAll('article');
                        if (cards.length > 0) return cards.length;
                        await new Promise(r => setTimeout(r, 200));
                    }
                    return 0;
                })()
            """); msg_id += 1

            print(f"  Found {card_count} project items in DOM.")

            # Click first project card (Emotion Reader)
            await eval_js(ws, msg_id, """
                (() => {
                    const cards = document.querySelectorAll('article');
                    if (cards.length > 0) {
                        cards[0].dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
                    }
                })()
            """); msg_id += 1
            await asyncio.sleep(0.5)

            # Check measurements
            metrics = await eval_js(ws, msg_id, """
                (() => {
                    const headerEl = document.querySelector('header');
                    const dialog = document.querySelector('[role="dialog"]');
                    if (!dialog) return { error: "No dialog element found after clicking project card" };

                    const card = dialog.querySelector('.glass-strong');
                    if (!card) return { error: "No modal card found inside dialog" };

                    const navRect = headerEl ? headerEl.getBoundingClientRect() : { top: 0, bottom: 65, height: 65 };
                    const cardRect = card.getBoundingClientRect();
                    const regions = card.children;
                    const headerRegion = regions[0];
                    const bodyRegion = regions[1];
                    const footerRegion = regions[2];

                    const hRect = headerRegion ? headerRegion.getBoundingClientRect() : null;
                    const bRect = bodyRegion ? bodyRegion.getBoundingClientRect() : null;
                    const fRect = footerRegion ? footerRegion.getBoundingClientRect() : null;

                    const titleEl = card.querySelector('h3');

                    return {
                        title: titleEl ? titleEl.innerText : "Unknown",
                        viewportHeight: window.innerHeight,
                        viewportWidth: window.innerWidth,
                        bodyOverflow: document.body.style.overflow,
                        htmlOverflow: document.documentElement.style.overflow,
                        navbar: { top: navRect.top, bottom: navRect.bottom, height: navRect.height },
                        card: {
                            top: cardRect.top,
                            bottom: cardRect.bottom,
                            height: cardRect.height,
                            width: cardRect.width
                        },
                        topClearance: cardRect.top - navRect.bottom,
                        bottomClearance: window.innerHeight - cardRect.bottom,
                        bodyScrollable: bodyRegion ? (bodyRegion.scrollHeight > bodyRegion.clientHeight) : false,
                        bodyScrollHeight: bodyRegion ? bodyRegion.scrollHeight : 0,
                        bodyClientHeight: bodyRegion ? bodyRegion.clientHeight : 0
                    };
                })()
            """); msg_id += 1

            if "error" in metrics:
                print(f"    ERROR: {metrics['error']}")
                results[label] = {"status": "FAIL: " + metrics["error"]}
                continue

            print(f"    Project Title: {metrics['title']}")
            print(f"    Navbar bottom: {metrics['navbar']['bottom']:.1f}px")
            print(f"    Modal top: {metrics['card']['top']:.1f}px (Clearance: {metrics['topClearance']:.1f}px)")
            print(f"    Modal bottom: {metrics['card']['bottom']:.1f}px (Clearance: {metrics['bottomClearance']:.1f}px from {metrics['viewportHeight']}px)")
            print(f"    Body scrollable: {metrics['bodyScrollable']} ({metrics['bodyScrollHeight']}px / {metrics['bodyClientHeight']}px)")

            passed_top = metrics['topClearance'] >= 5.0
            passed_bottom = metrics['bottomClearance'] >= 5.0
            passed_scroll_lock = metrics['bodyOverflow'] == "hidden" and metrics['htmlOverflow'] == "hidden"

            print(f"    => Below Navbar: {'PASS' if passed_top else 'FAIL'} (+{metrics['topClearance']:.1f}px)")
            print(f"    => Inside Viewport: {'PASS' if passed_bottom else 'FAIL'} (+{metrics['bottomClearance']:.1f}px)")
            print(f"    => Scroll Lock Active: {'PASS' if passed_scroll_lock else 'FAIL'}")

            # Test scroll pinned regions
            scroll_test = await eval_js(ws, msg_id, """
                (() => {
                    const dialog = document.querySelector('[role="dialog"]');
                    const card = dialog.querySelector('.glass-strong');
                    const regions = card.children;
                    const headerRegion = regions[0];
                    const bodyRegion = regions[1];
                    const footerRegion = regions[2];

                    const hTopBefore = headerRegion.getBoundingClientRect().top;
                    const fBottomBefore = footerRegion.getBoundingClientRect().bottom;

                    bodyRegion.scrollTop = 120;

                    const hTopAfter = headerRegion.getBoundingClientRect().top;
                    const fBottomAfter = footerRegion.getBoundingClientRect().bottom;

                    return {
                        headerPinned: Math.abs(hTopBefore - hTopAfter) < 1,
                        footerPinned: Math.abs(fBottomBefore - fBottomAfter) < 1
                    };
                })()
            """); msg_id += 1

            print(f"    => Header Pinned on Scroll: {'PASS' if scroll_test['headerPinned'] else 'FAIL'}")
            print(f"    => Footer Pinned on Scroll: {'PASS' if scroll_test['footerPinned'] else 'FAIL'}")

            # Close modal
            await eval_js(ws, msg_id, """
                (() => {
                    const closeBtn = document.querySelector('[role="dialog"] button[aria-label*="Close"]');
                    if (closeBtn) closeBtn.click();
                })()
            """); msg_id += 1
            await asyncio.sleep(0.3)

            post_body_overflow = await eval_js(ws, msg_id, "document.body.style.overflow"); msg_id += 1
            post_html_overflow = await eval_js(ws, msg_id, "document.documentElement.style.overflow"); msg_id += 1
            overflow_restored = post_body_overflow == "" and post_html_overflow == ""
            print(f"    => Scroll Lock Restored on Close: {'PASS' if overflow_restored else 'FAIL'}")

            results[label] = {
                "title": metrics['title'],
                "topClearance": round(metrics['topClearance'], 1),
                "bottomClearance": round(metrics['bottomClearance'], 1),
                "belowNavbar": passed_top,
                "insideViewport": passed_bottom,
                "headerPinned": scroll_test['headerPinned'],
                "footerPinned": scroll_test['footerPinned'],
                "scrollLock": passed_scroll_lock and overflow_restored
            }

    proc.kill()
    print("\n==========================================")
    print("PROJECTS MODAL TEST SUMMARY:")
    print("==========================================")
    print(json.dumps(results, indent=2))

if __name__ == "__main__":
    asyncio.run(run_tests())
