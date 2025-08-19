// const express = require("express");
// const router = express.Router();

// const {
//   createExam,
//   getAllExams,
//   deleteExam,
//   updateExam
// } = require("../controllers/examEntryController");

// router.post("/create", createExam);
// router.get("/getAll", getAllExams);
// router.delete("/delete/:id", deleteExam);
// router.put("/update/:id", updateExam);

// module.exports = router;


const express = require("express");
const router = express.Router();

const {
  createExamSchedule,
  getAllExamSchedules,
  getExamScheduleById,
  updateExamSchedule,
  deleteExamSchedule,
  getsubjectbyclassandexam
} = require("../../controllers/Examination/examScheduleController");

// Routes
router.post("/create", createExamSchedule);
router.get("/getAll", getAllExamSchedules);
router.get("/get/:id", getExamScheduleById);
router.put("/update/:id", updateExamSchedule);
router.delete("/delete/:id", deleteExamSchedule);

router.get('/subjects',getsubjectbyclassandexam);

module.exports = router;

