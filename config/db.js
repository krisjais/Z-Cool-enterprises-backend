const mongoose = require('mongoose');
const dns = require('dns');

// Configure reliable DNS servers for SRV resolution
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (_) {}

let isConnected = false;

const ensureInitialAdmin = async () => {
  try {
    const Admin = require('../models/Admin');
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const username = process.env.INITIAL_ADMIN_USERNAME || 'admin';
      const email = (process.env.INITIAL_ADMIN_EMAIL || 'admin@zcooltech.com').toLowerCase().trim();
      const password = process.env.INITIAL_ADMIN_PASSWORD || 'password123';

      await Admin.create({
        username,
        email,
        password,
      });
      console.log(`[MongoDB] Default admin user auto-provisioned: ${email} (username: ${username})`);
    }
  } catch (err) {
    console.warn(`[MongoDB] Admin auto-provision notice: ${err.message}`);
  }
};

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.warn('WARNING: MONGODB_URI is not set in environment variables. Falling back to local mongodb://127.0.0.1:27017/z-cool-tech');
  }

  const connectionString = mongoUri || 'mongodb://127.0.0.1:27017/z-cool-tech';

  try {
    const conn = await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 8000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);

    // Ensure initial admin user exists
    await ensureInitialAdmin();

    mongoose.connection.on('error', (err) => {
      console.error(`[MongoDB] Connection error event: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB] Disconnected from database');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('[MongoDB] Reconnected to database');
      isConnected = true;
    });

    return conn;
  } catch (error) {
    console.error(`[MongoDB] Error connecting to MongoDB: ${error.message}`);
    console.error('[MongoDB] Please check your MONGODB_URI in backend/.env file (e.g., MongoDB Atlas connection string or local MongoDB).');
    // Allow server to stay up in dev if DB is temporarily down, but log prominently
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
