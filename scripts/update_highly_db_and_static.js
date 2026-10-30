require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const galleryImages = [
  {
    url: 'https://res.cloudinary.com/ot9atptn/image/upload/v1793201639/z-cool/products/Highly_ATE690UC3Q9JK_1.jpg',
    publicId: 'z-cool/products/Highly_ATE690UC3Q9JK_1'
  },
  {
    url: 'https://res.cloudinary.com/ot9atptn/image/upload/v1793201640/z-cool/products/Highly_ATE690UC3Q9JK_Nameplate.jpg',
    publicId: 'z-cool/products/Highly_ATE690UC3Q9JK_Nameplate'
  },
  {
    url: 'https://res.cloudinary.com/ot9atptn/image/upload/v1793201641/z-cool/products/Highly_ATE690UC3Q9JK_Profile.jpg',
    publicId: 'z-cool/products/Highly_ATE690UC3Q9JK_Profile'
  },
  {
    url: 'https://res.cloudinary.com/ot9atptn/image/upload/v1793201642/z-cool/products/Highly_ATE690UC3Q9JK_Warehouse_Stock.jpg',
    publicId: 'z-cool/products/Highly_ATE690UC3Q9JK_Warehouse_Stock'
  }
];

const imageManifest = [
  {
    url: 'https://res.cloudinary.com/ot9atptn/image/upload/v1793201639/z-cool/products/Highly_ATE690UC3Q9JK_1.jpg',
    localUrl: '/products/verified/highly-ate690uc3q9jk-primary.jpg',
    publicId: 'z-cool/products/Highly_ATE690UC3Q9JK_1',
    isVerified: true,
    type: 'primary',
    label: 'Verified Physical Unit · Front View',
    badgeText: 'Verified Physical Unit · Single Unit',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    dotClass: 'bg-emerald-600',
    caption: 'Authentic physical workshop photograph of Shanghai Highly ATE690UC3Q9JK twin rotary compressor with visible OEM nameplate sticker and serial number.',
    thumbTag: 'Unit'
  },
  {
    url: 'https://res.cloudinary.com/ot9atptn/image/upload/v1793201640/z-cool/products/Highly_ATE690UC3Q9JK_Nameplate.jpg',
    localUrl: '/products/verified/highly-ate690uc3q9jk-nameplate.jpg',
    publicId: 'z-cool/products/Highly_ATE690UC3Q9JK_Nameplate',
    isVerified: true,
    type: 'nameplate',
    label: 'Verified OEM Nameplate Close-Up',
    badgeText: 'Verified OEM Nameplate · Technical Data Stamped',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    dotClass: 'bg-emerald-600',
    caption: 'High-resolution macro photograph of compressor nameplate confirming model ATE690UC3Q9JK, 50Hz 380-415V 3~ electrical, R410A refrigerant, barcode LKHN1E2319MKL, and Shanghai Hitachi Electrical Appliances Co., Ltd. manufacture.',
    thumbTag: 'Nameplate'
  },
  {
    url: 'https://res.cloudinary.com/ot9atptn/image/upload/v1793201641/z-cool/products/Highly_ATE690UC3Q9JK_Profile.jpg',
    localUrl: '/products/verified/highly-ate690uc3q9jk-profile.jpg',
    publicId: 'z-cool/products/Highly_ATE690UC3Q9JK_Profile',
    isVerified: true,
    type: 'profile',
    label: 'Side Profile & Suction Accumulator',
    badgeText: 'Verified Physical Shell · Accumulator & Ports',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    dotClass: 'bg-emerald-600',
    caption: 'Side profile photograph showing hermetic cylindrical shell, brazed suction accumulator canister with mounting clamp bracket, and top terminal connection housing.',
    thumbTag: 'Profile'
  },
  {
    url: 'https://res.cloudinary.com/ot9atptn/image/upload/v1793201642/z-cool/products/Highly_ATE690UC3Q9JK_Warehouse_Stock.jpg',
    localUrl: '/products/verified/highly-ate690uc3q9jk-warehouse.jpg',
    publicId: 'z-cool/products/Highly_ATE690UC3Q9JK_Warehouse_Stock',
    isVerified: true,
    type: 'stock',
    label: 'Warehouse Inventory Batch',
    badgeText: 'Commercial Batch Stock · Verified Inventory',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    dotClass: 'bg-emerald-600',
    caption: 'Commercial warehouse inventory staging of Shanghai Highly ATE690 series rotary compressors ready for dispatch and pressure-hold testing.',
    thumbTag: 'Stock'
  }
];

const datasheet = {
  filename: 'Highly-Rotary-Compressor-Catalogue.pdf',
  displayName: 'Highly Rotary Compressor Catalogue',
  title: 'Highly Rotary Compressor Catalogue',
  model: 'ATE690UC3',
  oemModelCode: 'ATE690UC3',
  brand: 'Highly',
  manufacturer: 'Shanghai Highly (Hitachi Technology Partner)',
  fileType: 'application/pdf',
  size: '1.38 MB',
  bytes: 1384724,
  url: '/datasheets/Highly-Rotary-Compressor-Catalogue.pdf',
  localUrl: '/uploads/datasheets/Highly-Rotary-Compressor-Catalogue.pdf',
  cloudinaryUrl: 'https://res.cloudinary.com/ot9atptn/raw/upload/v1793201586/z-cool/datasheets/Highly_Rotary_Compressor_Catalogue.pdf',
  cloudinaryPublicId: 'z-cool/datasheets/Highly_Rotary_Compressor_Catalogue.pdf',
  isCatalogue: true,
  note: 'Publicly available manufacturer product-family catalogue covering TE-Series rotary compressor base model ATE690UC3. Contains technical specifications, displacement, and dimensions.',
  verifiedAt: new Date().toISOString()
};

const downloads = [
  {
    name: 'Highly Rotary Compressor Catalogue (Product Family Documentation)',
    type: 'PDF',
    version: 'TE-Series',
    size: '1.38 MB',
    updated: '28-10-2026',
    file: '/datasheets/Highly-Rotary-Compressor-Catalogue.pdf'
  }
];

async function updateDb() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/z-cool-tech';
  await mongoose.connect(uri);
  const collection = mongoose.connection.collection('products');

  const countBefore = await collection.countDocuments();
  console.log(`[DB] Products before update: ${countBefore}`);

  const updateResult = await collection.updateOne(
    { slug: 'highly-ate690uc3q9jk' },
    {
      $set: {
        images: galleryImages,
        primaryImage: galleryImages[0],
        imageManifest,
        datasheet,
        downloads,
        imageType: 'verified',
        imageDisclaimer: 'Physical unit and OEM nameplate stamped ATE690UC3Q9JK verified with manufacturer product-family catalogue documentation.',
        updatedAt: new Date()
      }
    }
  );

  console.log(`[DB] Matched: ${updateResult.matchedCount}, Modified: ${updateResult.modifiedCount}`);

  const countAfter = await collection.countDocuments();
  console.log(`[DB] Products after update: ${countAfter} (must equal ${countBefore})`);

  const updatedDoc = await collection.findOne({ slug: 'highly-ate690uc3q9jk' });
  console.log('[DB] Updated document images count:', updatedDoc.images?.length);
  console.log('[DB] Updated document datasheet:', updatedDoc.datasheet?.title);

  await mongoose.disconnect();
}

function updateStaticCatalog() {
  const filePath = 'C:/Users/AFFAN KHAN/OneDrive/Desktop/zcool/Z-Cool-enterprises/src/data/products.js';
  let content = fs.readFileSync(filePath, 'utf8');

  // Find highly-ate690uc3q9jk block and update images, imageManifest, datasheet, downloads
  const targetPattern = /"id":\s*"highly-ate690uc3q9jk"[\s\S]*?"source":\s*\{[\s\S]*?\}\s*\}/;
  const match = content.match(targetPattern);
  if (!match) {
    console.error('[Static Catalog] Could not locate highly-ate690uc3q9jk block!');
    return;
  }

  // Parse or replace the section in content
  const oldBlock = match[0];
  
  // Replace images
  let newBlock = oldBlock.replace(
    /"images":\s*\[[\s\S]*?\],/,
    `"images": ${JSON.stringify(galleryImages, null, 6).trim()},\n    "imageManifest": ${JSON.stringify(imageManifest, null, 6).trim()},`
  );

  // Replace datasheet and downloads
  newBlock = newBlock.replace(
    /"datasheet":\s*null,/,
    `"datasheet": ${JSON.stringify(datasheet, null, 6).trim()},`
  );
  newBlock = newBlock.replace(
    /"downloads":\s*\[\],/,
    `"downloads": ${JSON.stringify(downloads, null, 6).trim()},`
  );

  content = content.replace(oldBlock, newBlock);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('[Static Catalog] Successfully updated src/data/products.js');
}

async function run() {
  await updateDb();
  updateStaticCatalog();
  console.log('[Done] DB and static catalog synchronized.');
}

run().catch(console.error);
