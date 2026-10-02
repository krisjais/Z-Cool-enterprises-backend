const fs = require('fs');
const path = require('path');
const { cloudinary, isConfigured, PRODUCT_IMAGE_FOLDER } = require('../config/cloudinary');

/**
 * Upload single image to Cloudinary (or fallback to local disk)
 * @param {string} filePath - Absolute path to temporary uploaded file
 * @param {string} folder - Cloudinary folder path (default: 'z-cool/products')
 * @returns {Promise<{ url: string, publicId: string }>}
 */
async function uploadImageToCloudinary(filePath, folder = PRODUCT_IMAGE_FOLDER) {
  try {
    if (isConfigured) {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: folder,
        resource_type: 'image',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' }
        ]
      });

      // Remove temporary disk file after successful Cloudinary upload
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    } else {
      // Local fallback url when Cloudinary credentials are not set
      const filename = path.basename(filePath);
      return {
        url: `/uploads/${filename}`,
        publicId: `local_${filename}`,
      };
    }
  } catch (error) {
    console.error('[Cloudinary Service] Upload failed:', error.message);
    // Keep local file as fallback if upload failed
    const filename = path.basename(filePath);
    return {
      url: `/uploads/${filename}`,
      publicId: `local_${filename}`,
    };
  }
}

/**
 * Delete single asset from Cloudinary
 * @param {string} publicId - Cloudinary asset public ID
 */
async function deleteImageFromCloudinary(publicId) {
  if (!publicId || publicId.startsWith('local_')) {
    // If local file, attempt to delete from uploads directory
    if (publicId && publicId.startsWith('local_')) {
      const filename = publicId.replace('local_', '');
      const localPath = path.join(__dirname, '../uploads', filename);
      if (fs.existsSync(localPath)) {
        try {
          fs.unlinkSync(localPath);
        } catch (e) {
          console.warn('[Cloudinary Service] Failed to unlink local file:', e.message);
        }
      }
    }
    return { result: 'ok' };
  }

  if (!isConfigured) {
    console.warn('[Cloudinary Service] Cloudinary not configured, skipping asset deletion:', publicId);
    return { result: 'skipped' };
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`[Cloudinary Service] Deleted asset ${publicId}:`, result);
    return result;
  } catch (error) {
    console.error(`[Cloudinary Service] Error deleting asset ${publicId}:`, error.message);
    return { result: 'error', error: error.message };
  }
}

/**
 * Delete multiple assets from Cloudinary
 * @param {string[]} publicIds - Array of Cloudinary public IDs
 */
async function deleteMultipleImagesFromCloudinary(publicIds = []) {
  if (!Array.isArray(publicIds) || publicIds.length === 0) return [];
  const results = [];
  for (const id of publicIds) {
    if (id) {
      const res = await deleteImageFromCloudinary(id);
      results.push(res);
    }
  }
  return results;
}

module.exports = {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
  deleteMultipleImagesFromCloudinary,
  PRODUCT_IMAGE_FOLDER,
};
