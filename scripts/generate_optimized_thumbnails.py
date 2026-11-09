import os
import re
from PIL import Image

Image.MAX_IMAGE_PIXELS = None

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_FILE = os.path.join(BASE_DIR, "src", "lib", "certificatesData.ts")
PUBLIC_DIR = os.path.join(BASE_DIR, "public")
THUMBS_DIR = os.path.join(PUBLIC_DIR, "uploads", "thumbs")
os.makedirs(THUMBS_DIR, exist_ok=True)

with open(DATA_FILE, "r", encoding="utf-8") as f:
    content = f.read()

# Extract CERTIFICATION_VAULT
blocks = content.split('{\n    id: "')[1:]

print("=" * 88)
print("     GENERATING OPTIMIZED WEBP THUMBNAILS FOR CERTIFICATE VAULT")
print("=" * 88)

total_orig = 0
total_thumb = 0
stats = []

for block in blocks:
    cert_id = block.split('"')[0]
    
    m_img = re.search(r'image:\s*"([^"]+)"', block)
    if not m_img:
        continue
    
    img_rel = m_img.group(1).lstrip("/")
    src_path = os.path.join(PUBLIC_DIR, img_rel)
    
    if not os.path.exists(src_path):
        print(f"Warning: source image not found for {cert_id}: {src_path}")
        continue
    
    orig_sz = os.path.getsize(src_path)
    total_orig += orig_sz
    
    thumb_rel = f"uploads/thumbs/{cert_id}.webp"
    dst_path = os.path.join(PUBLIC_DIR, thumb_rel)
    
    try:
        with Image.open(src_path) as im:
            orig_w, orig_h = im.size
            # Max width 800, max height 500, preserving aspect ratio
            ratio = min(800 / orig_w, 500 / orig_h)
            new_w = max(1, int(orig_w * ratio))
            new_h = max(1, int(orig_h * ratio))
            
            # Check transparency
            has_alpha = im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info)
            if has_alpha:
                thumb = im.convert('RGBA').resize((new_w, new_h), Image.Resampling.LANCZOS)
            else:
                thumb = im.convert('RGB').resize((new_w, new_h), Image.Resampling.LANCZOS)
                
            thumb.save(dst_path, "WEBP", quality=82, method=6)
            
        thumb_sz = os.path.getsize(dst_path)
        total_thumb += thumb_sz
        reduction = (1 - thumb_sz / orig_sz) * 100
        stats.append((cert_id, orig_sz, thumb_sz, (orig_w, orig_h), (new_w, new_h), reduction))
    except Exception as e:
        print(f"Error processing {cert_id}: {e}")

# Also generate high-res modal webp for IBM prompt engineering to replace 20000x20000 in modal
pe_src = os.path.join(PUBLIC_DIR, "uploads", "IBM", "Prompt Engineering- Shaping Better AI Responses.png")
pe_modal_dst = os.path.join(PUBLIC_DIR, "uploads", "IBM", "prompt-engineering-modal.webp")
if os.path.exists(pe_src):
    with Image.open(pe_src) as im:
        im_modal = im.convert('RGBA').resize((1600, 1600), Image.Resampling.LANCZOS)
        im_modal.save(pe_modal_dst, "WEBP", quality=85)
    print(f"Generated optimized modal preview for IBM Prompt Engineering: {os.path.getsize(pe_modal_dst)/1024:.1f} KB (down from {os.path.getsize(pe_src)/1024:.1f} KB)")

# Also generate homepage.webp if not already generated
hp_src = os.path.join(PUBLIC_DIR, "uploads", "homepage.png")
hp_dst = os.path.join(PUBLIC_DIR, "uploads", "homepage.webp")
if os.path.exists(hp_src):
    with Image.open(hp_src) as im:
        im.convert('RGB').save(hp_dst, "WEBP", quality=85)
    print(f"Generated homepage.webp: {os.path.getsize(hp_dst)/1024:.1f} KB (down from {os.path.getsize(hp_src)/1024:.1f} KB)")

print(f"\nSuccessfully generated {len(stats)} thumbnails in {THUMBS_DIR}!")
print(f"Total Original Size:  {total_orig / 1024 / 1024:8.2f} MB")
print(f"Total Thumbnail Size: {total_thumb / 1024 / 1024:8.2f} MB")
print(f"Net Space Saved:      {(total_orig - total_thumb) / 1024 / 1024:8.2f} MB ({(1 - total_thumb / total_orig) * 100:.1f}% reduction)")
print()
print("Top 10 highest bandwidth savings:")
stats.sort(key=lambda x: x[1] - x[2], reverse=True)
for item in stats[:10]:
    print(f"  {item[0]:<30} {item[1]/1024:7.1f} KB -> {item[2]/1024:5.1f} KB  (-{item[5]:.1f}%)")
print("=" * 88)
