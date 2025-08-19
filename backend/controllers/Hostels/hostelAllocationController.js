const HostelAllocation = require("../../models/Hostel/Hostel_AllocationModel");

// POST /api/hostel-allotments
exports.createHostelAllocation = async (req, res) => {
  try {
    const newAllotment = await HostelAllocation.create(req.body);
    res.status(201).json({
      success: true,
      message: "Hostel Allotment created successfully",
      data: newAllotment,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET /api/hostel-allotments
exports.getAllHostelAllocation = async (req, res) => {
  try {
    const allotments = await HostelAllocation.find()
      .populate("class")
      .populate("section")
      .populate("studentName", "firstName lastName registration_no")
      .populate("hostelName", "Hostel_Name")
      .populate("roomName", "roomName")
      .populate("category", "Category_name");

    res.status(200).json({
      success: true,
      data: allotments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/hostel-allotments/:id
exports.getHostelAllocationById = async (req, res) => {
  try {
    const allotment = await HostelAllocation.findById(req.params.id)
     .populate("class")
      .populate("section")
      .populate("studentName", "firstName lastName registration_no")
      .populate("hostelName", "Hostel_Name")
      .populate("roomName", "roomName")
      .populate("category", "Category_name");


    if (!allotment) {
      return res
        .status(404)
        .json({ success: false, message: "Allotment not found" });
    }

    res.status(200).json({
      success: true,
      data: allotment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/hostel-allotments/:id
exports.updateHostelAllocation = async (req, res) => {
  try {
    const updatedAllotment = await HostelAllocation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedAllotment) {
      return res
        .status(404)
        .json({ success: false, message: "Allotment not found" });
    }

    res.status(200).json({
      success: true,
      message: "Allotment updated successfully",
      data: updatedAllotment,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/hostel-allotments/:id
exports.deleteHostelAllocation = async (req, res) => {
  try {
    const deleted = await HostelAllocation.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Allotment not found" });
    }

    res.status(200).json({
      success: true,
      message: "Allotment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
