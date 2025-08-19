const TeacherIdCard = require("../models/teacherModel");

// ✅ Create teacher ID card
exports.createTeacherIdCard = async (req, res) => {
  try {
    const { templateId, employeeIds, roleId } = req.body;

    if (!templateId || !employeeIds?.length || !roleId) {
      return res.status(400).json({
        success: false,
        message: "templateId, employeeIds, and roleId are required.",
      });
    }

    const newCard = new TeacherIdCard({
      template: templateId,
      employees: employeeIds,
      role: roleId,
    });

    const savedCard = await newCard.save();

    const populatedCard = await TeacherIdCard.findById(savedCard._id)
      .populate("template", "idCardName layoutSpacing logoImage signatureImage backgroundImage")
      .populate({
        path: "employees",
        select:
          "staffId name email gender mobile department designation profilePicture",
        populate: [
          { path: "department", select: "name" },
          { path: "designation", select: "name" },
        ],
      })
      .populate("role", "name");

    res.status(201).json({
      success: true,
      message: "Teacher ID Card generated successfully.",
      data: populatedCard,
    });
  } catch (err) {
    console.error("Error in createTeacherIdCard:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// ✅ Get all teacher ID cards
exports.getAllTeacherIdCards = async (req, res) => {
  try {
    const cards = await TeacherIdCard.find()
      .populate("template", "idCardName layoutSpacing logoImage signatureImage backgroundImage")
      .populate({
        path: "employees",
        select:
          "staffId name email gender mobile department designation profilePicture",
        populate: [
          { path: "department", select: "name" },
          { path: "designation", select: "name" },
        ],
      })
      .populate("role", "name");

    res.status(200).json({
      success: true,
      message: "All teacher ID cards fetched.",
      data: cards,
    });
  } catch (error) {
    console.error("Error in getAllTeacherIdCards:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
