const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      default: 'Z Cool Enterprises',
      trim: true,
    },
    businessEmail: {
      type: String,
      required: [true, 'Business email is required'],
      default: 'zcooltech4@gmail.com',
      trim: true,
      lowercase: true,
    },
    businessPhone: {
      type: String,
      required: [true, 'Primary phone is required'],
      default: '+91 99209 06508',
      trim: true,
    },
    secondaryPhone: {
      type: String,
      default: '+91 98921 58245',
      trim: true,
    },
    address: {
      type: String,
      default: 'Shop No. 4, Ground Floor, Mumbai Central Sourcing Hub, Mumbai, Maharashtra 400008, India',
      trim: true,
    },
    operatingHours: {
      type: String,
      default: 'Monday – Saturday: 9:30 AM – 7:30 PM IST',
      trim: true,
    },
    dispatchOrigin: {
      type: String,
      default: 'Mumbai Central Sourcing Hub, MH',
      trim: true,
    },
    orderNotificationEmail: {
      type: String,
      default: 'zcooltech4@gmail.com',
      trim: true,
    },
    defaultStockFilter: {
      type: String,
      default: 'all',
      trim: true,
    },
    autoConfirmOrders: {
      type: Boolean,
      default: true,
    },
    updatedBy: {
      type: String,
      default: 'Admin',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Setting', settingSchema);
