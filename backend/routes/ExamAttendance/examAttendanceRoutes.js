const express = require("express");
const router = express.Router();
const controller = require("../../controllers/ExamAttendance/examAttendanceController");

router.post("/save", controller.saveExamAttendance);
router.get("/filter", controller.getExamStudents);
router.get("/report",controller.getStudentExamAttendanceReport)

module.exports = router;
