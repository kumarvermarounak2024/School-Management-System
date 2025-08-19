const mongoose = require("mongoose");

const feesAllocationSchema = new mongoose.Schema({
  feeGroup: {
     type: mongoose.Schema.Types.ObjectId,
      ref: "FeeGroup",
      // required: true,
  },
  sNo: {
    type: Number,
    // required: true,
    // unique: true,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admission",
      required: true,
    }
  ]
}, {
  timestamps: true,
});

module.exports = mongoose.model("FeesAllocation", feesAllocationSchema);
