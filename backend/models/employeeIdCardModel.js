const mongoose = require("mongoose");

const employeeIdCardSchema = new mongoose.Schema(
  {
    employees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
      },
    ],
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IdCardTemplate",
      // required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmployeeIdCard", employeeIdCardSchema);
