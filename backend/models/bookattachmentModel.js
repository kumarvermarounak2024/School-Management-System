const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
    publishDate: {
      type: Date,
      required: true,
    },
    remarks: {
      type: String,
    },
    attachmentUrl: {
      type: String,
      required: true,
    },
    availableForAll: {
      type: Boolean,
    },
    notAccordingSubject: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attachment", attachmentSchema);
