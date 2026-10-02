const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from backend root .env
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = require('../config/db');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Admin = require('../models/Admin');

// The 10 official categories
const REQUIRED_CATEGORIES = [
  {
    name: 'AC Compressor',
    slug: 'ac-compressor',
    description: 'Commercial and residential replacement AC compressors tested for Pan-India freight dispatch.',
  },
  {
    name: 'Scroll Compressor',
    slug: 'scroll-compressor',
    description: 'Hermetic scroll compressors engineered for commercial package air conditioners and water chillers.',
  },
  {
    name: 'Refrigeration Compressors',
    slug: 'refrigeration-compressors',
    description: 'Low and medium temperature compressors for cold storage, blast freezers, and industrial refrigeration.',
  },
  {
    name: 'Copeland Scroll Compressor',
    slug: 'copeland-scroll-compressor',
    description: 'Authentic Copeland ZR and ZP series commercial hermetic scroll compressors.',
  },
  {
    name: 'Air Compressor',
    slug: 'air-compressor',
    description: 'Heavy-duty industrial air compressors and air handling equipment.',
  },
  {
    name: 'Rotary Compressor',
    slug: 'rotary-compressor',
    description: 'Compact single and twin rotary compressors for commercial cassette and split AC units.',
  },
  {
    name: 'Air Conditioner',
    slug: 'air-conditioner',
    description: 'Refurbished precision AC units, package systems, and modular industrial cooling equipment.',
  },
  {
    name: 'Danfoss Scroll Compressor',
    slug: 'danfoss-scroll-compressor',
    description: 'Danfoss Maneurop and Performer series commercial scroll compressors.',
  },
  {
    name: 'Air Conditioning Compressors',
    slug: 'air-conditioning-compressors',
    description: 'Universal and OEM replacement compressors for industrial air conditioning systems.',
  },
  {
    name: 'Copeland Compressor',
    slug: 'copeland-compressor',
    description: 'Copeland semi-hermetic, Discus, and reciprocating refrigeration compressors.',
  },
];

// Helper to normalize category name to one of the 10 standard categories
function normalizeCategoryName(rawCategory, brand) {
  if (!rawCategory) return 'Scroll Compressor';
  const c = rawCategory.trim().toLowerCase();
  const b = (brand || '').trim().toLowerCase();

  if (c.includes('rotary')) return 'Rotary Compressor';
  if (c.includes('refrigeration') || c.includes('reciprocating')) {
    if (b.includes('copeland')) return 'Copeland Compressor';
    return 'Refrigeration Compressors';
  }
  if (c.includes('copeland')) {
    if (c.includes('scroll')) return 'Copeland Scroll Compressor';
    return 'Copeland Compressor';
  }
  if (c.includes('danfoss')) return 'Danfoss Scroll Compressor';
  if (c.includes('vrf') || c.includes('vrv')) return 'AC Compressor';
  if (c.includes('air compressor')) return 'Air Compressor';
  if (c.includes('air conditioner')) return 'Air Conditioner';
  if (c.includes('scroll')) {
    if (b.includes('copeland')) return 'Copeland Scroll Compressor';
    if (b.includes('danfoss')) return 'Danfoss Scroll Compressor';
    return 'Scroll Compressor';
  }
  return 'AC Compressor';
}

// Convert specs object from frontend catalog into key/value specifications array
function convertSpecsToKeyValues(specsObj, product) {
  const list = [];

  if (product.voltage) {
    list.push({ key: 'Operating Voltage', value: product.voltage });
  }
  if (product.displacement) {
    list.push({ key: 'Displacement', value: product.displacement });
  }
  if (product.refrigerant) {
    list.push({ key: 'Refrigerant', value: product.refrigerant });
  }
  if (product.application) {
    list.push({ key: 'Application', value: product.application });
  }

  if (specsObj && typeof specsObj === 'object') {
    for (const [sectionKey, sectionVal] of Object.entries(specsObj)) {
      if (typeof sectionVal === 'object' && sectionVal !== null) {
        for (const [key, val] of Object.entries(sectionVal)) {
          if (val && !list.some((item) => item.key.toLowerCase() === key.toLowerCase())) {
            list.push({ key, value: String(val) });
          }
        }
      }
    }
  }

  return list;
}

async function seedProducts() {
  console.log('====================================================');
  console.log('   Z COOL TECHNOLOGY - PRODUCT CATALOGUE SEEDER     ');
  console.log('====================================================');

  try {
    await connectDB();

    // 1. Seed / Ensure Admin user exists
    let adminCreated = false;
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (!existingAdmin) {
      await Admin.create({
        username: 'admin',
        email: 'admin@zcooltech.com',
        password: 'password123',
      });
      console.log('✓ Initial Admin created: admin / password123');
      adminCreated = true;
    } else {
      console.log('✓ Admin user already exists: ' + existingAdmin.username);
    }

    // 2. Seed / Upsert the 10 Categories without destructive deletion
    console.log('\n--- Syncing Categories ---');
    let catsAdded = 0;
    let catsUpdated = 0;

    for (const catData of REQUIRED_CATEGORIES) {
      const existing = await Category.findOne({
        $or: [{ slug: catData.slug }, { name: new RegExp(`^${catData.name}$`, 'i') }],
      });

      if (!existing) {
        await Category.create(catData);
        catsAdded++;
      } else {
        existing.description = catData.description;
        await existing.save();
        catsUpdated++;
      }
    }
    console.log(`✓ Categories: ${catsAdded} added, ${catsUpdated} verified/updated.`);

    // 3. Load catalog products from frontend file
    const catalogPath = path.join(__dirname, '../../Z-Cool-enterprises/src/data/products.js');
    if (!fs.existsSync(catalogPath)) {
      throw new Error(`Catalog source file not found at: ${catalogPath}`);
    }

    const fileContent = fs.readFileSync(catalogPath, 'utf8');
    const catalogMatch = fileContent.match(/export const PRODUCTS_CATALOG = (\[[\s\S]*?\]);\s*export const CATEGORIES_LIST/);
    if (!catalogMatch || !catalogMatch[1]) {
      throw new Error('Failed to parse PRODUCTS_CATALOG from data/products.js');
    }

    const parseCatalog = new Function(`return ${catalogMatch[1]}`);
    const catalogItems = parseCatalog();

    console.log(`\nFound ${catalogItems.length} products in reference source data.`);

    let addedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    for (const item of catalogItems) {
      const normCategory = normalizeCategoryName(item.category, item.brand);
      const specifications = convertSpecsToKeyValues(item.specs, item);
      const images = (item.images || []).map((img) => ({
        url: img,
        publicId: '',
      }));

      const modelNumber = item.code || item.id;
      const slug = item.id.toLowerCase();

      // Check if product already exists by slug, code, or name
      const existing = await Product.findOne({
        $or: [
          { slug: slug },
          { id: slug },
          { code: item.code },
          { name: item.name },
        ],
      });

      if (!existing) {
        await Product.create({
          id: slug,
          slug,
          code: item.code || modelNumber,
          modelNumber: modelNumber,
          name: item.name,
          brand: item.brand,
          category: normCategory,
          tagline: item.tagline || '',
          shortDescription: item.tagline || '',
          description: item.description || '',
          type: item.type || 'Hermetic Scroll',
          condition: item.condition || 'Refurbished & Pressure Tested',
          availability: 'IN STOCK',
          price: 0,
          images: images,
          voltage: item.voltage || '',
          displacement: item.displacement || '',
          refrigerant: item.refrigerant || '',
          application: item.application || '',
          accentColor: item.accentColor || '#1D6FA3',
          statusBadge: item.statusBadge || 'Pressure Tested',
          compatibility: item.compatibility || [],
          compatDetails: item.compatDetails || {},
          specs: item.specs || {},
          specifications: specifications,
          featured: true,
          inStock: true,
          status: 'Active',
        });
        addedCount++;
        console.log(`  + [NEW] ${item.name} (${normCategory})`);
      } else {
        // Safe update without wiping Cloudinary images if user already uploaded custom images
        existing.category = normCategory;
        existing.brand = item.brand;
        if (!existing.description) existing.description = item.description || '';
        if (!existing.shortDescription) existing.shortDescription = item.tagline || '';
        if (!existing.modelNumber) existing.modelNumber = modelNumber;
        if (!existing.specifications || existing.specifications.length === 0) {
          existing.specifications = specifications;
        }
        if (!existing.images || existing.images.length === 0) {
          existing.images = images;
        }
        if (existing.specs === undefined || Object.keys(existing.specs).length === 0) {
          existing.specs = item.specs || {};
        }
        existing.updatedAt = Date.now();
        await existing.save();
        updatedCount++;
        console.log(`  ~ [UPDATED] ${item.name} (${normCategory})`);
      }
    }

    console.log('\n====================================================');
    console.log('   SEED REPORT SUMMARY                              ');
    console.log('====================================================');
    console.log(`- Categories Verified:  ${REQUIRED_CATEGORIES.length}`);
    console.log(`- Products Added:       ${addedCount}`);
    console.log(`- Products Updated:     ${updatedCount}`);
    console.log(`- Duplicates Skipped:   ${skippedCount}`);
    console.log(`- Total In Database:    ${await Product.countDocuments()}`);
    console.log('====================================================\n');

    await mongoose.connection.close();
    console.log('MongoDB connection closed cleanly.');
    process.exit(0);
  } catch (error) {
    console.error('Seed Error:', error);
    try {
      await mongoose.connection.close();
    } catch (_) {}
    process.exit(1);
  }
}

seedProducts();
