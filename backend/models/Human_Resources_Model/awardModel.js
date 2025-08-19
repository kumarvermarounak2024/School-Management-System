const mongoose = require('mongoose');

const awardSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
  },
  winner: {
    type: String,
    required: true,
  },
  awardName: {
    type: String,
    required: true,
  },
  giftItem: {
    type: String,
    required: true,
  },
  cashPrice: {
    type: String,
    default: "",
  },
  awardReason: {
    type: String,
    required: true,
  },
  givenDate: {
    type: Date, // Better to use Date type
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Award', awardSchema);
