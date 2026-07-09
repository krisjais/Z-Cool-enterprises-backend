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

    // Clear existing data
    await Admin.deleteMany();
    await Category.deleteMany();
    await Brand.deleteMany();
    console.log('Existing collection data wiped.');

    // Seed Admin
    const admin = await Admin.create({
      username: 'admin',
      email: 'admin@zcooltech.com',
      password: 'password123', // Will be hashed automatically by the Admin.js model pre-save hook
    });
    console.log(`Admin user seeded: username="admin", password="password123"`);

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
