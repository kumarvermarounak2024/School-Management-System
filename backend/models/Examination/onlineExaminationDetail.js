const mongoose = require('mongoose');

const onlineExamSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  class: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  maximumMarks: {
    type: Number,
    required: true
  },
  passingMarks: {
    type: Number,
    required: true
  },
  examType: {
    type: String,
    required: true,
    enum: ['Paid', 'Free']
  },
  examFee: {
    type: Number,
    default: 0 // Optional but included if examType is Paid
  },
  negativeMarkApplicable: {
    type: Boolean,
    default: false
  },
  markDisplay: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('OnlineExam', onlineExamSchema);
