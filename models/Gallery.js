const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an image title'],
  },
  imageUrl: {
    type: String,
    required: [true, 'Please provide the image URL'],
  },
  category: {
    type: String,
    enum: ['project', 'factory', 'event'],
    default: 'project',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Gallery', gallerySchema);
