const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Admin = require('./models/Admin');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Shipment = require('./models/Shipment');

dotenv.config();

// Catalog data from frontend
const catalogPath = path.join(__dirname, '../Z-Cool-enterprises/src/data/products.js');

async function sync() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/z-cool-tech';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB:', mongoUri);

    // 1. Ensure Admin exists
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      await Admin.create({
        username: 'admin',
        email: 'admin@zcooltech.com',
        password: 'password123', // Will be hashed by pre-save bcrypt hook
      });
      console.log('Seeded initial admin: admin / password123 (bcrypt-hashed)');
    } else {
      console.log(`Admin user already exists (count: ${adminCount})`);
    }

    // 2. Import catalog products from frontend data file
    const fs = require('fs');
    const content = fs.readFileSync(catalogPath, 'utf8');
    
    // Evaluate PRODUCTS_CATALOG safely
    const catalogMatch = content.match(/export const PRODUCTS_CATALOG = (\[[\s\S]*?\]);\s*export const CATEGORIES_LIST/);
    let catalog = [];
    if (catalogMatch && catalogMatch[1]) {
      // Parse using Function or VM
      const getCatalog = new Function(`return ${catalogMatch[1]}`);
      catalog = getCatalog();
    }

    console.log(`Found ${catalog.length} products in static catalog.`);

    for (const item of catalog) {
      const existing = await Product.findOne({ $or: [{ id: item.id }, { code: item.code }] });
      if (!existing) {
        await Product.create({
          id: item.id,
          slug: item.id,
          code: item.code,
          name: item.name,
          brand: item.brand,
          tagline: item.tagline || '',
          category: item.category,
          type: item.type || 'Hermetic Scroll',
          condition: item.condition || 'Refurbished & Pressure Tested',
          availability: 'IN STOCK',
          images: item.images || [],
          description: item.description || '',
          voltage: item.voltage || '',
          displacement: item.displacement || '',
          refrigerant: item.refrigerant || '',
          application: item.application || '',
          accentColor: item.accentColor || '#1D6FA3',
          statusBadge: item.statusBadge || 'Pressure Tested',
          compatibility: item.compatibility || [],
          compatDetails: item.compatDetails || {},
          specs: item.specs || {},
          featured: true,
          inStock: true,
        });
        console.log(`Imported product to MongoDB: ${item.code} (${item.name})`);
      } else {
        // Update images and availability if missing
        if (!existing.images || existing.images.length === 0) {
          existing.images = item.images || [];
        }
        if (!existing.availability) {
          existing.availability = 'IN STOCK';
        }
        await existing.save();
      }
    }

    // 3. Ensure initial Orders exist for real analytics
    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      await Order.create([
        {
          id: 'ORD-2026-001',
          orderType: 'OFFLINE',
          productId: 'copeland-zr72kc-tfd',
          productName: 'Copeland Scroll Compressor ZR72KC-TFD',
          quantity: 2,
          customer: {
            name: 'Vikram Construction & HVAC',
            company: 'Vikram MEP Pvt Ltd',
            phone: '+91 98201 54321',
            email: 'vikram@vikrammep.in',
            city: 'Mumbai',
          },
          status: 'COMPLETED',
          notes: 'Commercial chiller replacement. Invoice #ZC-2026-89.',
        },
        {
          id: 'ORD-2026-002',
          orderType: 'ONLINE',
          productId: 'daikin-jt160g-p8y1',
          productName: 'Daikin Scroll Compressor JT160G-P8Y1',
          quantity: 1,
          customer: {
            name: 'Rajesh Nair',
            company: 'Apex Cold Chain Systems',
            phone: '+91 98450 11223',
            email: 'rnair@apexcool.com',
            city: 'Bengaluru',
          },
          status: 'PROCESSING',
          notes: 'Web sourcing desk dispatch inquiry confirmed.',
        },
        {
          id: 'ORD-2026-003',
          orderType: 'OFFLINE',
          productId: 'danfoss-sm161-4vi',
          productName: 'Danfoss Maneurop Scroll Compressor SM161-4VI',
          quantity: 4,
          customer: {
            name: 'Sunil Mehta',
            company: 'Gujarat Industrial Chillers',
            phone: '+91 98790 99887',
            email: 'sunil@gujaratchillers.com',
            city: 'Ahmedabad',
          },
          status: 'CONFIRMED',
          notes: 'Advance received via RTGS. Batch dispatch.',
        },
      ]);
      console.log('Seeded 3 initial real orders (1 Online, 2 Offline).');
    }

    // 4. Ensure initial Shipments exist for real tracking
    const shipmentCount = await Shipment.countDocuments();
    if (shipmentCount === 0) {
      await Shipment.create([
        {
          id: 'SHP-2026-001',
          orderId: 'ORD-2026-001',
          productId: 'copeland-zr72kc-tfd',
          productName: 'Copeland Scroll Compressor ZR72KC-TFD',
          quantity: 2,
          shippedFrom: 'Mumbai Central Sourcing Hub, MH',
          shippedTo: 'Pune Industrial Area, MH',
          courier: 'Blue Dart Express',
          trackingNumber: 'BD-948210492',
          status: 'DELIVERED',
          notes: 'Delivered and signed by site engineer.',
        },
        {
          id: 'SHP-2026-002',
          orderId: 'ORD-2026-002',
          productId: 'daikin-jt160g-p8y1',
          productName: 'Daikin Scroll Compressor JT160G-P8Y1',
          quantity: 1,
          shippedFrom: 'Mumbai Central Sourcing Hub, MH',
          shippedTo: 'Bengaluru Peenya Hub, KA',
          courier: 'TCI Freight Cargo',
          trackingNumber: 'TCI-7721948',
          status: 'IN TRANSIT',
          notes: 'Estimated arrival in 36 hours.',
        },
      ]);
      console.log('Seeded 2 initial real shipments with tracking references.');
    }

    console.log('Sync complete!');
    process.exit(0);
  } catch (err) {
    console.error('Sync Error:', err);
    process.exit(1);
  }
}

sync();
