const express = require("express");
const router = express.Router();

const {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam,
} = require("../../controllers/Examination/ExaminationController");

router.post("/create", createExam);

router.get("/getAll", getAllExams);

router.get("/get/:id", getExamById);

router.put("/update/:id", updateExam);

router.delete("/delete/:id", deleteExam);

module.exports = router;
