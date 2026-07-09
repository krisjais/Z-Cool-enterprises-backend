const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide the client name'],
  },
  designation: {
    type: String,
    default: '',
  },
  company: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    required: [true, 'Please provide the testimonial content'],
  },
  avatar: {
    type: String,
    default: '',
  },
  videoUrl: {
    type: String,
    default: '',
  },
  rating: {
    type: Number,
    default: 5,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
