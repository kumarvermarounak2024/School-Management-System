const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    subjectName: {
      type: String,
      required: true,
      trim: true,
    },
    subjectCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    subjectAuthor: {
      type: String,
      trim: true,
    },
    subjectType: {
      type: String,
      enum: ["Theory", "Practical", "Optional"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Subject", subjectSchema);
