const mongoose = require("mongoose");

const visitingPurposeModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});
const VisitingPurpose = mongoose.model("VisitingPurpose", visitingPurposeModel);
module.exports = VisitingPurpose;
