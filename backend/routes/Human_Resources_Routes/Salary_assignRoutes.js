const express = require("express");
const router = express.Router();
const {
  getEmployeesByRoleDesignation,
  assignSalaryGrade,
  getSalaryGrades,
  getAllAssign,
  getAssignByEmployeeId
} = require("../../controllers/Human_Resources_Controller/Salary_assignController");

router.get("/get", getEmployeesByRoleDesignation);
router.post("/assign", assignSalaryGrade);
router.get("/grades", getSalaryGrades); 
router.get("/getAllAssign", getAllAssign);
router.get("/getAssign/:employeeId", getAssignByEmployeeId);


module.exports = router;
