const mongoose = require('mongoose');

async function runVerification() {
  console.log('========================================================');
  console.log('   STEP 1: BACKEND API CATEGORIES VERIFICATION          ');
  console.log('========================================================');
  const catRes = await fetch('http://localhost:5000/api/categories').then((r) => r.json());
  console.log('Categories Count:', catRes.count, '(Expected: 25)');
  console.log('Total Products in DB:', catRes.totalProducts, '(Expected: 6)');
  console.log('Categories List:');
  catRes.data.forEach((c) => {
    console.log(
      `  [#${String(c.sortOrder).padStart(2)}] ${c.name.padEnd(38)} -> /products/${c.slug} (Count: ${c.productCount})`
    );
  });

  console.log('\n========================================================');
  console.log('   STEP 2: FRONTEND NEXT.JS ROUTE VERIFICATION          ');
  console.log('========================================================');
  const routesToTest = [
    '/products',
    '/products/ac-compressor',
    '/products/rotary-compressor',
    '/products/scroll-compressor',
    '/products/new-items',
    '/products/category/vrf-system',
  ];

  for (const r of routesToTest) {
    try {
      const res = await fetch('http://localhost:3000' + r);
      console.log(`Route ${r.padEnd(32)} -> Status: ${res.status}`);
    } catch (e) {
      console.log(`Route ${r.padEnd(32)} -> Error: ${e.message}`);
    }
  }

  console.log('\n========================================================');
  console.log('   STEP 3: ADMIN CATEGORY CRUD WORKFLOW VERIFICATION   ');
  console.log('========================================================');
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'password123' }),
  }).then((r) => r.json());
  const token = loginRes.token;
  console.log('Admin Authentication Token Acquired:', !!token);

  // 1. Create a category
  const createRes = await fetch('http://localhost:5000/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify({
      name: 'Custom Test HVAC Category',
      slug: 'custom-test-hvac-category',
      sortOrder: 26,
      description: 'Temporary testing category',
    }),
  }).then((r) => r.json());
  console.log('A. Create Category:', createRes.success, 'Slug:', createRes.data?.slug);

  const testId = createRes.data?._id;

  // 2. Update category
  const updateRes = await fetch('http://localhost:5000/api/categories/' + testId, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify({
      name: 'Custom Test HVAC Category Updated',
      description: 'Updated description for test',
    }),
  }).then((r) => r.json());
  console.log('B. Update Category:', updateRes.success, 'Name:', updateRes.data?.name);

  // 3. Delete category
  const deleteRes = await fetch('http://localhost:5000/api/categories/' + testId, {
    method: 'DELETE',
    headers: { Authorization: 'Bearer ' + token },
  }).then((r) => r.json());
  console.log('C. Delete Category:', deleteRes.success, deleteRes.message);

  // 4. Verify Final State
  const finalCats = await fetch('http://localhost:5000/api/categories').then((r) => r.json());
  console.log('\nD. Final Categories Count in DB:', finalCats.count, '(Strictly 25)');

  // 5. Database Direct Integrity Check
  const dotenv = require('dotenv');
  const path = require('path');
  dotenv.config({ path: path.join(__dirname, '../.env') });
  await mongoose.connect(process.env.MONGODB_URI);
  const dbCatCount = await mongoose.connection.db.collection('categories').countDocuments();
  const dbProdCount = await mongoose.connection.db.collection('products').countDocuments();
  console.log('\n========================================================');
  console.log('   STEP 4: DIRECT MONGODB DATABASE INTEGRITY CHECK     ');
  console.log('========================================================');
  console.log('MongoDB Category Documents:', dbCatCount, '(Strictly 25)');
  console.log('MongoDB Product Documents: ', dbProdCount, '(Strictly 6, NO PRODUCTS TOUCHED)');

  // Slugs uniqueness check
  const allDbCats = await mongoose.connection.db.collection('categories').find({}).toArray();
  const seenSlugs = new Set();
  let duplicates = 0;
  allDbCats.forEach((c) => {
    if (seenSlugs.has(c.slug)) {
      duplicates++;
    }
    seenSlugs.add(c.slug);
  });
  console.log('Duplicate Slugs:           ', duplicates, '(Strictly 0)');

  await mongoose.disconnect();
  console.log('========================================================\n');
}

runVerification().catch(console.error);
