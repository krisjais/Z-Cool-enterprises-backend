const Product = require('../models/Product');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const { uploadToCloudinary } = require('../middleware/upload');
const fs = require('fs');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const { category, brand, search, featured, limit } = req.query;
    const query = {};

    if (category) {
      const catObj = await Category.findOne({ slug: category });
      if (catObj) query.category = catObj._id;
    }

    if (brand) {
      const brandObj = await Brand.findOne({ name: new RegExp(brand, 'i') });
      if (brandObj) query.brand = brandObj._id;
    }

    if (featured) {
      query.featured = featured === 'true';
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let productsQuery = Product.find(query).populate('category').populate('brand');

    if (limit) {
      productsQuery = productsQuery.limit(parseInt(limit));
    }

    const products = await productsQuery.sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product by slug
// @route   GET /api/products/:slug
// @access  Public
exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('category')
      .populate('brand');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Find related products (same category)
    const related = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id }
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
    const { name, description, category, brand, featured, inStock, specs } = req.body;

    // Check if product name already exists
    const exists = await Product.findOne({ name });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Product name already exists' });
    }

    // Process files
    const imagesUrls = [];
    let datasheetUrl = '';

    if (req.files) {
      if (req.files.images) {
        for (const file of req.files.images) {
          const url = await uploadToCloudinary(file.path, 'z_cool_tech/products');
          imagesUrls.push(url);
        }
      }
      if (req.files.datasheet) {
        datasheetUrl = await uploadToCloudinary(req.files.datasheet[0].path, 'z_cool_tech/datasheets');
      }
    }

    // Handle specs map parsing from frontend stringified JSON
    let parsedSpecs = {};
    if (specs) {
      try {
        parsedSpecs = typeof specs === 'string' ? JSON.parse(specs) : specs;
      } catch (e) {
        console.error('Specs parsing error:', e);
      }
    }

    const product = await Product.create({
      name,
      description,
      category,
      brand: brand || null,
      images: imagesUrls,
      datasheet: datasheetUrl,
      specs: parsedSpecs,
      featured: featured === 'true',
      inStock: inStock !== 'false',
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
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const { name, description, category, brand, featured, inStock, specs, existingImages } = req.body;

    // Process file updates
    let imagesUrls = [];
    if (existingImages) {
      // Retain already uploaded images selected by user
      imagesUrls = typeof existingImages === 'string' ? [existingImages] : existingImages;
    }

    let datasheetUrl = product.datasheet;

    if (req.files) {
      if (req.files.images) {
        for (const file of req.files.images) {
          const url = await uploadToCloudinary(file.path, 'z_cool_tech/products');
          imagesUrls.push(url);
        }
      }
      if (req.files.datasheet) {
        datasheetUrl = await uploadToCloudinary(req.files.datasheet[0].path, 'z_cool_tech/datasheets');
      }
    }

    // Handle specs parsing
    let parsedSpecs = product.specs;
    if (specs) {
      try {
        parsedSpecs = typeof specs === 'string' ? JSON.parse(specs) : specs;
      } catch (e) {
        console.error('Specs parsing error:', e);
      }
    }

    const updateData = {
      name: name || product.name,
      description: description || product.description,
      category: category || product.category,
      brand: brand || product.brand,
      images: imagesUrls,
      datasheet: datasheetUrl,
      specs: parsedSpecs,
      featured: featured !== undefined ? featured === 'true' : product.featured,
      inStock: inStock !== undefined ? inStock !== 'false' : product.inStock,
    };

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

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
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
