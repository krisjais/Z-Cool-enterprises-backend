const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const orderRoutes = require('./orderRoutes');
const shipmentRoutes = require('./shipmentRoutes');
const uploadRoutes = require('./uploadRoutes');
const inquiryRoutes = require('./inquiryRoutes');
const customerRoutes = require('./customerRoutes');
const analyticsRoutes = require('./analyticsRoutes');
const settingRoutes = require('./settingRoutes');

// Mount sub-routers
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/shipments', shipmentRoutes);
router.use('/upload', uploadRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/contact', inquiryRoutes);
router.use('/customers', customerRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/settings', settingRoutes);

// General health-check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Z Cool Tech Backend API is operational',
    timestamp: new Date(),
  });
});

module.exports = router;
