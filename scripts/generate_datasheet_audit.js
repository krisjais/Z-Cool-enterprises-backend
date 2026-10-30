const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

async function run() {
  await mongoose.connect('mongodb://127.0.0.1:27017/z-cool-tech');
  const Product = require('../models/Product');

  const dbProducts = await Product.find().lean();
  console.log(`Database Products: ${dbProducts.length}`);

  // Also read frontend static products
  const staticPath = 'C:\\Users\\AFFAN KHAN\\OneDrive\\Desktop\\zcool\\Z-Cool-enterprises\\src\\data\\products.js';
  let staticProducts = [];
  if (fs.existsSync(staticPath)) {
    const content = fs.readFileSync(staticPath, 'utf8');
    // Extract array if export default
    try {
      const match = content.match(/export const PRODUCTS_CATALOG = (\[[\s\S]*\]);/);
      if (match) {
        staticProducts = JSON.parse(match[1]);
      }
    } catch (e) {
      console.log('Parsing static products via JSON failed, parsing roughly:', e.message);
    }
  }

  const brandCounts = {};
  dbProducts.forEach(p => {
    const brand = p.brand || 'Unknown';
    brandCounts[brand] = (brandCounts[brand] || 0) + 1;
  });

  console.log('Brand breakdown in MongoDB:');
  console.log(JSON.stringify(brandCounts, null, 2));

  // Check how many have datasheet field populated
  const withDatasheet = dbProducts.filter(p => p.datasheet && p.datasheet.url);
  console.log(`Products in DB with datasheet.url: ${withDatasheet.length}`);
  withDatasheet.forEach(p => {
    console.log(`- ${p.brand} ${p.code || p.name}: ${p.datasheet.url} (Model: ${p.datasheet.model}, OEM: ${p.datasheet.oemModelCode})`);
  });

  await mongoose.disconnect();
}

run().catch(console.error);
