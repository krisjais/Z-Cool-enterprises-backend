const ContactRequest = require('../models/ContactRequest');
const { uploadImageToCloudinary } = require('../services/cloudinaryService');

const INQUIRY_IMAGE_FOLDER = 'z-cool/inquiries';

/**
 * @desc    Submit a new customer enquiry or quote request
 * @route   POST /api/inquiries (also aliased as POST /api/contact)
 * @access  Public
 */
exports.submitInquiry = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      company,
      message,
      requirement,
      type,
      brand,
      model,
      quantity,
      application,
    } = req.body;

    // 1. Mandatory field validation
    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your full contact name (minimum 2 characters).',
      });
    }

    if (!phone || phone.trim().length < 7) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid contact telephone or WhatsApp number (minimum 7 digits).',
      });
    }

    // 2. Email format validation (if provided)
    if (email && email.trim() !== '') {
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
      if (!emailRegex.test(email.trim())) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address or leave the field blank.',
        });
      }
    }

    // 3. Process optional uploaded nameplate photo
    let nameplatePhoto = {
      url: '',
      publicId: '',
      filename: '',
      size: 0,
      mimetype: '',
    };

    if (req.file) {
      const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedMimes.includes(req.file.mimetype.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid file format. Only JPG, PNG, and WebP compressor photographs are supported.',
        });
      }

      if (req.file.size > 5 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          message: 'Photo attachment exceeds the 5MB maximum file size limit.',
        });
      }

      // Check if Cloudinary is configured
      if (
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
      ) {
        try {
          const cloudRes = await uploadImageToCloudinary(req.file.path, INQUIRY_IMAGE_FOLDER);
          nameplatePhoto = {
            url: cloudRes.url,
            publicId: cloudRes.publicId,
            filename: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype,
          };
        } catch (cloudErr) {
          console.warn('[Inquiry Controller] Cloudinary upload fallback to local storage:', cloudErr.message);
          nameplatePhoto = {
            url: `/uploads/${req.file.filename}`,
            publicId: '',
            filename: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype,
          };
        }
      } else {
        // Fallback to local server static path
        nameplatePhoto = {
          url: `/uploads/${req.file.filename}`,
          publicId: '',
          filename: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
        };
      }
    }

    // 4. Persist to MongoDB database
    const inquiry = await ContactRequest.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim().toLowerCase() : '',
      company: company ? company.trim() : '',
      message: (message || requirement || '').trim(),
      type: type || 'quote',
      details: {
        brand: (brand || '').trim(),
        model: (model || '').trim(),
        quantity: quantity || '1 Unit',
        application: (application || '').trim(),
        nameplatePhoto,
      },
      status: 'pending',
      sourceIp: req.ip || req.connection?.remoteAddress || '',
    });

    console.log(`[INQUIRY CREATED] ID: ${inquiry._id} | Model: ${inquiry.details.model || 'Open'} | Buyer: ${inquiry.name}`);

    return res.status(201).json({
      success: true,
      message: 'Your inquiry has been successfully registered with our Mumbai technical sourcing desk.',
      inquiryId: inquiry._id,
      data: {
        id: inquiry._id,
        name: inquiry.name,
        phone: inquiry.phone,
        model: inquiry.details.model,
        hasPhoto: Boolean(nameplatePhoto.url),
        createdAt: inquiry.createdAt,
      },
    });
  } catch (error) {
    console.error('[Inquiry Controller Error]', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'An unexpected error occurred while saving your inquiry. Please try again.',
    });
  }
};

/**
 * @desc    Get all inquiries with optional status/type filtering
 * @route   GET /api/inquiries
 * @access  Private (Admin)
 */
exports.getInquiries = async (req, res) => {
  try {
    const { status, type, limit = 50, page = 1 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (type) filter.type = type;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await ContactRequest.countDocuments(filter);
    const inquiries = await ContactRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    return res.status(200).json({
      success: true,
      total,
      page: parseInt(page, 10),
      pages: Math.ceil(total / parseInt(limit, 10)),
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    console.error('[Inquiry Controller Get Error]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update inquiry status
 * @route   PATCH /api/inquiries/:id
 * @access  Private (Admin)
 */
exports.updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'in-progress', 'resolved'];

    if (!status || !allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowed.join(', ')}`,
      });
    }

    const inquiry = await ContactRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry record not found' });
    }

    return res.status(200).json({ success: true, data: inquiry });
  } catch (error) {
    console.error('[Inquiry Controller Update Error]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
