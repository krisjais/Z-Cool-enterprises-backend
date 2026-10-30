const mongoose = require('mongoose');

async function audit() {
  await mongoose.connect('mongodb://127.0.0.1:27017/z-cool-tech');
  const Product = require('../models/Product');
  
  const allProducts = await Product.find().lean();
  console.log(`Total products in MongoDB: ${allProducts.length}`);

  const withDatasheet = allProducts.filter(p => p.datasheet || (Array.isArray(p.downloads) && p.downloads.length > 0));
  console.log(`Products with datasheet or downloads: ${withDatasheet.length}`);
  
  withDatasheet.forEach(p => {
    console.log(`\nProduct: ${p.name} (${p.id})`);
    console.log(`Brand: ${p.brand} | Model: ${p.code || p.modelNumber}`);
    console.log(`Datasheet object:`, p.datasheet);
    console.log(`Downloads:`, p.downloads);
  });

  // Check Copeland ZR72KC specifically
  const copeland = allProducts.find(p => (p.id || '').toLowerCase().includes('zr72') || (p.code || '').toLowerCase().includes('zr72'));
  if (copeland) {
    console.log('\n--- COPELAND ZR72 RECORD ---');
    console.log('ID:', copeland.id);
    console.log('Name:', copeland.name);
    console.log('Code:', copeland.code);
    console.log('CatalogCode:', copeland.catalogCode);
    console.log('Datasheet:', copeland.datasheet);
    console.log('Downloads:', copeland.downloads);
  }

  await mongoose.disconnect();
}

audit().catch(console.error);
