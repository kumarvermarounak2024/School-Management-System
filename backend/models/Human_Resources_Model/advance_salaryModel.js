const mongoose = require('mongoose');

const advanceSalarySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    applicantName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    designation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Designation',
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AdvanceSalary', advanceSalarySchema);
