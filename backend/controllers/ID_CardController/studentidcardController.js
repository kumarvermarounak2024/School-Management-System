const StudentIdCard = require("../../models/studentidcardModel");

exports.createStudentIdCart = async (req, res) => {
  try {
    const { students, templateId } = req.body;

    if (!Array.isArray(students) || students.length === 0 || !templateId) {
      return res.status(400).json({
        success: false,
        message: "Students and templateId are required.",
      });
    }

    // Create a new StudentIdCard document
    const newCard = await StudentIdCard.create({
      students: students.map((s) => s.studentId),
      template: templateId,
    });

    // Populate references
    const populatedCard = await StudentIdCard.findById(newCard._id)
      .populate({
        path: "students",
        select: "firstName lastName level_class section registration_no roll_no mobile_no photo",
        populate: [
          { path: "level_class", select: "className Name", strictPopulate: false },
          { path: "section", select: "Name", strictPopulate: false }
        ]
      })
      .populate("template", "idCardName backgroundImage logoImage signatureImage");

    res.status(201).json({
      success: true,
      message: "Student ID Card created successfully",
      data: populatedCard,
    });
  } catch (error) {
    console.error("Error creating StudentIdCard:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


exports.getStudentIdCarts = async (req, res) => {
  try {
    const data = await StudentIdCard.find()
      .populate({
        path: "students",
        select: "firstName lastName level_class section registration_no roll_no mobile_no photo",
        populate: [
          { path: "level_class", select: "className Name", strictPopulate: false },
          { path: "section", select: "Name", strictPopulate: false }
        ]
      })
      .populate("template", "idCardName backgroundImage logoImage signatureImage");

    res.status(200).json({
      success: true,
      message: "Student ID Cards fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error fetching StudentIdCards:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
