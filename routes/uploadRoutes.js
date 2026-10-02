const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
  PRODUCT_IMAGE_FOLDER,
} = require('../services/cloudinaryService');

// @desc    Upload multiple product images to Cloudinary
// @route   POST /api/upload
// @access  Private (Admin)
router.post('/', protect, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No image files uploaded' });
    }

    const uploadedImages = [];

    for (const file of req.files) {
      const result = await uploadImageToCloudinary(file.path, PRODUCT_IMAGE_FOLDER);
      uploadedImages.push(result);
    }

    res.status(200).json({
      success: true,
      count: uploadedImages.length,
      images: uploadedImages, // Array of { url, publicId }
      urls: uploadedImages.map((img) => img.url), // Compatibility with older frontend code
    });
  } catch (error) {
    console.error('[Upload Route] Error uploading images:', error);
    res.status(500).json({ success: false, message: error.message || 'Image upload failed' });
  }
});

// @desc    Delete an asset from Cloudinary
// @route   DELETE /api/upload / POST /api/upload/delete
// @access  Private (Admin)
router.post('/delete', protect, async (req, res) => {
  try {
    const { publicId } = req.body;
    if (!publicId) {
      return res.status(400).json({ success: false, message: 'publicId is required' });
    }

    const result = await deleteImageFromCloudinary(publicId);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('[Upload Route] Error deleting image:', error);
    res.status(500).json({ success: false, message: error.message || 'Image deletion failed' });
  }
});

module.exports = router;
