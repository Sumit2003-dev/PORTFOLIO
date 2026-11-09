import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
url = "https://sumit2003-dev.github.io/PORTFOLIO/"

def run_pagespeed(strategy):
    api_url = f"https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url={urllib.parse.quote(url)}&strategy={strategy}&category=performance"
    print(f"Requesting official Google Lighthouse audit ({strategy})...")
    req = urllib.request.Request(api_url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=120) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            lh = data.get("lighthouseResult", {})
            cats = lh.get("categories", {})
            perf = cats.get("performance", {})
            score = int((perf.get("score") or 0) * 100)
            audits = lh.get("audits", {})
            
            fcp = audits.get("first-contentful-paint", {}).get("displayValue")
            lcp = audits.get("largest-contentful-paint", {}).get("displayValue")
            tbt = audits.get("total-blocking-time", {}).get("displayValue")
            cls = audits.get("cumulative-layout-shift", {}).get("displayValue")
            si = audits.get("speed-index", {}).get("displayValue")
            
            print(f"[{strategy.upper()}] Performance Score: {score}/100")
            print(f"  • FCP: {fcp}")
            print(f"  • LCP: {lcp}")
            print(f"  • TBT: {tbt}")
            print(f"  • CLS: {cls}")
            print(f"  • Speed Index: {si}")
            return {
                "strategy": strategy,
                "score": score,
                "fcp": fcp,
                "lcp": lcp,
                "tbt": tbt,
                "cls": cls,
                "si": si,
                "audits": audits
            }
    except Exception as e:
        print(f"Error running PageSpeed for {strategy}:", e)
        return None

desktop_res = run_pagespeed("desktop")
mobile_res = run_pagespeed("mobile")

with open("lighthouse_results.json", "w", encoding="utf-8") as f:
    json.dump({"desktop": desktop_res, "mobile": mobile_res}, f, indent=2)
print("Saved lighthouse_results.json")

