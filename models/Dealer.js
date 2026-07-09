const mongoose = require('mongoose');

const dealerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide the applicant name'],
    trim: true,
  },
  company: {
    type: String,
    required: [true, 'Please provide the company name'],
    trim: true,
  },
  gstin: {
    type: String,
    required: [true, 'Please provide the GSTIN number'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number'],
  },
  address: {
    type: String,
    required: [true, 'Please provide the company address'],
  },
  experience: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Dealer', dealerSchema);
