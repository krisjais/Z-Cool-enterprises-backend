const express = require('express');
const router = express.Router();
const { upload, uploadToCloudinary } = require('../middleware/upload');
const { protect } = require('../middleware/auth');

// Protected upload route for admin product images
router.post('/', protect, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No image files uploaded' });
    }

    const urls = [];
    for (const file of req.files) {
      const url = await uploadToCloudinary(file.path, 'z_cool_tech/products');
      urls.push(url);
    }

    res.status(200).json({
      success: true,
      count: urls.length,
      urls,
    });
  } catch (error) {
    console.error('Image Upload Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
