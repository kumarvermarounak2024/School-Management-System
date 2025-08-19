const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    // Fields from first form
    assigned: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    reference: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Referance",
      required: true,
    },
    response: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Response",
      required: true,
    },
    responseText: {
      type: String,
    },
    note: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    classApplyingFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    // Fields from second form
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },
    dateOfBirth: {
      type: Date,
    },
    previousSchool: {
      type: String,
    },
    fatherName: {
      type: String,
      required: true,
    },
    motherName: {
      type: String,
      required: true,
    },
    mobileNo: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    address: {
      type: String,
      required: true,
    },
    noOfChild: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Enquiry", enquirySchema);
