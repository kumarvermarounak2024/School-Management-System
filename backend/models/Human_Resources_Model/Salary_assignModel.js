// models/Human_Resources_Model/Salary_assignModel.js
const mongoose = require('mongoose');

const salaryAssignSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  gradeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SalaryTemplate',
    required: true
  },  
  assignedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SalaryAssign', salaryAssignSchema);
