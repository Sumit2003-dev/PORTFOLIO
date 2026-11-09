import os
import shutil

src_root = r"C:\Users\SUMIT KUMAR\OneDrive\Desktop\google certificates"
dest_root = r"c:\Users\SUMIT KUMAR\OneDrive\Desktop\PROJECTS(1)\PERSONAL PORTFOLIO WEBSITE\sumit2003dev-main\public\uploads"

os.makedirs(dest_root, exist_ok=True)

copied_count = 0
skipped_count = 0

for root, dirs, files in os.walk(src_root):
    rel_dir = os.path.relpath(root, src_root)
    target_dir = os.path.join(dest_root, rel_dir) if rel_dir != "." else dest_root
    os.makedirs(target_dir, exist_ok=True)
    
    for f in files:
        src_file = os.path.join(root, f)
        dest_file = os.path.join(target_dir, f)
        
        # Don't copy huge zip / giant non-certificate files if not needed
        if not os.path.exists(dest_file) or os.path.getsize(src_file) != os.path.getsize(dest_file):
            shutil.copy2(src_file, dest_file)
            copied_count += 1
            print(f"Copied: {os.path.relpath(dest_file, dest_root)}")
        else:
            skipped_count += 1

print(f"\nSync complete: {copied_count} files copied, {skipped_count} already up-to-date.")

