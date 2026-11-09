import re

path = 'src/lib/certificatesData.ts'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update VaultCertificate interface
if 'thumbnail?: string;' not in content:
    content = content.replace('image?: string;', 'image?: string;\n  thumbnail?: string;')

# 2. Update ibm-prompt-engineering image
content = content.replace(
    'image: "/uploads/IBM/Prompt Engineering- Shaping Better AI Responses.png",',
    'image: "/uploads/IBM/prompt-engineering-modal.webp",'
)

# 3. Add thumbnail to each certificate in CERTIFICATION_VAULT
def add_thumbnail(match):
    full_block = match.group(0)
    cid = match.group(1)
    if 'thumbnail:' in full_block:
        return full_block
    if 'image:' in full_block:
        return re.sub(
            r'(image:\s*"[^"]+",)',
            r'\1\n    thumbnail: "/uploads/thumbs/' + cid + '.webp",',
            full_block,
            count=1
        )
    else:
        return re.sub(
            r'(id:\s*"' + cid + '",)',
            r'\1\n    thumbnail: "/uploads/thumbs/' + cid + '.webp",',
            full_block,
            count=1
        )

pattern = re.compile(r'\{\s*id:\s*"([a-zA-Z0-9_-]+)"[\s\S]*?hasVerifiedLink:\s*(?:true|false),?\s*\}')
new_content = pattern.sub(add_thumbnail, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Updated certificatesData.ts successfully")
