import urllib.request
import json
import ssl

ctx = ssl.create_default_context()

url = 'https://api.github.com/repos/Sumit2003-dev/PORTFOLIO/actions/runs'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        runs = data.get('workflow_runs', [])
        for r in runs[:5]:
            head_sha = r.get('head_sha', '')[:7]
            status = r.get('status', '')
            conclusion = r.get('conclusion', '')
            created = r.get('created_at', '')
            name = r.get('name', '')
            print(f"Workflow: {name} | Commit: {head_sha} | Status: {status} | Conclusion: {conclusion} | Created: {created}")
except Exception as e:
    print("Error querying actions:", e)

