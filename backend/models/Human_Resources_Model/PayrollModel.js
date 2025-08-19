const mongoose = require("mongoose");

const allowanceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const deductionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const salaryTemplateSchema = new mongoose.Schema({
  salaryGrade: {
    type: String,
    required: true,
    trim: true,
  },
  basicSalary: {
    type: Number,
    required: true,
  },
  overtimeRate: {
    type: Number,
    default: 0,
  },
  allowances: [allowanceSchema],
  deductions: [deductionSchema],
  finalSalary: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SalaryTemplate", salaryTemplateSchema);
