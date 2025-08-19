const express = require("express");
const router = express.Router();
const controller = require("../../controllers/studentAttendance/studentAttendanceController");

router.post("/create", controller.createAttendance);
router.get("/list", controller.getStudentsByClassSection);
router.get("/report", controller.getStudentAttendanceReport);

module.exports = router;
