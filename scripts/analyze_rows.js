const fs = require('fs');
const rows = JSON.parse(fs.readFileSync('scripts/parsed_rows_raw.json', 'utf8'));

rows.forEach((r, idx) => {
  console.log(`\n================================================================`);
  console.log(`ROW ${idx + 1}:`);
  console.log(`Title: ${r.title}`);
  console.log(`URL: ${r.url}`);
  console.log(`Price: "${r.price}" | PriceDisplay: "${r.priceDisplay}" | Currency: "${r.currency}"`);
  console.log(`Main Image: ${r.mainImage}`);
  
  // Extract images
  const images = [];
  for (const [k, v] of Object.entries(r)) {
    if ((k === 'mainImage' || k.startsWith('images/') || k.startsWith('additionalImages/')) && v) {
      images.push({ key: k, url: v });
    }
  }
  console.log(`Images (${images.length}):`, images);
  
  // Extract brochure
  if (r.brochureUrl) {
    console.log(`Brochure URL: ${r.brochureUrl}`);
  }

  // Extract seller/company
  console.log(`Company Name: ${r['companyDetails/companyName'] || r['companyName']}`);
  console.log(`Seller Location: ${r['companyDetails/city'] || r['companyDetails/location'] || r['city']}`);

  // Extract specifications
  const specs = {};
  for (let i = 0; i < 30; i++) {
    const kKey = `specifications/${i}/key`;
    const vKey = `specifications/${i}/value`;
    if (r[kKey] || r[vKey]) {
      specs[r[kKey]] = r[vKey];
    }
  }
  console.log(`Specifications:`, specs);

  // Description / About
  console.log(`Description (first 200 chars):`, (r.description || '').slice(0, 200));
});
