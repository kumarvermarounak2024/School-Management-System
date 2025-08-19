const mongoose = require("mongoose");

const feeInventorySchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admission",
      required: true,
    },
    feeGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FeeGroup",
      // required: true,
    },
    status: {
      type: String,
      enum: ["Total Paid", "Unpaid"],
      default: "Unpaid",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("feeInventory", feeInventorySchema);
