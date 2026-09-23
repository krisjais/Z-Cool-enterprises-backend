const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  code: {
    type: String,
    required: [true, 'Product code is required'],
    trim: true,
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    trim: true,
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true,
  },
  tagline: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  type: {
    type: String,
    default: 'Hermetic Scroll',
  },
  condition: {
    type: String,
    default: 'Refurbished & Pressure Tested',
  },
  availability: {
    type: String,
    enum: ['IN STOCK', 'OUT OF STOCK', 'MADE TO ORDER', 'REFURBISHMENT IN PROGRESS'],
    default: 'IN STOCK',
  },
  images: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    default: '',
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
  featured: {
    type: Boolean,
    default: false,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto-generate slug and id if missing
productSchema.pre('save', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  if (!this.id) {
    this.id = this.slug;
  }
  this.updatedAt = Date.now();
  if (typeof next === 'function') next();
});

module.exports = mongoose.model('Product', productSchema);
