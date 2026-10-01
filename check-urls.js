const fs = require('fs');
const https = require('https');
const http = require('http');
const content = fs.readFileSync('frontend/src/data/cars.js', 'utf8');

const urlRegex = /image:\s*'(https?:\/\/[^']+)'/g;
const heroRegex = /heroImage:\s*'(https?:\/\/[^']+)'/g;
const logoRegex = /logo:\s*'(https?:\/\/[^']+)'/g;

const urls = new Set();
let m;
while ((m = urlRegex.exec(content)) !== null) urls.add(m[1]);
while ((m = heroRegex.exec(content)) !== null) urls.add(m[1]);
while ((m = logoRegex.exec(content)) !== null) urls.add(m[1]);

function checkUrl(url) {
  return new Promise((resolve) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.request(url, { method: 'HEAD', timeout: 10000 }, (res) => {
      resolve({ url, status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 400 });
    });
    req.on('error', (e) => resolve({ url, status: 'ERROR: ' + e.message, ok: false }));
    req.on('timeout', () => { req.destroy(); resolve({ url, status: 'TIMEOUT', ok: false }); });
    req.end();
  });
}

async function main() {
  const urlList = [...urls];
  console.log('Total unique URLs to check: ' + urlList.length + '\n');
  
  const results = await Promise.all(urlList.map(checkUrl));
  
  const broken = results.filter(r => !r.ok);
  const ok = results.filter(r => r.ok);
  
  console.log('=== BROKEN (' + broken.length + ') ===');
  broken.forEach(r => console.log('  [' + r.status + '] ' + r.url));
  
  console.log('\n=== OK (' + ok.length + ') ===');
  ok.forEach(r => console.log('  [' + r.status + '] ' + r.url));
}

main();
