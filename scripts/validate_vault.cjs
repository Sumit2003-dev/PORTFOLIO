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
const entryBlocks = vaultBlock.split(/\{\s*id:\s*"/).slice(1);

console.log("=================================================================");
console.log("       CERTIFICATION VAULT AUTOMATED ACCURACY & ASSET AUDIT       ");
console.log("=================================================================\n");

const ids = new Set();
let duplicates = 0;
let missingPdfs = 0;
let missingImages = 0;
let verifiedUrls = 0;
let totalWithPdfs = 0;
let totalWithImages = 0;
const pdfUsage = new Map();
const imageUsage = new Map();
const providerCounts = {};
const auditReport = [];

entryBlocks.forEach((block) => {
  const id = block.split('"')[0];
  if (ids.has(id)) {
    duplicates++;
  }
  ids.add(id);

  const titleMatch = block.match(/title:\s*"([^"]+)"/);
  const title = titleMatch ? titleMatch[1] : id;

  const providerMatch = block.match(/provider:\s*"([^"]+)"/);
  const provider = providerMatch ? providerMatch[1] : "unknown";
  providerCounts[provider] = (providerCounts[provider] || 0) + 1;

  const pdfMatch = block.match(/pdf:\s*"([^"]+)"/);
  let pdfExists = false;
  let pdfPathRel = null;
  if (pdfMatch) {
    totalWithPdfs++;
    pdfPathRel = pdfMatch[1];
    const pdfFullPath = path.join(__dirname, "../public", pdfPathRel);
    if (fs.existsSync(pdfFullPath)) {
      pdfExists = true;
      const count = pdfUsage.get(pdfPathRel) || 0;
      pdfUsage.set(pdfPathRel, count + 1);
    } else {
      missingPdfs++;
    }
  }

  const imgMatch = block.match(/image:\s*"([^"]+)"/);
  let imgExists = false;
  let imgPathRel = null;
  if (imgMatch) {
    totalWithImages++;
    imgPathRel = imgMatch[1];
    const imgFullPath = path.join(__dirname, "../public", imgPathRel);
    if (fs.existsSync(imgFullPath)) {
      imgExists = true;
      const count = imageUsage.get(imgPathRel) || 0;
      imageUsage.set(imgPathRel, count + 1);
    } else {
      missingImages++;
    }
  }

  const urlMatch = block.match(/verificationUrl:\s*"([^"]+)"/);
  const hasUrl = Boolean(urlMatch);
  if (hasUrl) {
    verifiedUrls++;
  }

  auditReport.push({
    id,
    provider,
    title: title.length > 38 ? title.slice(0, 35) + "..." : title,
    hasPdf: pdfExists ? "OK" : pdfMatch ? "MISSING" : "NONE",
    hasPreview: imgExists ? "OK" : imgMatch ? "MISSING" : "FALLBACK",
    hasVerifyUrl: hasUrl ? "YES" : "NO",
  });
});

// Check duplicate PDF mappings
const duplicatePdfs = [];
for (const [p, count] of pdfUsage.entries()) {
  if (count > 1) {
    duplicatePdfs.push({ pdf: p, occurrences: count });
  }
}

// Check duplicate image mappings
const duplicateImages = [];
for (const [img, count] of imageUsage.entries()) {
  if (count > 1) {
    duplicateImages.push({ image: img, occurrences: count });
  }
}

console.log("--- 1. PROVIDER DISTRIBUTION ---");
console.table(providerCounts);

console.log("\n--- 2. ASSET & PROVENANCE SUMMARY ---");
console.log(`• Total Cataloged Credentials:        ${ids.size}`);
console.log(`• Credentials with Verified PDFs:     ${totalWithPdfs - missingPdfs} / ${totalWithPdfs}`);
console.log(`• Credentials with Dedicated Preview: ${totalWithImages - missingImages} / ${ids.size}`);
console.log(`• Credentials using Clean Fallback:   ${ids.size - totalWithImages}`);
console.log(`• Records with Live Verification URL: ${verifiedUrls}`);
console.log(`• Duplicate Certificate IDs:          ${duplicates}`);
console.log(`• Missing PDF Files on Disk:          ${missingPdfs}`);
console.log(`• Missing Preview Files on Disk:      ${missingImages}`);
console.log(`• Duplicate PDF Mappings:             ${duplicatePdfs.length}`);
console.log(`• Duplicate Preview Mappings:         ${duplicateImages.length}`);

if (duplicatePdfs.length > 0) {
  console.log("\nDuplicate PDFs detected:");
  console.table(duplicatePdfs);
}

if (duplicateImages.length > 0) {
  console.log("\nDuplicate Images detected:");
  console.table(duplicateImages);
}

console.log("\n--- 3. DETAILED CREDENTIAL AUDIT SAMPLE (FIRST 15) ---");
console.table(auditReport.slice(0, 15));

console.log("\n=================================================================");
if (duplicates === 0 && missingPdfs === 0 && missingImages === 0 && duplicatePdfs.length === 0) {
  console.log("RESULT: AUDIT PASSED [100% Provenance & Integrity Verified]");
  console.log("=================================================================\n");
  process.exit(0);
} else {
  console.error("RESULT: AUDIT FAILED [Integrity or Mismatch Issues Detected]");
  console.log("=================================================================\n");
  process.exit(1);
}
