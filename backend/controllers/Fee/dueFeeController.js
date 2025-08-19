const mongoose = require("mongoose");

const FeeAssignment = require("../../models/Fee/dueFeeModel");

// const FeeAssignment = require("../../models/Fee/dueFeeModel");
const FeeGroup = require("../../models/Fee/FeeGroupModel");
const FeeInventory = require("../../models/Fee/inventoryModel");



exports.createDueFee = async (req, res) => {
  try {
    const { student, feeGroup, feeType } = req.body;

    // Step 1: Fetch FeeGroup from DB
    const feeGroupData = await FeeGroup.findById(feeGroup);
    if (!feeGroupData) {
      return res.status(404).json({ message: "Fee Group not found" });
    }

    // Step 2: Use the first available fee detail
    const matchedFeeDetail = feeGroupData.feeDetails[0];
    if (!matchedFeeDetail) {
      return res.status(400).json({ message: "No fee details found in Fee Group" });
    }

    // Step 3: Fetch paid & discount from FeeInventory
    const feeInventory = await FeeInventory.findOne({ student, feeGroup });
    const paid = feeInventory?.paidAmount || 0;
    const discount = feeInventory?.discount || 0;

    // Step 4: Create new Fee Assignment
    const newFee = new FeeAssignment({
      student,
      feeType,
      feeGroup,
      dueDate: matchedFeeDetail.dueDate,
      amount: matchedFeeDetail.amount,
      paid,
      discount,
    });

    await newFee.save();

    // Step 5: Populate and respond
    const populatedFee = await FeeAssignment.findById(newFee._id)
      .populate("student", "firstName registration_no roll_no level_class section mobile_no")
         .populate("feeGroup", "feeGroup")   
      .populate("feeType", "feeType");

    res.status(201).json({
      message: "Fee Assignment created successfully",
      data: populatedFee
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "Error creating fee assignment",
      error: error.message
    });
  }
};



// exports.getAllDueFees = async (req, res) => {
//   try {
//     const assignments = await FeeAssignment.find()
//       .populate("student", "firstName registration_no roll_no mobile_no")
//       .populate("feeType", "feeType");

//     res.status(200).json(assignments);
//   } catch (error) {
//     res.status(400).json({
//       message: "Error fetching fee assignments",
//       error: error.message,
//     });
//   }
// };
exports.getAllFeeAssignments = async (req, res) => {
  try {
    const assignments = await FeeAssignment.find()
      .populate("student", "firstName registration_no level_class section  roll_no mobile_no")
      .populate("feeGroup", "feeGroup")   
      .populate("feeType", "feeType");      
    res.status(200).json(assignments);
  } catch (error) {
    res.status(400).json({
      message: "Error fetching fee assignments",
      error: error.message
    });
  }
};



exports.getDueFeeById = async (req, res) => {
  try {
    const assignment = await FeeAssignment.findById(req.params.id)
      .populate("student", "firstName registration_no level_class section roll_no mobile_no")
       .populate("feeGroup", "feeGroup")   
      .populate("feeType", "feeType");

    if (!assignment) {
      return res.status(404).json({ message: "Fee assignment not found" });
    }

    res.status(200).json(assignment);
  } catch (error) {
    res.status(400).json({
      message: "Error fetching fee assignment",
      error: error.message,
    });
  }
};
exports.updateDueFee = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid FeeAssignment ID" });
  }

  try {
    const updatedFee = await FeeAssignment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("student", "firstName registration_no level_class section roll_no mobile_no")
       .populate("feeGroup", "feeGroup")   
      .populate("feeType", "feeType");

    if (!updatedFee) {
      return res.status(404).json({ message: "Fee assignment not found" });
    }

    res.status(200).json({
      message: "Fee assignment updated successfully",
      data: updatedFee,
    });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};
exports.deleteDueFee = async (req, res) => {
  try {
    const deleted = await FeeAssignment.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Fee assignment not found" });
    }

    res.status(200).json({ message: "Fee assignment deleted successfully" });
  } catch (error) {
    res.status(400).json({
      message: "Delete failed",
      error: error.message,
    });
  }
};









// // GET ALL
// exports.getAllFeeAssignments = async (req, res) => {
//   try {
//     const assignments = await FeeAssignment.find()
//       .populate("student", "firstName registration_no roll_no mobile_no")
//       .populate("feeGroup", "feeGroupName");

//     res.status(200).json(assignments);
//   } catch (error) {
//     res.status(400).json({
//       message: "Error fetching fee assignments",
//       error: error.message
//     });
//   }
// };

// // GET BY ID
// exports.getFeeAssignmentById = async (req, res) => {
//   try {
//     const assignment = await FeeAssignment.findById(req.params.id)
//       .populate("student", "firstName registration_no roll_no mobile_no")
//       .populate("feeType", "feeType");

//     if (!assignment) {
//       return res.status(404).json({ message: "Fee assignment not found" });
//     }

//     res.status(200).json(assignment);
//   } catch (error) {
//     res.status(400).json({
//       message: "Error fetching fee assignment",
//       error: error.message
//     });
//   }
// };

// exports.updateFeeAssignmentById = async (req, res) => {
//   const { id } = req.params;

//   console.log("Update ID:", id);
//   console.log("Request Body:", req.body);

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ message: "Invalid ID format" });
//   }

//   try {
//     const updatedFeeAssignment = await FeeAssignment.findByIdAndUpdate(
//       id,
//       req.body,
//       { new: true, runValidators: true }
//     )
//       .populate("student", "firstName mobile_no registration_no roll_no")
//       .populate("feeType", "feeType");

//     if (!updatedFeeAssignment) {
//       return res.status(404).json({ message: "Fee Assignment not found" });
//     }

//     res.status(200).json({
//       message: "Fee Assignment updated successfully",
//       data: updatedFeeAssignment,
//     });
//   } catch (error) {
//     console.error("Update Error:", error);
//     res.status(500).json({ message: "Error updating Fee Assignment", error });
//   }
// };




// // DELETE
// exports.deleteFeeAssignment = async (req, res) => {
//   try {
//     const deleted = await FeeAssignment.findByIdAndDelete(req.params.id);

//     if (!deleted) {
//       return res.status(404).json({ message: "Fee assignment not found" });
//     }

//     res.status(200).json({ message: "Deleted successfully" });
//   } catch (error) {
//     res.status(400).json({
//       message: "Delete failed",
//       error: error.message
//     });
//   }
// };
