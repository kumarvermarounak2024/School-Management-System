const express = require("express");
const router = express.Router();
const {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
} = require("../../controllers/Academic/subjectController");

router.post("/create", createSubject);
router.get("/getAll", getAllSubjects);
router.get("/get/:id", getSubjectById);
router.put("/update/:id", updateSubject);
router.delete("/delete/:id", deleteSubject);

module.exports = router;
