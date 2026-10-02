const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const orderRoutes = require('./orderRoutes');
const shipmentRoutes = require('./shipmentRoutes');
const uploadRoutes = require('./uploadRoutes');

// Mount sub-routers
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/shipments', shipmentRoutes);
router.use('/upload', uploadRoutes);

// General health-check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Z Cool Tech Backend API is operational',
    timestamp: new Date(),
  });
});

module.exports = router;
