const Employee = require("../../models/employeeModel");
const LeaveApplication = require("../../models/Leave_Management/add_leaveModel");
const LeaveCategory = require("../../models/Leave_Management/LeaveCategoryModel");
const { uploadDocument } = require("../../config/cloudinary"); // adjust path if needed

// Create Leave Application
exports.createLeaveApplication = async (req, res) => {
  try {
    const {
      
      applicant,
      leaveCategory,
      leaveDateFrom,
      leaveDateTo,
      reason,
      comments,
    } = req.body;

    let attachmentData = null;

    // Cloudinary upload
    if (req.file && req.file.buffer) {
      attachmentData = await uploadDocument(
        req.file.buffer,
        "leave_attachments",
        req.file.originalname,
        req.file.mimetype
      );
    }

    const leaveApp = new LeaveApplication({
      
      applicant,
      leaveCategory,
      leaveDate: {
        from: leaveDateFrom,
        to: leaveDateTo,
      },
      reason,
      comments,
      attachment: attachmentData ? attachmentData.url : null,
    });

    await leaveApp.save();
    res.status(201).json({
      success: true,
      message: "Leave applied successfully",
      data: leaveApp,
    });
  } catch (err) {
    console.error("Leave application error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get All Leave Applications

exports.getAllLeaveApplications = async (req, res) => {
  try {
    const leaveApplications = await LeaveApplication.find()
      .populate("applicant")
      .populate({
        path: "leaveCategory",
        select: "categoryName",
      });

    res.status(200).json({
      success: true,
      message: "Fetched all leave applications",
      data: leaveApplications,
    });
  } catch (error) {
    console.error("Error fetching leave applications:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Delete Leave Application
exports.deleteLeaveApplication = async (req, res) => {
  try {
    const { id } = req.params;
    await LeaveApplication.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Leave application deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.updateLeaveApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const { leaveCategory, leaveDate, reason, comments, status, attachment } =
      req.body;

    const updateData = {
      ...(leaveCategory && { leaveCategory }),
      ...(leaveDate && {
        leaveDate: {
          from: leaveDate.from,
          to: leaveDate.to,
        },
      }),
      ...(reason && { reason }),
      ...(comments && { comments }),
      ...(status && { status }),
      ...(attachment && { attachment }),
    };

    const updatedLeave = await LeaveApplication.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
      }
    )
      .populate("applicant", "name email")
      .populate("role", "name email role")
      .populate("leaveCategory", "categoryName");

    if (!updatedLeave) {
      return res.status(404).json({
        success: false,
        message: "Leave application not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Leave application updated successfully",
      data: updatedLeave,
    });
  } catch (error) {
    console.error("Error updating leave:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
