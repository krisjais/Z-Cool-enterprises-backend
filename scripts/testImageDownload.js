const fs = require('fs');
const path = require('path');
const https = require('https');

const imageUrls = [
  { label: 'mainImage', url: 'https://5.imimg.com/data5/SELLER/Default/2026/5/611908097/JX/XH/YT/85009421/whatsapp-image-2024-12-06-at-6-32-51-pm-2.jpeg' },
  { label: 'img0', url: 'https://5.imimg.com/data5/SELLER/Default/2024/12/471157977/AE/WH/AQ/85009421/whatsapp-image-2024-12-06-at-6-32-51-pm.jpeg' },
  { label: 'img1', url: 'https://5.imimg.com/data5/SELLER/Default/2024/12/471157968/CS/ID/VB/85009421/whatsapp-image-2024-12-06-at-6-32-52-pm.jpeg' },
  { label: 'img2', url: 'https://5.imimg.com/data5/SELLER/Default/2024/12/471157966/UI/KA/YT/85009421/whatsapp-image-2024-12-06-at-6-32-52-pm-1.jpeg' },
];

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        fs.writeFileSync(destPath, buffer);
        resolve({
          statusCode: res.statusCode,
          contentType: res.headers['content-type'],
          length: buffer.length
        });
      });
    }).on('error', reject);
  });
}

async function run() {
  const tmpDir = path.join(__dirname, '../temp_images');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  for (const item of imageUrls) {
    const filename = `${item.label}.jpeg`;
    const dest = path.join(tmpDir, filename);
    try {
      const res = await downloadFile(item.url, dest);
      console.log(`[SUCCESS] ${item.label}: HTTP ${res.statusCode}, ${res.contentType}, ${res.length} bytes -> ${dest}`);
    } catch (err) {
      console.error(`[ERROR] ${item.label} (${item.url}):`, err.message);
    }
  }
}

run();
