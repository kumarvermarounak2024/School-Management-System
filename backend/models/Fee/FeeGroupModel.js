const mongoose = require("mongoose");

const FeeGroupSchema = new mongoose.Schema({
  feeGroup: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  feeDetails: [
    {
      // feeType: { type: String, required: true },
      feeType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FeeType",
        required: true,
      },


      dueDate: { type: Date, required: true },
      amount: { type: Number, required: true },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("FeeGroup", FeeGroupSchema);