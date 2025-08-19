const mongoose = require("mongoose");

const FeeReminderSchema = new mongoose.Schema({
  frequency: {
    type: String,
    required: true,
    enum: ["Before","After"], 
  },
  days: {
    type: [String],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  dltTemplateId: {
    type: String,
    required: false,
  },
  notifyStudent: {
    type: Boolean,
    default: false,
  },
  notifyGuardian: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model("FeeReminder", FeeReminderSchema);
