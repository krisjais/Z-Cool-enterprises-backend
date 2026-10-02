const mongoose = require('mongoose');

const specificationSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, 'Specification key is required'],
      trim: true,
    },
    value: {
      type: String,
      required: [true, 'Specification value is required'],
      trim: true,
    },
  },
  { _id: false }
);

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    publicId: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
    },
    modelNumber: {
      type: String,
      trim: true,
      default: '',
    },
    code: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative'],
    },
    shortDescription: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    tagline: {
      type: String,
      trim: true,
      default: '',
    },
    specifications: {
      type: [specificationSchema],
      default: [],
    },
    images: {
      type: [imageSchema],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Draft'],
      default: 'Active',
    },
    availability: {
      type: String,
      enum: ['IN STOCK', 'OUT OF STOCK', 'MADE TO ORDER', 'REFURBISHMENT IN PROGRESS'],
      default: 'IN STOCK',
    },
    type: {
      type: String,
      default: 'Hermetic Scroll',
    },
    condition: {
      type: String,
      default: 'Refurbished & Pressure Tested',
    },
    voltage: {
      type: String,
      default: '',
    },
    displacement: {
      type: String,
      default: '',
    },
    refrigerant: {
      type: String,
      default: '',
    },
    application: {
      type: String,
      default: '',
    },
    accentColor: {
      type: String,
      default: '#1D6FA3',
    },
    statusBadge: {
      type: String,
      default: 'Pressure Tested',
    },
    compatibility: {
      type: [String],
      default: [],
    },
    compatDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    specs: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Normalize images and sync fields before validation
productSchema.pre('validate', function () {
  // 1. Normalize images: convert raw string URLs into { url, publicId }
  if (Array.isArray(this.images)) {
    this.images = this.images.map((item) => {
      if (typeof item === 'string') {
        return { url: item, publicId: '' };
      }
      if (item && typeof item === 'object') {
        return {
          url: item.url || '',
          publicId: item.publicId || '',
        };
      }
      return item;
    }).filter((img) => img && img.url);
  }

  // 2. Sync code and modelNumber
  if (!this.code && this.modelNumber) {
    this.code = this.modelNumber;
  }
  if (!this.modelNumber && this.code) {
    this.modelNumber = this.code;
  }
  if (!this.code && !this.modelNumber && this.name) {
    this.code = this.name.split(' ').slice(0, 3).join('-').toUpperCase();
    this.modelNumber = this.code;
  }

  // 3. Sync shortDescription and tagline
  if (!this.shortDescription && this.tagline) {
    this.shortDescription = this.tagline;
  }
  if (!this.tagline && this.shortDescription) {
    this.tagline = this.shortDescription;
  }

  // 4. Auto-generate slug and id
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  if (!this.id) {
    this.id = this.slug;
  }

  // 5. Sync inStock with availability
  if (this.inStock === false && this.availability === 'IN STOCK') {
    this.availability = 'OUT OF STOCK';
  } else if (this.availability === 'OUT OF STOCK') {
    this.inStock = false;
  }

  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Product', productSchema);
