const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const candidateUrls = [
  {
    name: 'candidate_1_raw_source',
    url: 'https://5.imimg.com/data5/ANDROID/Default/2026/8/632097144/QQ/IN/IA/112017448/drive-primary-1785905802186-jpeg-1000x1000.jpeg',
    note: 'Original Apify source image (1000x1000)'
  },
  {
    name: 'candidate_2_seller_view1',
    url: 'https://5.imimg.com/data5/SELLER/Default/2026/3/593192246/KM/YZ/ZI/260365553/ate690-highly-rotary-compressor-1000x1000.jpeg',
    note: 'Alternative IndiaMART ATE690 seller image 1'
  },
  {
    name: 'candidate_3_seller_view2',
    url: 'https://5.imimg.com/data5/SELLER/Default/2026/3/593192626/TN/IS/HG/260365553/ate690-highly-rotary-compressor-1000x1000.jpeg',
    note: 'Alternative IndiaMART ATE690 seller image 2'
  },
  {
    name: 'candidate_4_seller_view3',
    url: 'https://5.imimg.com/data5/SELLER/Default/2026/3/593716820/CU/VN/XY/260365553/ate690-highly-rotary-compressor-1000x1000.jpeg',
    note: 'Alternative IndiaMART ATE690 seller image 3'
  },
  {
    name: 'candidate_5_seller_view4',
    url: 'https://5.imimg.com/data5/SELLER/Default/2026/3/593716754/IK/JK/WU/260365553/ate690-highly-rotary-compressor-1000x1000.jpeg',
    note: 'Alternative IndiaMART ATE690 seller image 4'
  }
];

async function downloadCandidates() {
  const outDir = path.join(__dirname, '../temp_images/highly_candidates');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const results = [];
  for (const item of candidateUrls) {
    try {
      const res = await fetch(item.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      if (!res.ok) {
        console.log(`Failed ${item.name}: status ${res.status}`);
        continue;
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      const hash = crypto.createHash('md5').update(buffer).digest('hex');
      const filename = `${item.name}.jpg`;
      const filePath = path.join(outDir, filename);
      fs.writeFileSync(filePath, buffer);
      results.push({
        name: item.name,
        filename,
        filePath,
        sizeBytes: buffer.length,
        md5: hash,
        note: item.note,
        url: item.url
      });
      console.log(`Downloaded ${item.name}: ${buffer.length} bytes, MD5: ${hash}`);
    } catch (err) {
      console.error(`Error downloading ${item.name}:`, err.message);
    }
  }

  fs.writeFileSync(path.join(outDir, 'candidates_manifest.json'), JSON.stringify(results, null, 2));
  console.log('Finished downloading all candidate images.');
}

downloadCandidates();
