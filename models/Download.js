const mongoose = require('mongoose');

const downloadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a file title'],
  },
  fileUrl: {
    type: String,
    required: [true, 'Please provide the file URL'],
  },
  fileType: {
    type: String,
    enum: ['catalog', 'datasheet', 'certificate'],
    default: 'catalog',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Download', downloadSchema);
