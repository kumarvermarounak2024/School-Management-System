const mongoose = require("mongoose");

const TeacherScheduleSchema = new mongoose.Schema(
  {
    class_teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      // required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TeacherSchedule", TeacherScheduleSchema);
