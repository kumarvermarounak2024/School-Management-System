const Grade = require('../../models/Examination/examGradeModel');

// Create a new grade
exports.createGrade = async (req, res) => {
  try {
    const { gradeName, gradePoint, minPercentage, maxPercentage, remark } = req.body;

    // Basic validation
    if (!gradeName || gradePoint === undefined || minPercentage === undefined || maxPercentage === undefined) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    const newGrade = new Grade({
      gradeName,
      gradePoint,
      minPercentage,
      maxPercentage,
      remark
    });

    await newGrade.save();
    res.status(201).json({ message: "Grade created successfully", grade: newGrade });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get all grades
exports.getGrades = async (req, res) => {
  try {
    const grades = await Grade.find().sort({ minPercentage: -1 });
    res.status(200).json(grades);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



// ✅ Update Grade
exports.updateGrade = async (req, res) => {
  try {
    console.log("Update Request Body:", req.body); // Debugging

    const { id } = req.params;
    const { gradeName, gradePoint, minPercentage, maxPercentage, remark } = req.body;

    // Validation
    if (!gradeName || gradePoint === undefined || minPercentage === undefined || maxPercentage === undefined) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    const updatedGrade = await Grade.findByIdAndUpdate(
      id,
      { gradeName, gradePoint, minPercentage, maxPercentage, remark },
      { new: true, runValidators: true }
    );

    if (!updatedGrade) {
      return res.status(404).json({ message: "Grade not found" });
    }

    res.status(200).json({ message: "Grade updated successfully", grade: updatedGrade });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Delete Grade
exports.deleteGrade = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedGrade = await Grade.findByIdAndDelete(id);

    if (!deletedGrade) {
      return res.status(404).json({ message: "Grade not found" });
    }

    res.status(200).json({ message: "Grade deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
