const express = require("express");
const router = express.Router();
const {
  createClassSchedule,
  getAllClassSchedules,
  getClassScheduleById,
  updateClassScheduleById,
  deleteClassSchedule,
} = require("../../controllers/Academic/classscheduleController");

router.post("/create", createClassSchedule);
router.get("/getAll", getAllClassSchedules);
router.get("/get/:id", getClassScheduleById);
router.put("/update/:id", updateClassScheduleById);
router.delete("/delete/:id", deleteClassSchedule);

module.exports = router;
