const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const { category, brand, availability, search, limit } = req.query;
    const query = {};

    if (category && category !== 'all') {
      query.category = new RegExp(`^${category.trim()}$`, 'i');
    }

    if (brand && brand !== 'all') {
      query.brand = new RegExp(`^${brand.trim()}$`, 'i');
    }

    if (availability && availability !== 'all') {
      query.availability = availability;
    }

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { code: searchRegex },
        { brand: searchRegex },
        { category: searchRegex },
        { type: searchRegex },
      ];
    }

    let productsQuery = Product.find(query).sort({ createdAt: -1 });

    if (limit) {
      productsQuery = productsQuery.limit(parseInt(limit, 10));
    }

    const products = await productsQuery;
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product by id or slug
// @route   GET /api/products/:idOrSlug
// @access  Public
exports.getProductBySlug = async (req, res) => {
  try {
    const identifier = req.params.idOrSlug;
    const cleanId = identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const idRegex = new RegExp(`^${cleanId}$`, 'i');
    const product = await Product.findOne({
      $or: [
        { id: idRegex },
        { slug: idRegex },
        { code: idRegex },
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

// @desc    Create a product
// @route   POST /api/products
// @access  Private (Admin)
exports.createProduct = async (req, res) => {
  try {
    const {
      code,
      name,
      brand,
      tagline,
      category,
      type,
      condition,
      availability,
      images,
      description,
      voltage,
      displacement,
      refrigerant,
      application,
      specs,
      compatibility,
      compatDetails,
    } = req.body;

    if (!code || !name || !brand || !category) {
      return res.status(400).json({
        success: false,
        message: 'Product code, name, brand, and category are required.',
      });
    }

    // Check if code or name already exists
    const exists = await Product.findOne({
      $or: [{ code: code.trim() }, { name: name.trim() }],
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Product with this code or name already exists.',
      });
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const product = await Product.create({
      id: slug,
      slug,
      code: code.trim(),
      name: name.trim(),
      brand: brand.trim(),
      tagline: tagline || '',
      category: category.trim(),
      type: type || 'Hermetic Scroll',
      condition: condition || 'Refurbished & Pressure Tested',
      availability: availability || 'IN STOCK',
      images: Array.isArray(images) ? images : (images ? [images] : []),
      description: description || '',
      voltage: voltage || '',
      displacement: displacement || '',
      refrigerant: refrigerant || '',
      application: application || '',
      specs: specs || {},
      compatibility: Array.isArray(compatibility) ? compatibility : [],
      compatDetails: compatDetails || {},
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Admin)
exports.updateProduct = async (req, res) => {
  try {
    const identifier = req.params.id;
    let product = await Product.findOne({
      $or: [
        { _id: identifier.match(/^[0-9a-fA-F]{24}$/) ? identifier : null },
        { id: identifier },
        { slug: identifier },
      ],
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updateFields = [
      'code',
      'name',
      'brand',
      'tagline',
      'category',
      'type',
      'condition',
      'availability',
      'images',
      'description',
      'voltage',
      'displacement',
      'refrigerant',
      'application',
      'specs',
      'compatibility',
      'compatDetails',
    ];

    updateFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    product.updatedAt = Date.now();
    await product.save();

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
exports.deleteProduct = async (req, res) => {
  try {
    const identifier = req.params.id;
    const product = await Product.findOneAndDelete({
      $or: [
        { _id: identifier.match(/^[0-9a-fA-F]{24}$/) ? identifier : null },
        { id: identifier },
        { slug: identifier },
      ],
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
