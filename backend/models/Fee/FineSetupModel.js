const mongoose = require("mongoose");

const FineSetupSchema = new mongoose.Schema(
  {
    feeGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FeeGroup",
      required: true,
    },
    feeType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FeeType",
      required: true,
    },
    fineType: {
      type: String,
      required: true,
    },
    fineValue: {
      type: String,
      required: true,
    },
    lateFeeFrequency: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FineSetup", FineSetupSchema);

