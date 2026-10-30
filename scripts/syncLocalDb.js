const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { runAutomatedImport } = require('./automaticProductImporter');

async function syncLocalDb() {
  const localUri = 'mongodb://127.0.0.1:27017/z-cool-tech';
  console.log('[SYNC] Connecting to confirmed local database:', localUri);
  await mongoose.connect(localUri);
  console.log('[SYNC] Connected. DB:', mongoose.connection.name, 'Host:', mongoose.connection.host);

  // Read backup of existing 177 products
  const backupPath = path.join(__dirname, '../backups/catalogue_backup_2026-10-28T11-51-44-046Z.json');
  if (!fs.existsSync(backupPath)) {
    throw new Error('Backup file not found at: ' + backupPath);
  }

  const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
  console.log(`[SYNC] Found ${backup.products.length} products and ${backup.categories.length} categories in backup.`);

  const currentCount = await Product.countDocuments();
  console.log(`[SYNC] Current products in local z-cool-tech: ${currentCount}`);

  if (currentCount === 0) {
    console.log('[SYNC] Populating local z-cool-tech with 177 products from backup...');
    // Clean products and insert
    for (const prod of backup.products) {
      delete prod._id; // Let mongoose assign or keep clean
      delete prod.__v;
      try {
        await Product.create(prod);
      } catch (err) {
        console.warn(`[SYNC] Insert notice for ${prod.name}:`, err.message);
      }
    }
    const afterCount = await Product.countDocuments();
    console.log(`[SYNC] Inserted products. Local DB now has ${afterCount} products.`);
  }

  // Ensure categories are present
  const catCount = await Category.countDocuments();
  if (catCount === 0 && backup.categories?.length > 0) {
    console.log('[SYNC] Populating local categories...');
    for (const cat of backup.categories) {
      delete cat._id;
      delete cat.__v;
      try {
        await Category.create(cat);
      } catch (_) {}
    }
  }

  await mongoose.disconnect();

  // Now run automated import for Danfoss SM110S4EA into local z-cool-tech
  console.log('\n[SYNC] Running automated import of Danfoss SM110S4EA into local z-cool-tech...');
  const res = await runAutomatedImport({ mongoUri: localUri });
  console.log('[SYNC] Import result:', res.action, '| Total products in local z-cool-tech:', res.finalCount);

  await mongoose.disconnect();
}

syncLocalDb().catch(err => {
  console.error('[SYNC ERROR]:', err);
  process.exit(1);
});
