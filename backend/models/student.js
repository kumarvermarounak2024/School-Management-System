const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  photo: {
    type: Object,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
  },
  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
  },
  registration_no: {
    type: String,
  },
  roll: {
    type: String,
  },
  date_of_birth: {
    type: Date,
  },
  guardian_name: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
