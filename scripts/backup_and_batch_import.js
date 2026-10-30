const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/z-cool-tech';
  console.log('[Safety Check] Connecting to:', uri);
  if (!uri.includes('127.0.0.1') && !uri.includes('localhost')) {
    throw new Error('FATAL: Attempted to run on non-local database!');
  }

  await mongoose.connect(uri);
  console.log('[Safety Check] Connected to local host:', mongoose.connection.host);
  console.log('[Safety Check] Database name:', mongoose.connection.name);

  const Product = require('../models/Product');

  // 1. BACKUP CURRENT CATALOGUE
  const existingProducts = await Product.find().lean();
  console.log(`[Backup] Existing products count in MongoDB: ${existingProducts.length}`);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(__dirname, '../backups');
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

  const backupPath = path.join(backupDir, `catalogue_backup_pre_bulk_import_${timestamp}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(existingProducts, null, 2), 'utf8');
  console.log(`[Backup] Saved ${existingProducts.length} records to: ${backupPath}`);

  // 2. DEFINE VERIFIED PRODUCT RECORD FOR HIGHLY ATE690UC3Q9JK
  const highlyProduct = {
    id: 'highly-ate690uc3q9jk',
    slug: 'highly-ate690uc3q9jk',
    code: 'ATE690UC3Q9JK',
    catalogCode: 'Z-HIGHLY-ATE690',
    name: 'Highly ATE690UC3Q9JK 5 TR Twin Rotary Compressor',
    brand: 'Highly',
    tagline: 'Commercial 5 TR Hermetic Twin Rotary AC Compressor',
    category: 'Rotary Compressors',
    type: 'Hermetic Rotary (Twin Rotary)',
    condition: 'Refurbished & Pressure Tested',
    availability: 'IN STOCK',
    voltage: '380V–415V, 3-Phase, 50Hz',
    displacement: '69.0 cm³/rev',
    coolingCapacity: '5 TR (~58,000 BTU/hr / 17.5 kW)',
    refrigerant: 'R410A',
    application: 'Commercial AC package units, chillers & ducted splits',
    accentColor: '#0E4B75',
    statusBadge: 'Verified OEM Match · Technical Documentation Available',
    verificationStatus: 'Verified OEM Commercial Match',
    imageType: 'verified',
    imageDisclaimer: 'Physical nameplate verified — model stamped ATE690UC3Q9JK.',
    shortDescription: 'Commercial hermetic twin rotary compressor manufactured by Shanghai Highly (Hitachi technology partner) under model code ATE690UC3Q9JK. Engineered for light-commercial split air conditioning, package units, and heat pumps with 5 TR cooling capacity.',
    description: 'Commercial hermetic twin rotary compressor manufactured by Shanghai Highly (Hitachi technology partner) under model code ATE690UC3Q9JK. Engineered for light-commercial split air conditioning, package units, and heat pumps with 5 TR cooling capacity. Operates on 380–415V three-phase electrical distribution with R410A refrigerant. Dispatched from Mumbai technical desk with pressure hold testing and oil level verification.',
    featured: true,
    inStock: true,
    status: 'Active',
    price: 27000,
    pricingMode: 'Request Quote',
    keySpecs: [
      { label: 'Displacement', value: '69.0 cm³/rev' },
      { label: 'Rated Capacity', value: '5 TR (~58,000 BTU/hr / 17.5 kW)' },
      { label: 'Electrical', value: '380V–415V, 3-Phase, 50Hz' },
      { label: 'Refrigerant', value: 'R410A' },
      { label: 'Technology', value: 'Twin Rotary' }
    ],
    specs: {
      electrical: {
        'Input Voltage': '380V–415V, 3-Phase, 50Hz',
        'Nominal HP': '5 HP',
        'Phase': 'Three-Phase',
        'Frequency': '50 Hz'
      },
      mechanical: {
        'Compressor Type': 'Hermetic Twin Rotary',
        'Displacement': '69.0 cm³/rev',
        'Cooling Capacity': '5 TR (~58,000 BTU/hr / 17.5 kW)',
        'Refrigerant': 'R410A',
        'Lubricant Oil': 'Synthetic POE (Pre-charged)'
      }
    },
    specifications: [
      { key: 'Equipment Model Code', value: 'ATE690UC3Q9JK' },
      { key: 'Highly OEM Equipment Code', value: 'Z-HIGHLY-ATE690' },
      { key: 'Manufacturer Brand', value: 'Shanghai Highly (Hitachi Technology Partner)' },
      { key: 'Compressor Technology', value: 'Hermetic Twin Rotary' },
      { key: 'Catalogue Category', value: 'Rotary Compressors' },
      { key: 'Nominal Cooling Capacity', value: '5 TR (~58,000 BTU/hr / 17.5 kW)' },
      { key: 'Displacement per Revolution', value: '69.0 cm³/rev' },
      { key: 'Operating Voltage', value: '380V–415V, 3-Phase, 50Hz' },
      { key: 'Refrigerant Compatibility', value: 'R410A' },
      { key: 'Application Type', value: 'Commercial ducted air conditioning, package units, and liquid chillers' },
      { key: 'Verification Status', value: 'Physical Nameplate Verified (Serial LKHN1E2335MKL)' },
      { key: 'Dispatch Location', value: 'Z Cool Enterprises Technical Desk, Mumbai' }
    ],
    images: [
      {
        url: 'https://res.cloudinary.com/ot9atptn/image/upload/v1793199454/z-cool/products/Highly_ATE690UC3Q9JK_1.jpg',
        publicId: 'z-cool/products/Highly_ATE690UC3Q9JK_1'
      },
      {
        url: '/products/verified/highly-ate690uc3q9jk.jpg',
        publicId: ''
      }
    ],
    datasheet: null, // Clean null per strict datasheet mapping: shows Request Documentation CTA
    downloads: [],
    source: {
      marketplace: 'IndiaMART',
      sellerName: 'Unique Refrigeration',
      sellerLocation: 'New Delhi',
      sourceUrl: 'https://www.indiamart.com/proddetail/ate690uc3q9jk-scroll-compressor-air-conditioning-2859657127691.html',
      priceDisplay: '₹ 27,000',
      rawPrice: 27000,
      verificationStatus: 'Marketplace Reference Listing'
    }
  };

  // 3. IDEMPOTENT UPSERT IN MONGODB
  console.log('\n[Import] Executing idempotent upsert for Highly ATE690UC3Q9JK...');
  const res = await Product.updateOne(
    { $or: [{ id: highlyProduct.id }, { code: highlyProduct.code }] },
    { $set: highlyProduct },
    { upsert: true }
  );
  console.log('[Import] MongoDB update result:', res);

  const updatedTotal = await Product.countDocuments();
  console.log(`[Import] New total products in MongoDB: ${updatedTotal}`);

  // 4. SYNCHRONIZE WITH FRONTEND STATIC CATALOG (products.js)
  const staticPath = 'C:\\Users\\AFFAN KHAN\\OneDrive\\Desktop\\zcool\\Z-Cool-enterprises\\src\\data\\products.js';
  if (fs.existsSync(staticPath)) {
    console.log('\n[Static Catalog] Syncing with src/data/products.js...');
    let staticContent = fs.readFileSync(staticPath, 'utf8');

    // Check if highly-ate690uc3q9jk already exists in static catalog
    if (!staticContent.includes('highly-ate690uc3q9jk')) {
      // Insert right after the opening bracket of PRODUCTS_CATALOG
      const match = staticContent.match(/export const PRODUCTS_CATALOG = \[/);
      if (match) {
        const insertPos = match.index + match[0].length;
        const jsonFormatted = '\n  ' + JSON.stringify(highlyProduct, null, 2).replace(/\n/g, '\n  ') + ',';
        const newContent = staticContent.slice(0, insertPos) + jsonFormatted + staticContent.slice(insertPos);
        fs.writeFileSync(staticPath, newContent, 'utf8');
        console.log('[Static Catalog] Successfully inserted Highly ATE690UC3Q9JK into products.js');
      } else {
        console.warn('[Static Catalog] Could not locate export const PRODUCTS_CATALOG in products.js');
      }
    } else {
      console.log('[Static Catalog] Highly ATE690UC3Q9JK is already present in products.js');
    }
  }

  // 5. TEST IDEMPOTENCY BY RE-RUNNING UPSERT
  console.log('\n[Idempotency Test] Re-running upsert with same data...');
  const res2 = await Product.updateOne(
    { $or: [{ id: highlyProduct.id }, { code: highlyProduct.code }] },
    { $set: highlyProduct },
    { upsert: true }
  );
  const retestedTotal = await Product.countDocuments();
  console.log('[Idempotency Test] Product count after re-run:', retestedTotal);
  if (retestedTotal !== updatedTotal) {
    throw new Error('IDEMPOTENCY FAILURE: Product count increased on re-run!');
  }
  console.log('>>> IDEMPOTENCY TEST PASSED: No duplicate records created.');

  await mongoose.disconnect();
  console.log('\n[Finished] Disconnected cleanly from MongoDB.');
}

main().catch(err => {
  console.error('[Error during batch import]:', err);
  process.exit(1);
});
