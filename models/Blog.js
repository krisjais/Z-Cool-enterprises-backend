const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    unique: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  content: {
    type: String,
    required: [true, 'Please add the blog content'],
  },
  image: {
    type: String,
    default: '',
  },
  author: {
    type: String,
    default: 'Z Cool Tech Team',
  },
  tags: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto slug generation on save
blogSchema.pre('save', function (next) {
  this.slug = this.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  if (typeof next === 'function') next();
});

module.exports = mongoose.model('Blog', blogSchema);
