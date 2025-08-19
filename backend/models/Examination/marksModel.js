const mongoose = require('mongoose');

const examMarksSchema = new mongoose.Schema({
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
    required: true
  },
  Admission: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admission',
    required: true
  },
  isAbsent: {
    type: Boolean,
    default: false
  },
  maximumMarks: {
    type: Number,
    required: true
  },
  obtainedMarks: {
    type: Number,
    required: function() {
      return !this.isAbsent;
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ExamMark', examMarksSchema);
