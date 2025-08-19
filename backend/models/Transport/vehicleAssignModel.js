// models/vehicleAssign.model.js

const mongoose = require('mongoose');

const vehicleAssignSchema = new mongoose.Schema({
  transportRoute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true
  },
  stoppage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stoppage',
    required: true
  },
  vehicles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('VehicleAssign', vehicleAssignSchema);
