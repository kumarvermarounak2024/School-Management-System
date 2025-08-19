// const Promotion = require('../../models/Academic/promotionModel');

// // GET all promotions with populated references
// const getAllPromotions = async (req, res) => {
//   try {
//     const promotions = await Promotion.find()
//       .populate({
//         path: 'StudentId',
//         select: 'firstName lastName studentName registration_no guardian_name roll_no currentDueAmount'
//       })
//       .populate( 'Class')
//       .populate( 'Section');
//     res.status(200).json(promotions);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching promotions', error });
//   }
// };

// // GET single promotion by ID
// const getPromotionById = async (req, res) => {
//   try {
//     const promotion = await Promotion.findById(req.params.id)
//       .populate('StudentId', 'studentName registerNo guardianName rollNo currentDueAmount')
//       .populate('Class', 'className')
//       .populate('Section', 'sectionName');
//     if (!promotion) return res.status(404).json({ message: 'Promotion not found' });
//     res.status(200).json(promotion);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching promotion', error });
//   }
// };

// // CREATE a new promotion
// const createPromotion = async (req, res) => {
//   try {
//     const { StudentId, Class, Section, promotionDate } = req.body;
//     const newPromotion = new Promotion({ StudentId, Class, Section, promotionDate });
//     await newPromotion.save();
//     res.status(201).json({ message: 'Promotion created successfully', promotion: newPromotion });
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating promotion', error });
//   }
// };

// // UPDATE a promotion
// const updatePromotion = async (req, res) => {
//   try {
//     const updatedPromotion = await Promotion.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     if (!updatedPromotion) return res.status(404).json({ message: 'Promotion not found' });
//     res.status(200).json({ message: 'Promotion updated successfully', promotion: updatedPromotion });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating promotion', error });
//   }
// };

// // DELETE a promotion
// const deletePromotion = async (req, res) => {
//   try {
//     const deletedPromotion = await Promotion.findByIdAndDelete(req.params.id);
//     if (!deletedPromotion) return res.status(404).json({ message: 'Promotion not found' });
//     res.status(200).json({ message: 'Promotion deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting promotion', error });
//   }
// };

// module.exports = {
//   getAllPromotions,
//   getPromotionById,
//   createPromotion,
//   updatePromotion,
//   deletePromotion
// };

const Admission = require("../../models/admissionModel");
const Promotion = require("../../models/Academic/promotionModel");

exports.bulkPromoteStudents = async (req, res) => {
  try {
    const {
      fromClassId,
      fromSectionId,
      toClassId,
      toSectionId,
      promotionDate,
    } = req.body;

  

    const students = await Admission.find({
      level_class: fromClassId,
      section: fromSectionId,
    });

    if (!students.length) {
      return res
        .status(404)
        .json({ success: false, message: "No students found to promote." });
    }

    const results = [];

    for (let student of students) {
      try {
      

        await Promotion.create({
          StudentId: student._id,
          Class: toClassId,
          Section: toSectionId,
          promotionDate: promotionDate ? new Date(promotionDate) : new Date(),
        });

    
        // Remove non-ObjectId fields before saving
student.level_class = toClassId;
student.section = toSectionId;

student.set({
  transport_route: undefined,
  Vehicle_number: undefined,
  hostel_name: undefined,
  room_name: undefined
});

const savedStudent = await student.save({ validateBeforeSave: false });


        results.push(savedStudent);
        console.log(savedStudent, 'savedstudent ✅');
      } catch (err) {
        console.error(`❌ Failed to promote student ${student._id}:`, err.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Students promoted successfully.",
      totalPromoted: results.length,
      promotedStudents: results,
    });
  } catch (error) {
    console.error("Promotion Error:", error);
    res.status(500).json({
      success: false,
      message: "Error promoting students",
      error: error?.message || "Unknown error",
    });
  }
};

exports.getStudentsByClassAndSection = async (req, res) => {
  try {
    const { classId, sectionId } = req.params;

    const students = await Admission.find({
      level_class: classId,
      section: sectionId,
      status: "Active", // Optional: only show active students
    });

    if (!students.length) {
      return res
        .status(404)
        .json({ success: false, message: "No students found" });
    }

    res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching students", error });
  }
};
