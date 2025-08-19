const express = require("express");
const router = express.Router();
const {
  createTeacherSchedule,
  getAllTeacherSchedules,
  getTeacherScheduleById,
 
} = require("../../controllers/Academic/TeacherScheduleController");

router.post("/create", createTeacherSchedule);
router.get("/getAll", getAllTeacherSchedules);
router.get("/get/:id", getTeacherScheduleById);


module.exports = router;
