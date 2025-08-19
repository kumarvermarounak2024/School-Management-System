const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Capacity: {
    type: Number,
    required: true,
  },
  empoyee:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  }
});

module.exports = mongoose.model("Section", SectionSchema);


