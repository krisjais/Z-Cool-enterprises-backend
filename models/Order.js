const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    trim: true,
  },
  orderType: {
    type: String,
    enum: ['ONLINE', 'OFFLINE'],
    required: [true, 'Order type (ONLINE or OFFLINE) is required'],
    default: 'OFFLINE',
  },
  productId: {
    type: String,
    required: [true, 'Associated Product reference is required'],
    trim: true,
  },
  productName: {
    type: String,
    required: [true, 'Product Name is required'],
    trim: true,
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
    default: 1,
  },
  customer: {
    name: { type: String, required: true, trim: true },
    company: { type: String, default: '', trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, default: '', trim: true },
    city: { type: String, default: 'Mumbai', trim: true },
  },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'COMPLETED', 'CANCELLED'],
    default: 'CONFIRMED',
  },
  notes: {
    type: String,
    default: '',
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

// Auto-generate order ID if not provided
orderSchema.pre('save', function (next) {
  if (!this.id) {
    this.id = `ORD-${Date.now().toString().slice(-6)}`;
  }
  this.updatedAt = Date.now();
  if (typeof next === 'function') next();
});

module.exports = mongoose.model('Order', orderSchema);
