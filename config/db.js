const mongoose = require('mongoose');

let isConnected = false;

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
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);

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
