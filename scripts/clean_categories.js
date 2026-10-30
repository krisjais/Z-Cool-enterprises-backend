const mongoose = require('mongoose');

async function cleanCategories() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/z-cool-tech';
  await mongoose.connect(mongoUri);

  const Category = require('../models/Category');
  const approved = [
    'scroll-compressors',
    'rotary-compressors',
    'reciprocating-compressors',
    'vrf-inverter-compressors'
  ];

  await Category.updateMany({ slug: { $nin: approved } }, { isActive: false });
  await Category.updateMany({ slug: { $in: approved } }, { isActive: true });

  const active = await Category.find({ isActive: true }).lean();
  console.log('Active categories in MongoDB (' + active.length + '):', active.map(c => ({ name: c.name, slug: c.slug })));

  await mongoose.disconnect();
}

cleanCategories().catch(console.error);
