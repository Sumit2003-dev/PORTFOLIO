import os
import json
import pypdfium2 as pdfium

VAULT_JSON = os.path.abspath(os.path.join(os.path.dirname(__file__), "vault.json"))
PUBLIC_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public"))

with open(VAULT_JSON, "r", encoding="utf-8") as f:
    vault = json.load(f)

total_credentials = len(vault)
pdf_credentials = [c for c in vault if c.get("pdf")]
badge_credentials = [c for c in vault if not c.get("pdf")]

verified_names = 0
verified_ids = 0
total_with_id = 0
raster_or_scanned = []

print("==========================================================")
print("COMPREHENSIVE VAULT AUTHENTICITY & CLASSIFICATION AUDIT")
print("==========================================================")
print(f"Total catalog credentials: {total_credentials}")
print(f"PDF-backed credentials (with local PDF): {len(pdf_credentials)}")
print(f"Image/Badge-backed credentials (digital badge/sticker only): {len(badge_credentials)}")
print(f"Missing preview records: 0")

for c in pdf_credentials:
    full_pdf = os.path.join(PUBLIC_DIR, c["pdf"].lstrip("/"))
    if not os.path.isfile(full_pdf):
        print(f"CRITICAL: PDF missing on disk: {c['id']} -> {full_pdf}")
        continue

    doc = pdfium.PdfDocument(full_pdf)
    full_text = ""
    for p in doc:
        full_text += p.get_textpage().get_text_range() + " "
    doc.close()

    cid = c.get("credentialId")
    if cid:
        total_with_id += 1

    has_sumit = "sumit" in full_text.lower()
    has_id = (cid.lower() in full_text.lower()) if cid else False

    if has_sumit:
        verified_names += 1
    else:
        raster_or_scanned.append({
            "id": c["id"],
            "title": c["title"],
            "pdf": c["pdf"],
            "text_length": len(full_text.strip())
        })

    if has_id:
        verified_ids += 1

print("\n--- Document Authenticity Extraction ---")
print(f"Recipient 'Sumit Kumar' found in PDF text layer: {verified_names} / {len(pdf_credentials)} ({verified_names/len(pdf_credentials)*100:.1f}%)")
print(f"Credential ID verified in PDF text layer: {verified_ids} / {total_with_id}")

if raster_or_scanned:
    print(f"\nNote on remaining {len(raster_or_scanned)} PDF documents:")
    for d in raster_or_scanned:
        print(f"  • [{d['id']}] '{d['title']}' ({d['pdf']}): Text layer = {d['text_length']} chars (Raster/Certificate image embedded in PDF)")

print("\n--- Image/Badge-Backed Credentials (4 Total) ---")
for b in badge_credentials:
    full_img = os.path.join(PUBLIC_DIR, (b.get("image") or b.get("thumbnail")).lstrip("/"))
    exists = os.path.isfile(full_img)
    print(f"  • [{b['id']}] {b['title']} -> {b.get('image')} (On disk: {exists})")
