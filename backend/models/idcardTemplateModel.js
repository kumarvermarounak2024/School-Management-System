const mongoose = require("mongoose");

const IdCardTemplateSchema = new mongoose.Schema(
  {
    idCardName: { type: String, required: true },

    // Changed applicableUser from ObjectId to String to allow "Student", "Teacher", etc.
    applicableUser: { type: String, required: true },

    pageLayout: {
      width: { type: Number, required: true },
      height: { type: Number, required: true },
    },

    userPhotoStyle: {
      style: {
        type: String,
        enum: ["square", "rounded", "circle", "rectangle"],
        required: true,
      },
      size: { type: Number, required: true },
    },

    layoutSpacing: {
      top: { type: Number, default: 0 },
      bottom: { type: Number, default: 0 },
      left: { type: Number, default: 0 },
      right: { type: Number, default: 0 },
    },

    signatureImage: { type: String, default: "" },
    logoImage: { type: String, default: "" },
    backgroundImage: { type: String, default: "" },

    Certificate_Content: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("IdCardTemplate", IdCardTemplateSchema);
