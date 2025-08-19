const mongoose = require("mongoose");

const employeeAttendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  role: {
    type: String,
    enum: ["Admin", "Teacher", "Accountant", "Librarian", "Receptionist"],
    required: true,
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee", 
    required: true,
  },
  status: {
    type: String,
    enum: ["Present", "Absent", "Late", "Half Day"],
    required: true,
  },
  remarks: {
    type: String,
    default: "",
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("EmployeeAttendance", employeeAttendanceSchema);
