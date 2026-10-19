const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const Category = require('./models/Category');
const Brand = require('./models/Brand');

dotenv.config();

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/z-cool-tech');
    console.log('MongoDB connected for seeding...');

    // Clear category/brand collection data (preserve admin accounts)
    await Category.deleteMany();
    await Brand.deleteMany();
    console.log('Category and Brand collection data refreshed.');

    // Check Admin status without wiping
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      if (process.env.INITIAL_ADMIN_EMAIL && process.env.INITIAL_ADMIN_PASSWORD) {
        await Admin.create({
          username: process.env.INITIAL_ADMIN_USERNAME || 'admin',
          email: process.env.INITIAL_ADMIN_EMAIL.trim().toLowerCase(),
          password: process.env.INITIAL_ADMIN_PASSWORD,
        });
        console.log(`[SECURITY] Initial administrator provisioned from environment for ${process.env.INITIAL_ADMIN_EMAIL}`);
      } else {
        console.log('[SECURITY NOTICE] No administrator accounts found in database. Run "npm run create-admin" to provision an administrator securely.');
      }
    } else {
      console.log(`[SECURITY] Preserved ${adminCount} existing administrator account(s).`);
    }

    // Seed Categories
    const categories = await Category.create([
      {
        name: 'Precision ACs',
        description: 'Close control air conditioning systems designed for server rooms and data centers.',
      },
      {
        name: 'Industrial Chillers',
        description: 'Heavy-duty water and air cooling chillers for industrial machinery.',
      },
      {
        name: 'Panel Coolers',
        description: 'Compact heat exchangers and coolers for electrical and control panels.',
      },
    ]);
    console.log(`${categories.length} Categories seeded.`);

    // Seed Brands
    const brands = await Brand.create([
      { name: 'Siemens', website: 'https://siemens.com' },
      { name: 'Daikin', website: 'https://daikin.com' },
      { name: 'Z Cool Industrial', website: 'https://zcooltech.com' },
    ]);
    console.log(`${brands.length} Brands seeded.`);

    console.log('Database Seeding Completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
