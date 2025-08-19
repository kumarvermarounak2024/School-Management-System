const express = require("express");
const router = express.Router();
const ExamMark = require("../../models/Examination/marksModel");
const Admission = require("../../models/admissionModel");

// ============ Exam Marks Controller ============
exports.createMarks = async (req, res) => {
  try {
    const examMark = new ExamMark(req.body);
    await examMark.save();
    res.status(201).json(examMark);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//=========== GET All Exam Marks ============
exports.getAllmarks = async (req, res) => {
  try {
    const marks = await ExamMark.find()
      .populate("exam")
      .populate("class")
      .populate("section")
      .populate("Admission");

    res.json(marks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =============== GET Exam Marks by ID ===============
exports.getmarksById = async (req, res) => {
  try {
    const mark = await ExamMark.findById(req.params.id)
      .populate("exam")
      .populate("class")
      .populate("section")
      .populate("Admission");

    if (!mark) return res.status(404).json({ error: "Exam mark not found" });
    res.json(mark);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//=============== UPDATE Exam Mark by ID ===============
exports.updatmarks = async (req, res) => {
  try {
    const updated = await ExamMark.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ error: "Exam mark not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ============= DELETE Exam Mark by ID =============
exports.deletemark = async (req, res) => {
  try {
    const deleted = await ExamMark.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Exam mark not found" });
    res.json({ message: "Exam mark deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
