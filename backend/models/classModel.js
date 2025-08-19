const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
    trim: true,
  },
  Class_Numeric: {
    type: Number,
    required: true,
  },
  employee:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  }
});

module.exports = mongoose.model("Class", classSchema);
