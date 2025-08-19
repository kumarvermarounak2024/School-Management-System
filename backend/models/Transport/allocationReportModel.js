const mongoose = require("mongoose");

const allocationReportSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admission",
      required: true,
    },
    fatherName: {
      type: String,
      required: false,
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    routeName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true,
    },
    stoppage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stoppage",
      required: true,
    },
    vehicleNumber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    // status: {
    //   type: String,
    //   enum: ["Active", "Inactive"],
    //   required: true,
    // },
    routeFare: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "allocationReportModel",
  allocationReportSchema
);
