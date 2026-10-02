const Category = require('../models/Category');
const Product = require('../models/Product');

// The 25 official categories based on the reference Z Cool Technology product catalogue
const INITIAL_CATEGORIES = [
  {
    name: 'AC Compressor',
    slug: 'ac-compressor',
    sortOrder: 1,
    description: 'Air conditioning compressors for residential and commercial cooling systems.',
  },
  {
    name: 'Scroll Compressor',
    slug: 'scroll-compressor',
    sortOrder: 2,
    description: 'Scroll compressors for air conditioning, refrigeration and HVAC applications.',
  },
  {
    name: 'Refrigeration Compressors',
    slug: 'refrigeration-compressors',
    sortOrder: 3,
    description: 'Compressors designed for refrigeration and cooling applications.',
  },
  {
    name: 'Copeland Scroll Compressor',
    slug: 'copeland-scroll-compressor',
    sortOrder: 4,
    description: 'Copeland scroll compressors engineered for commercial and industrial cooling systems.',
  },
  {
    name: 'Air Compressor',
    slug: 'air-compressor',
    sortOrder: 5,
    description: 'Industrial and commercial air compressor units and air systems.',
  },
  {
    name: 'Rotary Compressor',
    slug: 'rotary-compressor',
    sortOrder: 6,
    description: 'Rotary compressors designed for high-efficiency residential and light commercial cooling.',
  },
  {
    name: 'Air Conditioner',
    slug: 'air-conditioner',
    sortOrder: 7,
    description: 'Air conditioner units, systems, and modular cooling equipment.',
  },
  {
    name: 'Danfoss Scroll Compressor',
    slug: 'danfoss-scroll-compressor',
    sortOrder: 8,
    description: 'Danfoss scroll compressors for commercial air conditioning and refrigeration applications.',
  },
  {
    name: 'Air Conditioning Compressors',
    slug: 'air-conditioning-compressors',
    sortOrder: 9,
    description: 'Compressors for residential, commercial, and industrial air conditioning systems.',
  },
  {
    name: 'Copeland Compressor',
    slug: 'copeland-compressor',
    sortOrder: 10,
    description: 'Copeland compressors including semi-hermetic, reciprocating, and scroll models.',
  },
  {
    name: 'Screw Compressor',
    slug: 'screw-compressor',
    sortOrder: 11,
    description: 'Screw compressors for large-scale industrial chilling and refrigeration systems.',
  },
  {
    name: 'AC AMC Service',
    slug: 'ac-amc-service',
    sortOrder: 12,
    description: 'Annual maintenance contract (AMC) services for commercial and industrial air conditioning.',
  },
  {
    name: 'VRF System',
    slug: 'vrf-system',
    sortOrder: 13,
    description: 'Variable Refrigerant Flow (VRF) systems and multi-split cooling solutions.',
  },
  {
    name: 'Relays',
    slug: 'relays',
    sortOrder: 14,
    description: 'Electrical relays and protection components for HVAC and compressor equipment.',
  },
  {
    name: 'Air Conditioner Installation Service',
    slug: 'air-conditioner-installation-service',
    sortOrder: 15,
    description: 'Professional installation and commissioning services for air conditioning systems.',
  },
  {
    name: 'Air Conditioner Motor',
    slug: 'air-conditioner-motor',
    sortOrder: 16,
    description: 'Fan and blower motors for residential, commercial, and industrial air conditioners.',
  },
  {
    name: 'Air Conditioner Maintenance Service',
    slug: 'air-conditioner-maintenance-service',
    sortOrder: 17,
    description: 'Preventive and corrective maintenance services for air conditioning units.',
  },
  {
    name: 'Rotary And Refrigerator Compressor',
    slug: 'rotary-and-refrigerator-compressor',
    sortOrder: 18,
    description: 'Rotary and reciprocating compressor units for domestic and commercial refrigeration.',
  },
  {
    name: 'Emerson Scroll Compressor',
    slug: 'emerson-scroll-compressor',
    sortOrder: 19,
    description: 'Emerson Copeland scroll compressors for HVAC and process cooling applications.',
  },
  {
    name: 'Daikin Compressor',
    slug: 'daikin-compressor',
    sortOrder: 20,
    description: 'Daikin scroll and inverter compressors for VRV, VRF, and commercial split systems.',
  },
  {
    name: 'Air Conditioner Compressor',
    slug: 'air-conditioner-compressor',
    sortOrder: 21,
    description: 'Replacement air conditioner compressors for all major cooling equipment brands.',
  },
  {
    name: '3D Bed Sheet',
    slug: '3d-bed-sheet',
    sortOrder: 22,
    description: 'Specialty industrial fabric and 3D protective bed sheets.',
  },
  {
    name: 'Pump And Valve',
    slug: 'pump-and-valve',
    sortOrder: 23,
    description: 'Industrial pumps, expansion valves, and fluid control accessories for cooling plants.',
  },
  {
    name: 'AACSR Conductor',
    slug: 'aacsr-conductor',
    sortOrder: 24,
    description: 'Aluminum Alloy Conductor Steel Reinforced (AACSR) electrical transmission conductors.',
  },
  {
    name: 'New Items',
    slug: 'new-items',
    sortOrder: 25,
    description: 'Newly arrived industrial cooling components, compressors, and specialized equipment.',
  },
];

/**
 * @desc    Get all categories with dynamic product counts (sorted by sortOrder)
 * @route   GET /api/categories
 * @access  Public
 */
exports.getCategories = async (req, res) => {
  try {
    let categories = await Category.find().sort({ sortOrder: 1, name: 1 });

    // Auto-seed default categories if empty
    if (categories.length === 0) {
      try {
        await Category.insertMany(INITIAL_CATEGORIES);
        categories = await Category.find().sort({ sortOrder: 1, name: 1 });
      } catch (seedErr) {
        console.warn('[CategoryController] Auto-seed failed:', seedErr.message);
      }
    }

    // Compute dynamic product counts from MongoDB
    const productCounts = await Product.aggregate([
      {
        $group: {
          _id: { $toLower: { $trim: { input: '$category' } } },
          count: { $sum: 1 },
        },
      },
    ]);

    const countMap = new Map();
    productCounts.forEach((item) => {
      if (item._id) {
        countMap.set(item._id.trim(), item.count);
      }
    });

    const totalProducts = await Product.countDocuments();

    const data = categories.map((cat) => {
      const lowerName = cat.name.toLowerCase().trim();
      const lowerSlug = (cat.slug || '').toLowerCase().trim();

      // Match exact name, slug, or singular/plural
      let count = countMap.get(lowerName) || (lowerSlug ? countMap.get(lowerSlug) : 0) || 0;
      if (!count) {
        const singularOrPlural = lowerName.endsWith('s') ? lowerName.slice(0, -1) : `${lowerName}s`;
        count = countMap.get(singularOrPlural) || 0;
      }

      return {
        _id: cat._id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        featured: cat.featured,
        sortOrder: cat.sortOrder !== undefined ? cat.sortOrder : 0,
        productCount: count,
        createdAt: cat.createdAt,
        updatedAt: cat.updatedAt,
      };
    });

    res.status(200).json({
      success: true,
      count: data.length,
      totalProducts,
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get single category by slug or id
 * @route   GET /api/categories/:slugOrId
 * @access  Public
 */
exports.getCategoryBySlug = async (req, res) => {
  try {
    const { slugOrId } = req.params;
    const cleanId = slugOrId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`^${cleanId}$`, 'i');

    const category = await Category.findOne({
      $or: [
        { _id: slugOrId.match(/^[0-9a-fA-F]{24}$/) ? slugOrId : null },
        { slug: regex },
        { name: regex },
      ],
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const productCount = await Product.countDocuments({
      category: new RegExp(`^${category.name.trim()}$`, 'i'),
    });

    res.status(200).json({
      success: true,
      data: {
        ...category.toObject(),
        productCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create new category
 * @route   POST /api/categories
 * @access  Private (Admin)
 */
exports.createCategory = async (req, res) => {
  try {
    const { name, slug, description, image, featured, sortOrder } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const existingName = await Category.findOne({
      name: new RegExp(`^${name.trim()}$`, 'i'),
    });

    if (existingName) {
      return res.status(400).json({ success: false, message: 'A category with this name already exists' });
    }

    // Auto-generate slug if not provided
    const targetSlug = slug
      ? slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      : name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const existingSlug = await Category.findOne({ slug: targetSlug });
    if (existingSlug) {
      return res.status(400).json({ success: false, message: 'A category with this slug already exists' });
    }

    // If sortOrder not specified, place at the end
    let finalOrder = sortOrder;
    if (finalOrder === undefined || finalOrder === null || finalOrder === '') {
      const highest = await Category.findOne().sort({ sortOrder: -1 });
      finalOrder = highest && highest.sortOrder ? highest.sortOrder + 1 : 1;
    }

    const category = await Category.create({
      name: name.trim(),
      slug: targetSlug,
      description: description ? description.trim() : '',
      image: image || '',
      featured: Boolean(featured),
      sortOrder: Number(finalOrder) || 0,
    });

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Private (Admin)
 */
exports.updateCategory = async (req, res) => {
  try {
    const id = req.params.id || req.params.slugOrId;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Category identifier is required' });
    }

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    const category = await Category.findOne({
      $or: [
        { _id: isObjectId ? id : null },
        { slug: id.toLowerCase() },
      ],
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const { name, slug, description, image, featured, sortOrder } = req.body;
    const oldName = category.name;

    if (name && name.trim()) {
      const trimmedName = name.trim();
      if (trimmedName.toLowerCase() !== category.name.toLowerCase()) {
        const duplicate = await Category.findOne({
          name: new RegExp(`^${trimmedName}$`, 'i'),
          _id: { $ne: category._id },
        });
        if (duplicate) {
          return res.status(400).json({ success: false, message: 'Another category already has this name' });
        }
      }
      category.name = trimmedName;
    }

    if (slug && slug.trim()) {
      const trimmedSlug = slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      if (trimmedSlug !== category.slug) {
        const duplicateSlug = await Category.findOne({
          slug: trimmedSlug,
          _id: { $ne: category._id },
        });
        if (duplicateSlug) {
          return res.status(400).json({ success: false, message: 'Another category already has this slug' });
        }
      }
      category.slug = trimmedSlug;
    }

    if (description !== undefined) category.description = description.trim();
    if (image !== undefined) category.image = image;
    if (featured !== undefined) category.featured = Boolean(featured);
    if (sortOrder !== undefined && sortOrder !== '') category.sortOrder = Number(sortOrder) || 0;

    await category.save();

    // If the category name changed, update products that referenced the old name
    if (name && name.trim() && name.trim() !== oldName) {
      try {
        await Product.updateMany(
          { category: oldName },
          { $set: { category: category.name } }
        );
      } catch (err) {
        console.warn('Failed to sync updated category name to products:', err.message);
      }
    }

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Private (Admin)
 */
exports.deleteCategory = async (req, res) => {
  try {
    const id = req.params.id || req.params.slugOrId;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Category identifier is required' });
    }

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    const category = await Category.findOne({
      $or: [
        { _id: isObjectId ? id : null },
        { slug: id.toLowerCase() },
      ],
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Safety check: check if any products are assigned to this category
    const productCount = await Product.countDocuments({
      category: new RegExp(`^${category.name.trim()}$`, 'i'),
    });

    // If products exist and force query is not provided, prevent accidental deletion
    if (productCount > 0 && req.query.force !== 'true') {
      return res.status(400).json({
        success: false,
        message: `Cannot delete "${category.name}" because ${productCount} product(s) are currently assigned to it. Please reassign the products first.`,
        productCount,
      });
    }

    await Category.findByIdAndDelete(category._id);

    res.status(200).json({
      success: true,
      message: `Category "${category.name}" deleted successfully.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports.INITIAL_CATEGORIES = INITIAL_CATEGORIES;
