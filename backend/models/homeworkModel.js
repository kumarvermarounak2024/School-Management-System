const mongoose = require("mongoose");

const homeworkSchema = new mongoose.Schema(
  {
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
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admission",
      // required: true,
    },
    status: {
      type: String,
      enum: ["completed", "incomplete"],
      default: "incomplete",
      // required: true,
    },
    rankOutOfFive: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    remark: {
      type: String,
    },
    assignment: {
      type: String,
    },
    dateOfHomework: { type: Date, required: true },
    dateOfSubmission: { type: Date },
    publishLater: { type: Boolean, default: false },
    scheduleDate: {
      type: Date,
      required: true,
    },
    homework: { type: String },
    attachmentUrl: {
      public_id: String,
      url: String,
      format: String,
      resource_type: String,
    },
    sendNotification: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Homework", homeworkSchema);
