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

server = http.server.ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
server_thread = threading.Thread(target=server.serve_forever, daemon=True)
server_thread.start()

print("=" * 96)
print("     LOCAL PRODUCTION BUILD (DIST) BROWSER & ASSET SERVING AUDIT")
print("=" * 96)
print(f"Testing local server at {BASE_URL} serving from {DIST_DIR}...\n")

test_targets = [
    # 0. App Shell
    {"name": "Local Site Index (App Shell)", "url": "/", "expected_type": "text/html"},
    
    # 1. Google (Preview & PDFs)
    {"name": "Google Capstone Preview", "url": "/uploads/previews/google-adv-capstone.png", "expected_type": "image/png"},
    {"name": "Google Capstone PDF", "url": "/uploads/google/Google_Advanced_Data_Analytics_Capstone.pdf", "expected_type": "application/pdf"},
    {"name": "Google Foundations Data PDF", "url": "/uploads/google/Foundations Data, Data, Everywhere.pdf", "expected_type": "application/pdf"},
    {"name": "Google Data Insights PDF", "url": "/uploads/google/Go Beyond the NumbersTranslate Data into Insights.pdf", "expected_type": "application/pdf"},
    {"name": "Google Foundations DS PDF", "url": "/uploads/google/Google_Foundations_of_Data_Science_Certificate.pdf", "expected_type": "application/pdf"},
    {"name": "Google Power of Statistics PDF", "url": "/uploads/google/The_Power_of_Statistics.pdf", "expected_type": "application/pdf"},
    
    # 2. IBM (Preview, PDFs & Badges)
    {"name": "IBM AI Analyst Preview", "url": "/uploads/previews/ibm-ai-analyst.png", "expected_type": "image/png"},
    {"name": "IBM AI Analyst PDF", "url": "/uploads/IBM/Artificial Intelligence Analyst.pdf", "expected_type": "application/pdf"},
    {"name": "IBM Data Analysis Python PDF", "url": "/uploads/IBM/Data Analysis with Python.pdf", "expected_type": "application/pdf"},
    {"name": "IBM Prompt Engineering Badge", "url": "/uploads/IBM/Prompt Engineering- Shaping Better AI Responses.png", "expected_type": "image/png"},
    
    # 3. Microsoft (Preview & PDFs)
    {"name": "Microsoft Azure ML Preview", "url": "/uploads/previews/ms-azure-ml-pipelines.png", "expected_type": "image/png"},
    {"name": "Microsoft Azure ML Studio PDF", "url": "/uploads/Microsoft/Coursera_Azure_ML_Pipelines_Certificate.pdf", "expected_type": "application/pdf"},
    {"name": "Microsoft Foundations AI/ML PDF", "url": "/uploads/Microsoft/Microsoft_Foundations_of_AI_and_Machine_Learning_Certificate.pdf", "expected_type": "application/pdf"},
    
    # 4. Anthropic (Preview & PDFs)
    {"name": "Anthropic Claude 101 Preview", "url": "/uploads/previews/anthropic-claude-101.png", "expected_type": "image/png"},
    {"name": "Anthropic Claude 101 PDF", "url": "/uploads/Anthropic/Claude-101.pdf", "expected_type": "application/pdf"},
    {"name": "Anthropic Claude API PDF", "url": "/uploads/Anthropic/Building with the Claude API.pdf", "expected_type": "application/pdf"},
    {"name": "Anthropic Vertex AI PDF", "url": "/uploads/Anthropic/Claude with Google Cloud's Vertex AI.pdf", "expected_type": "application/pdf"},
    {"name": "Anthropic Bedrock PDF", "url": "/uploads/Anthropic/Claude with Amazon Bedrock.pdf", "expected_type": "application/pdf"},
    {"name": "Anthropic MCP Intro PDF", "url": "/uploads/Anthropic/Introduction to Model Context Protocol.pdf", "expected_type": "application/pdf"},
    
    # 5. Others & NPTEL
    {"name": "NPTEL IIT Roorkee Python PDF", "url": "/uploads/others/NPTEL.pdf", "expected_type": "application/pdf"},
    {"name": "TCS iON AI For All PDF", "url": "/uploads/others/AI FOR ALL.pdf", "expected_type": "application/pdf"},
    {"name": "Deloitte Data Analytics PDF", "url": "/uploads/others/Data Analytics Job Simulation.PDF", "expected_type": "application/pdf"},
    {"name": "Quantium Analytics PDF", "url": "/uploads/others/Data Analytics Job Simulation(Quantium).pdf", "expected_type": "application/pdf"},
    {"name": "Saylor Python PDF", "url": "/uploads/others/INTRODUCTION TO PYTHON.pdf", "expected_type": "application/pdf"},

    # 6. Optimized High-Performance Assets
    {"name": "Hero Homepage WebP (25.9 KB)", "url": "/uploads/homepage.webp", "expected_type": "image/webp"},
    {"name": "IBM Prompt Eng Modal WebP (56.7 KB)", "url": "/uploads/IBM/prompt-engineering-modal.webp", "expected_type": "image/webp"},
    {"name": "Google Capstone WebP Thumbnail", "url": "/uploads/thumbs/google-adv-capstone.webp", "expected_type": "image/webp"},
    {"name": "IBM Prompt Eng WebP Thumbnail", "url": "/uploads/thumbs/ibm-prompt-engineering.webp", "expected_type": "image/webp"},
    {"name": "Anthropic Claude 101 WebP Thumbnail", "url": "/uploads/thumbs/anthropic-claude-101.webp", "expected_type": "image/webp"},
    {"name": "NPTEL WebP Thumbnail", "url": "/uploads/thumbs/nptel-iit-roorkee-python.webp", "expected_type": "image/webp"},
]

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
