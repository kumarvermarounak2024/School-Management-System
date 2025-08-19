const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EventType', // must match the model name
      required: true
    },

    audience: { type: String },
    description: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    isHoliday: { type: Boolean, default: false },
    showWebsite: { type: Boolean, default: false },
    publish: { type: Boolean, default: false },
    createdBy: { type: String },
    
    image: {
      public_id: String,
      url: String,
      format: String,
      resource_type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
