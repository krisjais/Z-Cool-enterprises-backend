const Product = require('../models/Product');
const Category = require('../models/Category');
const { deleteMultipleImagesFromCloudinary } = require('../services/cloudinaryService');

/**
 * Helper to normalize incoming images into [{ url, publicId }]
 */
function normalizeImages(images) {
  if (!images) return [];
  const rawList = Array.isArray(images) ? images : [images];
  return rawList
    .map((item) => {
      if (typeof item === 'string') {
        return { url: item.trim(), publicId: '' };
      }
      if (item && typeof item === 'object') {
        return {
          url: (item.url || '').trim(),
          publicId: (item.publicId || '').trim(),
        };
      }
      return null;
    })
    .filter((img) => img && Boolean(img.url));
}

/**
 * Helper to normalize specifications into [{ key, value }]
 */
function normalizeSpecifications(specs, existingSpecs) {
  if (Array.isArray(specs)) {
    return specs
      .filter((s) => s && (s.key || s.value))
      .map((s) => ({
        key: String(s.key || '').trim(),
        value: String(s.value || '').trim(),
      }))
      .filter((s) => s.key !== '' && s.value !== '');
  }

  // If specs was sent as a key-value object (e.g. { "Voltage": "220V", ... })
  if (specs && typeof specs === 'object' && !Array.isArray(specs)) {
    const list = [];
    // Could be grouped { electrical: {...}, thermal: {...} } or flat
    for (const [k, v] of Object.entries(specs)) {
      if (typeof v === 'object' && v !== null) {
        for (const [subK, subV] of Object.entries(v)) {
          list.push({ key: subK, value: String(subV) });
        }
      } else if (v !== undefined && v !== null) {
        list.push({ key: k, value: String(v) });
      }
    }
    return list;
  }

  return [];
}

/**
 * @desc    Get all products (with search, category, brand, pagination, status filtering)
 * @route   GET /api/products
 * @access  Public
 */
exports.getProducts = async (req, res) => {
  try {
    const {
      category,
      brand,
      availability,
      status,
      search,
      q,
      featured,
      limit,
      page,
      sort,
    } = req.query;

    const query = {};

    // Category filter: handles category name or category slug
    const catQuery = category || req.params.slug;
    if (catQuery && catQuery !== 'all') {
      const cleanCat = catQuery.replace(/-/g, ' ').trim();
      query.$or = [
        { category: new RegExp(`^${catQuery.trim()}$`, 'i') },
        { category: new RegExp(`^${cleanCat}$`, 'i') },
        { category: new RegExp(catQuery.trim().replace(/-/g, '[- ]?'), 'i') },
      ];
    }

    if (brand && brand !== 'all') {
      query.brand = new RegExp(`^${brand.trim()}$`, 'i');
    }

    if (availability && availability !== 'all') {
      query.availability = availability;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (featured !== undefined) {
      query.featured = featured === 'true' || featured === true;
    }

    const searchTerm = (search || q || '').trim();
    if (searchTerm) {
      const searchRegex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      const orClauses = [
        { name: searchRegex },
        { code: searchRegex },
        { modelNumber: searchRegex },
        { brand: searchRegex },
        { category: searchRegex },
        { type: searchRegex },
        { shortDescription: searchRegex },
        { description: searchRegex },
        { 'specifications.key': searchRegex },
        { 'specifications.value': searchRegex },
      ];

      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: orClauses }];
        delete query.$or;
      } else {
        query.$or = orClauses;
      }
    }

    // Determine sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc') sortOption = { price: 1 };
    else if (sort === 'price-desc') sortOption = { price: -1 };
    else if (sort === 'name-asc') sortOption = { name: 1 };
    else if (sort === 'name-desc') sortOption = { name: -1 };

    let productsQuery = Product.find(query).sort(sortOption);

    const totalCount = await Product.countDocuments(query);

    if (page && limit) {
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 20;
      productsQuery = productsQuery.skip((pageNum - 1) * limitNum).limit(limitNum);
    } else if (limit) {
      productsQuery = productsQuery.limit(parseInt(limit, 10));
    }

    const products = await productsQuery;

    res.status(200).json({
      success: true,
      count: products.length,
      totalCount,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get products by category slug
 * @route   GET /api/products/category/:slug
 * @access  Public
 */
exports.getProductsByCategorySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const cleanCategory = slug.replace(/-/g, ' ').trim();

    // Check category model first
    const categoryDoc = await Category.findOne({
      $or: [
        { slug: slug.toLowerCase() },
        { name: new RegExp(`^${cleanCategory}$`, 'i') },
      ],
    });

    const categoryName = categoryDoc ? categoryDoc.name : cleanCategory;

    const query = {
      $or: [
        { category: new RegExp(`^${categoryName}$`, 'i') },
        { category: new RegExp(`^${slug}$`, 'i') },
        { category: new RegExp(slug.replace(/-/g, '[- ]?'), 'i') },
      ],
    };

    const products = await Product.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      category: categoryDoc || { name: categoryName, slug },
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get single product by id, slug, or modelNumber/code
 * @route   GET /api/products/:idOrSlug
 * @access  Public
 */
exports.getProductBySlug = async (req, res) => {
  try {
    const identifier = req.params.idOrSlug;
    if (!identifier) {
      return res.status(400).json({ success: false, message: 'Identifier is required' });
    }

    const cleanId = identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const idRegex = new RegExp(`^${cleanId}$`, 'i');

    const product = await Product.findOne({
      $or: [
        { _id: identifier.match(/^[0-9a-fA-F]{24}$/) ? identifier : null },
        { id: idRegex },
        { slug: idRegex },
        { code: idRegex },
        { modelNumber: idRegex },
      ],
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Related products in the same category
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(4);

    res.status(200).json({ success: true, data: product, related });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create a product
 * @route   POST /api/products
 * @access  Private (Admin)
 */
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      brand,
      modelNumber,
      code,
      price,
      shortDescription,
      description,
      tagline,
      specifications,
      specs,
      images,
      featured,
      inStock,
      status,
      availability,
      type,
      condition,
      voltage,
      displacement,
      refrigerant,
      application,
      compatibility,
      compatDetails,
    } = req.body;

    // Required Field Validations
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Product name is required.' });
    }
    if (!category || !category.trim()) {
      return res.status(400).json({ success: false, message: 'Category is required.' });
    }
    if (!brand || !brand.trim()) {
      return res.status(400).json({ success: false, message: 'Brand is required.' });
    }

    // Price validation
    let numericPrice = 0;
    if (price !== undefined && price !== null && price !== '') {
      numericPrice = Number(price);
      if (isNaN(numericPrice) || numericPrice < 0) {
        return res.status(400).json({ success: false, message: 'Price must be a valid positive number.' });
      }
    }

    const assignedCode = (modelNumber || code || name.split(' ').slice(0, 3).join('-')).trim();

    // Generate unique slug
    let baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    if (!baseSlug) {
      baseSlug = `product-${Date.now()}`;
    }

    let slug = baseSlug;
    let counter = 1;
    while (await Product.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Normalize images & specifications
    const formattedImages = normalizeImages(images);
    const formattedSpecs = normalizeSpecifications(specifications, specs);

    const product = await Product.create({
      id: slug,
      slug,
      name: name.trim(),
      category: category.trim(),
      brand: brand.trim(),
      modelNumber: assignedCode,
      code: assignedCode,
      price: numericPrice,
      shortDescription: (shortDescription || tagline || '').trim(),
      tagline: (tagline || shortDescription || '').trim(),
      description: (description || '').trim(),
      specifications: formattedSpecs,
      specs: specs || {},
      images: formattedImages,
      featured: Boolean(featured),
      inStock: inStock !== undefined ? Boolean(inStock) : true,
      status: status || 'Active',
      availability: availability || (inStock === false ? 'OUT OF STOCK' : 'IN STOCK'),
      type: type || 'Hermetic Scroll',
      condition: condition || 'Refurbished & Pressure Tested',
      voltage: voltage || '',
      displacement: displacement || '',
      refrigerant: refrigerant || '',
      application: application || '',
      compatibility: Array.isArray(compatibility) ? compatibility : [],
      compatDetails: compatDetails || {},
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error('[ProductController] Create error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private (Admin)
 */
exports.updateProduct = async (req, res) => {
  try {
    const identifier = req.params.id;
    const product = await Product.findOne({
      $or: [
        { _id: identifier.match(/^[0-9a-fA-F]{24}$/) ? identifier : null },
        { id: identifier },
        { slug: identifier },
      ],
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const {
      name,
      category,
      brand,
      modelNumber,
      code,
      price,
      shortDescription,
      description,
      tagline,
      specifications,
      specs,
      images,
      featured,
      inStock,
      status,
      availability,
      type,
      condition,
      voltage,
      displacement,
      refrigerant,
      application,
      compatibility,
      compatDetails,
    } = req.body;

    // Price validation
    if (price !== undefined && price !== null && price !== '') {
      const numericPrice = Number(price);
      if (isNaN(numericPrice) || numericPrice < 0) {
        return res.status(400).json({ success: false, message: 'Price must be a valid positive number.' });
      }
      product.price = numericPrice;
    }

    if (name) product.name = name.trim();
    if (category) product.category = category.trim();
    if (brand) product.brand = brand.trim();
    if (modelNumber !== undefined) product.modelNumber = modelNumber.trim();
    if (code !== undefined) product.code = code.trim();
    if (shortDescription !== undefined) product.shortDescription = shortDescription.trim();
    if (tagline !== undefined) product.tagline = tagline.trim();
    if (description !== undefined) product.description = description.trim();
    if (featured !== undefined) product.featured = Boolean(featured);
    if (inStock !== undefined) product.inStock = Boolean(inStock);
    if (status !== undefined) product.status = status;
    if (availability !== undefined) product.availability = availability;
    if (type !== undefined) product.type = type;
    if (condition !== undefined) product.condition = condition;
    if (voltage !== undefined) product.voltage = voltage;
    if (displacement !== undefined) product.displacement = displacement;
    if (refrigerant !== undefined) product.refrigerant = refrigerant;
    if (application !== undefined) product.application = application;
    if (compatibility !== undefined) product.compatibility = compatibility;
    if (compatDetails !== undefined) product.compatDetails = compatDetails;
    if (specs !== undefined) product.specs = specs;

    if (specifications !== undefined) {
      product.specifications = normalizeSpecifications(specifications, specs);
    }

    // Handle image updates and cleanup orphaned Cloudinary assets
    if (images !== undefined) {
      const updatedImages = normalizeImages(images);
      const existingImages = product.images || [];

      // Find Cloudinary publicIds that were removed
      const updatedPublicIds = new Set(updatedImages.map((img) => img.publicId).filter(Boolean));
      const removedPublicIds = existingImages
        .map((img) => img.publicId)
        .filter((pubId) => pubId && !updatedPublicIds.has(pubId) && !pubId.startsWith('local_'));

      if (removedPublicIds.length > 0) {
        console.log(`[ProductController] Cleaning up ${removedPublicIds.length} removed Cloudinary assets for product ${product.slug}`);
        deleteMultipleImagesFromCloudinary(removedPublicIds).catch((err) => {
          console.warn('[ProductController] Background asset cleanup warning:', err.message);
        });
      }

      product.images = updatedImages;
    }

    product.updatedAt = Date.now();
    await product.save();

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error('[ProductController] Update error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete a product and delete associated Cloudinary images
 * @route   DELETE /api/products/:id
 * @access  Private (Admin)
 */
exports.deleteProduct = async (req, res) => {
  try {
    const identifier = req.params.id;
    const product = await Product.findOne({
      $or: [
        { _id: identifier.match(/^[0-9a-fA-F]{24}$/) ? identifier : null },
        { id: identifier },
        { slug: identifier },
      ],
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Extract Cloudinary publicIds to delete
    const publicIds = (product.images || [])
      .map((img) => (typeof img === 'object' ? img.publicId : ''))
      .filter((pubId) => pubId && !pubId.startsWith('local_'));

    // Delete product document from MongoDB
    await Product.findByIdAndDelete(product._id);

    // Delete Cloudinary assets
    if (publicIds.length > 0) {
      console.log(`[ProductController] Deleting ${publicIds.length} Cloudinary images for deleted product ${product.name}`);
      deleteMultipleImagesFromCloudinary(publicIds).catch((err) => {
        console.warn('[ProductController] Asset deletion warning:', err.message);
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product and associated assets deleted successfully.',
    });
  } catch (error) {
    console.error('[ProductController] Delete error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
