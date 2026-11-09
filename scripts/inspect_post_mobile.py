import json

with open('lighthouse-mobile-post.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

audits = d.get('audits', {})

print('=== LCP BREAKDOWN ===')
for item in audits.get('lcp-breakdown-insight', {}).get('details', {}).get('items', []):
    if item.get('type') == 'table':
        for row in item.get('items', []):
            print(f"  {row.get('label')}: {row.get('duration')} ms")

print('\n=== LCP DISCOVERY ===')
for item in audits.get('lcp-discovery-insight', {}).get('details', {}).get('items', []):
    if item.get('type') == 'checklist':
        print(json.dumps(item.get('items'), indent=2))
    elif item.get('type') == 'node':
        print("Node snippet:", item.get('snippet'))

print('\n=== MAIN THREAD BREAKDOWN ===')
for item in audits.get('mainthread-work-breakdown', {}).get('details', {}).get('items', []):
    print(f"  {item.get('groupLabel', item.get('group'))}: {item.get('duration')} ms")

print('\n=== BOOTUP TIME ===')
for item in audits.get('bootup-time', {}).get('details', {}).get('items', []):
    url = item.get('url', '').split('/')[-1]
    print(f"  {url}: Total {item.get('total'):.1f} ms, Script eval {item.get('scripting'):.1f} ms")

print('\n=== LONG TASKS ===')
for item in audits.get('long-tasks', {}).get('details', {}).get('items', [])[:5]:
    print(f"  Duration: {item.get('duration')} ms, Start: {item.get('startTime')} ms")
