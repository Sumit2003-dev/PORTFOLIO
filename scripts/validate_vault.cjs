const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../src/lib/certificatesData.ts");
const content = fs.readFileSync(filePath, "utf8");

// Extract CERTIFICATION_VAULT array
const vaultMatch = content.match(/export const CERTIFICATION_VAULT: VaultCertificate\[\] = \[([\s\S]*?)\];\s*$/);
if (!vaultMatch) {
  console.error("Could not find CERTIFICATION_VAULT in certificatesData.ts");
  process.exit(1);
}

const vaultBlock = vaultMatch[1];

// Parse each entry
const entryBlocks = vaultBlock.split(/\{\s*id:\s*"/).slice(1);
console.log(`Found ${entryBlocks.length} entries in CERTIFICATION_VAULT.`);

const ids = new Set();
let duplicates = 0;
let missingPdfs = 0;
let missingImages = 0;
let verifiedUrls = 0;
let totalWithPdfs = 0;
let totalWithImages = 0;
const providerCounts = {};

entryBlocks.forEach((block, idx) => {
  const id = block.split('"')[0];
  if (ids.has(id)) {
    console.error(`Duplicate ID found: ${id}`);
    duplicates++;
  }
  ids.add(id);

  const providerMatch = block.match(/provider:\s*"([^"]+)"/);
  const provider = providerMatch ? providerMatch[1] : "unknown";
  providerCounts[provider] = (providerCounts[provider] || 0) + 1;

  const pdfMatch = block.match(/pdf:\s*"([^"]+)"/);
  if (pdfMatch) {
    totalWithPdfs++;
    const pdfPath = path.join(__dirname, "../public", pdfMatch[1]);
    if (!fs.existsSync(pdfPath)) {
      console.error(`Missing PDF for [${id}]: ${pdfMatch[1]}`);
      missingPdfs++;
    }
  }

  const imgMatch = block.match(/image:\s*"([^"]+)"/);
  if (imgMatch) {
    totalWithImages++;
    const imgPath = path.join(__dirname, "../public", imgMatch[1]);
    if (!fs.existsSync(imgPath)) {
      console.error(`Missing Image for [${id}]: ${imgMatch[1]}`);
      missingImages++;
    }
  }

  const urlMatch = block.match(/verificationUrl:\s*"([^"]+)"/);
  if (urlMatch) {
    verifiedUrls++;
  }
});

console.log("\n--- Provider Distribution ---");
console.table(providerCounts);
console.log(`Total Credentials: ${ids.size}`);
console.log(`Credentials with on-file PDFs: ${totalWithPdfs}`);
console.log(`Credentials with artwork/thumbnails: ${totalWithImages}`);
console.log(`Credentials with live Verification URLs: ${verifiedUrls}`);
console.log(`Duplicate IDs: ${duplicates}`);
console.log(`Missing PDFs: ${missingPdfs}`);
console.log(`Missing Images: ${missingImages}`);

if (duplicates > 0 || missingPdfs > 0 || missingImages > 0) {
  console.error("\nFAIL: Integrity issues found.");
  process.exit(1);
} else {
  console.log("\nSUCCESS: All files verified on disk with zero broken paths!");
}
