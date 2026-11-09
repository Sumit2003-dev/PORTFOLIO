import json

with open('lighthouse-mobile.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

audits = d.get('audits', {})

# 1. LCP element
lcp_elem = audits.get('largest-contentful-paint-element', {})
print('=== LCP ELEMENT ===')
print('Description:', lcp_elem.get('displayValue'))
items = lcp_elem.get('details', {}).get('items', [])
for it in items:
    node = it.get('node', {})
    print('Snippet:', node.get('snippet'))
    print('Selector:', node.get('selector'))
    print('Node label:', node.get('nodeLabel'))

# 2. Main-thread work breakdown
print('\n=== MAIN THREAD WORK BREAKDOWN ===')
mt = audits.get('mainthread-work-breakdown', {})
print('Total:', mt.get('displayValue'))
for it in mt.get('details', {}).get('items', []):
    print(f"  {it.get('groupLabel', it.get('group'))}: {it.get('duration'):.1f} ms")

# 3. Bootup time (JS execution)
print('\n=== BOOTUP TIME ===')
bt = audits.get('bootup-time', {})
for it in bt.get('details', {}).get('items', []):
    url = it.get('url', '').split('/')[-1]
    print(f"  {url}: Total {it.get('total'):.1f} ms, Script eval {it.get('scripting'):.1f} ms")

# 4. Long tasks
print('\n=== LONG TASKS ===')
lt = audits.get('long-tasks', {})
for it in lt.get('details', {}).get('items', [])[:8]:
    print(f"  Duration: {it.get('duration'):.1f} ms, Start: {it.get('startTime'):.1f} ms")

# 5. Render blocking
print('\n=== RENDER BLOCKING ===')
rb = audits.get('render-blocking-resources', {})
print('Savings:', rb.get('displayValue'))
for it in rb.get('details', {}).get('items', []):
    url = it.get('url', '').split('/')[-1]
    print(f"  {url}: {it.get('wastedMs')} ms")

# 6. Network payloads
print('\n=== NETWORK PAYLOADS (LARGE) ===')
np = audits.get('total-byte-weight', {})
print('Total:', np.get('displayValue'))
for it in np.get('details', {}).get('items', [])[:10]:
    url = it.get('url', '').split('/')[-1]
    print(f"  {url}: {it.get('totalBytes')/1024:.1f} KB")

# 7. Diagnostics & Opportunities
print('\n=== OPPORTUNITIES & DIAGNOSTICS ===')
for k, v in audits.items():
    if v.get('details', {}).get('type') == 'opportunity' and v.get('numericValue', 0) > 100:
        print(f"  Opportunity: {v.get('title')} -> {v.get('displayValue')} ({v.get('numericValue'):.1f} ms)")
