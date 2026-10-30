const fs = require('fs');

function parseCSV(text) {
  let p = '', row = [''], rows = [row], i = 0, s = true;
  for (let l of text) {
    if ('"' === l) {
      if (s && l === p) row[row.length - 1] += l;
      s = !s;
    } else if (',' === l && s) l = row[row.length] = '';
    else if ('\n' === l && s) {
      if ('\r' === p) row[row.length - 1] = row[row.length - 1].slice(0, -1);
      row = [l = ''];
      rows.push(row);
    } else row[row.length - 1] += l;
    p = l;
  }
  return rows.filter(r => r.length > 1 || (r[0] && r[0].trim() !== ''));
}

function extractCsvProduct(csvPath) {
  let content = fs.readFileSync(csvPath, 'utf8');
  // Strip BOM if present
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  const rows = parseCSV(content);
  if (rows.length < 2) {
    throw new Error('CSV has insufficient rows');
  }

  const headers = rows[0].map(h => h.trim());
  const data = rows[1];
  const map = {};
  headers.forEach((h, idx) => {
    map[h] = data[idx] !== undefined ? data[idx].trim() : '';
  });

  // Extract specs from specifications/X/key and specifications/X/value
  const specs = [];
  let specIdx = 0;
  while (map[`specifications/${specIdx}/key`] !== undefined) {
    const k = map[`specifications/${specIdx}/key`];
    const v = map[`specifications/${specIdx}/value`];
    if (k && v) {
      specs.push({ key: k, value: v });
    }
    specIdx++;
  }

  // Extract images
  const imageCandidates = [];
  if (map['mainImage']) {
    imageCandidates.push({ label: 'mainImage', url: map['mainImage'] });
  }
  let imgIdx = 0;
  while (map[`images/${imgIdx}/full`] !== undefined || map[`images/${imgIdx}/medium`] !== undefined) {
    const full = map[`images/${imgIdx}/full`];
    const med = map[`images/${imgIdx}/medium`];
    if (full) {
      imageCandidates.push({ label: `images/${imgIdx}/full`, url: full });
    } else if (med) {
      imageCandidates.push({ label: `images/${imgIdx}/medium`, url: med });
    }
    imgIdx++;
  }

  return {
    rawMap: map,
    title: map['title'],
    url: map['url'],
    priceValue: parseFloat(map['price/value']) || 0,
    priceDisplay: map['price/displayString'] || '',
    priceCurrency: map['price/currency'] || 'INR',
    mcatName: map['mcatName'] || 'Scroll Compressor',
    specs,
    imageCandidates,
    sellerCompany: map['companyDetails/name'] || '',
  };
}

module.exports = { extractCsvProduct };

if (require.main === module) {
  const res = extractCsvProduct('C:\\Users\\AFFAN KHAN\\Downloads\\dataset_indiamart-scraper_2026-10-28_10-53-51-545.csv');
  console.log('Title:', res.title);
  console.log('Price:', res.priceValue, res.priceCurrency, res.priceDisplay);
  console.log('Category / MCat:', res.mcatName);
  console.log('Specs count:', res.specs.length);
  res.specs.forEach(s => console.log(`  - ${s.key}: ${s.value}`));
  console.log('Images candidates count:', res.imageCandidates.length);
  res.imageCandidates.forEach(i => console.log(`  [${i.label}] ${i.url}`));
}
