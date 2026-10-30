const dotenv = require('dotenv');
dotenv.config();
const { cloudinary, isConfigured } = require('../config/cloudinary');
const path = require('path');
const fs = require('fs');

async function testUpload() {
  console.log('[Test Cloudinary] isConfigured:', isConfigured);
  if (!isConfigured) {
    console.log('[Test Cloudinary] Missing credentials.');
    return;
  }

  const pdfPath = 'C:\\Users\\AFFAN KHAN\\Downloads\\Danfoss-product-details-2026-10-28.pdf';
  console.log('[Test Cloudinary] Uploading PDF to z-cool/datasheets...');
  try {
    const pdfRes = await cloudinary.uploader.upload(pdfPath, {
      folder: 'z-cool/datasheets',
      resource_type: 'raw',
      public_id: 'Danfoss_SM110S4EA_Datasheet',
      overwrite: true,
    });
    console.log('[Test Cloudinary] PDF Upload SUCCESS:', {
      public_id: pdfRes.public_id,
      secure_url: pdfRes.secure_url,
      format: pdfRes.format,
      bytes: pdfRes.bytes,
    });
  } catch (err) {
    console.error('[Test Cloudinary] PDF Upload error:', err.message);
  }

  const imgPath = path.join(__dirname, '../temp_images/danfoss_official_compressor.jpg');
  if (fs.existsSync(imgPath)) {
    console.log('[Test Cloudinary] Uploading official image to z-cool/products...');
    try {
      const imgRes = await cloudinary.uploader.upload(imgPath, {
        folder: 'z-cool/products',
        resource_type: 'image',
        public_id: 'danfoss_sm110s4ea_official',
        overwrite: true,
      });
      console.log('[Test Cloudinary] Image Upload SUCCESS:', {
        public_id: imgRes.public_id,
        secure_url: imgRes.secure_url,
        format: imgRes.format,
        bytes: imgRes.bytes,
      });
    } catch (err) {
      console.error('[Test Cloudinary] Image Upload error:', err.message);
    }
  }
}

testUpload();
