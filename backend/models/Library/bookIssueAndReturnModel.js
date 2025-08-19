const mongoose = require("mongoose");

const bookIssueSchema = new mongoose.Schema(
  {
    bookCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BookCategory", 
      required: true,
    },
    bookTitle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book", 
      required: true,
    },
    issuedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class", 
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admission",
    },
    issueDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    fine: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Issued", "Pending", "Rejected"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BookIssue", bookIssueSchema);
