const mongoose = require('mongoose');

const classScheduleSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    // required: true,
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    // required: true,
  },
  level_class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    // required: true,
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
    // required: true,
  },
  startTime: {
    type: String,
    // required: true,
  },
  endTime: {
    type: String,
    // required: true,
  },
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    // required: true,
  },
  class_room:{
    type: String,
    // required: true,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('calssSchedule', classScheduleSchema);