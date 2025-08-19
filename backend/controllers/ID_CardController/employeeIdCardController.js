const EmployeeIdCard = require("../../models/employeeIdCardModel");


exports.createIDCard = async (req, res) => {
  try {
    const { templateId, employeeIds } = req.body;

    // ✅ Validate inputs
    if (
      !templateId ||
      !employeeIds ||
      !Array.isArray(employeeIds) ||
      !employeeIds.length
    ) {
      return res.status(400).json({
        success: false,
        message: "templateId and employeeIds are required.",
      });
    }

    // ✅ Create new card document
    const newCard = new EmployeeIdCard({
      template: templateId,
      employees: employeeIds,
    });

    const savedCard = await newCard.save();

    // ✅ Populate the saved data
    const populatedCard = await EmployeeIdCard.findById(savedCard._id)
      .populate("template")
      .populate("employees"); // 🔁 Correct field name

    res.status(201).json({
      success: true,
      message: "ID card generated successfully",
      data: populatedCard,
    });
  } catch (error) {
    console.error("Error generating ID card:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate ID card.",
    });
  }
};

exports.getFilteredIDCards = async (req, res) => {
  try {
    const { roleId, templateId } = req.body;

    if (!roleId || !templateId) {
      return res.status(400).json({
        success: false,
        message: "roleId and templateId are required.",
      });
    }

    const idCards = await EmployeeIdCard.find({
      role: roleId,
      template: templateId,
    })
      .populate("role")
      .populate(
        "template",
        "idCardName signatureImage logoImage backgroundImage pageLayout userPhotoStyle layoutSpacing"
      );

    res.status(200).json({
      success: true,
      message: "Filtered ID cards fetched successfully.",
      data: idCards,
    });
  } catch (err) {
    console.error("Error fetching ID cards:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// ============= Get All ID Cards ==============
exports.getAllIdCards = async (req, res) => {
  try {
    const idCards = await EmployeeIdCard.find()
      .populate({
        path: "role", // populate role which refers to Employee
        select: "name mobile role department designation",
        populate: [
          { path: "department", select: "name" }, // populate department with only name field
          { path: "designation", select: "name" }, // populate designation with only name field
        ],
      })
      .populate("template");

    res.status(200).json({
      success: true,
      message: "All ID cards fetched successfully.",
      data: idCards,
    });
  } catch (error) {
    console.error("Error fetching ID cards:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch ID cards.",
    });
  }
};

exports.getAllEmployeeIdCards = async (req, res) => {
  try {
    const cards = await EmployeeIdCard.find()
      .populate({
        path: "template",
        select:
          "idCardName pageLayout userPhotoStyle layoutSpacing logoImage signatureImage backgroundImage",
      })
      .populate({
        path: "employees",
        select:
          "staffId name email gender mobile department designation profilePicture",
        populate: [
          { path: "designation", select: "name" },
          { path: "department", select: "name" },
        ],
      });

    res.status(200).json({ success: true, data: cards });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// exports.getEmployeeIdCardById = async (req, res) => {
//   try {
//     const card = await EmployeeIdCard.findById(req.params.id)
//       .populate({
//         path: "role",
//         select: "staffId name gender email mobile designation department profilePicture",
//         populate: [
//           { path: "designation", select: "name" },
//           { path: "department", select: "name" },
//         ],
//       })
//       .populate({
//         path: "template",
//         select: "name frontImage backImage",
//       })
//       .populate({
//         path: "employees",
//         select: "staffId name gender email mobile designation department profilePicture",
//         populate: [
//           { path: "designation", select: "name" },
//           { path: "department", select: "name" },
//         ],
//       });

//     if (!card) {
//       return res.status(404).json({ success: false, message: "ID Card not found" });
//     }

//     res.status(200).json({ success: true, data: card });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

exports.getEmployeeIdCardById = async (req, res) => {
  try {
    const card = await EmployeeIdCard.findById(req.params.id)
      .populate({
        path: "role",
        select:
          "staffId name gender email mobile designation department profilePicture",
        populate: [
          { path: "designation", select: "name" },
          { path: "department", select: "name" },
        ],
      })
      .populate("template");

    // if (!card) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "ID Card not found",
    //   });
    // }

    res.status(200).json({
      success: true,
      data: card,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
