const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');

// Mount sub-routers
router.use('/auth', authRoutes);

// General health-check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Z Cool Tech Backend API is operational',
    timestamp: new Date(),
  });
});

module.exports = router;
