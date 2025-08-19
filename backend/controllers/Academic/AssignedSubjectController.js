const AssignedSubject = require("../../models/Academic/AssignedSubjectModel");

// Create assignment
exports.assignSubjects = async (req, res) => {
  try {
    const { classId, sectionId, subjects } = req.body;

    if (!classId || !sectionId || !subjects || subjects.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Class, Section, and at least one Subject are required",
      });
    }

    const newAssignment = new AssignedSubject({
      classId,
      sectionId,
      subjects,
    });

    const savedAssignment = await newAssignment.save();

    res.status(201).json({
      success: true,
      message: "Subjects assigned successfully",
      data: savedAssignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get all assigned subjects
exports.getAllAssigSubject = async (req, res) => {
  try {
    const assignments = await AssignedSubject.find()
      .populate("classId")
      .populate("sectionId")
      .populate("subjects")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// Update assigned subjects
exports.updateAssigSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { classId, sectionId, subjects } = req.body;

    const updatedAssignment = await AssignedSubject.findByIdAndUpdate(
      id,
      { classId, sectionId, subjects },
      { new: true }
    );

    if (!updatedAssignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Assignment updated successfully",
      data: updatedAssignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete assigned subjects
exports.deleteAssigSubject = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAssignment = await AssignedSubject.findByIdAndDelete(id);

    if (!deletedAssignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Assignment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
// Get assignment by ID
exports.getAssigSubjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await AssignedSubject.findById(id)
    if (!assignment) {
        return res.status(404).json({
            success: false,
            message: "Assignment not found",
            });
    }
    res.status(200).json({
        success: true,
        data: assignment,
    });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}