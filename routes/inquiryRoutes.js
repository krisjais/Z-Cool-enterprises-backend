const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const inquiryController = require('../controllers/inquiryController');

// Multer middleware wrapper that gracefully handles both 'photo' and 'nameplatePhoto' field names
const handlePhotoUpload = (req, res, next) => {
  const singleUpload = upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'nameplatePhoto', maxCount: 1 },
  ]);

  singleUpload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload validation error.',
      });
    }
    // Normalize req.file if uploaded through fields
    if (req.files) {
      if (req.files.photo && req.files.photo[0]) {
        req.file = req.files.photo[0];
      } else if (req.files.nameplatePhoto && req.files.nameplatePhoto[0]) {
        req.file = req.files.nameplatePhoto[0];
      }
    }
    next();
  });
};

// @desc    Submit a customer inquiry or quote request
// @route   POST /api/inquiries
// @access  Public
router.post('/', handlePhotoUpload, inquiryController.submitInquiry);

// @desc    Get all inquiries
// @route   GET /api/inquiries
// @access  Private (Admin)
router.get('/', protect, inquiryController.getInquiries);

// @desc    Update inquiry status
// @route   PATCH /api/inquiries/:id
// @access  Private (Admin)
router.patch('/:id', protect, inquiryController.updateInquiryStatus);

module.exports = router;
