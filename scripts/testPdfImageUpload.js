const dotenv = require('dotenv');
dotenv.config();
const { cloudinary } = require('../config/cloudinary');
const https = require('https');

async function testPdfImageUpload() {
  const pdfPath = 'C:\\Users\\AFFAN KHAN\\Downloads\\Danfoss-product-details-2026-10-28.pdf';
  console.log('[Test Cloudinary] Uploading PDF as resource_type: "image"...');
  try {
    const res = await cloudinary.uploader.upload(pdfPath, {
      folder: 'z-cool/datasheets',
      resource_type: 'image',
      format: 'pdf',
      public_id: 'Danfoss_SM110S4EA_Datasheet_cdn',
      overwrite: true,
    });
    console.log('[Test Cloudinary] Upload result:', {
      public_id: res.public_id,
      secure_url: res.secure_url,
      format: res.format,
      bytes: res.bytes,
    });

    // Check delivery
    https.get(res.secure_url, (cRes) => {
      console.log('[Test Delivery] Status code:', cRes.statusCode);
      console.log('[Test Delivery] Content-type:', cRes.headers['content-type']);
      console.log('[Test Delivery] Content-length:', cRes.headers['content-length']);
    });
  } catch (err) {
    console.error('[Test Error]:', err.message);
  }
}

testPdfImageUpload();
