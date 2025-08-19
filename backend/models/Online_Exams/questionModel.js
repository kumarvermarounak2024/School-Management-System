
const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  type: {
    type: String,
    enum: ["Objective", "One Word", "True/False", "Descriptive"],
    required: true,
  },
  marks: {
    type: Number,
    required: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  // Only for Objective questions
  options: [optionSchema],
  correctOptionIndex: {
    type: Number, // index of the correct option (0-3)
    validate: {
      validator: function (val) {
        return (
          this.type !== "Objective" || (val >= 0 && val < this.options.length)
        );
      },
      message: "Invalid correct option index.",
    },
  },
  // For other types
  answer: {
    type: mongoose.Schema.Types.Mixed, // string or boolean
    required: function () {
      return this.type !== "Objective";
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Question", questionSchema);
