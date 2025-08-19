const mongoose = require("mongoose");

const examAttendanceSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    attendance: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Addmission",
          required: true,
        },
        status: {
          type: String,
          enum: ["Present", "Absent", "Late"],
          required: true,
        },
        remarks: {
          type: String,
          default: "",
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExamAttendance", examAttendanceSchema);
