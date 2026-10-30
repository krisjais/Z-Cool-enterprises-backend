const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables immediately before local modules
dotenv.config();

const connectDB = require('./config/db');
const { apiLimiter } = require('./middleware/rateLimiter');
const mainRoutes = require('./routes/main');
const errorHandler = require('./middleware/errorHandler');

// Enforce Critical Security Environment Configuration
if (process.env.NODE_ENV === 'production') {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.trim().length < 32) {
    console.error('[FATAL SECURITY ERROR] JWT_SECRET must be defined and at least 32 characters long in production.');
    process.exit(1);
  }
} else if (!process.env.JWT_SECRET || process.env.JWT_SECRET.trim() === '') {
  console.warn('[SECURITY WARNING] JWT_SECRET is not set in development .env. Set JWT_SECRET to enable secure authentication.');
}

// Connect to Database
connectDB();

const app = express();

// Security Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
// Configure CORS with normalized origin checking (stripping trailing slashes)
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'https://z-cool-enterprises.vercel.app',
  ...(process.env.CLIENT_URL || '')
    .split(',')
    .map((url) => url.trim().replace(/\/+$/, ''))
    .filter(Boolean),
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g. mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/+$/, '');
      const isAllowed =
        allowedOrigins.includes(normalizedOrigin) ||
        normalizedOrigin.endsWith('.vercel.app') ||
        (process.env.NODE_ENV !== 'production' && normalizedOrigin.includes('localhost'));

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    credentials: true,
  })
);

// Performance & Parsing Middlewares
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Development Logger
if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  app.use(morgan('dev'));
}

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Apply General Rate Limiter to API endpoints
app.use('/api', apiLimiter);

// Mount API Routes
app.use('/api', mainRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Z Cool Technology API Services - Operational' });
});

// Global Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Watch trigger: connected to confirmed local database
