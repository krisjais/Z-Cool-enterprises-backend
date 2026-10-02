const cloudinary = require('cloudinary').v2;

const isConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  console.log('[Cloudinary] Configured successfully.');
} else {
  console.log('[Cloudinary] Credentials not fully configured in backend/.env. Local fallback upload is active.');
}

module.exports = {
  cloudinary,
  isConfigured,
  PRODUCT_IMAGE_FOLDER: 'z-cool/products',
};
