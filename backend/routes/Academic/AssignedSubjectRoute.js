const express = require("express");
const router = express.Router();
const {
  assignSubjects,
  getAllAssigSubject,
    updateAssigSubject,
    deleteAssigSubject,
    getAssigSubjectById
    
} = require("../../controllers/Academic/AssignedSubjectController");

router.post("/create", assignSubjects);
router.get("/getAll", getAllAssigSubject);
router.put("/update/:id", updateAssigSubject);
router.delete("/delete/:id", deleteAssigSubject);
router.get("/get/:id", getAssigSubjectById);

module.exports = router;
