const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    trim: true,
  },
  orderId: {
    type: String,
    default: '',
    trim: true,
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
    min: 1,
    default: 1,
  },
  shippedFrom: {
    type: String,
    required: [true, 'Dispatch origin location is required'],
    default: 'Mumbai Central Sourcing Hub, MH',
    trim: true,
  },
  shippedTo: {
    type: String,
    required: [true, 'Destination location is required'],
    trim: true,
  },
  courier: {
    type: String,
    required: [true, 'Logistics / Courier partner is required'],
    default: 'Blue Dart Express',
    trim: true,
  },
  trackingNumber: {
    type: String,
    required: [true, 'Tracking / Docket reference number is required'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['PROCESSING', 'SHIPPED', 'IN TRANSIT', 'DELIVERED'],
    default: 'SHIPPED',
  },
  notes: {
    type: String,
    default: '',
  },
  dispatchedAt: {
    type: Date,
    default: Date.now,
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

shipmentSchema.pre('save', function (next) {
  if (!this.id) {
    this.id = `SHP-${Date.now().toString().slice(-6)}`;
  }
  this.updatedAt = Date.now();
  if (typeof next === 'function') next();
});

module.exports = mongoose.model('Shipment', shipmentSchema);
