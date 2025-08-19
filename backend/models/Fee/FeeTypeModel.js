// models/FeeType.js

const mongoose = require('mongoose');

const feeTypeSchema = new mongoose.Schema(
  {
    feeType: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FeeType', feeTypeSchema);
