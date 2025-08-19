const mongoose = require("mongoose");

const studentIDCardSchema = new mongoose.Schema(
  {
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admission",
        required: true,
      }
    ],
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IdCardTemplate",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentIdCard", studentIDCardSchema);
