const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'public', 'images');
const filename = 'vase-safi.jpg';
const url = 'https://images.unsplash.com/photo-1593006526979-5f8814c229f9?w=600&fit=crop&auto=format&q=80';

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve()));
    }).on('error', reject);
  });
}

const dest = path.join(OUTPUT_DIR, filename);
download(url, dest).then(() => console.log('✅ Vase Safi downloaded')).catch(err => console.error('❌ Failed:', err.message));
