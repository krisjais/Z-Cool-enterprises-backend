require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { cloudinary } = require('../config/cloudinary');

const imagesToProcess = [
  {
    localSource: 'temp_images/highly_candidates/candidate_1_raw_source.jpg',
    publicId: 'Highly_ATE690UC3Q9JK_1',
    localFilename: 'highly-ate690uc3q9jk-primary.jpg',
    existingUrl: 'https://res.cloudinary.com/ot9atptn/image/upload/v1793199454/z-cool/products/Highly_ATE690UC3Q9JK_1.jpg',
    title: 'Shanghai Highly ATE690UC3Q9JK - Upright Unit Front View',
    label: 'Physical Unit with Verified OEM Nameplate'
  },
  {
    localSource: 'temp_images/highly_candidates/candidate_2_seller_view1.jpg',
    publicId: 'Highly_ATE690UC3Q9JK_Nameplate',
    localFilename: 'highly-ate690uc3q9jk-nameplate.jpg',
    title: 'Shanghai Highly ATE690UC3Q9JK - Official Nameplate Specification Label',
    label: 'Verified Nameplate: 380-415V 3-Phase, R410A, Shanghai Hitachi Co.'
  },
  {
    localSource: 'temp_images/highly_candidates/candidate_5_seller_view4.jpg',
    publicId: 'Highly_ATE690UC3Q9JK_Profile',
    localFilename: 'highly-ate690uc3q9jk-profile.jpg',
    title: 'Shanghai Highly ATE690UC3Q9JK - Full Side Profile & Suction Accumulator',
    label: 'Hermetic Shell, Suction Accumulator & Brazed Copper Ports'
  },
  {
    localSource: 'temp_images/highly_candidates/candidate_3_seller_view2.jpg',
    publicId: 'Highly_ATE690UC3Q9JK_Warehouse_Stock',
    localFilename: 'highly-ate690uc3q9jk-warehouse.jpg',
    title: 'Shanghai Highly ATE690UC3Q9JK - Commercial Batch Inventory Stock',
    label: 'Commercial Batch Stock Units'
  }
];

async function main() {
  const frontendDir = 'C:/Users/AFFAN KHAN/OneDrive/Desktop/zcool/Z-Cool-enterprises/public/products/verified';
  const backendDir = 'uploads/products';
  if (!fs.existsSync(frontendDir)) fs.mkdirSync(frontendDir, { recursive: true });
  if (!fs.existsSync(backendDir)) fs.mkdirSync(backendDir, { recursive: true });

  const galleryResults = [];

  for (const item of imagesToProcess) {
    console.log(`\nProcessing ${item.publicId}...`);
    // 1. Copy local file to frontend and backend
    const frontendDest = path.join(frontendDir, item.localFilename);
    const backendDest = path.join(backendDir, item.localFilename);
    fs.copyFileSync(item.localSource, frontendDest);
    fs.copyFileSync(item.localSource, backendDest);
    console.log(`Copied to ${frontendDest}`);

    // 2. Upload to Cloudinary (or verify existing)
    let cloudinaryUrl = item.existingUrl;
    let fullPublicId = `z-cool/products/${item.publicId}`;

    try {
      console.log(`Uploading ${item.localSource} to Cloudinary...`);
      const uploadRes = await cloudinary.uploader.upload(item.localSource, {
        folder: 'z-cool/products',
        public_id: item.publicId,
        resource_type: 'image',
        overwrite: true
      });
      cloudinaryUrl = uploadRes.secure_url;
      fullPublicId = uploadRes.public_id;
      console.log(`Uploaded to Cloudinary: ${cloudinaryUrl}`);
    } catch (err) {
      console.warn(`Cloudinary upload warning: ${err.message}. Using fallback.`);
    }

    galleryResults.push({
      url: cloudinaryUrl || `/products/verified/${item.localFilename}`,
      localUrl: `/products/verified/${item.localFilename}`,
      publicId: fullPublicId,
      title: item.title,
      label: item.label
    });
  }

  fs.writeFileSync('temp_images/highly_gallery_manifest.json', JSON.stringify(galleryResults, null, 2));
  console.log('\n--- VERIFIED GALLERY MANIFEST ---');
  console.log(JSON.stringify(galleryResults, null, 2));
}

main();
