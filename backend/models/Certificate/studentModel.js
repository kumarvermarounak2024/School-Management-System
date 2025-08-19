const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentIdCardSchema = new Schema({
  students: [{ type: Schema.Types.ObjectId, ref: "Student" }],
  template: { type: Schema.Types.ObjectId, ref: "Certificate" },
}, { timestamps: true });

module.exports = mongoose.model("StudentIdCard", studentIdCardSchema);