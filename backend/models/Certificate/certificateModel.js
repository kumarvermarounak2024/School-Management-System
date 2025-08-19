const mongoose = require("mongoose");

const fileSchema = {
  public_id: String,
  url: String,
  format: String,
  resource_type: String,
};

const certificateSchema = new mongoose.Schema({
  certificateName: String,
  applicableUser: String,
  pageLayout: String,
  photoStyle: String,
  photoSize: String,
  layoutSpacing: {
    top: Number,
    bottom: Number,
    left: Number,
    right: Number,
  },
  signature: fileSchema,
  logo: fileSchema,
  background: fileSchema,
  content: String,
  createdAt: String,
});

module.exports = mongoose.model("Certificate", certificateSchema);
