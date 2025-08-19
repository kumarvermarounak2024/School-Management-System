const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  public_id: String,
  url: String,
  format: String,
  resource_type: String,
});

const PostalRecordSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: ["Receive", "Send"], 
    },
    reference_no: {
      type: String,
      required: [true, "Reference number is required"],
      unique: true,
    },
    sender_title: {
      type: String,
      required: [true, "Sender title is required"],
    },
    receiver_title: {
      type: String,
      required: [true, "Receiver title is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    note: {
      type: String,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    document_file: DocumentSchema,
    confidential: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PostalRecord", PostalRecordSchema);
