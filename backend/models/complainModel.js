// models/complainModel.js
const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    complaintType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "complainType",
      required: true,
    },
    complainantName: {
      type: String,
      required: [true, "Complainant name is required"],
    },
    mobileNo: {
      type: String,
      required: [true, "Mobile number is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    dateOfSolution: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },
    assignTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: [true, "Assign to is required"],
    },
    note: {
      type: String,
    },
    document: {
      public_id: String,
      url: String,
      format: String,
      resource_type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
