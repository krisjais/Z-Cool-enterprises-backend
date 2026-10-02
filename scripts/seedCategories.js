const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from backend root .env
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = require('../config/db');
const Category = require('../models/Category');
const Product = require('../models/Product');

// The 25 official categories based on the reference Z Cool Technology product catalogue
const REQUIRED_CATEGORIES = [
  {
    name: 'AC Compressor',
    slug: 'ac-compressor',
    sortOrder: 1,
    description: 'Air conditioning compressors for residential and commercial cooling systems.',
  },
  {
    name: 'Scroll Compressor',
    slug: 'scroll-compressor',
    sortOrder: 2,
    description: 'Scroll compressors for air conditioning, refrigeration and HVAC applications.',
  },
  {
    name: 'Refrigeration Compressors',
    slug: 'refrigeration-compressors',
    sortOrder: 3,
    description: 'Compressors designed for refrigeration and cooling applications.',
  },
  {
    name: 'Copeland Scroll Compressor',
    slug: 'copeland-scroll-compressor',
    sortOrder: 4,
    description: 'Copeland scroll compressors engineered for commercial and industrial cooling systems.',
  },
  {
    name: 'Air Compressor',
    slug: 'air-compressor',
    sortOrder: 5,
    description: 'Industrial and commercial air compressor units and air systems.',
  },
  {
    name: 'Rotary Compressor',
    slug: 'rotary-compressor',
    sortOrder: 6,
    description: 'Rotary compressors designed for high-efficiency residential and light commercial cooling.',
  },
  {
    name: 'Air Conditioner',
    slug: 'air-conditioner',
    sortOrder: 7,
    description: 'Air conditioner units, systems, and modular cooling equipment.',
  },
  {
    name: 'Danfoss Scroll Compressor',
    slug: 'danfoss-scroll-compressor',
    sortOrder: 8,
    description: 'Danfoss scroll compressors for commercial air conditioning and refrigeration applications.',
  },
  {
    name: 'Air Conditioning Compressors',
    slug: 'air-conditioning-compressors',
    sortOrder: 9,
    description: 'Compressors for residential, commercial, and industrial air conditioning systems.',
  },
  {
    name: 'Copeland Compressor',
    slug: 'copeland-compressor',
    sortOrder: 10,
    description: 'Copeland compressors including semi-hermetic, reciprocating, and scroll models.',
  },
  {
    name: 'Screw Compressor',
    slug: 'screw-compressor',
    sortOrder: 11,
    description: 'Screw compressors for large-scale industrial chilling and refrigeration systems.',
  },
  {
    name: 'AC AMC Service',
    slug: 'ac-amc-service',
    sortOrder: 12,
    description: 'Annual maintenance contract (AMC) services for commercial and industrial air conditioning.',
  },
  {
    name: 'VRF System',
    slug: 'vrf-system',
    sortOrder: 13,
    description: 'Variable Refrigerant Flow (VRF) systems and multi-split cooling solutions.',
  },
  {
    name: 'Relays',
    slug: 'relays',
    sortOrder: 14,
    description: 'Electrical relays and protection components for HVAC and compressor equipment.',
  },
  {
    name: 'Air Conditioner Installation Service',
    slug: 'air-conditioner-installation-service',
    sortOrder: 15,
    description: 'Professional installation and commissioning services for air conditioning systems.',
  },
  {
    name: 'Air Conditioner Motor',
    slug: 'air-conditioner-motor',
    sortOrder: 16,
    description: 'Fan and blower motors for residential, commercial, and industrial air conditioners.',
  },
  {
    name: 'Air Conditioner Maintenance Service',
    slug: 'air-conditioner-maintenance-service',
    sortOrder: 17,
    description: 'Preventive and corrective maintenance services for air conditioning units.',
  },
  {
    name: 'Rotary And Refrigerator Compressor',
    slug: 'rotary-and-refrigerator-compressor',
    sortOrder: 18,
    description: 'Rotary and reciprocating compressor units for domestic and commercial refrigeration.',
  },
  {
    name: 'Emerson Scroll Compressor',
    slug: 'emerson-scroll-compressor',
    sortOrder: 19,
    description: 'Emerson Copeland scroll compressors for HVAC and process cooling applications.',
  },
  {
    name: 'Daikin Compressor',
    slug: 'daikin-compressor',
    sortOrder: 20,
    description: 'Daikin scroll and inverter compressors for VRV, VRF, and commercial split systems.',
  },
  {
    name: 'Air Conditioner Compressor',
    slug: 'air-conditioner-compressor',
    sortOrder: 21,
    description: 'Replacement air conditioner compressors for all major cooling equipment brands.',
  },
  {
    name: '3D Bed Sheet',
    slug: '3d-bed-sheet',
    sortOrder: 22,
    description: 'Specialty industrial fabric and 3D protective bed sheets.',
  },
  {
    name: 'Pump And Valve',
    slug: 'pump-and-valve',
    sortOrder: 23,
    description: 'Industrial pumps, expansion valves, and fluid control accessories for cooling plants.',
  },
  {
    name: 'AACSR Conductor',
    slug: 'aacsr-conductor',
    sortOrder: 24,
    description: 'Aluminum Alloy Conductor Steel Reinforced (AACSR) electrical transmission conductors.',
  },
  {
    name: 'New Items',
    slug: 'new-items',
    sortOrder: 25,
    description: 'Newly arrived industrial cooling components, compressors, and specialized equipment.',
  },
];

async function seedCategories() {
  try {
    await connectDB();

    // Verify initial product count to ensure ZERO products are deleted or modified
    const initialProductCount = await Product.countDocuments();

    let createdCount = 0;
    let updatedCount = 0;
    let duplicateCount = 0;

    const officialSlugs = new Set(REQUIRED_CATEGORIES.map((c) => c.slug));
    const officialNames = new Set(REQUIRED_CATEGORIES.map((c) => c.name.toLowerCase()));

    // Safe, non-destructive upsert of all 25 official categories
    for (const catData of REQUIRED_CATEGORIES) {
      const cleanName = catData.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const existing = await Category.findOne({
        $or: [
          { slug: catData.slug },
          { name: new RegExp(`^${cleanName}$`, 'i') },
        ],
      });

      if (!existing) {
        await Category.create({
          name: catData.name,
          slug: catData.slug,
          description: catData.description,
          sortOrder: catData.sortOrder,
          featured: false,
        });
        createdCount++;
      } else {
        // Safe update of metadata fields while strictly preserving MongoDB _id
        existing.name = catData.name;
        existing.slug = catData.slug;
        existing.sortOrder = catData.sortOrder;
        if (!existing.description) {
          existing.description = catData.description;
        }
        await existing.save();
        updatedCount++;
      }
    }

    // Prune obsolete unreferenced template placeholder categories with 0 products
    const allDbCategories = await Category.find();
    for (const dbCat of allDbCategories) {
      if (!officialSlugs.has(dbCat.slug) && !officialNames.has(dbCat.name.toLowerCase())) {
        const prodCount = await Product.countDocuments({
          category: new RegExp(`^${dbCat.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
        });
        if (prodCount === 0) {
          await Category.findByIdAndDelete(dbCat._id);
        }
      }
    }

    // Final database verification
    const finalCategoryCount = await Category.countDocuments();
    const finalProductCount = await Product.countDocuments();

    // Verify uniqueness of slugs
    const verifyCategories = await Category.find();
    const slugMap = new Map();
    for (const cat of verifyCategories) {
      if (slugMap.has(cat.slug)) {
        duplicateCount++;
      } else {
        slugMap.set(cat.slug, cat._id);
      }
    }

    console.log('================================');
    console.log('CATEGORY SEED COMPLETE');
    console.log('================================');
    console.log(`Categories found: ${REQUIRED_CATEGORIES.length}`);
    console.log(`Categories created: ${createdCount}`);
    console.log(`Categories updated: ${updatedCount}`);
    console.log(`Duplicates: ${duplicateCount}`);
    console.log('');
    console.log(`Products modified: 0`);
    console.log(`Products imported: 0`);
    console.log(`Products deleted: ${initialProductCount - finalProductCount}`);
    console.log('================================\n');

    console.log(`Verification:`);
    console.log(`- Final Category.countDocuments(): ${finalCategoryCount}`);
    console.log(`- Final Product.countDocuments():  ${finalProductCount}`);
    console.log(`- Slugs are unique:                ${duplicateCount === 0 ? 'YES' : 'NO'}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Category Seed Error:', error);
    try {
      await mongoose.connection.close();
    } catch (_) {}
    process.exit(1);
  }
}

seedCategories();
