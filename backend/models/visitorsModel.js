const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
  visitingPurpose: {
    type: String,
    required: [true, "Visiting purpose is required"],
  },
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  mobileNo: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    required: [true, "Date is required"],
  },
  entryTime: {
    type: String,
    required: [true, "Entry time is required"],
  },
  exitTime: {
    type: String,
    required: [true, "Exit time is required"],
  },
  numberOfVisitor: {
    type: Number,
    required: [true, "Number of visitors is required"],
  },
  idNumber: {
    type: String,
  },
  tokenPass: {
    type: String,
  },
  note: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Visitor = mongoose.model("Visitor", visitorSchema);

module.exports = Visitor;
