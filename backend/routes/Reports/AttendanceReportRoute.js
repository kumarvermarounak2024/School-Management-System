const express = require("express");
const router = express.Router();
const attendanceController = require("../../controllers/Reports/AttendanceReportController");


// GET Monthly Attendance Report
router.get("/report", attendanceController.getMonthlyStudentAttendanceReport);

// GET Teacher Monthly Attendance Report
router.get("/staff/report", attendanceController.getStaffMonthlyAttendanceReport);

// GET Daily Attendance Report
router.get("/attendance/class-report",attendanceController.getClassAttendanceSummary);


module.exports = router;
