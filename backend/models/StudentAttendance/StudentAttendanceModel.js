const mongoose = require("mongoose");

const studentAttendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admission",
    required: true,
  },
  status: {
    type: String,
    enum: ["Present", "Absent", "Late", "Half Day"],
    required: true,
  },
  remarks: {
    type: String,
    default: "",
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model("StudentAttendance", studentAttendanceSchema);
