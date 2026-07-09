const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

// Configure Local Disk Storage as fallback/temp storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// File filter (images and PDFs)
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp|gif|pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (.jpg, .jpeg, .png, .webp, .gif) and PDFs (.pdf) are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter,
});

// Cloudinary configuration (if keys exist)
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Helper function to upload to Cloudinary (falls back to local server path)
const uploadToCloudinary = async (filePath, folder = 'z_cool_tech') => {
  try {
    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ) {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: folder,
        resource_type: 'auto',
      });
      // Delete temporary file after successful upload
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return result.secure_url;
    } else {
      // Local fallback url (absolute path mapped via Express static middleware)
      const filename = path.basename(filePath);
      return `/uploads/${filename}`;
    }
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    // If Cloudinary fails, return local file url as safety fallback
    const filename = path.basename(filePath);
    return `/uploads/${filename}`;
  }
};

module.exports = { upload, uploadToCloudinary };
