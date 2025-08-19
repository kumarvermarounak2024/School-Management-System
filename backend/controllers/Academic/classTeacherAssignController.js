const ClassTeacherAssignment = require("../../models/Academic/classTeacherAssignModel");
const Employee = require("../../models/employeeModel");

// ================ Create Class Teacher Assignment ====================
exports.createAssignment = async (req, res) => {
  try {
    const { classId, sectionId, teacherId } = req.body;

    if (!classId || !sectionId || !teacherId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the assignment already exists
    const existingAssignment = await ClassTeacherAssignment.findOne({
      level_class: classId,
      section: sectionId,
      class_teacher: teacherId,
    });

    if (existingAssignment) {
      return res.status(400).json({ message: "Assignment already exists" });
    }

    const newAssignment = new ClassTeacherAssignment({
      level_class: classId,
      section: sectionId,
      class_teacher: teacherId,
    });

    await newAssignment.save();
    res.status(201).json({ message: "Assignment created successfully", data: newAssignment });
  } catch (error) {
    res.status(500).json({ message: "Failed to create assignment", error: error.message });
  }
};




//=================  Get all assign Teacher =========================
exports.getAllClassTeacherAssignments = async (req, res) => {
  try {
    const assignments = await ClassTeacherAssignment.find()
      .populate("level_class")
      .populate("section")
      .populate("class_teacher", "name");

    res.status(200).json({ data: assignments });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve assignments", error: error.message });
  }
};



// ============= Get assignTeacher by ID=================
exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await ClassTeacherAssignment.findById(req.params.id)
      .populate("level_class")
      .populate("section")
      .populate("class_teacher", "name");

    if (!assignment) {
      return res
        .status(404)
        .json({ success: false, message: "Assignment not found" });
    }

    res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    console.error("Get Assignment by ID Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============== Update assign ===============
// PUT /api/assignments/:id
exports.updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { classId, sectionId, teacherId } = req.body;

    if (!classId || !sectionId || !teacherId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updatedAssignment = await ClassTeacherAssignment.findByIdAndUpdate(
      id,
      {
        level_class: classId,
        section: sectionId,
        class_teacher: teacherId,
      },
      { new: true }
    );

    if (!updatedAssignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json({ message: "Assignment updated successfully", data: updatedAssignment });
  } catch (error) {
    res.status(500).json({ message: "Failed to update assignment", error: error.message });
  }
};


// ================= Delete assign ===============
exports.deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAssignment = await ClassTeacherAssignment.findByIdAndDelete(id);

    if (!deletedAssignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json({ message: "Assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete assignment", error: error.message });
  }
};


exports.getAllTeachers = async (req, res) => {
  try {
    // sirf wahi employees laao jinka role "Teacher" ho
    const teachers = await Employee.find({ role: "Teacher" }).select(
      "staffId name email mobile role department designation"
    );

    res.status(200).json({
      success: true,
      count: teachers.length,
      data: teachers,
    });
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};