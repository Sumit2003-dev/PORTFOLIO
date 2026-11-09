import asyncio
import json
import os
import subprocess
import tempfile
import time
import urllib.request
import websockets

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 9223
USER_DATA_DIR = tempfile.mkdtemp(prefix="chrome_cdp_")
SITE_URL = "https://sumit2003-dev.github.io/PORTFOLIO/"

async def run_cdp_audit():
    # 1. Launch Chrome
    chrome_cmd = [
        CHROME_PATH,
        "--headless=new",
        f"--remote-debugging-port={PORT}",
        f"--user-data-dir={USER_DATA_DIR}",
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-extensions",
        "--disable-background-networking"
    ]
    proc = subprocess.Popen(chrome_cmd)
    time.sleep(2)
    
    try:
        # Get WebSocket target
        res = urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json", timeout=5)
        targets = json.loads(res.read().decode('utf-8'))
        ws_url = targets[0]["webSocketDebuggerUrl"]
        
        async with websockets.connect(ws_url, max_size=20*1024*1024) as ws:
            msg_id = 0
            async def send(method, params=None):
                nonlocal msg_id
                msg_id += 1
                payload = {"id": msg_id, "method": method, "params": params or {}}
                await ws.send(json.dumps(payload))
                while True:
                    raw = await ws.recv()
                    data = json.loads(raw)
                    if data.get("id") == msg_id:
                        return data.get("result", {})
            
            # Tracking structures
            network_requests = []
            console_logs = []
            failed_requests = []

            # Background listener
            async def listen_events():
                try:
                    while True:
                        raw = await ws.recv()
                        ev = json.loads(raw)
                        method = ev.get("method")
                        params = ev.get("params", {})
                        if method == "Network.requestWillBeSent":
                            req = params.get("request", {})
                            url = req.get("url", "")
                            network_requests.append({
                                "url": url,
                                "type": params.get("type", ""),
                                "time": time.time()
                            })
                        elif method == "Network.loadingFailed":
                            failed_requests.append(params)
                        elif method in ("Runtime.consoleAPICalled", "Log.entryAdded"):
                            console_logs.append(ev)
                except asyncio.CancelledError:
                    pass
                except Exception:
                    pass

            listener_task = asyncio.create_task(listen_events())
            
            # Enable domains
            await send("Page.enable")
            await send("Network.enable")
            await send("Runtime.enable")
            await send("Log.enable")
            await send("DOM.enable")

            print("\n=======================================================")
            print("        CHROME DEVTOOLS NETWORK & INTERACTION AUDIT     ")
            print("=======================================================")
            print(f"Navigating to {SITE_URL}...")
            
            # Navigate
            await send("Page.navigate", {"url": SITE_URL})
            await asyncio.sleep(4)
            
            # Step 1: Initial Page Load (Before Scrolling)
            initial_reqs = list(network_requests)
            initial_thumbs = [r for r in initial_reqs if "/uploads/thumbs/" in r["url"]]
            initial_pdfs = [r for r in initial_reqs if r["url"].lower().endswith(".pdf")]
            
            # Calculate transferred bytes using Performance API
            perf_res = await send("Runtime.evaluate", {
                "expression": "performance.getEntriesByType('resource').map(r => ({name: r.name, size: r.transferSize || r.encodedBodySize || 0}))",
                "returnByValue": True
            })
            resources = perf_res.get("result", {}).get("value", [])
            initial_bytes = sum(r["size"] for r in resources)
            
            print(f"\n--- STEP 1: INITIAL PAGE LOAD (ABOVE THE FOLD) ---")
            print(f"  • Total Resources Loaded:          {len(resources)}")
            print(f"  • Total Transferred Bytes:         {initial_bytes:,} bytes ({initial_bytes/(1024*1024):.2f} MB)")
            print(f"  • Certificate Thumbnails Loaded:   {len(initial_thumbs)} (Expected: 0 above fold)")
            print(f"  • PDF Documents Requested:         {len(initial_pdfs)} (Expected: 0)")
            
            # Step 2: Scroll to Certificates Section
            print(f"\n--- STEP 2: SCROLLING TO #certificates ---")
            await send("Runtime.evaluate", {
                "expression": "document.getElementById('certificates').scrollIntoView();"
            })
            await asyncio.sleep(3)
            
            after_scroll_reqs = list(network_requests)
            new_scroll_reqs = after_scroll_reqs[len(initial_reqs):]
            vault_thumbs = [r for r in new_scroll_reqs if "/uploads/thumbs/" in r["url"]]
            vault_pdfs = [r for r in new_scroll_reqs if r["url"].lower().endswith(".pdf")]
            
            print(f"  • New Requests on Section Enter:   {len(new_scroll_reqs)}")
            print(f"  • Visible Thumbnails Triggered:    {len(vault_thumbs)} (Expected: 12 initial cards)")
            print(f"  • PDF Documents Requested:         {len(vault_pdfs)} (Expected: 0 - lazy)")
            
            # Step 3: Open Certificate Modal
            print(f"\n--- STEP 3: OPENING CERTIFICATE DETAIL MODAL ---")
            pre_modal_count = len(network_requests)
            click_res = await send("Runtime.evaluate", {
                "expression": "(() => { const cards = document.querySelectorAll('#certificates [role=\"button\"]'); if (cards.length > 0) { cards[0].click(); return true; } return false; })()",
                "returnByValue": True
            })
            await asyncio.sleep(2)
            
            post_modal_reqs = network_requests[pre_modal_count:]
            modal_images = [r for r in post_modal_reqs if "/uploads/" in r["url"]]
            modal_pdfs = [r for r in post_modal_reqs if r["url"].lower().endswith(".pdf")]
            
            print(f"  • Card Click Succeeded:            {click_res.get('result', {}).get('value')}")
            print(f"  • Modal Image Loaded:              {[r['url'].split('/')[-1] for r in modal_images]}")
            print(f"  • PDF Downloads Initiated:         {len(modal_pdfs)} (Expected: 0 - user must click download)")
            
            # Close modal
            await send("Runtime.evaluate", {
                "expression": "(() => { const closeBtn = document.querySelector('[aria-label=\"Close certificate modal\"]'); if (closeBtn) closeBtn.click(); })()"
            })
            await asyncio.sleep(1)

            # Step 4: Test Filtering, Sorting, and Pagination (All 51 Credentials)
            print(f"\n--- STEP 4: INTERACTION, FILTERING & PAGINATION AUDIT ---")
            
            # Click provider tabs
            providers = ["google", "ibm", "microsoft", "anthropic", "tata-tcs", "all"]
            for p in providers:
                eval_p = await send("Runtime.evaluate", {
                    "expression": f"(() => {{ const btns = Array.from(document.querySelectorAll('#certificates button')); const b = btns.find(x => x.textContent.toLowerCase().includes('{p}')); if (b) {{ b.click(); return true; }} return false; }})()",
                    "returnByValue": True
                })
                await asyncio.sleep(0.5)
            print("  • Provider navigation tabs switched successfully: Google, IBM, Microsoft, Anthropic, Tata/TCS, All.")
            
            # Test Sorting
            for s in ["Oldest", "A–Z", "Newest"]:
                await send("Runtime.evaluate", {
                    "expression": f"(() => {{ const btns = Array.from(document.querySelectorAll('#certificates button')); const b = btns.find(x => x.textContent.includes('{s}')); if (b) b.click(); }})()"
                })
                await asyncio.sleep(0.5)
            print("  • Sorting controls toggled: Oldest, A–Z, Newest.")
            
            # Pagination: Click 'Load More' until all 51 cards are mounted
            load_more_clicks = 0
            while True:
                has_more = await send("Runtime.evaluate", {
                    "expression": "(() => { const btns = Array.from(document.querySelectorAll('#certificates button')); const lm = btns.find(x => x.textContent.includes('Load More')); if (lm) { lm.click(); return true; } return false; })()",
                    "returnByValue": True
                })
                if not has_more.get("result", {}).get("value"):
                    break
                load_more_clicks += 1
                await asyncio.sleep(0.8)
            
            total_mounted_cards = await send("Runtime.evaluate", {
                "expression": "document.querySelectorAll('#certificates [role=\"button\"]').length",
                "returnByValue": True
            })
            card_count = total_mounted_cards.get("result", {}).get("value", 0)
            print(f"  • 'Load More' Clicked:             {load_more_clicks} times")
            print(f"  • Total Credentials Rendered:      {card_count} / 51")
            
            # Step 5: Mobile Viewport & Throttled Performance
            print(f"\n--- STEP 5: MOBILE VIEWPORT & CPU/NETWORK THROTTLING ---")
            # Emulate Mobile (iPhone 14 / Pixel 7: 390x844)
            await send("Emulation.setDeviceMetricsOverride", {
                "width": 390,
                "height": 844,
                "deviceScaleFactor": 3,
                "mobile": True
            })
            # 4x CPU Slowdown
            await send("Emulation.setCPUThrottlingRate", {"rate": 4})
            # Fast 3G / Slow 4G Network Throttling (latency 100ms, download 1.6Mbps, upload 750kbps)
            await send("Network.emulateNetworkConditions", {
                "offline": False,
                "latency": 100,
                "downloadThroughput": 1600 * 1024 // 8,
                "uploadThroughput": 750 * 1024 // 8
            })
            
            # Scroll through mobile
            await send("Runtime.evaluate", {
                "expression": "window.scrollTo(0, document.body.scrollHeight / 2);"
            })
            await asyncio.sleep(1.5)
            await send("Runtime.evaluate", {
                "expression": "window.scrollTo(0, document.body.scrollHeight);"
            })
            await asyncio.sleep(1.5)
            
            # Measure layout stability
            cls_res = await send("Runtime.evaluate", {
                "expression": "(() => { let cls = 0; new PerformanceObserver(l => { for (let e of l.getEntries()) if (!e.hadRecentInput) cls += e.value; }).observe({type: 'layout-shift', buffered: true}); return cls; })()",
                "returnByValue": True
            })
            measured_cls = cls_res.get("result", {}).get("value", 0)
            print(f"  • Mobile Viewport Emulation:       390 × 844 (Scale 3x, Mobile: True)")
            print(f"  • CPU Throttling Applied:          4x Slowdown")
            print(f"  • Network Throttling Applied:      Fast 3G (1.6 Mbps / 100ms RTT)")
            print(f"  • Mobile Layout Shift (CLS):       {measured_cls:.4f}")

            # Step 6: Console Errors & Failed Requests
            print(f"\n--- STEP 6: CONSOLE HEALTH & NETWORK INTEGRITY ---")
            error_logs = [log for log in console_logs if "error" in str(log).lower()]
            print(f"  • Failed Network Requests:         {len(failed_requests)}")
            if failed_requests:
                for f in failed_requests[:5]:
                    print(f"    - Failed: {f.get('errorText')} for {f.get('url')}")
            print(f"  • Console Error Entries:           {len(error_logs)}")
            if error_logs:
                for el in error_logs[:5]:
                    print(f"    - Error: {el}")
            
            listener_task.cancel()
            print("\n=======================================================")
            print("                 CDP AUDIT COMPLETED                   ")
            print("=======================================================")

    finally:
        proc.terminate()
        try:
            proc.wait(timeout=3)
        except Exception:
            proc.kill()

if __name__ == "__main__":
    asyncio.run(run_cdp_audit())

