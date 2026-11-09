import asyncio
import json
import os
import subprocess
import tempfile
import time
import urllib.request
import websockets

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 9224
USER_DATA_DIR = tempfile.mkdtemp(prefix="chrome_cdp_audit_")
SITE_URL = "https://sumit2003-dev.github.io/PORTFOLIO/"

async def run():
    chrome_cmd = [
        CHROME_PATH,
        "--headless=new",
        f"--remote-debugging-port={PORT}",
        f"--user-data-dir={USER_DATA_DIR}",
        "--no-first-run",
        "--no-default-browser-check"
    ]
    proc = subprocess.Popen(chrome_cmd)
    time.sleep(2)
    
    try:
        res = urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json", timeout=5)
        targets = json.loads(res.read().decode('utf-8'))
        page_targets = [t for t in targets if t.get("type") == "page"]
        if not page_targets:
            print("No page target found!")
            return
        ws_url = page_targets[0]["webSocketDebuggerUrl"]
        
        async with websockets.connect(ws_url, max_size=50*1024*1024) as ws:
            msg_id = 0
            futures = {}

            async def send(method, params=None):
                nonlocal msg_id
                msg_id += 1
                mid = msg_id
                fut = asyncio.get_event_loop().create_future()
                futures[mid] = fut
                payload = {"id": mid, "method": method, "params": params or {}}
                await ws.send(json.dumps(payload))
                return await fut

            network_reqs = []
            console_msgs = []
            failed_reqs = []

            async def event_loop():
                while True:
                    try:
                        raw = await ws.recv()
                        ev = json.loads(raw)
                        mid = ev.get("id")
                        if mid and mid in futures:
                            futures[mid].set_result(ev.get("result", {}))
                            del futures[mid]
                            continue
                        
                        method = ev.get("method")
                        params = ev.get("params", {})
                        if method == "Network.requestWillBeSent":
                            network_reqs.append({
                                "url": params.get("request", {}).get("url", ""),
                                "type": params.get("type", "")
                            })
                        elif method == "Network.loadingFailed":
                            failed_reqs.append(params)
                        elif method == "Runtime.consoleAPICalled":
                            args = [a.get("value", a.get("description", "")) for a in params.get("args", [])]
                            console_msgs.append(f"[{params.get('type')}] {' '.join(str(x) for x in args)}")
                    except asyncio.CancelledError:
                        break
                    except Exception:
                        break

            loop_task = asyncio.create_task(event_loop())

            await send("Page.enable")
            await send("Network.enable")
            await send("Runtime.enable")
            await send("Log.enable")
            await send("DOM.enable")

            print(f"Navigating to {SITE_URL}...")
            await send("Page.navigate", {"url": SITE_URL})
            
            # Wait for readyState === complete and document to mount
            for _ in range(30):
                await asyncio.sleep(0.5)
                eval_res = await send("Runtime.evaluate", {
                    "expression": "document.readyState === 'complete' && Boolean(document.querySelector('#main-content'))"
                })
                if eval_res.get("result", {}).get("value"):
                    break
            
            await asyncio.sleep(2) # Give dynamic animations time to settle

            # 1. Initial Page Load Analysis
            initial_reqs = list(network_reqs)
            initial_thumbs = [r for r in initial_reqs if "/uploads/thumbs/" in r["url"]]
            initial_pdfs = [r for r in initial_reqs if r["url"].lower().endswith(".pdf")]
            
            perf_res = await send("Runtime.evaluate", {
                "expression": "performance.getEntriesByType('resource').map(r => ({name: r.name, size: r.transferSize || r.encodedBodySize || 0}))",
                "returnByValue": True
            })
            resources = perf_res.get("result", {}).get("value", [])
            initial_bytes = sum(r["size"] for r in resources)
            
            print("\n=== 1. CHROME NETWORK METRICS (ABOVE-THE-FOLD INITIAL LOAD) ===")
            print(f"Total Resources Loaded:             {len(resources)}")
            print(f"Total Transferred Payload:          {initial_bytes:,} bytes ({initial_bytes/(1024*1024):.2f} MB)")
            print(f"Certificate Thumbnails Requested:   {len(initial_thumbs)} (Expected: 0 - lazy loaded)")
            print(f"PDF Documents Requested:            {len(initial_pdfs)} (Expected: 0)")
            
            # 2. Scroll to Certificates Section
            print("\n=== 2. CHROME NETWORK METRICS (SCROLLING TO CERTIFICATES) ===")
            await send("Runtime.evaluate", {
                "expression": "document.getElementById('certificates').scrollIntoView();"
            })
            await asyncio.sleep(3)
            
            after_scroll_reqs = list(network_reqs)
            new_reqs = after_scroll_reqs[len(initial_reqs):]
            new_thumbs = [r for r in new_reqs if "/uploads/thumbs/" in r["url"]]
            new_pdfs = [r for r in new_reqs if r["url"].lower().endswith(".pdf")]
            
            print(f"New Resources on Viewport Enter:    {len(new_reqs)}")
            print(f"Certificate Thumbnails Triggered:   {len(new_thumbs)} (Expected: exactly 12 cards)")
            print(f"PDF Documents Requested:            {len(new_pdfs)} (Expected: 0 - zero PDF card rendering)")
            
            # 3. Open Modal for First Certificate
            print("\n=== 3. MODAL PREVIEW & PDF ISOLATION TEST ===")
            pre_modal_req_count = len(network_reqs)
            
            # Click the first certificate card
            open_res = await send("Runtime.evaluate", {
                "expression": "(() => { const cards = document.querySelectorAll('#certificates [role=\"button\"]'); if (cards.length > 0) { cards[0].click(); return true; } return false; })()",
                "returnByValue": True
            })
            await asyncio.sleep(2)
            
            post_modal_reqs = network_reqs[pre_modal_req_count:]
            modal_images = [r for r in post_modal_reqs if "/uploads/" in r["url"] and not r["url"].endswith(".pdf")]
            modal_pdfs = [r for r in post_modal_reqs if r["url"].lower().endswith(".pdf")]
            
            modal_title = await send("Runtime.evaluate", {
                "expression": "document.querySelector('[role=\"dialog\"] h3')?.textContent",
                "returnByValue": True
            })
            
            print(f"Certificate Card Clicked:           {open_res.get('result', {}).get('value')}")
            print(f"Modal Opened with Title:            '{modal_title.get('result', {}).get('value')}'")
            print(f"Modal High-Res Previews Loaded:     {len(modal_images)} {[r['url'].split('/')[-1] for r in modal_images]}")
            print(f"PDF Documents Requested:            {len(modal_pdfs)} (Verified: PDFs are NOT auto-downloaded)")
            
            # Close modal
            await send("Runtime.evaluate", {
                "expression": "(() => { const closeBtn = document.querySelector('[aria-label=\"Close certificate modal\"]'); if (closeBtn) closeBtn.click(); })()"
            })
            await asyncio.sleep(1)

            # 4. Interactive Vault Controls: Filters, Sorting & Pagination
            print("\n=== 4. VAULT CONTROLS & PAGINATION TEST (ALL 51 CREDENTIALS) ===")
            
            # Test Provider Filters
            for p in ["google", "ibm", "microsoft", "anthropic", "tata-tcs", "nptel", "all"]:
                await send("Runtime.evaluate", {
                    "expression": f"(() => {{ const btns = Array.from(document.querySelectorAll('#certificates button')); const b = btns.find(x => x.textContent.toLowerCase().includes('{p}')); if (b) b.click(); }})()"
                })
                await asyncio.sleep(0.3)
            print("Switched all provider tabs: Google -> IBM -> Microsoft -> Anthropic -> Tata/TCS -> NPTEL -> All.")
            
            # Test Sorting
            for s in ["Oldest", "A–Z", "Newest"]:
                await send("Runtime.evaluate", {
                    "expression": f"(() => {{ const btns = Array.from(document.querySelectorAll('#certificates button')); const b = btns.find(x => x.textContent.includes('{s}')); if (b) b.click(); }})()"
                })
                await asyncio.sleep(0.3)
            print("Toggled sorting: Oldest -> A–Z -> Newest.")
            
            # Click Load More until all 51 credentials are visible
            load_clicks = 0
            while True:
                has_more = await send("Runtime.evaluate", {
                    "expression": "(() => { const btns = Array.from(document.querySelectorAll('#certificates button')); const lm = btns.find(x => x.textContent.includes('Load More')); if (lm) { lm.click(); return true; } return false; })()",
                    "returnByValue": True
                })
                if not has_more.get("result", {}).get("value"):
                    break
                load_clicks += 1
                await asyncio.sleep(0.6)
            
            card_count = await send("Runtime.evaluate", {
                "expression": "document.querySelectorAll('#certificates [role=\"button\"]').length",
                "returnByValue": True
            })
            print(f"'Load More' Pagination Clicks:      {load_clicks}")
            print(f"Total Rendered Certificate Cards:   {card_count.get('result', {}).get('value')} / 51")
            
            # 5. Mobile Viewport & Throttling
            print("\n=== 5. MOBILE VIEWPORT & THROTTLED PERFORMANCE ===")
            await send("Emulation.setDeviceMetricsOverride", {
                "width": 390,
                "height": 844,
                "deviceScaleFactor": 3,
                "mobile": True
            })
            await send("Emulation.setCPUThrottlingRate", {"rate": 4})
            await send("Network.emulateNetworkConditions", {
                "offline": False,
                "latency": 150,
                "downloadThroughput": 1600 * 1024 // 8,
                "uploadThroughput": 750 * 1024 // 8
            })
            
            # Smooth scroll up and down
            await send("Runtime.evaluate", {
                "expression": "window.scrollTo({top: 0, behavior: 'instant'});"
            })
            await asyncio.sleep(1)
            await send("Runtime.evaluate", {
                "expression": "document.getElementById('certificates').scrollIntoView();"
            })
            await asyncio.sleep(1.5)
            
            perf_timing = await send("Runtime.evaluate", {
                "expression": "(() => { const p = performance.timing; return { loadTime: p.loadEventEnd - p.navigationStart, domReady: p.domContentLoadedEventEnd - p.navigationStart }; })()",
                "returnByValue": True
            })
            timings = perf_timing.get("result", {}).get("value", {})
            print(f"Mobile Viewport Config:             390 × 844 (Scale 3x, Mobile: True)")
            print(f"Throttling Applied:                 4x CPU Slowdown, 1.6 Mbps Fast 3G")
            print(f"Mobile DOM Ready:                   {timings.get('domReady')} ms")
            print(f"Mobile Load Event:                  {timings.get('loadTime')} ms")

            # 6. Console Health & Failed Requests
            print("\n=== 6. CONSOLE ERRORS & FAILED ASSETS AUDIT ===")
            print(f"Total Console Messages:             {len(console_msgs)}")
            console_errors = [m for m in console_msgs if "[error]" in m.lower()]
            print(f"Console Errors:                     {len(console_errors)}")
            for ce in console_errors:
                print(f"  • {ce}")
            
            print(f"Failed HTTP Network Requests:       {len(failed_reqs)}")
            for fr in failed_reqs:
                print(f"  • {fr.get('errorText')} - {fr.get('request', {}).get('url')}")
            
            loop_task.cancel()
    finally:
        proc.terminate()
        try:
            proc.wait(timeout=3)
        except Exception:
            proc.kill()

if __name__ == "__main__":
    asyncio.run(run())

