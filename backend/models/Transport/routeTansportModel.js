// models/route.model.js
const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  routeName: {
    type: String,
    required: true,
    trim: true,
  },
  startPlace: {
    type: String,
    required: true,
    trim: true,
  },
  stopPlace: {
    type: String,
    required: true,
    trim: true,
  },
  remark: {
    type: String,
    trim: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Route', routeSchema);