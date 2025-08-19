const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  gradeName: {
    type: String,
    required: true,
    trim: true
  },
  gradePoint: {
    type: Number,
    required: true
  },
  minPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  maxPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  remark: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Grade', gradeSchema);
