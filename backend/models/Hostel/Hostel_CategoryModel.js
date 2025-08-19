const mongoose = require("mongoose");

const hostelCategorySchema = new mongoose.Schema({
  Category_name: {
    type: String,
    required: true,
  },
});
const HostelCategory = mongoose.model("HostelCategory", hostelCategorySchema);
module.exports = HostelCategory;
