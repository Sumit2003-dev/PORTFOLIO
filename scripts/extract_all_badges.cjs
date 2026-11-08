const fs = require('fs');

const html = fs.readFileSync('profile_dump.html', 'utf8');

// Regex to capture each badge block
const badgeRegex = /<div class=['"]profile-badge['"]>([\s\S]*?)<\/div>\s*(?:<\/div>|<div class=['"]profile-badge['"])/gi;

const badges = [];

// Split by <div class='profile-badge'>
const parts = html.split(/<div class=['"]profile-badge['"]>/i);
console.log('Total split parts:', parts.length);

for (let i = 1; i < parts.length; i++) {
  const part = parts[i];
  
  // Extract href
  const hrefMatch = part.match(/<a[^>]*class=['"][^'"]*badge-image[^'"]*['"][^>]*href=['"]([^'"]+)['"]/i) ||
                    part.match(/href=['"](https:\/\/www\.skills\.google\/public_profiles\/[^'"]+)['"]/i);
  const href = hrefMatch ? hrefMatch[1] : '';

  // Extract img src
  const imgMatch = part.match(/<img[^>]*src=['"]([^'"]+)['"]/i);
  const img = imgMatch ? imgMatch[1] : '';

  // Extract title
  const titleMatch = part.match(/<span class=['"]ql-title-medium[^'"]*['"]>([\s\S]*?)<\/span>/i);
  let title = titleMatch ? titleMatch[1].trim() : '';
  title = title
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ');

  // Extract date
  const dateMatch = part.match(/<span class=['"]ql-body-medium[^'"]*['"]>([\s\S]*?)<\/span>/i);
  let dateStr = dateMatch ? dateMatch[1].trim() : '';
  dateStr = dateStr
    .replace(/Earned\s+/i, '')
    .replace(/\s+EST/i, '')
    .replace(/\s+EDT/i, '')
    .replace(/\s+/g, ' ');

  if (title) {
    // Categorize based on title
    let category = 'Cloud Infrastructure';
    let iconType = 'cloud';
    const lower = title.toLowerCase();

    if (
      lower.includes('generative ai') ||
      lower.includes('genai') ||
      lower.includes('gemini') ||
      lower.includes('large language model') ||
      lower.includes('llm') ||
      lower.includes('prompt') ||
      lower.includes('transformer') ||
      lower.includes('deepmind') ||
      lower.includes('ai studio') ||
      lower.includes('natural language') ||
      lower.includes('vertex ai') ||
      lower.includes('neural')
    ) {
      category = 'Generative AI';
      iconType = lower.includes('deepmind') ? 'deepmind' : 'gemini';
    } else if (
      lower.includes('bigquery') ||
      lower.includes('data') ||
      lower.includes('dataproc') ||
      lower.includes('dataflow') ||
      lower.includes('spark') ||
      lower.includes('sql') ||
      lower.includes('analytics') ||
      lower.includes('looker') ||
      lower.includes('warehouse') ||
      lower.includes('pipeline') ||
      lower.includes('database') ||
      lower.includes('spanner') ||
      lower.includes('cloud sql')
    ) {
      category = 'Data & BigQuery';
      iconType = 'data';
    } else if (
      lower.includes('security') ||
      lower.includes('iam') ||
      lower.includes('kms') ||
      lower.includes('armor') ||
      lower.includes('protect') ||
      lower.includes('network') ||
      lower.includes('vpc') ||
      lower.includes('firewall') ||
      lower.includes('beyondcorp')
    ) {
      category = 'Security & IAM';
      iconType = 'security';
    } else if (
      lower.includes('devops') ||
      lower.includes('terraform') ||
      lower.includes('sre') ||
      lower.includes('monitor') ||
      lower.includes('log') ||
      lower.includes('ci/cd') ||
      lower.includes('build') ||
      lower.includes('deploy') ||
      lower.includes('cloud operations')
    ) {
      category = 'DevOps & SRE';
      iconType = 'devops';
    } else if (lower.includes('kubernetes') || lower.includes('gke') || lower.includes('container') || lower.includes('docker')) {
      category = 'Cloud Infrastructure';
      iconType = 'kubernetes';
    }

    // Extract skills / keywords
    const skills = [];
    if (lower.includes('gemini')) skills.push('Gemini');
    if (lower.includes('vertex')) skills.push('Vertex AI');
    if (lower.includes('bigquery')) skills.push('BigQuery');
    if (lower.includes('sql')) skills.push('SQL');
    if (lower.includes('kubernetes') || lower.includes('gke')) skills.push('Kubernetes');
    if (lower.includes('terraform')) skills.push('Terraform');
    if (lower.includes('security') || lower.includes('iam')) skills.push('Cloud Security');
    if (lower.includes('cloud run')) skills.push('Cloud Run');
    if (lower.includes('cloud storage')) skills.push('Cloud Storage');
    if (lower.includes('prompt')) skills.push('Prompting');
    if (lower.includes('deepmind')) skills.push('DeepMind');
    if (skills.length === 0) {
      skills.push('Google Cloud', category.split(' ')[0]);
    }

    const badgeId = href ? href.split('/').pop() : `badge-${i}`;

    badges.push({
      id: `gcp-${badgeId}`,
      title,
      category,
      earnedDate: dateStr,
      description: `Official Google Cloud skill badge validating practical competency in ${title}.`,
      skills,
      iconType,
      imageUrl: img,
      verificationUrl: href || 'https://www.skills.google/public_profiles/d8429119-44bb-443a-8563-87b7953f74e9',
    });
  }
}

console.log(`Successfully extracted ${badges.length} verified badges!`);
console.log('Sample badge 0:', badges[0]);
console.log('Sample badge 1:', badges[1]);
console.log('Sample badge 2:', badges[2]);

// Count by category
const catCounts = {};
badges.forEach(b => {
  catCounts[b.category] = (catCounts[b.category] || 0) + 1;
});
console.log('Category distribution:', catCounts);

// Save to JSON file
fs.writeFileSync('src/lib/googleSkillsBadges.json', JSON.stringify(badges, null, 2));
console.log('Saved all badges to src/lib/googleSkillsBadges.json');
