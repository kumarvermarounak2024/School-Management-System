const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  examTerms: [
    {
      name: {
        type: String,
        required: true
      }
    }
  ],
  examRooms: [
    {
      roomNumber: {
        type: String,
        required: true
      },
      noOfSeats: {
        type: Number,
        required: true
      }
    }
  ],
  examList: [
    {
      examName: {
        type: String,
        required: true
      },
      term: {
        type: String,
        required: true
      },
      examType: {
        type: String,
        enum: ['Objective', 'Subjective', 'Both'],
        required: true
      },
      remark: {
        type: String
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);
