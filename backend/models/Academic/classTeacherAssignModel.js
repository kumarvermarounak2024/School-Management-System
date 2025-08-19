const mongoose = require("mongoose");

const classTeacherAssignmentSchema = new mongoose.Schema(
  {
    level_class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      // required: true,
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      // required: true,
    },
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

module.exports = mongoose.model(
  "ClassTeacherAssignment",
  classTeacherAssignmentSchema
);
