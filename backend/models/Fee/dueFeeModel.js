const mongoose = require("mongoose");

const FeeAssignmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admission",
      // required: true,
    },
    feeType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FeeType",
      // required: true,
    },
    dueDate: {
      type: Date,
      // required: true,
    },
        feeGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FeeGroup", 
    },
    amount: {
      type: Number,
      // required: true,
    },
    paid: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    balance: {
      type: Number,
      default: function () {
        return this.amount - this.paid - this.discount;
      },
    },
  },
  { timestamps: true }
);

// Auto-calculate balance before save
FeeAssignmentSchema.pre("save", function (next) {
  this.balance = this.amount - this.paid - this.discount;
  next();
});

module.exports = mongoose.model("FeeAssignment", FeeAssignmentSchema);

