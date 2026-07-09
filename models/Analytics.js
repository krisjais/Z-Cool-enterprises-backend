const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
  },
  inquiriesCount: {
    type: Number,
    default: 0,
  },
  quotesCount: {
    type: Number,
    default: 0,
  },
  dealerRequestsCount: {
    type: Number,
    default: 0,
  },
  visitorsCount: {
    type: Number,
    default: 0,
  },
  pageViewsCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Analytics', analyticsSchema);
