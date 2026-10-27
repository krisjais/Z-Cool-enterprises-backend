const mongoose = require('mongoose');

const contactRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your contact name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Please provide a valid contact phone number'],
      trim: true,
      minlength: [7, 'Phone number must be at least 7 digits'],
      maxlength: [25, 'Phone number cannot exceed 25 characters'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
      validate: {
        validator: function (v) {
          if (!v || v.trim() === '') return true; // Optional field
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(v);
        },
        message: 'Please provide a valid email address',
      },
    },
    company: {
      type: String,
      trim: true,
      maxlength: [120, 'Company name cannot exceed 120 characters'],
      default: '',
    },
    message: {
      type: String,
      trim: true,
      maxlength: [2000, 'Message/requirements cannot exceed 2000 characters'],
      default: '',
    },
    type: {
      type: String,
      enum: ['quote', 'callback', 'dealer', 'general'],
      default: 'quote',
    },
    details: {
      brand: { type: String, default: '' },
      model: { type: String, default: '' },
      quantity: { type: String, default: '1 Unit' },
      application: { type: String, default: '' },
      nameplatePhoto: {
        url: { type: String, default: '' },
        publicId: { type: String, default: '' },
        filename: { type: String, default: '' },
        size: { type: Number, default: 0 },
        mimetype: { type: String, default: '' },
      },
    },
    consentGiven: {
      type: Boolean,
      default: false,
    },
    consentTimestamp: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'resolved'],
      default: 'pending',
    },
    sourceIp: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ContactRequest', contactRequestSchema);
