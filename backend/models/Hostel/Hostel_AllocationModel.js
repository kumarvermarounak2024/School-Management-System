const mongoose = require("mongoose");

const hostelAllocationSchema = new mongoose.Schema({
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
  studentName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admission",
    required: true,
  },
  fatherName: {
    type: String,
    required: true,
  },
  hostelName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HostelMaster",
    required: true,
  },
  roomName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HostelRoom",
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HostelCategory",
    required: true,
  },
  hostelFees: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("HostelAllocation", hostelAllocationSchema);
