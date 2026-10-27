/**
 * Automated Verification Suite for Admin Panel Functionality
 * Tests Categories, Customers, Analytics, Settings, Auth, and Security
 */
const mongoose = require('mongoose');
const express = require('express');
const http = require('http');
const dotenv = require('dotenv');

dotenv.config({ path: __dirname + '/../.env' });

const { signToken } = require('../utils/token');
const Admin = require('../models/Admin');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');
const ContactRequest = require('../models/ContactRequest');
const Setting = require('../models/Setting');
const mainRoutes = require('../routes/main');

let server;
let baseUrl;
let adminToken;
let testAdmin;

async function request(path, options = {}) {
  const url = `${baseUrl}${path}`;
  const parsed = new URL(url);

  return new Promise((resolve, reject) => {
    const reqOptions = {
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data), headers: res.headers });
        } catch {
          resolve({ status: res.statusCode, raw: data, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('================================================================');
  console.log(' Z COOL ENTERPRISES — ADMIN PANEL FUNCTIONALITY TEST SUITE');
  console.log('================================================================');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    process.stdout.write(`• ${name} ... `);
    try {
      await fn();
      console.log('PASSED [OK]');
      passed++;
    } catch (err) {
      console.log('FAILED [X]');
      console.error(`  Error: ${err.message}`);
      failed++;
    }
  }

  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
    console.log('[DB] Connected to MongoDB Atlas successfully.');

    // Find or create test admin
    testAdmin = await Admin.findOne();
    if (!testAdmin) {
      testAdmin = await Admin.create({
        username: 'admin',
        email: 'admin@zcooltech.com',
        password: 'admin_test_password_123',
      });
    }

    // Generate valid admin JWT token
    adminToken = signToken({ id: testAdmin._id });

    // Setup temporary test express app
    const app = express();
    app.use(express.json());
    app.use('/api', mainRoutes);

    await new Promise((resolve) => {
      server = app.listen(0, '127.0.0.1', () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        console.log(`[HTTP] Test server running at ${baseUrl}`);
        resolve();
      });
    });

    // 1. HEALTH CHECK
    await test('HEALTH: Backend API /api/health responds with 200', async () => {
      const res = await request('/api/health');
      if (res.status !== 200 || !res.body.success) throw new Error('Health check failed');
    });

    // 2. CATEGORIES - AUTH PROTECTION
    await test('SECURITY: Category mutation rejects unauthenticated request with 401', async () => {
      const res = await request('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { name: 'Unauthorized Category' },
      });
      if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
    });

    // 3. CATEGORIES - LIST & PRODUCT COUNTS
    await test('CATEGORIES: GET /api/categories returns actual list with dynamic productCount', async () => {
      const res = await request('/api/categories');
      if (res.status !== 200 || !res.body.success || !Array.isArray(res.body.data)) {
        throw new Error('Failed to retrieve categories list');
      }
      if (res.body.data.length === 0) throw new Error('Expected at least 1 category in database');
      const first = res.body.data[0];
      if (first.productCount === undefined) throw new Error('productCount property is missing');
      if (first.isActive === undefined) throw new Error('isActive status property is missing');
    });

    // 4. CATEGORIES - CREATE WITH VALIDATION
    const testCategoryName = `Test Industrial Unit ${Date.now()}`;
    let createdCategorySlug;

    await test('CATEGORIES: POST /api/categories creates validated category with isActive=true', async () => {
      const res = await request('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: {
          name: testCategoryName,
          description: 'Automated test category description',
          isActive: true,
          sortOrder: 99,
        },
      });
      if (res.status !== 201 || !res.body.success) {
        throw new Error(res.body.message || `Failed to create category, status ${res.status}`);
      }
      createdCategorySlug = res.body.data.slug;
      if (res.body.data.isActive !== true) throw new Error('Category isActive is not true');
    });

    // 5. CATEGORIES - PREVENT DUPLICATES
    await test('CATEGORIES: POST /api/categories rejects duplicate category name with 400', async () => {
      const res = await request('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: {
          name: testCategoryName,
        },
      });
      if (res.status !== 400) throw new Error(`Expected 400 duplicate error, got ${res.status}`);
    });

    // 6. CATEGORIES - UPDATE & TOGGLE ACTIVE
    await test('CATEGORIES: PUT /api/categories/:id updates description and toggles isActive to false', async () => {
      const res = await request(`/api/categories/${createdCategorySlug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: {
          description: 'Updated test description',
          isActive: false,
        },
      });
      if (res.status !== 200 || !res.body.success) {
        throw new Error(res.body.message || 'Failed to update category');
      }
      if (res.body.data.isActive !== false) throw new Error('isActive was not set to false');
    });

    // 7. CATEGORIES - DELETE SAFETY DEPENDENCY CHECK
    await test('CATEGORIES: DELETE /api/categories rejects deletion when products depend on category', async () => {
      // Find a category that currently has products
      const catWithProducts = await Category.findOne({ name: 'AC Compressor' });
      if (catWithProducts) {
        const res = await request(`/api/categories/${catWithProducts.slug}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        if (res.status !== 400 || !res.body.message.includes('Cannot delete')) {
          throw new Error(`Expected 400 dependency error, got ${res.status}`);
        }
      }
    });

    // 8. CATEGORIES - SAFE DELETE UNASSIGNED CATEGORY
    await test('CATEGORIES: DELETE /api/categories removes unassigned test category safely', async () => {
      const res = await request(`/api/categories/${createdCategorySlug}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.status !== 200 || !res.body.success) {
        throw new Error(res.body.message || 'Failed to delete test category');
      }
    });

    // 9. CUSTOMERS - REAL CUSTOMER AGGREGATION
    await test('CUSTOMERS: GET /api/customers aggregates real customers with linked history', async () => {
      const res = await request('/api/customers', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.status !== 200 || !res.body.success || !Array.isArray(res.body.data)) {
        throw new Error('Failed to retrieve customers');
      }
      if (res.body.data.length > 0) {
        const cust = res.body.data[0];
        if (!cust.name) throw new Error('Customer name missing');
        if (!Array.isArray(cust.inquiries)) throw new Error('Customer inquiries array missing');
        if (!Array.isArray(cust.orders)) throw new Error('Customer orders array missing');
      }
    });

    // 10. CUSTOMERS - SEARCH FILTER
    await test('CUSTOMERS: GET /api/customers?search=Vishesh filters correctly', async () => {
      const res = await request('/api/customers?search=Vishesh', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.status !== 200 || !res.body.success) throw new Error('Failed to search customers');
      if (res.body.data.length > 0) {
        if (!res.body.data[0].name.includes('Vishesh')) throw new Error('Search result does not match query');
      }
    });

    // 11. ANALYTICS - DASHBOARD ENDPOINT
    await test('ANALYTICS: GET /api/analytics computes real overview, products, categories, orders', async () => {
      const res = await request('/api/analytics', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.status !== 200 || !res.body.success || !res.body.data) {
        throw new Error('Failed to retrieve analytics');
      }
      const { overview, products, categories, revenue } = res.body.data;
      if (typeof overview.totalProducts !== 'number') throw new Error('totalProducts missing in analytics');
      if (typeof overview.totalCategories !== 'number') throw new Error('totalCategories missing in analytics');
      if (revenue.isAvailable !== false) throw new Error('revenue isAvailable should be false (no fake currency)');
    });

    // 12. SETTINGS - GET & PERSISTENCE
    await test('SETTINGS: GET /api/settings retrieves current business settings', async () => {
      const res = await request('/api/settings', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.status !== 200 || !res.body.success || !res.body.data) {
        throw new Error('Failed to get settings');
      }
      if (!res.body.data.companyName) throw new Error('Company name missing in settings');
      if (!res.body.data.businessEmail) throw new Error('Business email missing in settings');
    });

    await test('SETTINGS: PUT /api/settings validates and updates store settings', async () => {
      const res = await request('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: {
          operatingHours: 'Monday – Saturday: 9:30 AM – 7:30 PM IST',
          dispatchOrigin: 'Mumbai Central Sourcing Hub, MH',
        },
      });
      if (res.status !== 200 || !res.body.success) throw new Error('Failed to update settings');
      if (res.body.data.operatingHours !== 'Monday – Saturday: 9:30 AM – 7:30 PM IST') {
        throw new Error('Settings update did not persist field');
      }
    });

    // 13. AUTH & SECURITY - UPDATE PASSWORD VALIDATION
    await test('AUTH: PUT /api/auth/update-password rejects incorrect current password with 400', async () => {
      const res = await request('/api/auth/update-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: {
          currentPassword: 'completely_wrong_current_password_999',
          newPassword: 'new_strong_password_2026',
        },
      });
      if (res.status !== 400 || !res.body.message.includes('Current password is incorrect')) {
        throw new Error(`Expected 400 wrong password error, got ${res.status}`);
      }
    });

  } catch (fatalErr) {
    console.error('Fatal execution error:', fatalErr);
    failed++;
  } finally {
    if (server) server.close();
    await mongoose.disconnect();
  }

  console.log('================================================================');
  console.log(`RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('================================================================');

  if (failed > 0) process.exit(1);
  process.exit(0);
}

runTests();
