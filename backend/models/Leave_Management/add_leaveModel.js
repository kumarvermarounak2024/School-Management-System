const mongoose = require("mongoose");

const LeaveApplicationSchema = new mongoose.Schema({
  role: {
   type: String,
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",  
    required: true,
  },
  leaveCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LeaveCategory",
    required: true,
  },
  leaveDate: {
    from: { type: Date, required: true },
    to: { type: Date, required: true },
  },
  reason: {
    type: String,
  },
  comments: {
    type: String,
  },
  attachment: {
    type: String, 
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("LeaveApplication", LeaveApplicationSchema);
