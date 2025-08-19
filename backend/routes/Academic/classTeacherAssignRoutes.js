const express = require("express");
const router = express.Router();
const {
  createAssignment,
  getAllClassTeacherAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  getAllTeachers
} = require("../../controllers/Academic/classTeacherAssignController");

router.post("/create", createAssignment);
router.get("/getAll", getAllClassTeacherAssignments);
router.get("/get/:id", getAssignmentById);
router.put("/update/:id", updateAssignment);
router.delete("/delete/:id", deleteAssignment);
router.get("/getTeacher", getAllTeachers)

module.exports = router;
