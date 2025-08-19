const express = require("express");
const router = express.Router();
const controller = require("../../controllers/EmployeeAttendance/EmployeeAttendance");

router.post("/create", controller.createAttendance);
router.get("/list", controller.getEmployeesByRole);
router.get("/report", controller.getEmployeeReport);

module.exports = router;
