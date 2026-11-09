import os, re
import pypdfium2 as pdfium
from PIL import Image

data_file = "src/lib/certificatesData.ts"
with open(data_file, "r", encoding="utf-8") as f:
    text = f.read()

# Only inspect CERTIFICATION_VAULT array
vault_start = text.find("export const CERTIFICATION_VAULT")
vault_text = text[vault_start:]

blocks = vault_text.split("{\n    id: \"")[1:]

out_dir = "public/uploads/previews"
os.makedirs(out_dir, exist_ok=True)

print(f"Total blocks found: {len(blocks)}")

generated = 0
for b in blocks:
    cid = b.split('"')[0]
    
    title_m = re.search(r'title:\s*"([^"]+)"', b)
    title = title_m.group(1) if title_m else cid
    
    pdf_m = re.search(r'pdf:\s*"([^"]+)"', b)
    pdf = pdf_m.group(1) if pdf_m else None
    
    img_m = re.search(r'image:\s*"([^"]+)"', b)
    img = img_m.group(1) if img_m else None
    
    if pdf:
        pdf_path = os.path.join("public", pdf.lstrip("/"))
        if os.path.exists(pdf_path):
            try:
                doc = pdfium.PdfDocument(pdf_path)
                page = doc[0]
                # Render at 1.5x scale
                pil_image = page.render(scale=1.5).to_pil()
                
                out_filename = f"{cid}.png"
                out_path = os.path.join(out_dir, out_filename)
                
                if pil_image.mode in ("RGBA", "P"):
                    pil_image = pil_image.convert("RGB")
                    
                pil_image.save(out_path, "PNG", optimize=True)
                generated += 1
                print(f"Generated preview for [{cid}]: {out_filename} ({pil_image.size})")
            except Exception as e:
                print(f"Error for [{cid}] with {pdf_path}: {e}")
        else:
            print(f"PDF missing for [{cid}]: {pdf_path}")
    else:
        print(f"No PDF for [{cid}] (keeps img: {img})")

print(f"\nDone! Generated {generated} preview images.")
