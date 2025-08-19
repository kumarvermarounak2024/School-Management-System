const mongoose = require("mongoose");

const examScheduleSchema = new mongoose.Schema({
  examName: {
    type: String,
    required: true
  },
  className: {
    type: String,
    required: true
  },
//   section: {
//     type: String,
//     required: true
//   },
//   session: {
//     type: String,
//     required: true
//   },
  schedule: [
    {
      subject: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        required: true
      },
      startingTime: {
        type: String,
        required: true
      },
      endingTime: {
        type: String,
        required: true
      },
      classRoomNo: {
        type: String,
        required: true
      }
    }
  ]
});

module.exports = mongoose.model("ExamSchedule", examScheduleSchema);
