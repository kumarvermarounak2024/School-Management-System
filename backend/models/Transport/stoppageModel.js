const mongoose = require('mongoose');

const stoppageSchema = new mongoose.Schema({
  stoppage: {
    type: String,
    required: true,
    trim: true
  },
  stopTiming: {
    type: String,  
    required: true
  },
  routeFare: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Stoppage', stoppageSchema);
