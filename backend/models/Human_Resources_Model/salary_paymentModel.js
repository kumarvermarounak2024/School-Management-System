const mongoose = require("mongoose");

const salaryPaymentSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    salaryGrade: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SalaryTemplate",
      required: true,
    },
    salaryassignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SalaryAssign",
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      require: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SalaryPayment", salaryPaymentSchema);
