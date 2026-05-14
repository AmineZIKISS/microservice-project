const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'public', 'images');

// Each entry: [filename, direct image URL]
// Sources: Unsplash direct, Pexels direct, Wikimedia Commons
const images = [
  ['tapis-beni-ouarain.jpg',   'https://images.unsplash.com/photo-1600166898405-da9535204843?w=600&fit=crop&auto=format&q=80'],
  ['tapis-azilal.jpg',         'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=600&fit=crop&auto=format&q=80'],
  ['tajine-terre-cuite.jpg',   'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600&fit=crop&auto=format&q=80'],
  ['assiettes-fassi.jpg',      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&fit=crop&auto=format&q=80'],
  ['vase-safi.jpg',            'https://images.unsplash.com/photo-1612196808214-b40bfb1aa61c?w=600&fit=crop&auto=format&q=80'],
  ['collier-berbere.jpg',      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&fit=crop&auto=format&q=80'],
  ['bracelet-amazigh.jpg',     'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&fit=crop&auto=format&q=80'],
  ['babouches-cuir.jpg',       'https://images.unsplash.com/photo-1555708982-8645ec9ce3cc?w=600&fit=crop&auto=format&q=80'],
  ['pouf-marocain.jpg',        'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=600&fit=crop&auto=format&q=80'],
  ['sac-besace-cuir.jpg',      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&fit=crop&auto=format&q=80'],
  ['theiere-argentee.jpg',     'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600&fit=crop&auto=format&q=80'],
  ['plateau-cuivre.jpg',       'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=600&fit=crop&auto=format&q=80'],
  ['lanterne-cuivre.jpg',      'https://images.unsplash.com/photo-1553531384-397c80973a0b?w=600&fit=crop&auto=format&q=80'],
  ['miroir-bois-sculpte.jpg',  'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&fit=crop&auto=format&q=80'],
  ['huile-argan.jpg',          'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&fit=crop&auto=format&q=80'],
  ['savon-noir-beldi.jpg',     'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=600&fit=crop&auto=format&q=80'],
  ['djellaba-homme.jpg',       'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&fit=crop&auto=format&q=80'],
  ['caftan-femme.jpg',         'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&fit=crop&auto=format&q=80'],
];

// Follow redirects (Unsplash returns 301/302)
function download(url, dest, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) return reject(new Error('Too many redirects'));

    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      // Follow redirects
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
        return download(res.headers.location, dest, maxRedirects - 1).then(resolve).catch(reject);
      }

      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }

      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve()));
      file.on('error', (err) => { fs.unlink(dest, () => {}); reject(err); });
    }).on('error', reject);
  });
}

async function main() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log(`\n📁 Saving images to: ${OUTPUT_DIR}\n`);

  let success = 0;
  let failed = 0;

  for (const [filename, url] of images) {
    const dest = path.join(OUTPUT_DIR, filename);
    process.stdout.write(`  ⬇️  ${filename} ... `);
    try {
      await download(url, dest);
      const size = fs.statSync(dest).size;
      console.log(`✅ (${(size / 1024).toFixed(0)} KB)`);
      success++;
    } catch (err) {
      console.log(`❌ ${err.message}`);
      failed++;
    }
  }

  console.log(`\n🏁 Done: ${success} downloaded, ${failed} failed.\n`);
}

main();
