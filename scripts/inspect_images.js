const fs = require('fs');

async function main() {
  const rows = JSON.parse(fs.readFileSync('scripts/parsed_rows_raw.json', 'utf8'));
  for (let idx = 0; idx < rows.length; idx++) {
    const r = rows[idx];
    const rowNum = idx + 1;
    console.log(`\n================ ROW ${rowNum} ================`);
    console.log(`Title: ${r.title}`);
    console.log(`URL: ${r.url}`);
    const urls = [];
    if (r.mainImage) urls.push({ key: 'mainImage', url: r.mainImage });
    for (let i = 0; i < 5; i++) {
      if (r[`images/${i}/full`]) urls.push({ key: `images/${i}/full`, url: r[`images/${i}/full`] });
    }
    for (const item of urls) {
      try {
        const res = await fetch(item.url, { method: 'HEAD' });
        const filename = item.url.split('/').pop();
        console.log(`  [${res.status}] ${item.key}: ${filename}`);
      } catch (e) {
        console.log(`  [ERR] ${item.key}: ${e.message}`);
      }
    }
  }
}

main().catch(console.error);
