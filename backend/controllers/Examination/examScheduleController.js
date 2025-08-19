const ExamSchedule = require("../../models/Examination/examSchedule");

// Create Exam Schedule
exports.createExamSchedule = async (req, res) => {
  try {
    console.log(req.body, "ddjdj");
    const newSchedule = new ExamSchedule(req.body);
    const savedSchedule = await newSchedule.save();
    res.status(201).json({
      message: "Exam schedule created successfully",
      data: savedSchedule,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create exam schedule",
      error: error.message,
    });
  }
};

// Get All Exam Schedules
exports.getAllExamSchedules = async (req, res) => {
  try {
    const schedules = await ExamSchedule.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "Fetched exam schedules successfully",
      data: schedules,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch schedules",
      error: error.message,
    });
  }
};

// Get Single Exam Schedule by ID
exports.getExamScheduleById = async (req, res) => {
  try {
    const schedule = await ExamSchedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    res.status(200).json({
      message: "Fetched exam schedule",
      data: schedule,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching schedule",
      error: error.message,
    });
  }
};


// Update Exam Schedule
exports.updateExamSchedule = async (req, res) => {
  try {
    const updated = await ExamSchedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.status(200).json({
      message: "Updated exam schedule successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating schedule",
      error: error.message,
    });
  }
};

// Delete Exam Schedule
exports.deleteExamSchedule = async (req, res) => {
  try {
    const deleted = await ExamSchedule.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    res.status(200).json({
      message: "Deleted exam schedule",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting schedule",
      error: error.message,
    });
  }
};

const AssignedSubject = require("../../models/Academic/AssignedSubjectModel");
const Exam = require("../../models/Examination/exam");

// Get subjects by class and exam
exports.getsubjectbyclassandexam = async (req, res) => {
  try {
    const { classId, examId } = req.query;

    if (!classId) {
      return res.status(400).json({ message: "classId is required" });
    }

    if (examId) {
      const examExists = await Exam.findById(examId);
      if (!examExists) {
        return res.status(404).json({ message: "Invalid examId" });
      }
    }

    const assignedSubjects = await AssignedSubject.findOne({ classId })
      .populate("subjects", "subjectName")
      .lean();

    if (!assignedSubjects) {
      return res
        .status(404)
        .json({ message: "No subjects assigned to this class" });
    }

    res.status(200).json({
      classId: assignedSubjects.classId,
      sectionId: assignedSubjects.sectionId,
      subjects: assignedSubjects.subjects,
    });
  } catch (error) {
    console.error("Error fetching assigned subjects:", error);
    res.status(500).json({ message: "Server error" });
  }
};
